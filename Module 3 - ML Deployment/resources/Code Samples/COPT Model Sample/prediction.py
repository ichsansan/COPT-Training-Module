import numpy as np
import pandas as pd
import sys
import os
import config
import sqlalchemy as db
from urllib.parse import quote_plus as urlparse
from file_manager_helper import (   
    load_model,
    load_model_tag_contract,
    load_dataset_tag_contract
)

from contracts.reducers.dataset_contract_reducers import convert_dataset, scale_back
from contracts.tag_contract_factory import TagContract
from sklearn.pipeline import Pipeline
from typing import Dict, List, Tuple, Any
# import pywt
from datetime import timedelta
import traceback
import time

# from pyXSteam.XSteam import XSteam
# steamTable = XSteam(XSteam.UNIT_SYSTEM_MKS)

import random, joblib
import db_config, re

from sklearn.preprocessing import PolynomialFeatures
from sklearn.pipeline import make_pipeline
from sklearn.linear_model import LinearRegression

class MainFlow:
    def __init__(self, unit, debug_mode, fetch_realtime=False):
        if debug_mode == False:
            self.db_mapping = db_config.DB_MAPPING[unit]
        else:
            self.db_mapping = db_config.DB_MAPPING_GCP[unit]
        self.db_mapping_gcp = db_config.DB_MAPPING_GCP[unit]
        self.unit = unit
        self.current_forecasting_model_names = config.FORECASTING_MODEL_CURRENT_NAMES[unit]
        self.current_forecasting_model_api_kinds = config.FORECASTING_MODEL_CURRENT_API_KINDS[unit]
        self.current_generative_model_name = config.GENERATIVE_MODEL_CURRENT_NAME[unit]
        self.current_generative_model_kind = config.GENERATIVE_MODEL_CURRENT_API_KIND[unit]

        self.current_dataset_tag_contract = load_dataset_tag_contract(
            contract_alias=self.unit,
            directory=os.path.join(config.ZIP_DATASET_CONTRACTS_DIRECTORY, self.unit))

        self.current_model_tag_contract = load_model_tag_contract(
            contract_alias=self.unit,
            directory=os.path.join(config.ZIP_MODEL_CONTRACTS_DIRECTORY, self.unit))

        self.engine = db.create_engine(
            f"mysql+pymysql://{self.db_mapping['username']}:{self.db_mapping['password']}@{self.db_mapping['host']}/{self.db_mapping['db_name']}", echo=False)
        self.engine_gcp = db.create_engine(
            f"mysql+pymysql://{self.db_mapping_gcp['username']}:{self.db_mapping_gcp['password']}@{self.db_mapping_gcp['host']}/{self.db_mapping_gcp['db_name']}", echo=False)
        self.debug_mode = debug_mode
        self.fetch_realtime = fetch_realtime
        self.mv_recomendations_df = None
        self.O2_callibrations_ = {}
        
        self.start_time = time.time()
        self.end_time = time.time()

        self.excess_oxygen_target_limit = None

        self.time_logs = {}

    def load_saved_data(self):
        # print('################# LOADING SAVED DATA INSIDE LOCAL API #################', flush=True)
        start_time = time.time()

        # Loading target and directional variable models
        forecasting_models = dict()

        for forecasting_model_name_key in self.current_dataset_tag_contract.tag_groups_map["RECOMMENDATION_TARGET_VARIABLES"]:
            forecasting_model_kind = self.current_forecasting_model_api_kinds[forecasting_model_name_key]
            forecasting_model_name = self.current_forecasting_model_names[forecasting_model_name_key]
            forecasting_model_dir = os.path.join(
                config.ZIP_FORECASTING_MODELS_DIRECTORY,
                self.unit,
                forecasting_model_name_key)

            forecasting_models[forecasting_model_name] = load_model(
                forecasting_model_dir,
                forecasting_model_name,
                forecasting_model_kind,
                False)

        for forecasting_model_name_key in self.current_dataset_tag_contract.tag_groups_map["RECOMMENDATION_DIRECTION_VARIABLES"]:
            forecasting_model_name = self.current_forecasting_model_names[forecasting_model_name_key]
            forecasting_model_kind = self.current_forecasting_model_api_kinds[forecasting_model_name_key]
            forecasting_model_dir = os.path.join(
                config.ZIP_FORECASTING_MODELS_DIRECTORY,
                self.unit,
                forecasting_model_name_key)
            
            forecasting_models[forecasting_model_name] = load_model(
                forecasting_model_dir,
                forecasting_model_name,
                forecasting_model_kind,
                False)
            
        self.forecasting_models = forecasting_models

        generative_model_dir = os.path.join(config.ZIP_GENERATIVE_MODELS_DIRECTORY, self.unit)
        self.generative_model = load_model(
            generative_model_dir,
            self.current_generative_model_name,
            self.current_generative_model_kind,
            False)

        # this variable only used to fetch data from server database due to unit differentiation in sensor reading
        #self.alias_sensors = self.sensor_df.loc[:, 'Alias Tag From DB'].values.tolist()
        self.sensor_df = pd.read_csv('data/sensor_list.csv')
        self.sensor_df = self.sensor_df[self.sensor_df['Unit'] == self.unit]
        self.alias_sensors = self.sensor_df['Tag'].values

        end_time = time.time()
        self.time_logs['Load Saved Data'] = f'{(end_time - start_time)} secs'

    def read_realtime_data(self, n_minutes):
        # print('################# READ REALTIME DATA FROM MARIA DB SERVER #################', flush=True)
        start_time = time.time()

        model_converters_dir = os.path.join(config.ZIP_MODEL_CONVERTERS_DIRECTORY, self.unit)
        self.model_converter_input_tags = dict()
        self.model_converters = dict()

        for model_converter_tag in config.MODEL_CONVERTER_NAMES[self.unit]:
            model_converter, model_converter_input_tags = load_model_converter(model_converter_tag, model_converters_dir)
            self.model_converters[model_converter_tag] = model_converter
            self.model_converter_input_tags[model_converter_tag] = model_converter_input_tags

        if self.fetch_realtime:
            realtime_df, original_realtime_df = get_realtime_data(
                engine=self.engine,
                tb_name='tb_bat_raw_history',
                sensors=None, #self.sensors,
                alias_sensors=self.alias_sensors,
                sensor_list_df=None, 
                n_minutes=n_minutes,
                contract=self.current_dataset_tag_contract,
                model_converters=self.model_converters,
                model_converter_input_tags=self.model_converter_input_tags)
        else:
            # FOR TESTING PURPOSE
            random_num = random.randint(0, 19500)

            realtime_df, original_realtime_df = get_from_disk_realtime_data(
                random_num=random_num,
                unit=self.unit,
                table_name=config.CSV_DATASET_MAPPER[self.unit],
                timesteps=n_minutes,
                contract=self.current_dataset_tag_contract,
                model_converters=self.model_converters,
                model_converter_input_tags=self.model_converter_input_tags)
        
        # Get latest process_id
        latest_id = get_latest_id(self.engine, "tb_combustion_model_message", "process_id")
        if latest_id is None: 
            self.process_id = 1
        else:
            self.process_id = latest_id + 1

        # Get Excess O2 callibration
        try: self.O2_callibrations_ = read_O2_parameters(self.engine)
        except Exception as E: logging(str(E))

        # MOT configuration
        if self.unit not in ['BLK1','BLK2']:
            mit_config, mot_config = get_mit_config(self.engine, f"{self.db_mapping['db_name']}.tb_combustion_conf_tags")
            mot_dataset = pd.read_csv('data/provided_data/Tabel MOT 4 - AF ratio 1.9.csv')
            x1_col = 'COAL_MOISTURE'
            x2_col = 'MILL_INLET_TEMP'
            y_col = 'MILL_OUTLET_TEMP'
            Model = make_pipeline(PolynomialFeatures(3), LinearRegression())
            Model.fit(mot_dataset[[x1_col,x2_col]], mot_dataset[y_col])
            
            self.mill_inlet_temp_config = mit_config
            self.mill_outlet_temp_config = mot_config
            self.mot_datasets = mot_dataset
            self.mot_model = Model
        
        self.realtime_df = realtime_df
        self.realtime_indexes = self.realtime_df.index
        self.original_realtime_df = original_realtime_df
        
        realtime_df.to_csv('data/debugging_outputs/realtime_df.csv')
        original_realtime_df.to_csv('data/debugging_outputs/original_realtime_df.csv')

        end_time = time.time()
        self.time_logs['Fetch Sensor Data'] = f'{(end_time - start_time)} secs'

    def read_backdate_data(self, timestamp, n_minutes):
        # print('################# READ REALTIME DATA FROM MARIA DB SERVER #################', flush=True)
        start_time = time.time()

        model_converters_dir = os.path.join(config.ZIP_MODEL_CONVERTERS_DIRECTORY, self.unit)
        self.model_converter_input_tags = dict()
        self.model_converters = dict()

        for model_converter_tag in config.MODEL_CONVERTER_NAMES[self.unit]:
            model_converter, model_converter_input_tags = load_model_converter(model_converter_tag, model_converters_dir)
            self.model_converters[model_converter_tag] = model_converter
            self.model_converter_input_tags[model_converter_tag] = model_converter_input_tags

        if self.fetch_realtime:
            realtime_df, original_realtime_df = get_realtime_data(
                engine=self.engine,
                tb_name='tb_bat_raw_history', #'tb_combustion_model_input',
                sensors=None, #self.sensors,
                alias_sensors=self.alias_sensors,
                sensor_list_df=None, #self.sensor_df.set_index('Alias Tag From DB'),
                n_minutes=n_minutes,
                contract=self.current_dataset_tag_contract,
                model_converters=self.model_converters,
                model_converter_input_tags=self.model_converter_input_tags,
                timestamp=timestamp)
        else:
            # FOR TESTING PURPOSE
            random_num = random.randint(0, 19500)

            realtime_df, original_realtime_df = get_from_disk_realtime_data(
                random_num=random_num,
                unit=self.unit,
                table_name=config.CSV_DATASET_MAPPER[self.unit],
                timesteps=n_minutes,
                contract=self.current_dataset_tag_contract,
                model_converters=self.model_converters,
                model_converter_input_tags=self.model_converter_input_tags)

        # Get latest process_id
        latest_id = get_latest_id(self.engine, "tb_combustion_model_message", "process_id", timestamp=timestamp)
        if latest_id is None: 
            self.process_id = 1
        else:
            self.process_id = latest_id + 1

        # Get Excess O2 callibration
        try: self.O2_callibrations_ = read_O2_parameters(self.engine)
        except Exception as E: logging(str(E))

        # MOT configuration
        if self.unit not in ['BLK1','BLK2']:
            mit_config, mot_config = get_mit_config(self.engine, f"{self.db_mapping['db_name']}.tb_combustion_conf_tags")
            mot_dataset = pd.read_csv('data/provided_data/Tabel MOT 4 - AF ratio 1.9.csv')
            x1_col = 'COAL_MOISTURE'
            x2_col = 'MILL_INLET_TEMP'
            y_col = 'MILL_OUTLET_TEMP'
            Model = make_pipeline(PolynomialFeatures(3), LinearRegression())
            Model.fit(mot_dataset[[x1_col,x2_col]], mot_dataset[y_col])
            
            self.mill_inlet_temp_config = mit_config
            self.mill_outlet_temp_config = mot_config
            self.mot_datasets = mot_dataset
            self.mot_model = Model
        
        self.realtime_df = realtime_df
        self.realtime_indexes = self.realtime_df.index
        self.original_realtime_df = original_realtime_df
        self.recom_exec_interval = recom_exec_interval
        
        realtime_df.to_csv('data/debugging_outputs/realtime_df.csv')
        original_realtime_df.to_csv('data/debugging_outputs/original_realtime_df.csv')

        end_time = time.time()
        self.time_logs['Fetch Sensor Data'] = f'{(end_time - start_time)} secs'

    def read_from_disk_realtime_data(self, table_name: str, timesteps: int, random_num: int):
        """This function is being used just for deriving the data from the local disk instead from the database.
           Thus it should have the same output as 'read_realtime_data' and we do NOT deploy this function, because
           it is onlt for local use."""
        # print('################# READ REALTIME DATA FROM LOCAL DISK #################', flush=True)
        start_time = time.time()
        model_converters_dir = os.path.join(
            config.ZIP_MODEL_CONVERTERS_DIRECTORY, self.unit)
        self.model_converter_input_tags = dict()
        self.model_converters = dict()

        for i, model_converter_tag in enumerate(config.MODEL_CONVERTER_NAMES[self.unit]):
            model_converter, model_converter_input_tags = load_model(
                directory=model_converters_dir,
                model_name=model_converter_tag,
                model_kind=config.MODEL_CONVERTER_API_KINDS[self.unit][i],
                input_specifics=True
            )

            self.model_converters[model_converter_tag] = model_converter
            self.model_converter_input_tags[model_converter_tag] = model_converter_input_tags

        model_converters_dir = os.path.join(config.ZIP_MODEL_CONVERTERS_DIRECTORY, self.unit)
        self.model_converter_input_tags = dict()
        self.model_converters = dict()

        for model_converter_tag in config.MODEL_CONVERTER_NAMES[self.unit]:
            # print(model_converter_tag)
            model_converter, model_converter_input_tags = load_model_converter(model_converter_tag, model_converters_dir)
            self.model_converters[model_converter_tag] = model_converter
            self.model_converter_input_tags[model_converter_tag] = model_converter_input_tags

        realtime_df, original_realtime_df = get_from_disk_realtime_data(
            random_num=random_num,
            unit=self.unit,
            table_name=table_name,
            timesteps=timesteps,
            contract=self.current_dataset_tag_contract,
            model_converters=self.model_converters,
            model_converter_input_tags=self.model_converter_input_tags)

        self.realtime_df = realtime_df
        self.original_realtime_df = original_realtime_df

        end_time = time.time()
        self.time_logs['Fetch Sensor Data'] = f'{(end_time - start_time)} secs'
        
    def pre_calculation(self):
        if self.unit == "BLK1":
            self.realtime_df["Windbox-to-Furnace Diff. Press A"] = self.realtime_df["Windbox-to-Furnace Diff. Press B"]
            self.excess_oxygen_target_limit = [4.9, 5.9]     # Force to 4.9-5.9
        elif self.unit == "BLK2":
            self.realtime_df["Furnace Pressure"] = self.original_realtime_df["A2PT119A"]
        return

    def predict_inverse_mapping(self):
        # print('################# PREDICT #################', flush=True)
        start_time = time.time()

        prediction = Prediction(
            self.unit,
            self.current_forecasting_model_names,
            self.forecasting_models,
            self.generative_model,
            self.current_dataset_tag_contract,
            self.current_model_tag_contract)
        
        if self.excess_oxygen_target_limit is not None:
            prediction.target_limits['Excess Oxygen Sensor'] = lambda x: (x > self.excess_oxygen_target_limit[0]) & (x <= self.excess_oxygen_target_limit[1])

        message = ""
        mv_recomendations_df = pd.DataFrame()
        models_predictions = None
        self.predicted_excess_oxy = None
        self.predicted_target = None
        curr_efficiency = None

        try:
            prediction.data_preparation(self.realtime_df)
            data_flats = Prediction.initial_flat_data_checking(prediction.realtime_df)
            (cvs_within_limits, not_passed_tags) = prediction.cvs_within_limit_checking(
                prediction.target_variables)

            if len(data_flats) > 0:
                message += f"\The following tag pairs is flat: '{str(data_flats)}'. Please check if the sensor(s) is offline / deactivated."
            elif cvs_within_limits:
                # TODO: Include the range as well.
                message += f" \nThe CV current values are within the desired range."
            else:
                message += f"There are CV(s) ({not_passed_tags}) outside the optimal range and thus we will generate MV recommendations."
                (not_all_conditions_fullfilled,
                 constrans_not_passing) = prediction.initial_constraint_checking()
                
                # Bypass constraint checking
                not_all_conditions_fullfilled = False
                
                if not_all_conditions_fullfilled:
                    message += f"\The following tag-value pairs don't fulfill the initial constraints: '{str(constrans_not_passing)}'."
                else:
                    prediction.mv_generation()

                    mv_recomendations_df, models_predictions, self.optimizer = prediction.cv_forecasting()

                if mv_recomendations_df is None or mv_recomendations_df.shape[0] == 0:
                    if config.EFFICIENCY_TAG in list(prediction.target_variables):
                        message += " \nEfficiency increase is estimated to be not possible."
                        
                    if any(target in prediction.target_variables for target in list(config.FORECASTING_MODEL_CURRENT_NAMES[self.unit].keys())):
                        message += " \nJump towards excess oxygen optimality is estimated to not be possible."
                    if not prediction.any_mv_constraint_check_satisfied:
                        message += " \nSome of the MV constraints are not being met."
                    if not prediction.any_model_constraint_check_satisfied:
                        message += " \nThe data doesn't fit the models capacity."
                    if not prediction.any_dv_constraints_check_satisfied:
                        message += "\nExcess Oxygen jump is larger than set limits."
                else:
                    excess_oxy_vars = list(config.FORECASTING_MODEL_CURRENT_NAMES[self.unit].keys())

                    if any(target in prediction.target_variables for target in excess_oxy_vars) & (config.EFFICIENCY_TAG not in excess_oxy_vars):
                        self.predicted_excess_oxy = {}
                        
                        for target in list(config.FORECASTING_MODEL_CURRENT_NAMES[self.unit].keys()):
                            mname = prediction.forecasting_model_names[target]
                            self.predicted_excess_oxy[target] = models_predictions[mname]

                        total_excess_oxy_dist = -self.optimizer.max_total_reward
                        total_excess_oxy_current_state_dist = -self.optimizer.calculate_current_total_state_reward()
            
                        message += f" \nWe found a solution that could change the average excess oxygen distance from the sweet spot from " + \
                                f"{total_excess_oxy_current_state_dist + prediction.sweet_spots[target]} to {total_excess_oxy_dist + prediction.sweet_spots[target]}." + \
                                f" \nThe estimated change is for the next {config.LABEL_LAG} minutes."

                    if config.EFFICIENCY_TAG in prediction.target_variables:
                            # Assigning excess oxygen tags to their corresponding predictions after MV change.
                        self.predicted_excess_oxy = {dv: models_predictions[prediction.forecasting_model_names[dv]]
                                for dv in prediction.direction_variables}
                        self.predicted_target = {cv: models_predictions[prediction.forecasting_model_names[cv]]
                                                            for cv in prediction.target_variables}

                        efficiency_model_name = self.current_forecasting_model_names[config.EFFICIENCY_TAG]
                        max_horizon_eff_diff = self.optimizer.optimal_reward
                        if max_horizon_eff_diff > 0:
                        # It might be that we can increase efficiency, but Excess Oxygen
                        # variables do not go towards favourable direction
                            if prediction.any_dv_constraints_check_satisfied:
                                message += f"\nExcess Oxygen not forecasted to go in correct direction with one or both variables with following recommendation."
                                message += f" \nThe solution optimizes based on efficiency which could increase by {self.optimizer.optimal_reward} ." + \
                                           f" \nThe estimated change is for the next {config.LABEL_LAG} minutes."
                        else:
                            # the efficiency diff is negative
                            # message += f" \nThe solution optimizes based on efficiency which best found solutions is efficiency decrease by {self.optimizer.optimal_reward}."
                            message += f" \nEfficiency not forecasted to go in correct direction, which is currently decrease by {self.optimizer.optimal_reward}."
                            mv_recomendations_df = None
        except Exception as e:
            message = traceback.format_exc()

        # Flipping recommendation from bias to value
        if mv_recomendations_df is not None:
            current_value = self.realtime_df.iloc[-1]
            for c in mv_recomendations_df.columns:
                mv_recomendations_df[c] = current_value[c] + mv_recomendations_df[c]

        # In case this is needed.
        if mv_recomendations_df is not None:
            self.mv_recomendations_df = scale_back(
                contract=self.current_dataset_tag_contract,
                dataset=mv_recomendations_df)
            
        logging(message)

        end_time = time.time()
        self.prediction = prediction
        self.time_logs['Prediction Time'] = f'{(end_time - start_time)} secs'
        self.message = message

        return message, curr_efficiency # penyesuaian

    def post_calculation(self):
        if self.mv_recomendations_df is None: return 
        
        # Remapping MV variables
        if self.unit in ['BLK1','BLK2']:
            self.current_dataset_tag_contract.tag_groups_map["RECOMMENDATION_MV_VARIABLES"] = {
                'Excess Oxygen Sensor',
            }
            self.mv_recomendations_df[config.EXCESS_OXYGEN_SOKET_2] = np.reshape(self.predicted_excess_oxy[config.EXCESS_OXYGEN_SOKET_2], -1)
            self.mv_recomendations_df = self.mv_recomendations_df.drop(columns='Total Secondary Air Flow Sides Sum')

            if self.excess_oxygen_target_limit is not None:
                if self.mv_recomendations_df[config.EXCESS_OXYGEN_SOKET_2].iloc[0] < self.excess_oxygen_target_limit[0] \
                    and self.realtime_df[config.EXCESS_OXYGEN_SOKET_2].iloc[-1] < self.excess_oxygen_target_limit[0]:
                    self.mv_recomendations_df = None
        return

    def save_to_db(self):
        # print('################# SAVE TO DATABASE #################', flush=True)
        start_time = time.time()
        execution_status = 0

        # if self.debug_mode:
        #     self.engine.dispose()
        #     self.engine = db.create_engine(
        #          f"mysql+pymysql://root:@127.0.0.1/{self.db_mapping['db_name']}", echo=False)

        recommendation_mv_variables = self.current_dataset_tag_contract.tag_groups_map[
            "RECOMMENDATION_MV_VARIABLES"]

        model_input_dict = {
            'tag_name':[],
            'ts':[],
            'category':[],
            'value':[]
        }
        mv_generation_dict = {
            'model_id': [],
            'ts': [],
            'tag_name': [],
            'process_id': [],
            'value': [],
            'bias_value': [],
        }

        predicted_excess_oxy_dict = {
            'model_id': [],
            'ts': [],
            'description': [],
            'value': [],
            'horizon_step':[],
        }

        predicted_target_dict = {
            'model_id': [],
            'ts': [],
            'description': [],
            'value': [],
            'horizon_step':[],
        }

        session_dict = {
            'ts': [],
            'tag_name': [],
            'category': [],
            'value': [],
            'history_step': [],
        }

        model_message_dict = {
            'process_id':[],
            'message':[],
            'ts':[],
            'status':[]
        }

        model_execution_dict = {
            'process_id': [],
            'ts': [],
            'exec_time': [],
            'status': []
        }

        recommendation_mv_variables = self.current_dataset_tag_contract.tag_groups_map["RECOMMENDATION_MV_VARIABLES"]
        
        mill_outlet_constranins = []#self.current_dataset_tag_contract.tag_groups_map["MILL_OUTLET_CONSTRAINTS"]
        model_input_df = self.realtime_df.reset_index().melt(id_vars='timestamp')

        if self.fetch_realtime:
            self.latest_timestamp = self.realtime_indexes[-1]
        else:
            # FOR TESTING PURPOSE!
            self.latest_timestamp = pd.to_datetime('today').floor('T')

        # Update Model Input
        model_input_df = model_input_df.rename(columns={'timestamp':'ts', 'variable':'tag_name'})
        model_input_df.to_sql("tb_combustion_model_input", con=self.engine, method=mysql_replace_into, \
            if_exists="append", index=False)

        # Update messages
        model_message_dict['process_id'].append(self.process_id)
        model_message_dict['message'].append(self.message[:450])
        model_message_dict['ts'].append(self.latest_timestamp)
        model_message_dict['status'].append('')
        model_message_df = pd.DataFrame(model_message_dict)
        model_message_df.to_sql(
            "tb_combustion_model_message", con=self.engine, method=mysql_replace_into,
            if_exists="append", index=False
        )

        # Update Model History
        try:
            model_history_df = self.prediction.forecasting_results_df.copy()
            model_history_df.insert(0, 'process_id', self.process_id)
            model_history_df.insert(2, 'ts', self.latest_timestamp)
            model_history_df.to_sql('tb_combustion_model_history', con=self.engine, method=mysql_replace_into,
                                    if_exists='append', index=False)
        except: pass
        
        if self.mv_recomendations_df is not None:
            self.sensor_df.set_index('Tag', inplace=True)
            execution_status = 1

            sensor_input_df = self.realtime_df[recommendation_mv_variables]
            sensor_input_df = sensor_input_df.iloc[-1:]
            self.delta_mv_recomendations_df = Prediction.calculate_delta_mv(
                sensor_input_df, self.mv_recomendations_df)

            for col in self.mv_recomendations_df.columns:
                mv_generation_dict['ts'].append(self.latest_timestamp)
                mv_generation_dict['model_id'].append(
                    config.GENERATIVE_MODEL_CURRENT_NAME[self.unit])
                mv_generation_dict['tag_name'].append(col)
                mv_generation_dict['process_id'].append(self.process_id)
                mv_generation_dict['value'].append(self.mv_recomendations_df.loc[0, col])
                mv_generation_dict['bias_value'].append(
                    self.delta_mv_recomendations_df.loc[0, col])

            mv_generation_df = pd.DataFrame(mv_generation_dict)
            mv_generation_df['tag_name'] = mv_generation_df['tag_name'].astype(
                str)
            mv_generation_df.to_sql(
                "tb_combustion_model_generation", con=self.engine, method=mysql_replace_into, \
                if_exists="append", index=False)

            if self.predicted_excess_oxy is not None:
                for idx, val in self.predicted_excess_oxy.items():
                    predicted_excess_oxy_dict['ts'].append(self.latest_timestamp)
                    predicted_excess_oxy_dict['model_id'].append(
                        config.GENERATIVE_MODEL_CURRENT_NAME[self.unit])
                    predicted_excess_oxy_dict['description'].append(idx)
                    predicted_excess_oxy_dict['value'].append(float(val))
                    predicted_excess_oxy_dict['horizon_step'].append(config.LABEL_LAG)

                predicted_excess_oxy_df = pd.DataFrame(predicted_excess_oxy_dict)
                predicted_excess_oxy_df['description'] = predicted_excess_oxy_df['description'].astype(
                    str)
                predicted_excess_oxy_df.to_sql(
                    "tb_combustion_model_forecasting", con=self.engine, method=mysql_replace_into, \
                    if_exists="append", index=False)

            if self.predicted_target is not None:
                for i in self.predicted_target:
                    predicted_target_dict['model_id'].append(config.FORECASTING_MODEL_CURRENT_NAMES[self.unit]['Efficiency Nominal'])
                    predicted_target_dict['ts'].append(self.latest_timestamp)
                    predicted_target_dict['description'].append(i)
                    predicted_target_dict['value'].append(np.reshape(self.predicted_target[i], -1)[0])
                    predicted_target_dict['horizon_step'].append(config.LABEL_LAG)

                predicted_efficiency_df = pd.DataFrame(predicted_target_dict)
                predicted_efficiency_df.to_sql("tb_combustion_model_forecasting",
                    con=self.engine, method=mysql_replace_into,
                    if_exists="append", index=False)
                
        # Input model execution time
        self.end_time = time.time()
        model_execution_dict['process_id'].append(self.process_id)
        model_execution_dict['ts'].append(self.latest_timestamp)
        model_execution_dict['exec_time'].append(self.end_time - self.start_time)
        model_execution_dict['status'].append(execution_status)
        model_execution_df = pd.DataFrame(model_execution_dict)
        model_execution_df.to_sql('tb_combustion_model_execution', con=self.engine, if_exists='append', index=False)

        counter_idx = 0

        recommendation_mv_variables = self.current_dataset_tag_contract.tag_groups_map["RECOMMENDATION_MV_VARIABLES"]
        mill_outlet_constranins = [] #self.current_dataset_tag_contract.tag_groups_map["MILL_OUTLET_CONSTRAINTS"]

        for idx, val in self.realtime_df.iterrows():
            for col in self.realtime_df.columns:
                if self.fetch_realtime:
                    session_dict['ts'].append(idx)
                else:
                    # TEMPORARY USED!
                    session_dict['ts'].append(
                        self.latest_timestamp - timedelta(minutes=self.realtime_df.shape[0]-(counter_idx+1)))

                if col in recommendation_mv_variables:
                    category = 'MV'
                elif col in mill_outlet_constranins:
                    category = 'CONSTRAINT'
                else:
                    category = 'DV'

                session_dict['tag_name'].append(col)
                session_dict['category'].append(category)
                session_dict['value'].append(val[col])
                session_dict['history_step'].append(counter_idx+1)

            counter_idx += 1

        session_df = pd.DataFrame(session_dict)
        session_df['tag_name'] = session_df['tag_name'].astype(str)
        session_df.replace([np.inf, -np.inf], 0, inplace=True)

        # batch saving
        batch_size = 500
        curr_counter = 0

        while curr_counter < session_df.shape[0]:
            # session_df.iloc[curr_counter:(curr_counter+batch_size)].to_sql("tb_combustion_model_history",
            #               con=self.engine, method=mysql_replace_into, if_exists="append", index=False)
            curr_counter = curr_counter + batch_size

        # close db connection
        self.engine.dispose()

        if self.mv_recomendations_df is not None:
            self.mv_recomendations_df = mv_generation_df
            self.predicted_excess_oxy_df = predicted_excess_oxy_df
        self.model_message_df = model_message_df
        self.session_df = session_df

        end_time = time.time()
        self.time_logs['Saving to DB Time'] = f'{(end_time - start_time)} secs'

    def get_time_logs(self):
        return self.time_logs


