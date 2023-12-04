import pandas as pd
import numpy as np
import time, config, traceback, re, os
from BackgroundService import logging
from urllib.parse import quote_plus as urlparse
from pprint import pprint
from sqlalchemy import create_engine

_USER_ = config._USER_
_PASS_ = urlparse(config._PASS_)
_IP_ = config._IP_
_DB_NAME_ = config._DB_NAME_
_TEMP_FOLDER_ = config.TEMP_FOLDER

con = f"mysql+mysqlconnector://{_USER_}:{_PASS_}@{_IP_}/{_DB_NAME_}"
engine = create_engine(con)

def save_to_path(dataframe, filename="download"):
    if not os.path.isdir(_TEMP_FOLDER_): os.makedirs(_TEMP_FOLDER_)

    # Delete all old files
    files = [os.path.join(_TEMP_FOLDER_, f) for f in os.listdir(_TEMP_FOLDER_)]
    current_time = time.time()
    for file in files:
        try:
            if (current_time - os.path.getmtime(file)) > (60*60*24): os.remove(file)
        except Exception as E:
            print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')} - {E}")

    # Save file, and return file path
    #filename = f"COPT-{filename}-{time.strftime('%Y-%m-%d %H%M%S')}.csv" # CSV file
    filename = f"COPT-{filename}-{time.strftime('%Y-%m-%d %H%M%S')}.xlsx" # Excel file
    path = os.path.join(_TEMP_FOLDER_, filename)
    dataframe.to_excel(path, index=False, engine='xlsxwriter')
    return path

def get_status():
    keys = [config.WATCHDOG_TAG, config.SAFEGUARD_TAG, config.DESC_ENABLE_COPT]
    q = f"""SELECT conf.f_tag_descr AS f_address_no, raw.f_value FROM tb_bat_raw raw
        LEFT JOIN tb_tags_read_conf conf
        ON raw.f_address_no = conf.f_tag_name
        WHERE conf.f_tag_descr IN {tuple(keys)}
        UNION
        SELECT f_address_no, f_value FROM tb_bat_raw
        WHERE f_address_no IN {tuple(keys)}"""
    df = pd.read_sql(q, engine).replace(np.nan, 0)
    df.loc[df['f_address_no'] == config.WATCHDOG_TAG, 'f_value'] = df['f_value'].replace({'False': 1, 'True': 0, '0': 1, '1': 0})
    df['f_value'] = df['f_value'].replace({'True': 1, 'False': 0})
    status = {}
    for k in keys:
        if k in df['f_address_no'].values: status[k] = int(df[df['f_address_no'] == k]['f_value'].values[0])
        elif np.isnan(status[k]): status[k] = int(0)
        else: status[k] = 0
    return status[keys[0]], status[keys[1]], status[keys[2]]

def get_o2_converter_parameters():
    try:
        q = f"""SELECT hdr.f_rule_hdr_id, hdr.f_rule_descr, dtl.f_tag_sensor, dtl.f_bracket_open, raw.f_value, dtl.f_bracket_close FROM tb_combustion_rules_hdr hdr
                LEFT JOIN tb_combustion_rules_dtl dtl 
                ON hdr.f_rule_hdr_id = dtl.f_rule_hdr_id 
                LEFT JOIN tb_bat_raw raw
                ON dtl.f_tag_sensor = raw.f_address_no 
                WHERE hdr.f_is_active = 1
                AND dtl.f_is_active = 1"""
        rules = pd.read_sql(q, engine)
        o2_a_params = rules[rules['f_rule_descr'] == 'O2_A_CALLIBRATION']['f_bracket_close'].values[0]
        o2_b_params = rules[rules['f_rule_descr'] == 'O2_B_CALLIBRATION']['f_bracket_close'].values[0]

        o2_a_intercept, o2_a_coef = [float(f.replace(' ','')) for f in re.findall('[-\s]+[0-9.]+', o2_a_params)]
        o2_b_intercept, o2_b_coef = [float(f.replace(' ','')) for f in re.findall('[-\s]+[0-9.]+', o2_b_params)]

        return np.average([o2_a_intercept, o2_b_intercept]), np.average([o2_a_coef, o2_b_coef])
    except:
        # logging('Failed to fetch o2 parameters. Giving out the default value ...')
        return [1, 0]

# def get_comb_tags():
#     q = f"""SELECT cd.f_desc, tbr.f_value, cd.f_units, 
#             cd.f_sequence, cd.f_bracket_open, cd.f_bracket_close FROM {_DB_NAME_}.cb_display cd 
#             LEFT JOIN {_DB_NAME_}.tb_bat_raw tbr 
#             ON cd.f_tags = tbr.f_address_no 
#             ORDER BY cd.f_desc,cd.f_sequence ASC"""
#     df = pd.read_sql(q, engine)
#     # df['f_data_type'] = df['f_data_type'].astype(str)
#     df['f_units'] = df['f_units'].astype(str)
#     df['f_value'] = df['f_value'].astype(str)

#     df['f_value'] = df['f_value'].replace('None',0)
#     df = df.replace('None','')

