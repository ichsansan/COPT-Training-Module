import pandas as pd
import numpy as np
from sqlalchemy import create_engine
import joblib, os, time, logging

logger = logging.getLogger("process")
logger.setLevel(logging.INFO)

Model = joblib.load("utils/Model Efficiency BLK2.bin")

param_id_map = """15	Boiler (Fuel) Efficiency
14	Credits - Auxiliary Equipment Power
13	Credits - Sensible Heat in Fuel
12	Credits - Moisture in Air
11	Credits - Entering Dry Air
10	Losses - Summary of Losses 
9	Losses - Surface Radiation and Convection
8	Losses - CO in Flue Gas
7	Losses - Sensible Heat Residue
6	Losses - Unburned Carbon
5	Losses - Moisture in Air
4	Losses - Water from H2O Fuel
3	Losses - Water from H2 Fuel
2	Losses - Dry Gas """.split('\n')
param_id_map = {f.split('\t')[1]:f.split('\t')[0] for f in param_id_map}

con = "mysql+mysqlconnector://training:12345@35.219.48.62:3306/db_bat_blk2"

result_columns = ['Boiler (Fuel) Efficiency', 'Credits - Auxiliary Equipment Power',
                  'Credits - Entering Dry Air', 'Credits - Moisture in Air',
                  'Credits - Sensible Heat in Fuel', 'Losses - CO in Flue Gas',
                  'Losses - Dry Gas ', 'Losses - Moisture in Air',
                  'Losses - Sensible Heat Residue', 'Losses - Summary of Losses ',
                  'Losses - Surface Radiation and Convection', 'Losses - Unburned Carbon',
                  'Losses - Water from H2 Fuel', 'Losses - Water from H2O Fuel']

def PredictEfficiency():
    ret = {
        'status': False,
        'message': ''
    }

    try:
        with create_engine(con).connect() as conn:
            q = f"""SELECT * FROM tb_efficiency_conf_tags"""
            Eff_tags = pd.read_sql(q, conn)

            summed_variable = ['Total Coal Flow','Total Desup Spray Flow']

            q = f"""SELECT NOW() AS f_date_rec, f_address_no, f_value FROM tb_bat_raw WHERE f_address_no IN {tuple(np.unique(Eff_tags['f_address_no']))} """
            Raw = pd.read_sql(q, conn)
            Raw['f_value'] = Raw['f_value'].astype(float)
            Raw = Raw.pivot_table(index='f_date_rec', columns='f_address_no', values='f_value')
            
            Data = pd.DataFrame(index=Raw.index)
            for label in np.unique(Eff_tags['f_tag_desc']):
                tags = Eff_tags[Eff_tags['f_tag_desc'] == label]['f_address_no'].values.reshape(-1)
                tags = np.array([f.strip() for f in tags])

                if label in summed_variable: 
                    Data[label] = Raw[tags].sum(axis=1)
                else: 
                    Data[label] = Raw[tags].mean(axis=1)

            Result = pd.DataFrame(Model.predict(Data), index=Data.index, columns=result_columns)
            Result_to_db = Result.reset_index().melt(id_vars='f_date_rec')
            Result_to_db = Result_to_db.rename(columns={'value':'f_value', 'variable':'f_param_name'})
            Result_to_db['f_units'] = '%'
            Result_to_db['f_date_rec'] = Result_to_db['f_date_rec'].round('1min')
            Result_to_db['f_param_id'] = [param_id_map[f] for f in Result_to_db['f_param_name']]
            
            logger.info(f"update {round(Result_to_db.size / (1024), 2)} KB ke database ...")
            
            Result_to_db.to_sql("tb_efficiency_result", conn, if_exists = 'append', index=False, chunksize=1000)
            efficiency_value = Result_to_db[Result_to_db['f_param_name'] == "Boiler (Fuel) Efficiency"].iloc[0]['f_value']
            q = f"""REPLACE INTO tb_bat_raw (f_date_rec, f_address_no, f_value)
                    VALUES (NOW(), "Efficiency", {efficiency_value}) """
            replies = conn.execute(q)

            Result_return = Result_to_db[['f_param_name','f_value','f_units']]
            Result_return['f_value'] = Result_return['f_value'].round(4)
            Result_return = Result_return.rename(columns={'f_param_name':'variable'})
            Result_return['value'] = Result_return['f_value'].astype(str) + ' ' + Result_return['f_units']
            Result_return = Result_return.drop(columns=['f_value','f_units'])

            ret['object'] = Result_return.astype(str).to_dict(orient='records')
            ret['message'] = f"Efficiency value has been generated!"
            ret['status'] = True
    except Exception as E:
        E = str(E).split('\n')[0]
        logger.error(f"Failed generating efficiency: {E}")
        ret['message'] = E
    
    return ret