class Prediction:
    def __init__(self,
              unit: str,
              forecasting_model_names: Dict[str, str],
              forecasting_models: Dict[str, Pipeline],
              generative_model: Pipeline,
              dataset_contract: TagContract,
              model_contract: TagContract):

        self.unit = unit
        self.target_variables = dataset_contract.tag_groups_map["RECOMMENDATION_TARGET_VARIABLES"]
        self.direction_variables = dataset_contract.tag_groups_map["RECOMMENDATION_DIRECTION_VARIABLES"]
        self.target_limits = dataset_contract.tags_to_actions["TARGET_LIMITS"]
        self.forecasting_model_names = forecasting_model_names

        self.sweet_spots = model_contract.tags_to_actions["GET_SWEET_SPOT"]["Excess Oxygen Forecaster"]
        self.forecasting_models = forecasting_models
        self.generative_model = generative_model
        self.recommendation_mv_variables = dataset_contract.tag_groups_map["RECOMMENDATION_MV_VARIABLES"]
        self.mv_dependent_constraints = dataset_contract.tag_groups_map["MV_DEPENDENT_CONSTRAINTS"]
        self.any_mv_constraint_check_satisfied = False
        self.any_dv_constraints_check_satisfied = False
        self.any_model_constraint_check_satisfied = False
        self.forecast_excess_oxy_within_limits = dict()

        self.initialize_optimizer()
        self.const_limits = dataset_contract.tags_to_actions["CONST_LIMITS"]
        self.variables = dataset_contract.get_active_tags()

    def initialize_optimizer(self):
        if config.EFFICIENCY_TAG in self.target_variables:
            gen_input_indices = {dv_tag: self.generative_model["model"].estimator_params["tags_to_index"][dv_tag]
                            for dv_tag in self.direction_variables}
            self.optimizer = EfficiencyOptimizer(
                forecasting_model_names=self.forecasting_model_names,
                gen_input_tags=gen_input_indices,
                forcast_input_index= \
                    self.forecasting_models[self.forecasting_model_names[config.EFFICIENCY_TAG]]["model"]\
                    .estimator_params["tags_to_index"][config.EFFICIENCY_TAG],
                limits=self.target_limits,
                dv_sweet_spot=self.sweet_spots)

        elif any(target in config.FORECASTING_MODEL_CURRENT_NAMES[self.unit].keys() for target in self.target_variables):
            self.optimizer = OxygenOptimizer(
                target_variables=self.target_variables,
                forecasting_model_names=self.forecasting_model_names,
                limits=self.target_limits,
                sweet_spots=self.sweet_spots
        )

        else:
            raise ValueError(
                    f"The tag(s) '{self.target_variables}' specified in the contract \
                        are not a part of the recommedation system required tags to be forecast.'")

    def data_preparation(self, realtime_df):
        # print('################# DATA PREPARATION #################', flush=True)
        if len(set(realtime_df.columns) - set(self.variables)) > 0:
            # TODO: system which is catching the errors and it is logging them in a storage needed.
            raise ValueError(
                f"The input data has {len(realtime_df.columns)} variables, but the contract has {len(self.variables)} variables.")

        generative_estimator_params = self.generative_model["model"].estimator_params
        generative_tags_to_index = generative_estimator_params["tags_to_index"]

        if len(self.variables) < len(generative_tags_to_index):
            raise ValueError(f"The contract variables number is {len(self.variables)}, but the variables of the generative model are {len(generative_tags_to_index)}.\n The extra values are {set(generative_tags_to_index) - set(self.variables)}")

        if "diff_lag" not in generative_estimator_params:
            diff_lag = 1
        else:
            diff_lag = generative_estimator_params["diff_lag"]

        forecasting_cv_history_length = -sys.maxsize - 1
        forecasting_mv_history_length = forecasting_cv_history_length
        for model_key in self.forecasting_models.keys():
            current_cv_history_length = self.forecasting_models[
                model_key]["model"].estimator_params["cv_history_length"]
            current_mv_history_length = self.forecasting_models[
                model_key]["model"].estimator_params["mv_history_length"]
            if forecasting_cv_history_length < current_cv_history_length:
                forecasting_cv_history_length = current_cv_history_length
            if forecasting_mv_history_length < current_mv_history_length:
                forecasting_mv_history_length = current_mv_history_length

            variables = self.forecasting_models[model_key]["model"].estimator_params["tags_to_index"].keys(
            )
            if len(set(variables) - set(self.variables)) or len(set(self.variables) - set(variables)) > 0:
                raise ValueError(
                    f"The contract variables number is {len(self.variables)}, but the variables of the forecasting model '{model_key}' are {len(variables)}")

        # Extract the days and minutes
        first_day, first_minute = extract_day_min_from_date(
            realtime_df.index[0])
        days = np.empty((realtime_df.shape[0], ))
        minutes = np.empty((realtime_df.shape[0], ))

        current_day = first_day

        for i in range(realtime_df.shape[0]):
            current_min = (first_minute + i) % config.MINUTES_IN_A_DAY

            if current_min == 0:
                current_day += 1

            days[i] = current_day
            minutes[i] = current_min

        tags_to_index = dict()

        tags = []

        for i, sensor_tag in enumerate(realtime_df.columns):

            if sensor_tag in variables:
                tags_to_index[sensor_tag] = len(tags)
                tags.append(sensor_tag)

        # '+1', because in the forecasting model we have to reserve extra instance for the present.
        instance_offset = max(forecasting_mv_history_length + 1,
                        forecasting_cv_history_length + 1,
                        self.generative_model["model"].estimator_params["history_length"])

        realtime_df = realtime_df.tail(instance_offset)
        self.present_index = realtime_df.values.shape[0] - 1
        self.present_cutoff = self.present_index + 1
        self.present_offset = self.present_cutoff - instance_offset

        # This property is used for shifting the forecasting models input with the proper amount,
        # so that we can extend the end of the shift with the generated MV by the generation model.
        # We put '+1', because we have to shift one extra index for the present index for the forecasting
        # input.
        self.f_mv_input_shift = diff_lag + \
            1 if diff_lag < instance_offset else instance_offset

        self.minute_input = minutes[self.present_offset:self.present_cutoff]
        self.day_input = days[self.present_offset:self.present_cutoff]
        self.realtime_df = realtime_df

        self.tags = tags
        self.tags_to_index = tags_to_index

    def cvs_within_limit_checking(self, target_tags) -> Tuple[bool, str]:
        '''It returns true if the CV(s) are outside of the limits.'''
        within_limits = True
        data_sensor_tags = set(self.realtime_df.columns)

        limits = self.target_limits
        not_passed_tags = list()
        for tag in target_tags:
            if tag not in data_sensor_tags:
                continue
            value = self.realtime_df[tag][self.present_index]
            if tag in self.tags_to_index:
                condition_not_fullfilled = not limits[tag](value)
                if condition_not_fullfilled:
                    within_limits = False
                    not_passed_tags.append(tag)

        return (within_limits, not_passed_tags)

    def initial_constraint_checking(self) -> Tuple[bool, Dict[str, float]]:
        # print('################# INITIAL CONSTRAINT CHECKING #################')

        not_all_conditions_fullfilled = False
        data_sensor_tags = set(self.realtime_df.columns)
        constrans_not_passing = dict()
        # For the initial constraints we are also checking if efficiency is suboptimal to begin with and
        # only if it is suboptimal we proceed further.
        const_limits = dict(self.const_limits)
        const_limits[config.EFFICIENCY_TAG] = lambda current_x, delta_x: 0 <= current_x + \
            delta_x <= config.SUBOPTIMAL_EFFICIENCY_THRESHOLD

        for condition in const_limits.keys():
            if condition not in data_sensor_tags:
                continue
            value = self.realtime_df[condition][self.present_index]
            if condition in self.tags_to_index:
                condition_not_fullfilled = not const_limits[condition](value, 0)
                if condition_not_fullfilled:
                    not_all_conditions_fullfilled = True
                    constrans_not_passing[condition] = value

        return (not_all_conditions_fullfilled, constrans_not_passing)

    @staticmethod
    def calculate_delta_mv(sensor_input, recommendation):
        delta_mv_dict = {}
        for col in recommendation.columns:
            delta_mv_dict[col] = [
                recommendation[col].values[0] - sensor_input[col].values[0]]

        return pd.DataFrame(delta_mv_dict)

    @staticmethod
    def initial_flat_data_checking(realtime_df: pd.DataFrame) -> List[str]:
        # print('################# INITIAL FLAT DATA CHECKING #################')

        values = realtime_df.values.astype(float)
        std_dev = values.std(axis=0)
        mean = values.mean(axis=0)
        data_flats = list(realtime_df.columns[(std_dev == 0.0) & (mean == 0.0)])

        return data_flats

    def mv_generation(self):
        # print('################# MV GENERATION #################', flush=True)

        # Rewrite the mappers from tags to indices in the input array:
        self.generative_model["model"].estimator_params["tags_to_index"] = self.tags_to_index
        self.generative_input = self.realtime_df.iloc[self.present_offset:self.present_cutoff, :][self.tags].to_numpy(
            copy=True)

        # Really important step of embedding the target excess oxygen value in the present value
        generative_input_idxs = {cv: self.tags_to_index[cv] for cv in self.optimizer.gen_input_tags}
        self.generative_input = self.optimizer.update_and_get_gen_input(self.generative_input,
                                                                generative_input_idxs)

        generative_input: Dict[str, np.ndarray] = {
            config.MINUTE_INPUT_KIND: self.minute_input,
            config.DAY_INPUT_KIND: self.day_input,
            config.SENSOR_INPUT_KIND: self.generative_input
        }

        self.generative_model["model"].estimator_params["output_variables"] = self.recommendation_mv_variables
        self.generative_model["model"].estimator_params["generative_prediction"] = True
        self.generative_model["model"].estimator_params["n_suggestions"] = config.GENERATION_COUNT
        self.generated_mvs = self.generative_model.predict(generative_input)

        self.all_mv_dependent_conditions_satisfied = np.full(
            (config.GENERATION_COUNT, ), True)
        self.efficieny_model_limits_satisfied = np.full(
            (config.GENERATION_COUNT, ), True)

        mv_dependent_constraints = self.mv_dependent_constraints

        for i in range(config.GENERATION_COUNT):
            # We are accessing the values at each generation, because we need a copy of the dataframe in which we migh replace values and
            # we don't want to replace tha values in the 'realtime_df'.
            self.generative_input = self.realtime_df.iloc[self.present_offset:self.present_cutoff, :][self.tags].to_numpy(
                copy=True)

            # Checking if MV-specific bias limits are satisfied before the generative input is changed.
            for j, condition in enumerate(self.recommendation_mv_variables):
                if condition not in self.const_limits:
                    continue
                constraint_is_not_within_limits = not self.const_limits[condition](
                    current_x=self.generative_input[-1, self.tags_to_index[condition]],
                    delta_x=self.generated_mvs[-1, j, i]
                )
                if constraint_is_not_within_limits:
                    self.all_mv_dependent_conditions_satisfied[i] = False
                    break

            # Checking MV-dependent constraints only if bias limits are passing
            if self.all_mv_dependent_conditions_satisfied[i] == True:
                for j, tag in enumerate(self.recommendation_mv_variables):
                    self.generative_input[-1, self.tags_to_index[tag]
                          ] += self.generated_mvs[-1, j, i]

                # MV dependent constrains forecasting
                # Here we shift the input by one in order to predict what will be the resulting dependent constrains,
                # after the change in the MVs.
                generative_input: Dict[str, np.ndarray] = {
                    config.MINUTE_INPUT_KIND: self.minute_input,
                    config.DAY_INPUT_KIND: self.day_input,
                    config.SENSOR_INPUT_KIND: self.generative_input
                }

                self.generative_model["model"].estimator_params["output_variables"] = mv_dependent_constraints
                # We switch to making point predictions instead of generative predictions
                self.generative_model["model"].estimator_params["generative_prediction"] = False
                predicted_mv_dependent_constrains = self.generative_model.predict(
                    generative_input)

                for j, condition in enumerate(mv_dependent_constraints):
                    if condition not in self.const_limits:
                        continue
                    constraint_is_not_within_limits = not self.const_limits[condition](
                        current_x=self.generative_input[-1, self.tags_to_index[condition]],
                        delta_x=predicted_mv_dependent_constrains[-1, j])

                    if constraint_is_not_within_limits:
                        self.all_mv_dependent_conditions_satisfied[i] = False
                        break

    def rearrange_forecast_cv_input_data(self, forecast_model):
        forecasting_tags_to_index = forecast_model.estimator_params["tags_to_index"]
        recomedation_mvs_set = set(self.recommendation_mv_variables)
        rearranged_forecasting_input = np.full(
            (self.present_cutoff-self.present_offset, len(self.tags)), np.nan)

        present_mvs = dict()

        for tag in forecasting_tags_to_index.keys():

            rearranged_forecasting_input[:, forecasting_tags_to_index[tag]
                               ] = self.realtime_df.iloc[self.present_offset:self.present_cutoff, :].loc[:, tag]

            if tag in recomedation_mvs_set:
                present_mvs[tag] = rearranged_forecasting_input[-1,
                                                        forecasting_tags_to_index[tag]]

                rearranged_forecasting_input[:, forecasting_tags_to_index[tag]] = np.roll(
                    rearranged_forecasting_input[:, forecasting_tags_to_index[tag]],
                    self.f_mv_input_shift,
                    axis=0)

        return rearranged_forecasting_input, present_mvs

    def prepare_forecast_cv_input(self, forecasting_input, generated_mvs, present_mvs, forecast_model):
        forecasting_tags_to_index = forecast_model.estimator_params["tags_to_index"]
        for j, tag in enumerate(self.recommendation_mv_variables):
            # We divide the generated MV in order to spread the divided amount over the whole input.
            # We do so instead ofinputing the whole generated MV value in order to avoid too drastic change at one  minute and
            # this drastic change might have not been seen by the forecasting model.
            generated_mv_minute_wise = generated_mvs[j] / self.f_mv_input_shift
            present_mv = present_mvs[tag]

            for p in range(forecasting_input.shape[0] - self.f_mv_input_shift, forecasting_input.shape[0]):
                forecasting_input[p, forecasting_tags_to_index[tag]
                        ] = present_mv + generated_mv_minute_wise
                generated_mv_minute_wise += generated_mv_minute_wise

        # Prepare the input for prediction
        present_input = forecasting_input[np.newaxis, -1, :]

        sensor_input: Dict[str, np.ndarray] = {
            config.MINUTE_INPUT_KIND: self.minute_input,
            config.DAY_INPUT_KIND: self.day_input,
            # The present index is the last one.
            config.PRESENT_INDICES: [forecasting_input.shape[0] - 1],
            config.PRESENT_INPUT: present_input,
            config.SENSOR_INPUT_KIND: forecasting_input
        }

        return sensor_input

    def forecast_cv(self, forecast_pipeline, sensor_input):
        scaled_input = forecast_pipeline["preprocessing"].transform(sensor_input)
        model = forecast_pipeline["model"]
        # Check whether the recommended MVs are within the efficiency forecaster's capacity.
        sensors_not_passing_constrains = model.is_input_within_limits(scaled_input)

        predictions = model.predict(scaled_input)

        return sensors_not_passing_constrains, predictions

    def cv_forecasting(self):
        # print('################# EFFICIENCY and EXCESS OXYGEN FORECASTING #################', flush=True)

        final_mv_recomendations = None
        final_cv_predictions = None
        any_efficiency_gain_detected = True
        cv_forecasting_input = None

        # Rewrite the mappers from tags to indices in the input array:
        rearranged_forecasting_inputs = dict()
        present_model_mvs = dict()
        generation_selected = None

        for model_name in self.forecasting_models.keys():
            rearranged_forecasting_input, present_mvs = self.rearrange_forecast_cv_input_data(
                self.forecasting_models[model_name]["model"])
            rearranged_forecasting_inputs[model_name] = rearranged_forecasting_input
            present_model_mvs[model_name] = present_mvs

        self.optimizer.update_current_state_reward(self.realtime_df)
        forecasting_results_array = []

        for i in range(config.GENERATION_COUNT):
            sensor_inputs = dict()
            models_limits_satisfied = dict()
            models_predictions = dict()

            all_conditions_satisfied = True

            for model_name in rearranged_forecasting_inputs.keys():
                
                generated_mvs = self.generated_mvs[-1, :, i]
                # We are accessing the values at each generation,
                # because we need a copy of the dataframe in which we might replace values and
                # we don't want to replace tha values in the 'realtime_df'.
                sensor_input = self.prepare_forecast_cv_input(
                    rearranged_forecasting_inputs[model_name].copy(),
                    generated_mvs,
                    present_model_mvs[model_name],
                    self.forecasting_models[model_name]["model"])

                sensor_inputs[model_name] = sensor_input
                (sensors_not_passing_limits, predictions) = self.forecast_cv(
                    self.forecasting_models[model_name],
                    sensor_input)

                models_predictions[model_name] = predictions
                models_limits_satisfied[model_name] = len(sensors_not_passing_limits) < 1
                self.sensors_not_passing_model_limits = sensors_not_passing_limits

                if len(sensors_not_passing_limits) < 1:
                    self.any_model_constraint_check_satisfied = True
                else:
                    all_conditions_satisfied = False

            self.optimizer.calculate_temporal_reward(models_predictions, sensor_inputs)
            total_reward = self.optimizer.calculate_total_temporal_reward()

            if self.direction_variables:
                # Checking directional variables (EOs) related constraints
                total_result_dv = 0
                total_current_dv = 0
                total_sweet_spot = 0
                dv_limits_fulfilled = True
                for dv_tag in self.direction_variables:
                    forecasting_model_name = self.forecasting_model_names[dv_tag]

                    forecasting_model = self.forecasting_models[forecasting_model_name]["model"]
                    forecasting_present_input = sensor_inputs[forecasting_model_name][config.PRESENT_INPUT]
                    result_dv = models_predictions[forecasting_model_name]
                    gen_input_index = self.generative_model["model"].estimator_params["tags_to_index"][dv_tag]
                    current_dv = self.generative_input[-1, gen_input_index]
                    sweet_spot = self.sweet_spots[dv_tag]
                    if not self.const_limits[dv_tag](current_dv, abs(result_dv-current_dv)):
                        dv_limits_fulfilled = False

                    total_result_dv += result_dv
                    total_current_dv += current_dv
                    total_sweet_spot += sweet_spot

                # Could also be left as total w/o division.
                total_result_dv /= len(self.direction_variables)
                total_current_dv /= len(self.direction_variables)
                total_sweet_spot /= len(self.direction_variables)

                # Adding tolerance to the check of directions.
                dv_directions_satisfied = (((abs(result_dv - sweet_spot) + config.TARGET_EXCESS_OXY_CONSERVATIVE_TOLERANCE) <= (abs(current_dv - sweet_spot)))
                                    or ((abs(result_dv - sweet_spot) - config.TARGET_EXCESS_OXY_CONSERVATIVE_TOLERANCE) <= (abs(current_dv - sweet_spot))))

                if dv_directions_satisfied and dv_limits_fulfilled:
                    self.any_dv_constraints_check_satisfied = True
                else:
                    all_conditions_satisfied = False

                if self.all_mv_dependent_conditions_satisfied[i]:
                    self.any_mv_constraint_check_satisfied = True
                else:
                    all_conditions_satisfied = False

                # if total_reward < current_state_total_reward:
                #     all_conditions_satisfied = False

                # Assign to False if DV delta is too large
                if all_conditions_satisfied:
                    any_efficiency_gain_detected = False
                    eff_optimizer = self.optimizer
                    # TODO: replace the tolerance factor by distribution data form the eff forecaster.
                    if eff_optimizer.temporal_horizon_eff_diff > 0 - config.NEG_EFFICIENCY_TOLERANCE and \
                        eff_optimizer.temporal_horizon_eff_diff <= (config.TARGET_EFFICIENCY_DIFF * config.TARGET_EFFICIENCY_TOP_TOLERANCE_FACTOR):
                        any_efficiency_gain_detected = True

                    if total_reward > eff_optimizer.optimal_reward and any_efficiency_gain_detected:
                        # If the reward is satisfying we accept the recommended values.
                        final_mv_recomendations = generated_mvs
                        final_cv_predictions = models_predictions
                        eff_optimizer.update_optimal_reward()
                        cv_forecasting_input = sensor_inputs
                        generation_selected = i


            else:
                self.any_dv_constraints_check_satisfied = True

                if self.all_mv_dependent_conditions_satisfied[i]:
                    self.any_mv_constraint_check_satisfied = True
                else:
                    all_conditions_satisfied = False

                if (total_reward < self.optimizer.calculate_current_total_state_reward()) or \
                    (not self.optimizer.is_target_optimized()):
                    all_conditions_satisfied = False

                if total_reward > self.optimizer.max_total_reward and all_conditions_satisfied:
                        # If the reward is satisfying we accept the recommended values.
                        final_mv_recomendations = generated_mvs
                        final_cv_predictions = models_predictions
                        self.optimizer.update_optimal_reward()
                        self.optimizer.max_total_reward = total_reward
                        generation_selected = i
            
            try:
                forecasting_results_array.append([i, '', 'Reward', total_reward, int(all_conditions_satisfied), 0])
                final_mv_recomendations_df = pd.DataFrame(generated_mvs[np.newaxis, ...], columns=self.recommendation_mv_variables)
                for k, v in final_mv_recomendations_df.iloc[0].to_dict().items():
                    forecasting_results_array.append([i, 'MV', k, v, int(all_conditions_satisfied), 0])
                for k,v in models_predictions.items():
                    model_to_var = {v:k for k,v in self.forecasting_model_names.items() }
                    forecasting_results_array.append([i, 'CV', model_to_var[k], np.reshape(v, -1)[0], int(all_conditions_satisfied), 0])
            except: pass
        
        forecasting_results_df = pd.DataFrame(forecasting_results_array, columns=["generation_number", "category", "variable","value","condition","selected"])
        if generation_selected is not None:
            indexes = forecasting_results_df[forecasting_results_df['generation_number'] == generation_selected].index
            forecasting_results_df.loc[indexes, 'selected'] = 1

        final_mv_recomendations_df = pd.DataFrame(final_mv_recomendations[np.newaxis, ...], columns=self.recommendation_mv_variables) if final_mv_recomendations is not None else None
        self.cv_forecasting_input = cv_forecasting_input
        self.forecasting_results_df = forecasting_results_df
        return final_mv_recomendations_df, final_cv_predictions, self.optimizer