#     # df['f_sequence'] = df['f_sequence'].fillna(0).astype(int)
#     # #filter untuk desc yg f_bracket_open is not empty
#     # filtered_df = df[df['f_bracket_open'].notna()]
#     # #gabung bracket open, value, bracket close kedalam kolom bias_value
#     # filtered_df.loc[:, 'Bias_Value'] = filtered_df.apply(lambda row: f"{row['f_bracket_open']}{row['f_value']}{row['f_bracket_close']}", axis=1)
#     # #group berdasarkan deskripsi
#     # grouped_df = filtered_df.groupby('f_desc')['Bias_Value'].apply(' '.join).reset_index()
#     # grouped_df['Bias_Value'] = grouped_df['Bias_Value'].apply(lambda x: eval(x))

#     # df = df.drop_duplicates(subset=['f_desc'])
#     # #merge kembali nilai yg membutuhkan eval
#     # df["Original_f_value"] = df["f_value"]
#     # df = df.merge(grouped_df, on="f_desc", how="left")
#     # df["f_value"] = df["Bias_Value"]
#     # df["f_value"].fillna(df["Original_f_value"], inplace=True)
#     # df.drop(columns=["Bias_Value", "Original_f_value","f_sequence","f_bracket_open","f_bracket_close"], inplace=True)

#     # df = df.set_index('f_desc')

#     # df['f_value'] = df['f_value'].astype(float).round(2).astype(str)
#     text = []
#     for f in df.index:
#         if len(df[df['f_desc'] == f]) < 1: continue
#         r = df[df['f_desc'] == f][['f_bracket_open','f_value','f_bracket_close']].fillna(0)
#         r['f_value'] = r['f_value'] + 0.00001    # untuk mencegak kalkulasi 1/0 = inf
#         r = ' '.join([' '.join(f) for f in r.values.astype(str)])
#         r = eval(r)
#         u = df[df['f_desc'] == f]['f_units'].astype(str).values[0]
        
#         # Jika f_unit nilainya 's' atau '', antara value dan f_unit tidak dikasih spasi
#         if u in ['s','']:
#             # TagValue[t] = f"{round(r,2)}{u}"
#             text.append(f"{round(r,2)}{u}")
#         else:
#             # TagValue[t] = f"{round(r,2)} {u}"
#             text.append(f"{round(r,2)}{u}")
#         # text.append(df.loc[f, 'f_value'] + " " + df.loc[f, 'f_units'])
#     df['text'] = text
#     return df.to_dict()['text']

def get_comb_tags():
    q = f"""SELECT cd.f_desc, tbr.f_value, cd.f_units, 
            cd.f_sequence, cd.f_bracket_open, cd.f_bracket_close FROM {_DB_NAME_}.cb_display cd 
            LEFT JOIN {_DB_NAME_}.tb_bat_raw tbr 
            ON cd.f_tags = tbr.f_address_no 
            ORDER BY cd.f_desc,cd.f_sequence ASC"""
    df = pd.read_sql(q, engine)
    # df['f_data_type'] = df['f_data_type'].astype(str)
    df['f_units'] = df['f_units'].astype(str)
    df['f_value'] = df['f_value'].replace('',0)
    df['f_value'] = df['f_value'].astype(float)
    df = df.replace('None','')

    text = {}
    for f in np.unique(df['f_desc']):
        if len(df[df['f_desc'] == f]) < 1: continue
        r = df[df['f_desc'] == f][['f_bracket_open','f_value','f_bracket_close']].fillna(0)
        r['f_value'] = r['f_value'] + 0.00001    # untuk mencegak kalkulasi 1/0 = inf
        r = ' '.join([' '.join(f) for f in r.values.astype(str)])
        r = eval(r)
        u = df[df['f_desc'] == f]['f_units'].astype(str).values[0]

        # Jika f_unit nilainya 's' atau '', antara value dan f_unit tidak dikasih spasi
        if u in ['s','']:
            text[f] = f"{round(r,2)}{u}"
        else:
            text[f] = f"{round(r,2)} {u}"
    return text

def get_parameter():
    q = f"""SELECT f_parameter_id AS 'id', f_label AS 'label', f_default_value AS 'value' 
            FROM {_DB_NAME_}.tb_combustion_parameters
            WHERE f_label != "MAX_BIAS_PERCENTAGE" """
    df = pd.read_sql(q, engine)
    df = df.to_dict(orient='records')
    
    return df

def get_recommendations(payload = None, sql_interval = '1 DAY', download = False):
    if type(payload) == dict:
        endDate = pd.to_datetime('now').ceil('1d') 
        startDate = endDate - pd.to_timedelta('90 day')
        if 'startDate' in payload.keys():
            startDate = pd.to_datetime(payload['startDate'])
        if 'endDate' in payload.keys():
            endDate = pd.to_datetime(payload['endDate'])
    else:
        startDate, endDate = (pd.to_datetime('now') - pd.to_timedelta(sql_interval), pd.to_datetime('now'))

    if download:
        where_state = f"""WHERE ts BETWEEN "{startDate.strftime('%Y-%m-%d')}" AND "{endDate.strftime('%Y-%m-%d')}" """
    else:
        where_state = f"WHERE ts > (SELECT ts FROM {_DB_NAME_}.tb_combustion_model_generation GROUP BY ts ORDER BY ts DESC LIMIT 15, 1)"

    q = f"""SELECT ts AS timestamp, tag_name AS 'desc', value AS targetValue, bias_value AS setValue, value-bias_value AS currentValue FROM {_DB_NAME_}.tb_combustion_model_generation
            {where_state}
            ORDER BY ts DESC, tag_name ASC"""

    df = pd.read_sql(q, engine)
    if download:
        return save_to_path(df, "recommendation")

    else:
        last_recommendation = str(df['timestamp'].max())
        
        for c in df.columns[-3:]:
            df[c] = np.round(df[c], 3)
        df_dict = df.astype(str).to_dict('records')
        
        
        return df_dict, last_recommendation

