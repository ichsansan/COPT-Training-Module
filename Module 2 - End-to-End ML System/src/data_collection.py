import pandas as pd
import numpy as np
import sqlalchemy as sq
import os, time, re
from os.path import isdir
from urllib.parse import quote_plus
import time

PASSWORD = '' # fill this
ADDRESS = '' # fill this

unit_db = [
#             ['BLT1','db_belitung_1'],
#             ['BLT2','db_belitung_2']
            ['BLT1','db_data_gateway'],
            ['BLT2','db_data_gateway']
          ]
tb = 'history' #'tb_bulk_history' #
folder_name = f"data/{tb}" #'data/tambahan'#_tb_raw_history'
col_date = "f_timestamp" #'f_date_rec' 
col_tags = 'f_address_no'
col_vals = 'f_value'

for UNIT, db in unit_db:
    # dftag = pd.read_excel('Tag COPT Belitung.xlsx',
    #                       sheet_name=f'Belitung#{UNIT[-1]}')
    # tags = dftag['TAG AT OPC'].astype(str).values
    # dftag = pd.read_excel('Tambahan Tag COPT Belitung.xlsx')
    dftag = pd.read_excel("COMBOPT LIST TAG UJLJBEL#1&2_R01.xlsx", sheet_name=f"UNIT#{UNIT[-1]}")
    tags = dftag['TAG AT OPC'].astype(str).values

    tags = np.reshape(tags, -1)
    tags = np.append(tags, 'Efficiency')

    print(f'Reading {db} ...')

    datestart = '2021-12-21' # '2022-10-01'
    dateend = time.strftime('%Y-%m-%d')
    dates = np.arange(np.datetime64(datestart), np.datetime64(dateend))    

    for t, i in enumerate(range(len(dates)-1)):
        ds = dates[i]
        de = dates[i+1]
        foname = f"{folder_name}/{UNIT}"
        fname = f"{foname}/{ds}.csv"
        if not isdir(foname): os.makedirs(foname)
        if os.path.isfile(fname): continue

        conn = sq.create_engine(f'mysql+mysqlconnector://root:{PASSWORD}@{ADDRESS}/{db}')
        with conn.connect() as con:
            q = f"""SELECT {col_tags},{col_date},{col_vals} FROM {db}.{tb}
                    WHERE {col_tags} IN {tuple(tags)}
                    AND {col_date} BETWEEN '{ds}' AND '{de}'"""
            df = pd.read_sql(q, con)
        if len(df) < 1: continue
        
        df['f_value'].replace("None", np.nan, inplace=True)
        df['f_value'] = pd.to_numeric(df['f_value'])
        
        print(UNIT, dates[i])
        df = df.pivot_table(index=col_date, columns=col_tags,values=col_vals)
        df = df.resample('1min').mean()
        df.to_csv(fname, index_label='timestamp')
        
        if t%50==0 and t>0:
            time.sleep(10)