class EfficiencyOptimizer:
    def __init__(self, forecasting_model_names,
          forcast_input_index,
          gen_input_tags, limits,
          dv_sweet_spot):
        
        self.forecasting_model_names=forecasting_model_names
        self.gen_input_tags = gen_input_tags
        self.dv_sweet_spot = dv_sweet_spot
        self.limits = limits
        self.forcast_input_index = forcast_input_index
        self.max_horizon_eff_diff = float('-inf')

    def update_and_get_gen_input(self, generative_input, gen_input_indices):
        for dv_tag, index in gen_input_indices.items():
            current_dv = generative_input[-1, index]
            generative_input[-1, index] += self.dv_sweet_spot[dv_tag] - current_dv
        return generative_input

    def update_optimal_reward(self):
        self.max_horizon_eff_diff = self.temporal_horizon_eff_diff

    def update_current_state_reward(self, state):
        # Staying in that state we have no diff change thus no reward.
        self.current_state_horizon_eff_diff = 0

    @property
    def current_state_reward(self):
        """The reward before starting max reward search."""
        return self.current_state_horizon_eff_diff

    @property
    def temporal_reward(self):
        return self.temporal_horizon_eff_diff

    @property
    def optimal_reward(self):
        """The reward for efficiency optimizer is the positive difference between last and first value of the horizon.
            The temporal reward, while deciding whether this one is the best."""
        return self.max_horizon_eff_diff

    def calculate_temporal_reward(self, predictions, sensor_input):
        self.predictions = predictions

        forecasting_model_name = self.forecasting_model_names[config.EFFICIENCY_TAG]
        prediction = self.predictions[forecasting_model_name]
        last_prediction = prediction[0, 0, -1]

        self.temporal_horizon_eff_diff = last_prediction - \
            sensor_input[forecasting_model_name][config.PRESENT_INPUT][-1, self.forcast_input_index]
        
    def calculate_total_temporal_reward(self):
        return self.temporal_reward