def get_rules_header():
    q = f"""SELECT f_rule_hdr_id AS id, f_rule_descr AS label FROM {_DB_NAME_}.tb_combustion_rules_hdr"""
    df = pd.read_sql(q, engine)
    df_dict = df.to_dict('records')
    return df_dict

def get_alarm_history(page=0, limit=40, payload=None, download=False):
    l1 = 0; l2 = 100; LIMIT = ""; WHERE = ""
    if bool(page) or bool(limit):
        page = max([int(page),0]); limit = int(limit)
        l1 = (page) * limit
        l2 = (page+1) * limit
        WHERE = ""
        LIMIT = f"LIMIT {l1},{l2}"

    if type(payload) == dict:
        startDate = pd.to_datetime('now').ceil('1d') 
        endDate = startDate - pd.to_timedelta('1 day')
        if 'startDate' in payload.keys():
            startDate = pd.to_datetime(payload['startDate'])
        if 'endDate' in payload.keys():
            endDate = pd.to_datetime(payload['endDate'])
        WHERE = f"""WHERE f_timestamp BETWEEN "{startDate.strftime('%Y-%m-%d')}" AND "{endDate.strftime('%Y-%m-%d')}" """
        LIMIT = ""

    q = f"""SELECT f_int_id AS alarmId, f_timestamp AS date, f_desc AS 'desc',
            f_set_value AS setValue, f_actual_value AS actualValue
            FROM {_DB_NAME_}.tb_combustion_alarm_history
            {WHERE}
            ORDER BY f_timestamp DESC
            {LIMIT}"""
    df = pd.read_sql(q, engine)
    if download:
        return save_to_path(df)
    df['actualValue'] = df['actualValue'].astype(float).round(3)
    df_dict = df.astype(str).to_dict('records')
    return df_dict

def get_specific_alarm_history(alarmID):
    q = f"""SELECT f_int_id AS alarmId, f_timestamp AS `date`, 
            f_set_value AS setValue, f_actual_value AS actualValue, 
            f_desc AS `desc` FROM {_DB_NAME_}.tb_combustion_alarm_history tcah 
            WHERE f_int_id = {alarmID} """
    df = pd.read_sql(q, engine)
    df_dict = df.astype(str).to_dict('records')
    if len(df_dict) > 0:
        return df_dict[0]
    else:
        return {}

def get_rules_detailed(rule_id):
    # q = f"""SELECT f_rule_dtl_id AS ruleDetailId, f_rule_hdr_id AS ruleHeaderId, f_sequence AS sequence, f_bracket_open AS bracketOpen, f_bracket_close AS bracketClose, f_tag_sensor AS tagSensor 
    #         FROM {_DB_NAME_}.tb_combustion_rules_dtl
    #         WHERE f_rule_hdr_id = {rule_id} """
    # df = pd.read_sql(q, engine)
    # df_dict = df.to_dict('records')
    # ret = {
    #     'detailRule': df_dict
    # }

    q = f"""SELECT hd.f_rule_hdr_id AS ruleId, hd.f_rule_descr AS ruleHdr, hd.f_used_preset_id AS presetUsed, 
        DATE_FORMAT(hd.f_updated_at, '%Y-%m-%d %H:%i:%s') AS ruleUpdate, pr.f_preset_id AS presetId, pr.f_preset_desc AS presetDesc, 
        pr.f_is_active AS isActive, DATE_FORMAT(pr.f_updated_at, '%Y-%m-%d %H:%i:%s') AS presetUpdate, pr.f_updated_by AS updatedBy, u.f_full_name 
        FROM {_DB_NAME_}.tb_combustion_rules_hdr hd LEFT JOIN {_DB_NAME_}.tb_combustion_rules_preset_hdr pr ON pr.f_rule_id = hd.f_rule_hdr_id 
        LEFT JOIN {_DB_NAME_}.tb_um_users u ON u.f_user_id = pr.f_updated_by 
        WHERE f_rule_hdr_id = {rule_id}"""
    df = pd.read_sql(q, engine)

    for i in df.index:
        if df.loc[i, 'isActive'] == 1:
            presetId = df.loc[i, 'presetId']
            updateBy = df.loc[i, 'f_full_name'].upper()
            presetHdr = df.loc[i, 'presetDesc']
            updateAt = df.loc[i, 'ruleUpdate']
            ruleHdr = df.loc[i, 'ruleHdr']
            isActive = df.loc[i, 'isActive']

    q = f"""SELECT f_rule_dtl_id AS ruleDetailId, f_rule_hdr_id AS ruleHeaderId, 
            f_sequence AS sequence, f_bracket_open AS bracketOpen, f_bracket_close AS bracketClose, 
            f_tag_sensor AS tagSensor, f_violated_count AS violatedCount, f_max_violated AS maxViolated 
            FROM {_DB_NAME_}.tb_combustion_rules_dtl
            WHERE /*f_rule_hdr_id = {rule_id} AND*/ f_preset_id = {presetId} """
    list = pd.read_sql(q, engine)

    ret = {
        'presetList': df[['presetId', 'presetDesc', 'isActive', 'presetUpdate', 'ruleId', 'updatedBy']].to_dict('records'),
        'updateBy': updateBy,
        'presetHdr': presetHdr,
        'isActive': int(isActive),
        'detailRule': list.to_dict('records'),
        'updateAt': updateAt,
        'currentPresetId': int(presetId),
        'label': ruleHdr,
        'ruleId': int(rule_id)
    }
    return ret