class OxygenOptimizer:
    def __init__(self, target_variables, forecasting_model_names, limits, sweet_spots):
        self.target_variables = target_variables
        self.forecasting_model_names=forecasting_model_names
        self.gen_input_tags = target_variables
        self.sweet_spots = sweet_spots
        self.limits = limits

        self.max_total_reward = float("-Inf")

    def update_and_get_gen_input(self, generative_input, gen_input_tags):
        for cv, idx in gen_input_tags.items():
            current_excess_oxy = generative_input[-1, idx]
            generative_input[-1, idx] += self.sweet_spots[cv] - current_excess_oxy

        return generative_input

    def update_optimal_reward(self):
        self.min_excess_oxy_dist = dict()

        for cv in self.target_variables:
            self.min_excess_oxy_dist[cv] = self.temporal_excess_oxy_dist[cv]

    def update_current_state_reward(self, state):
        self.current_state_excess_oxy_dist = dict()

        for cv in self.target_variables:
            self.current_state_excess_oxy_dist[cv] = abs(self.sweet_spots[cv] - state[cv][-1])

    def current_state_reward(self, cv):
        return -self.current_state_excess_oxy_dist[cv]

    def calculate_current_total_state_reward(self):
        current_total_state_reward = 0

        for cv_tag in self.target_variables:
            current_total_state_reward += self.current_state_reward(cv_tag)

        current_total_state_reward /= len(self.target_variables)

        return current_total_state_reward
    
    def temporal_reward(self, cv_tag):
        return -self.temporal_excess_oxy_dist[cv_tag]
    
    def calculate_total_temporal_reward(self):
        total_reward = 0

        for cv in self.target_variables:
            total_reward += self.temporal_reward(cv)
        
        total_reward /= len(self.target_variables)

        return total_reward

    @property
    def optimal_reward(self):
        """The reward for oxygen optimizer is the negative distance from the sweet spot."""
        return - self.min_excess_oxy_dist

    def calculate_temporal_reward(self, predictions, sensor_input):
        self.temporal_excess_oxy_dist = dict()
        self.predictions = predictions

        for cv in self.target_variables:
            forecasting_model_name = self.forecasting_model_names[cv]
            prediction = self.predictions[forecasting_model_name]
            last_prediction = prediction[0, 0, -1]
            self.prediction = last_prediction
            self.temporal_excess_oxy_dist[cv] = abs(last_prediction - self.sweet_spots[cv])

    def is_target_optimized(self):
        if all(
            self.current_state_excess_oxy_dist[cv] > self.temporal_excess_oxy_dist[cv] for cv in self.target_variables
            ):
            return True

        return False


def extract_day_min_from_date(date):
    delta = date - config.DATE_OFFSET

    day = delta.days
    minute = (date.hour * 60) + date.minute

    return day, minute


def get_from_disk_realtime_data(
        random_num,
        unit: str,
        table_name: str,
        timesteps: int,
        contract: TagContract,
        model_converters: Dict[str, Any],
        model_converter_input_tags: Dict[str, Any]):
    """This function is ubeing used just for deriving the data from the local disk instead from the database.
       Thus it should have the same output as 'get_realtime_data' and we do NOT deploy this function, because
       it is onlt for local use."""

    original_dataset = pd.read_csv(f"data/prepared_datasets/sampletest/{unit}/{table_name}", parse_dates=[
            config.REAL_TIME_DATE_COLUMN_NAME], index_col=config.REAL_TIME_DATE_COLUMN_NAME)
    # original_dataset.index = original_dataset.index.dt.floor('Min')
    original_dataset = original_dataset.resample("1min").mean().interpolate()

    if random_num is None:
        original_dataset = original_dataset.tail(timesteps)
    else:
        # FOR TESTING PURPOSE!
        original_dataset = original_dataset.iloc[int(random_num):]
        original_dataset = original_dataset.head(timesteps)

    dataset, original_dataset = convert_dataset(
            contract=contract,
            dataset=original_dataset,
            model_converters=model_converters,
            model_converters_association_tags=model_converter_input_tags)

    return dataset, original_dataset