def get_rules_preset_detailed(rule_id, preset_id):
    ret = {'Status': 'Failed'}
    
    rule_id = int(rule_id)
    preset_id = int(preset_id)

    q = f"""SELECT hd.f_rule_hdr_id AS ruleId, hd.f_rule_descr AS ruleHdr, hd.f_used_preset_id AS presetUsed, 
        DATE_FORMAT(hd.f_updated_at, '%Y-%m-%d %H:%i:%s') AS ruleUpdate, pr.f_preset_id AS presetId, pr.f_preset_desc AS presetDesc, 
        pr.f_is_active AS isActive, DATE_FORMAT(pr.f_updated_at, '%Y-%m-%d %H:%i:%s') AS presetUpdate, pr.f_updated_by AS updatedBy, u.f_full_name 
        FROM {_DB_NAME_}.tb_combustion_rules_hdr hd LEFT JOIN {_DB_NAME_}.tb_combustion_rules_preset_hdr pr ON pr.f_rule_id = hd.f_rule_hdr_id 
        LEFT JOIN {_DB_NAME_}.tb_um_users u ON u.f_user_id = pr.f_updated_by 
        WHERE f_rule_hdr_id = {rule_id}"""
    df = pd.read_sql(q, engine)

    for i in df.index:
        if df.loc[i, 'presetId'] == preset_id:
            presetId = df.loc[i, 'presetId']
            updateBy = df.loc[i, 'f_full_name'].upper()
            presetHdr = df.loc[i, 'presetDesc']
            updateAt = df.loc[i, 'ruleUpdate']
            ruleHdr = df.loc[i, 'ruleHdr']
            isActive = df.loc[i, 'isActive']

    q = f"""SELECT f_rule_dtl_id AS ruleDetailId, f_rule_hdr_id AS ruleHeaderId, 
            f_sequence AS sequence, f_bracket_open AS bracketOpen, f_bracket_close AS bracketClose, 
            f_tag_sensor AS tagSensor, f_max_violated AS maxViolated 
            FROM {_DB_NAME_}.tb_combustion_rules_dtl
            WHERE /*f_rule_hdr_id = {rule_id} AND*/ f_preset_id = {presetId} """
    list = pd.read_sql(q, engine)

    ret = {
        'presetList': df[['presetId', 'presetDesc', 'isActive', 'presetUpdate', 'ruleId', 'updatedBy']].to_dict('records'),
        'updateBy': updateBy,
        'presetHdr': presetHdr,
        'isActive': int(isActive),
        'detailRule': list.to_dict('records'),
        'updateAt': updateAt,
        'currentPresetId': int(presetId),
        'label': ruleHdr,
        'ruleId': int(rule_id)
    }
    return ret

def get_all_rules_detailed():
    q = f"""SELECT
                hdr.f_rule_hdr_id AS `No`,
                hdr.f_rule_descr AS `Rule`,
                rule.f_sequence AS `Sequence`,
                conf.f_tag_descr AS Description,
                CONCAT(rule.f_bracket_open , rule.f_tag_sensor, rule.f_bracket_close ) AS RuleDetail,
                CONCAT(rule.f_bracket_open , raw.f_value, rule.f_bracket_close ) AS CurrentValue
            FROM
                {_DB_NAME_}.tb_combustion_rules_dtl rule
            LEFT JOIN {_DB_NAME_}.tb_bat_raw raw ON
                rule.f_tag_sensor = raw.f_address_no
            LEFT JOIN {_DB_NAME_}.tb_tags_read_conf conf ON
                rule.f_tag_sensor = conf.f_tag_name
            LEFT JOIN {_DB_NAME_}.tb_combustion_rules_hdr hdr ON
                hdr.f_rule_hdr_id = rule.f_rule_hdr_id
            WHERE
                hdr.f_rule_hdr_id > 0 AND rule.f_is_active = 1; """
    df = pd.read_sql(q, engine)
    return save_to_path(df, "rules")