def detect_and_label_outliers_as_nan(data, m=2):
    for column in data.columns:
        d = np.abs(data[column] - np.mean(data[column]))
        mdev = np.mean(d)
        s = d/mdev if mdev else np.zeros(d.shape)
        data.loc[s > m, column] = np.NaN

    return data


def get_realtime_data(
    engine,
    tb_name,
    sensors,
    alias_sensors,
    sensor_list_df,
    n_minutes,
    contract,
    model_converters,
    model_converter_input_tags,
    timestamp='now'):

    # print('################# FUNCTION FOR GETTING REALTIME DATA #################')
    if len(alias_sensors) > 1:
        where_script = f'in {str(tuple(alias_sensors))}'
    else:
        where_script = f'="{alias_sensors[0]}"'

    latest_timestamp = pd.to_datetime(timestamp)
    # query = f'SELECT * FROM {tb_name} WHERE f_address_no as tag_name {where_script} AND ts >= NOW() - INTERVAL {n_minutes} MINUTE ORDER BY ts DESC'
    query = f"""SELECT f_date_rec as ts, f_address_no as tag_name, CAST(f_value AS FLOAT) as `value` FROM {tb_name}
                WHERE f_address_no {where_script} 
                AND f_date_rec >= (NOW() - INTERVAL {n_minutes} MINUTE) ORDER BY f_date_rec DESC"""
    query = f"""SELECT f_date_rec as ts, f_address_no as tag_name, CAST(f_value AS FLOAT) as `value` FROM {tb_name}
                WHERE f_address_no {where_script} 
                AND f_date_rec >= (NOW() - INTERVAL {n_minutes} MINUTE) 
                UNION
                SELECT f_date_rec AS ts, "Efficiency" AS tag_name, CAST(f_value AS FLOAT) as `value` FROM tb_efficiency_result
                WHERE f_param_name = "Boiler (Fuel) Efficiency"
                AND f_date_rec >= (NOW() - INTERVAL {n_minutes} MINUTE)
                """
    dataset = pd.read_sql(query, con=engine)

    # realtime data preprocessing
    dataset["value"] = pd.to_numeric(dataset["value"])
    dataset[config.REAL_TIME_DATE_COLUMN_NAME] = pd.to_datetime(dataset["ts"])
    pivoted_dataset = pd.pivot_table(
        dataset, values='value', index=config.REAL_TIME_DATE_COLUMN_NAME, columns='tag_name')
    pivoted_dataset = pivoted_dataset.resample("1min").mean().interpolate()

    # TODO: Need to clarify this!
    for sensor in alias_sensors:
        if not sensor in pivoted_dataset.columns:
            pivoted_dataset[sensor] = np.nan

    return convert_dataset(
            contract=contract,
            dataset=pivoted_dataset,
            model_converters=model_converters,
            model_converters_association_tags=model_converter_input_tags)