def get_all_rules_log(payload = None):
    if type(payload) == dict:
        endDate = pd.to_datetime('now').ceil('1d') 
        startDate = endDate - pd.to_timedelta('7 day')
        rulesId = 20
        if 'startDate' in payload.keys():
            startDate = pd.to_datetime(payload['startDate'])
        if 'endDate' in payload.keys():
            endDate = pd.to_datetime(payload['endDate'])
        if 'rulesId'  in payload.keys():
            rulesId = int(payload['rulesId'])

    q = f""" SELECT l.f_rule_hdr_desc as Rules,l.f_preset_desc as Preset,l.f_sequence as Sequence,l.f_bracket_open as Bracket_Open,l.f_tag_sensor as Tag_Sensor
        ,l.f_bracket_close as Bracket_Close,t.f_tag_descr as Description,u.f_full_name as User,l.f_updated_at as Updated_At 
        FROM `tb_combustion_rules_dtl_log` l LEFT JOIN `tb_tags_read_conf` t ON t.f_tag_name = l.f_tag_sensor 
        LEFT JOIN `tb_um_users` u ON u.f_user_id = l.f_update_by WHERE `f_rule_hdr_id` = {rulesId} 
        and l.f_updated_at between "{startDate.strftime('%Y-%m-%d 00:00:00')}" and "{endDate.strftime('%Y-%m-%d 23:59:59')}" """
    df = pd.read_sql(q, engine)
    try:
        # Membuat folder temporary jika belum ada
        if not os.path.isdir(_TEMP_FOLDER_):
            os.makedirs(_TEMP_FOLDER_)

        # Delete all old files
        files = [os.path.join(_TEMP_FOLDER_, f) for f in os.listdir(_TEMP_FOLDER_)]
        current_time = time.time()
        for file in files:
            try:
                if (current_time - os.path.getmtime(file)) > (60 * 60 * 24):
                    os.remove(file)
            except Exception as E:
                print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')} - {E}]")

        # Save each sheet to the temporary folder
        filename = f"COPT-log-rules-setting-{time.strftime('%Y-%m-%d %H%M%S')}.xlsx"
        with pd.ExcelWriter(os.path.join(_TEMP_FOLDER_, filename), engine='xlsxwriter') as writer:
            # for preset_desc, subset_df in df.groupby('Preset'):
            #     sheet_name = preset_desc[:31]  # Batasi nama sheet menjadi maksimal 31 karakter
            #     subset_df.to_excel(writer, sheet_name=sheet_name, index=False)
            last_preset = None  # Inisialisasi last_preset
            for preset_desc, subset_df in df.groupby('Preset'):
                sheet_name = preset_desc[:31]  # Batasi nama sheet menjadi maksimal 31 karakter
                
                modified_df = pd.DataFrame(columns=subset_df.columns)

                for index, row in subset_df.iterrows():
                    if row['Sequence'] == 1 and last_preset == preset_desc:
                        # Add a blank row before sequence 1 starts again
                        modified_df = modified_df.append(pd.Series(), ignore_index=True)
                    modified_df = modified_df.append(row, ignore_index=True)
                    last_preset = preset_desc  

                modified_df.to_excel(writer, sheet_name=sheet_name, index=False)

        filepath = os.path.join(_TEMP_FOLDER_, filename)

        return filepath
    except Exception as e:
        return f"Terjadi saat create log rules: {str(e)}"

def get_tags_rule():
    q = f"""SELECT "" AS tagKKS, f_tag_name AS tagSensor, 
            f_tag_descr AS tagDescription FROM tb_tags_read_conf ttrc 
            WHERE f_is_active != 0"""
    df = pd.read_sql(q, engine)
    df['tagDescription'] = [f.strip() for f in df['tagDescription'].astype(str)]
    df['tagDescription'] = df['tagSensor'] + ' -- ' + df['tagDescription']
    df_dict = df.to_dict('records')
    return df_dict

def get_indicator():
    watchdog_status, safeguard_status, comb_enable_status = get_status()
    recommendations, last_recommendation = get_recommendations()
    comb_tags = get_comb_tags()
    parameter = get_parameter()
    rules = get_rules_header()
    object = {
        'watchdog': watchdog_status,
        'comb_enable': comb_enable_status, 
        'parameter': parameter,
        'last_recommendation': last_recommendation,
        'rules': rules,
        'comb_tags': comb_tags,
        'recommendations': recommendations,
        'safeguard': safeguard_status
    }
    return object

def get_parameter_detailed(parameter_id):
    q = f"""SELECT f_parameter_id AS id, f_label AS label, f_default_value AS value FROM {_DB_NAME_}.tb_combustion_parameters
            WHERE f_parameter_id = {parameter_id}"""
    df = pd.read_sql(q, engine)
    if len(df) > 0:
        df_dict = df.to_dict('records')[0]
    else: df_dict = {}
    return df_dict