def get_latest_id(engine, table, col, timestamp=None):
    if timestamp is None:
        query = f'SELECT MAX({col}) FROM {table}'
    else:
        query = f'SELECT MAX({col}) FROM {table} WHERE ts = "{timestamp}"'
    result = pd.read_sql(query, con=engine)

    return result.values[0][0]

def get_mit_config(engine, table):
    dbname = table.split('.')[0]
    query = f'''SELECT tag_dcs as tag, description, f_value as value FROM {table} tcct
                LEFT JOIN {dbname}.tb_bat_raw tcr
                ON tcct.tag_dcs = tcr.f_address_no
                WHERE description LIKE "%%Inlet%%Temperature%%"'''
    result = pd.read_sql(query, con=engine)

    query = f'''SELECT description, AVG(f_value) as value FROM {table} tcct
                LEFT JOIN {dbname}.tb_bat_raw tcr
                ON tcct.tag_dcs = tcr.f_address_no
                WHERE description LIKE "%%Outlet Temperature%%"
                GROUP BY description'''
    result2 = pd.read_sql(query, con=engine)
    return result, result2

def get_recom_exec_interval(engine):
    query = f"""SELECT f_default_value FROM tb_combustion_parameters WHERE f_label = "RECOM_EXEC_INTERVAL" """
    result = pd.read_sql(query, con=engine)
    if len(result) == 0:
        result = 15
    else:
        result = np.reshape(result.values,-1)[0]
    return result

def read_O2_parameters(engine):
    q = f"""SELECT hdr.f_rule_hdr_id, hdr.f_rule_descr, dtl.f_tag_sensor, dtl.f_bracket_open, raw.f_value, dtl.f_bracket_close FROM tb_combustion_rules_hdr hdr
        LEFT JOIN tb_combustion_rules_dtl dtl 
        ON hdr.f_rule_hdr_id = dtl.f_rule_hdr_id 
        LEFT JOIN tb_bat_raw raw
        ON dtl.f_tag_sensor = raw.f_address_no 
        WHERE hdr.f_is_active = 1
        AND hdr.f_rule_descr LIKE "%%_CALLIBRATION"
        AND dtl.f_is_active = 1"""
    rules = pd.read_sql(q, engine)
    ret = {}

    for i in rules.index:
        rule = rules.iloc[i]
        bc = rule['f_bracket_close']
        bc = re.findall('[\s\-0-9\.]+', bc)
        coef = 0; intercept = 0
        if len(bc) == 2:
            coef, intercept = bc
            coef = float(coef.replace(' ','').strip())
            intercept = float(intercept.replace(' ','').strip())
        elif len(bc) == 1:
            coef = bc[0]
            coef = float(coef.replace(' ','').strip())
        else: raise ValueError("Nilai kalibrasi tidak match")
        ret[rule['f_tag_sensor']] = {'coef':coef, "intercept":intercept}

    return ret

def noise_reduction(y: np.ndarray, days: np.ndarray, wavelet="db4"):
    results = np.empty(y.shape)

    sucessive_count = 0
    if days.shape[0] > 0:
        prev_day = days[0]
        sucessive_count = 1

    successive_counts = list()

    for i in range(1, days.shape[0]):
        current_day = days[i]
        if(current_day == prev_day):
            sucessive_count += 1
        else:
            successive_counts.append(sucessive_count)
            sucessive_count = 1

        prev_day = current_day
    if sucessive_count > 0:
        successive_counts.append(sucessive_count)

    offset = 0
    for sucessive_count in successive_counts:
        signal = y[offset:offset+sucessive_count]

        coeff = pywt.wavedec(signal, wavelet, mode="per")

        sigma = (1/0.6745) * \
            np.mean(np.absolute(coeff[-1] - np.mean(coeff[-1])))
        # Calculte the univeral threshold
        s_thresh = sigma * np.sqrt(2*np.log(signal.shape[0]))

        coeff[1:] = (pywt.threshold(i, value=s_thresh, mode="soft")
                    for i in coeff[1:])

        signal = pywt.waverec(coeff, wavelet, mode="per")
        results[offset:offset+sucessive_count] = signal[:y[offset:offset +
                                                     sucessive_count].shape[0]]
        offset += sucessive_count

    # Sometimes when we have near no variation we get NAs and in that case we return back
    # the original data.
    if np.isnan(results).sum() > np.isnan(y).sum():
        results = y

    return results

# use REPLACE INTO commands instead of INSERT INTO


def mysql_replace_into(table, conn, keys, data_iter):
    from sqlalchemy.dialects.mysql import insert
    from sqlalchemy.ext.compiler import compiles
    from sqlalchemy.sql.expression import Insert

    @compiles(Insert)
    def replace_string(insert, compiler, **kw):
        s = compiler.visit_insert(insert, **kw)
        s = s.replace("INSERT INTO", "REPLACE INTO")
        return s

    data = [dict(zip(keys, row)) for row in data_iter]

    conn.execute(table.table.insert(replace_string=""), data)

def logging(text):
    t = time.strftime('%Y-%m-%d %X')
    text = text.replace('\n', '\n                        ')
    print(f"[{t}] - {text}")
    