def get_display_detailed(parameter_display):
    q = f""" SELECT c.f_desc, c.f_sequence, c.f_bracket_open, c.f_tags, c.f_bracket_close, c.f_units, t.f_tag_descr, r.f_value 
        FROM cb_display c LEFT JOIN tb_tags_read_conf t ON t.f_tag_name = c.f_tags LEFT JOIN tb_bat_raw r ON r.f_address_no = c.f_tags 
        WHERE c.f_desc = '{parameter_display}' order by c.f_sequence ASC """
    df = pd.read_sql(q, engine)

    if not df.empty:
        rule = f"({' '.join(df['f_bracket_open'] + df['f_tags'] + df['f_bracket_close'])})"
        result = {
            "message": "Success",
            "object": {
                "variable": parameter_display,
                "rule": f"({' '.join(df['f_bracket_open'] + df['f_tags'] + df['f_bracket_close'])})",
                "tags": []
            }
        }

        for index, row in df.iterrows():
            tag_info = {
                "tag_name": row['f_tags'],
                "description": row['f_tag_descr'],
                "unit_meas": row['f_units'],
                "value": float(row['f_value']) if pd.notnull(row['f_value']) else None
            }
            result["object"]["tags"].append(tag_info)
    else:
        result = {
            "message": "No data found",
            "object": {},
        }

    return result

def get_all_parameter():
    q = f"""SELECT f_parameter_id AS id, f_label AS label, f_default_value AS value FROM {_DB_NAME_}.tb_combustion_parameters
            WHERE f_is_active = 1 
            AND f_label != "MAX_BIAS_PERCENTAGE" """
    df = pd.read_sql(q, engine)
    return save_to_path(df, "parameters")


def get_all_log_parameter(payload = None):
    if type(payload) == dict:
        endDate = pd.to_datetime('now').ceil('1d') 
        startDate = endDate - pd.to_timedelta('7 day')
        if 'startDate' in payload.keys():
            startDate = pd.to_datetime(payload['startDate'])
        if 'endDate' in payload.keys():
            endDate = pd.to_datetime(payload['endDate'])

    q = f"""select l.f_label as Parameter,l.f_default_value as Old_Value,l.f_default_value_log as New_Value,
        u.f_full_name as Update_By,l.f_updated_at as Update_At from 
        `tb_combustion_parameters_log` l left join `tb_um_users` u on u.f_user_id = l.f_update_by 
        where l.f_updated_at between "{startDate.strftime('%Y-%m-%d 00:00:00')}" and "{endDate.strftime('%Y-%m-%d 23:59:59')}" """
    df = pd.read_sql(q, engine)
    df.loc[df["Parameter"] == "DEBUG_MODE", "Old_Value"] = df["Old_Value"].astype(bool)
    df.loc[df["Parameter"] == "DEBUG_MODE", "New_Value"] = df["New_Value"].astype(bool)
    return save_to_path(df, "log-parameters")


def post_rule(payload):
    ret = {'Status': 'Failed'}

    if type(payload) is not dict: 
       return ret
    if len(payload.keys()) == 0: 
       return ret
    if 'detailRule' not in payload.keys():
       return ret

    q = f"""INSERT INTO
            {_DB_NAME_}.tb_combustion_rules_dtl(f_rule_hdr_id, f_rule_descr, f_tag_sensor, f_rules, f_operator, 
                f_unit, f_limit_high, f_limit_low, f_sequence, f_bracket_open, 
                f_bracket_close, f_violated_count, f_max_violated, f_is_active, f_updated_at, f_preset_id)
            VALUES """

    # preset_id = int(payload['presetId'])
    # is_active = int(payload['isActive'])
    # RulesId   = int(payload['id'])
    # rulesDesc = payload['label']
    # userId    = 2
    # if 'userId' in payload.keys():
    #     userId    = int(payload['userId'])
    ruleHeaderId = 20
    preset_id = int(payload['presetId'])
    is_active = int(payload['isActive'])
    RulesId   = 20
    ruleHeaderId   = 20
    if 'id' in payload.keys():
        RulesId   = int(payload['id'])
        ruleHeaderId   = int(payload['id'])
    if 'ruleId' in payload.keys():
        RulesId   = int(payload['ruleId'])
        ruleHeaderId   = int(payload['ruleId'])
    if 'label' in payload.keys():
        rulesDesc = payload['label']
    if 'presetDesc' in payload.keys():
        rulesDesc = payload['presetDesc']
    userId    = 2
    if 'userId' in payload.keys():
        userId    = int(payload['userId'])

    qlog = f""" INSERT IGNORE INTO tb_combustion_rules_dtl_log 
        (f_rule_hdr_id, f_rule_hdr_desc, f_sequence, f_bracket_open, f_tag_sensor, f_bracket_close, f_violated_count, f_max_violated, f_is_active, 
        f_updated_at, f_preset_id, f_preset_desc, f_update_by)
        select d.`f_rule_hdr_id`,"{rulesDesc}",d.`f_sequence`,d.`f_bracket_open`,d.`f_tag_sensor`,d.`f_bracket_close`,d.`f_violated_count`,d.`f_max_violated`,
        d.`f_is_active`,now(),d.`f_preset_id`,p.`f_preset_desc`,{userId} from 
        `tb_combustion_rules_dtl` d left join `tb_combustion_rules_preset_hdr` p on p.`f_preset_id` = d.`f_preset_id` 
        where d.`f_rule_hdr_id` = {RulesId} and d.`f_preset_id` = {preset_id} and d.`f_is_active` = {is_active} """

    Payload = payload['detailRule']
    evaluate = ''
    tags_used = []
    for P in Payload:
        bracketOpen = P['bracketOpen']
        bracketClose = P['bracketClose']
        sequence = P['sequence']
        # tagSensor = [P['tagSensor'][:-1].split('(')[0] if '(' in P['tagSensor'] else P['tagSensor']][0]
        tagSensor = P['tagSensor'].split(' -- ')[0] if ' -- ' in P['tagSensor'] else P['tagSensor']
        # ruleHeaderId = 20
        maxViolated = 'NULL'
        if 'ruleHeaderId' in P.keys(): ruleHeaderId = P['ruleHeaderId']
        if 'maxViolated' in P.keys(): maxViolated = P['maxViolated']

        r = f"""( {ruleHeaderId} , NULL, '{tagSensor}', NULL, NULL, NULL, NULL, NULL, {sequence}, '{bracketOpen}', '{bracketClose}', 0, {maxViolated}, {is_active}, NOW(), {preset_id} ),"""
        q += r
        evaluate += f"{bracketOpen}{tagSensor}{bracketClose} "
        tags_used.append(tagSensor)

    q = q[:-1]

    # Value check
    wherescript = f"('{tags_used[0]}')" if len(tags_used) == 1 else tuple(tags_used)
    qcheck = f"SELECT f_address_no, f_value FROM {_DB_NAME_}.tb_bat_raw WHERE f_address_no IN {wherescript}"
    df = pd.read_sql(qcheck, engine)
    df = df.set_index('f_address_no')['f_value']

    for k in df.index: evaluate = evaluate.replace(k, str(df[k]))
    evaluate = evaluate.lower().replace("=","==")
    while "===" in evaluate: evaluate = evaluate.replace("===","==")

    try:
        Safeguard_status = eval(evaluate)
        qdel = f"""DELETE FROM {_DB_NAME_}.tb_combustion_rules_dtl
                   WHERE f_rule_hdr_id={ruleHeaderId} AND f_preset_id={preset_id} """
        
        qup = f"""UPDATE {_DB_NAME_}.tb_combustion_rules_preset_hdr SET f_updated_at = NOW() 
                    WHERE f_rule_id={ruleHeaderId} AND f_preset_id={preset_id} """

        with engine.connect() as conn:
            rup = conn.execute(qup)
            red = conn.execute(qdel)
            res = conn.execute(q)
            rlog = conn.execute(qlog)

        return {'Status':'Success'}

    except Exception as E:
        logging(f"Error evaluating a new rule: {evaluate}")
        logging(f"{E}")
        return {'Status': str(E)}


def post_rule_preset(payload):
    ret = {'Status': 'Failed'}

    if type(payload) is not dict: 
       return ret
    if len(payload.keys()) == 0: 
       return ret
    
    preset_desc = payload.get('presetDesc')
    rule_id = payload.get('ruleId')
    update_by = payload.get('updateBy')
    current_time = time.strftime('%Y-%m-%d %H:%M:%S')

    q = f"""INSERT INTO 
        {_DB_NAME_}.tb_combustion_rules_preset_hdr(f_preset_desc, f_rule_id, f_is_active, f_updated_at, f_updated_by) 
        VALUES ('{preset_desc}', {rule_id}, 0, '{current_time}', {update_by})"""
    
    qGetId = f"""SELECT f_preset_id from {_DB_NAME_}.tb_combustion_rules_preset_hdr 
        WHERE f_preset_desc='{preset_desc}' AND f_updated_at='{current_time}'"""
           
    try:
        with engine.connect() as conn:
            red = conn.execute(q)
            res = conn.execute(qGetId)
            result_value = res.fetchone()[0]
        payload['presetId'] = int(result_value)
        payload['isActive'] = 0

        return payload

    except Exception as E:
        logging(f"{E}")
        return {'Status': str(E)}


def post_preset_activated(payload):
    ruleId = payload['ruleId']
    presetId = payload['presetId']

    qp = f"""UPDATE {_DB_NAME_}.tb_combustion_rules_preset_hdr SET f_is_active = 1 
        WHERE f_rule_id={ruleId} AND f_preset_id={presetId}"""
    qpReset = f"""UPDATE {_DB_NAME_}.tb_combustion_rules_preset_hdr SET f_is_active = 0 
        WHERE f_rule_id={ruleId} /*AND f_preset_id={presetId}*/"""

    q = f"""UPDATE {_DB_NAME_}.tb_combustion_rules_dtl SET f_is_active = 1 
        WHERE f_rule_hdr_id={ruleId} AND f_preset_id={presetId}"""
    qReset = f"""UPDATE {_DB_NAME_}.tb_combustion_rules_dtl SET f_is_active = 0 
        WHERE f_rule_hdr_id={ruleId} /*AND f_preset_id={presetId}*/"""
    
    qRuleHdr = f"""UPDATE {_DB_NAME_}.tb_combustion_rules_hdr SET f_used_preset_id = {presetId} 
        WHERE f_rule_hdr_id={ruleId}"""
    
    try:
        with engine.connect() as conn:
            rek = conn.execute(qpReset)
            reb = conn.execute(qp)
            res = conn.execute(qReset)
            red = conn.execute(q)
            reh = conn.execute(qRuleHdr)

        return {'Status':'Success'}

    except Exception as E:
        logging(f"{E}")
        return {'Status': str(E)}
    

def post_rule_preset(payload):
    ret = {'Status': 'Failed'}

    if type(payload) is not dict: 
       return ret
    if len(payload.keys()) == 0: 
       return ret
    
    update_by    = 2 
    if 'userId' in payload.keys():
        update_by    = int(payload['userId']) 
    elif 'updateBy' in payload.keys():
        update_by    = int(payload['updateBy']) 
    preset_desc = payload.get('presetDesc')
    rule_id = payload.get('ruleId')
    # update_by = payload.get('updateBy')
    current_time = time.strftime('%Y-%m-%d %H:%M:%S')

    q = f"""INSERT INTO 
        {_DB_NAME_}.tb_combustion_rules_preset_hdr(f_preset_desc, f_rule_id, f_is_active, f_updated_at, f_updated_by) 
        VALUES ('{preset_desc}', {rule_id}, 0, '{current_time}', {update_by})"""
    
    qGetId = f"""SELECT f_preset_id from {_DB_NAME_}.tb_combustion_rules_preset_hdr 
        WHERE f_preset_desc='{preset_desc}' AND f_updated_at='{current_time}'"""
           
    try:
        with engine.connect() as conn:
            red = conn.execute(q)
            res = conn.execute(qGetId)
            result_value = res.fetchone()[0]
        payload['presetId'] = int(result_value)
        payload['isActive'] = 0

        return payload

    except Exception as E:
        logging(f"{E}")
        return {'Status': str(E)}
    

def post_preset_activated(payload):
    ruleId = payload['ruleId']
    presetId = payload['presetId']

    qp = f"""UPDATE {_DB_NAME_}.tb_combustion_rules_preset_hdr SET f_is_active = 1 
        WHERE f_rule_id={ruleId} AND f_preset_id={presetId}"""
    qpReset = f"""UPDATE {_DB_NAME_}.tb_combustion_rules_preset_hdr SET f_is_active = 0 
        WHERE f_rule_id={ruleId} /*AND f_preset_id={presetId}*/"""

    q = f"""UPDATE {_DB_NAME_}.tb_combustion_rules_dtl SET f_is_active = 1 
        WHERE f_rule_hdr_id={ruleId} AND f_preset_id={presetId}"""
    qReset = f"""UPDATE {_DB_NAME_}.tb_combustion_rules_dtl SET f_is_active = 0 
        WHERE f_rule_hdr_id={ruleId} /*AND f_preset_id={presetId}*/"""
    
    qRuleHdr = f"""UPDATE {_DB_NAME_}.tb_combustion_rules_hdr SET f_used_preset_id = {presetId} 
        WHERE f_rule_hdr_id={ruleId}"""
    
    try:
        with engine.connect() as conn:
            rek = conn.execute(qpReset)
            reb = conn.execute(qp)
            res = conn.execute(qReset)
            red = conn.execute(q)
            reh = conn.execute(qRuleHdr)

        return {'Status':'Success'}

    except Exception as E:
        logging(f"{E}")
        return {'Status': str(E)}
    

def post_parameter(payload):
    parameterID = payload['id']
    label = payload['label']
    defaultValue = payload['value']
    userId = 2
    if 'userId' in payload.keys():
        userId = payload['userId']

    qlog = f"""INSERT IGNORE INTO {_DB_NAME_}.tb_combustion_parameters_log 
            (f_parameter_id, f_label, f_address_no, f_parameter_descr, f_type, f_default_value, 
            f_is_active, f_update_by, f_updated_at, f_default_value_log) 
            SELECT f_parameter_id, f_label, f_address_no, f_parameter_descr, f_type, f_default_value, 
            f_is_active, {userId}, NOW(), {defaultValue} FROM {_DB_NAME_}.tb_combustion_parameters 
            WHERE f_parameter_id={parameterID} AND f_default_value <> {defaultValue} """

    q = f"""INSERT INTO
            {_DB_NAME_}.tb_combustion_parameters (f_parameter_id,f_label,f_default_value,f_is_active,f_updated_at)
            VALUES ({parameterID},'{label}',{defaultValue},1,NOW());
         """
    qdel = f"""DELETE FROM {_DB_NAME_}.tb_combustion_parameters
               WHERE f_parameter_id={parameterID}"""

    with engine.connect() as conn:
        rin = conn.execute(qlog)
        red = conn.execute(qdel)
        res = conn.execute(q)

    return {'Status':'Success'}

def post_alarm(payload):
    ret = {
        'Status': 'Failed',
        'Message': ''
    }
    for key in ['alarmId', 'desc']:
        if key not in payload.keys(): 
            ret['Message']= f"Key `{key}` not in payload."
            return ret
    
    q = f"""UPDATE tb_combustion_alarm_history
            SET f_desc = "{payload['desc']}"
            WHERE f_int_id = "{payload['alarmId']}" """
    with engine.connect() as conn:
        rett = conn.execute(q)
        ret['Message'] = f'Success changing {rett.rowcount} line(s).'
        ret['Status'] = 'Success'
    return ret
