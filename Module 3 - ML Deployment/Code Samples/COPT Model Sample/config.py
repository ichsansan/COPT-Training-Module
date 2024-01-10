import datetime

'''
THIS FILE CONTAINS HARDCODED VARIABLES AND REQUIRED PARAMS
'''

ZIP_FORECASTING_MODELS_DIRECTORY = "zipped_forecasting_models"
ZIP_GENERATIVE_MODELS_DIRECTORY = "zipped_generative_models"
ZIP_DATASET_CONTRACTS_DIRECTORY = "zipped_dataset_contracts"
ZIP_MODEL_CONTRACTS_DIRECTORY = "zipped_model_contracts"
ZIP_MODEL_CONVERTERS_DIRECTORY = "zipped_model_converters"

DEPLOYMENT_CURR_VERSION = '1.1'
DEPLOYMENT_LAST_UPDATE = '02/04/2022'

TARGET_EFFICIENCY_DIFF = 0.5
LABEL_LAG = 7
TARGET_EFFICIENCY_TOP_TOLERANCE_FACTOR = 2
TARGET_EXCESS_OXY_CONSERVATIVE_TOLERANCE = 0.1
NEG_EFFICIENCY_TOLERANCE = 1  # In percent
HORIZON_STEP = 60

PROJECT_NAME = "SOCKET2"

PCT1_DATA_TAG = "PCT1"
PCT2_DATA_TAG = "PCT2"
RBG1_DATA_TAG = "RBG1"
RBG2_DATA_TAG = "RBG2"
KTT1_DATA_TAG = "KTT1"
KTT2_DATA_TAG = "KTT2"
PTN9_DATA_TAG = "PTN9"
AMG1_DATA_TAG = "AMG1"
AMG2_DATA_TAG = "AMG2"
BLK1_DATA_TAG = "BLK1"
BLK2_DATA_TAG = "BLK2"
BLT1_DATA_TAG = "BLT1"
BLT2_DATA_TAG = "BLT2"

EXCESS_OXYGEN_SOKET_2 = "Excess Oxygen Sensor"
EXCESS_OXYGEN_SOKET_2_1 = "Excess Oxygen A Side 1"
EXCESS_OXYGEN_SOKET_2_2 = "Excess Oxygen B Side 1"
EXCESS_OXYGEN_FORECASTING_MODEL_TAG = "Excess Oxygen Forecaster"
EFFICIENCY_FORECASTING_MODEL_TAG = "Efficiency Forecaster"

EFFICIENCY_TAG = "Efficiency Nominal"
SA_TO_PA_RATIO_TAG = "SA to PA Ratio"
AIR_TO_FUEL_RATIO_TAG = "Air to Fuel Ratio"

SUBOPTIMAL_EFFICIENCY_THRESHOLD = 90
EFFICIENCY_CAP = 100

FORECASTING_MODEL_CURRENT_NAMES = {
    PCT1_DATA_TAG: {
        EXCESS_OXYGEN_SOKET_2: "D0944505-0",
        EFFICIENCY_TAG: "A1A67427-0"
    },
    PCT2_DATA_TAG: {
        EXCESS_OXYGEN_SOKET_2: "D5E207E7-0",
        EFFICIENCY_TAG: "D65F67EE-0"
    },
    RBG1_DATA_TAG: {
        EXCESS_OXYGEN_SOKET_2: "BD4D9D25-0",
        EFFICIENCY_TAG: "898FF029-0"
    },
    RBG2_DATA_TAG: {
        EXCESS_OXYGEN_SOKET_2: "7A490474-0",
        EFFICIENCY_TAG: "E1FBB73D-0"
    },
    KTT1_DATA_TAG: {
        EXCESS_OXYGEN_SOKET_2_2: "065686E3-0",
        EXCESS_OXYGEN_SOKET_2_1: "DEB77C98-0"
    },
    KTT2_DATA_TAG: {
        EXCESS_OXYGEN_SOKET_2_2: "8108893D-0",
        EXCESS_OXYGEN_SOKET_2_1: "7F745E15-0"
    },
    BLT1_DATA_TAG: {
        EXCESS_OXYGEN_SOKET_2: "CDB02663-0",
    },
    BLT2_DATA_TAG: {
        EXCESS_OXYGEN_SOKET_2: "C4C62DB0-0",
        EFFICIENCY_TAG: "16E1C78D-0"
    },
    BLK1_DATA_TAG: {
        EXCESS_OXYGEN_SOKET_2: "5F069807-0",
        EFFICIENCY_TAG: "DD60C212-0"
    },
    BLK2_DATA_TAG: {
        EXCESS_OXYGEN_SOKET_2: "27D78490-0",
        EFFICIENCY_TAG: "8E4FA566-0"
    },
    PTN9_DATA_TAG: {
        EXCESS_OXYGEN_SOKET_2: "7FB67851-0",
    },
    AMG1_DATA_TAG: {
        EXCESS_OXYGEN_SOKET_2_2: "DFB88A43-0",
        EXCESS_OXYGEN_SOKET_2_1: "67B674DA-0"
    },
    AMG2_DATA_TAG: {
        EXCESS_OXYGEN_SOKET_2_2: "5B66606F-0",
        EXCESS_OXYGEN_SOKET_2_1: "BC5E2E8D-0"
    }
}

FORECASTING_MODEL_CURRENT_API_KINDS = {
    PCT1_DATA_TAG: {
        EXCESS_OXYGEN_SOKET_2: "XGBOOST",
        EFFICIENCY_TAG: "XGBOOST"
    },
    PCT2_DATA_TAG: {
        EXCESS_OXYGEN_SOKET_2: "XGBOOST",
        EFFICIENCY_TAG: "XGBOOST"
    },
    RBG1_DATA_TAG: {
        EXCESS_OXYGEN_SOKET_2: "XGBOOST",
        EFFICIENCY_TAG: "XGBOOST"
    },
    RBG2_DATA_TAG: {
        EXCESS_OXYGEN_SOKET_2: "XGBOOST",
        EFFICIENCY_TAG: "XGBOOST"
    },
    KTT1_DATA_TAG: {
        EXCESS_OXYGEN_SOKET_2_2: "XGBOOST",
        EXCESS_OXYGEN_SOKET_2_1: "XGBOOST"
    },
    KTT2_DATA_TAG: {
        EXCESS_OXYGEN_SOKET_2_2: "XGBOOST",
        EXCESS_OXYGEN_SOKET_2_1: "XGBOOST"
    },
    BLT1_DATA_TAG: {
        EXCESS_OXYGEN_SOKET_2: "XGBOOST",
    },
    BLT2_DATA_TAG: {
        EXCESS_OXYGEN_SOKET_2: "XGBOOST",
        EFFICIENCY_TAG: "XGBOOST"
    },
    BLK1_DATA_TAG: {
        EXCESS_OXYGEN_SOKET_2: "XGBOOST",
        EFFICIENCY_TAG: "XGBOOST"
    },
    BLK2_DATA_TAG: {
        EXCESS_OXYGEN_SOKET_2: "XGBOOST",
        EFFICIENCY_TAG: "XGBOOST"
    },
    PTN9_DATA_TAG: {
        EXCESS_OXYGEN_SOKET_2: "XGBOOST",
    },
    AMG1_DATA_TAG: {
        EXCESS_OXYGEN_SOKET_2_2: "XGBOOST",
        EXCESS_OXYGEN_SOKET_2_1: "XGBOOST"
    },
    AMG2_DATA_TAG: {
        EXCESS_OXYGEN_SOKET_2_2: "XGBOOST",
        EXCESS_OXYGEN_SOKET_2_1: "XGBOOST"
    },
}

GENERATIVE_MODEL_CURRENT_NAME = {
    PCT1_DATA_TAG: "8F0C8BCC-0",
    PCT2_DATA_TAG: "74BFB5BD-0",
    RBG1_DATA_TAG: "FC396F55-0",
    RBG2_DATA_TAG: "E71A17CB-0",
    KTT1_DATA_TAG: "4CB42CCC-0",
    KTT2_DATA_TAG: "3D19DA55-0",
    BLK1_DATA_TAG: "7D5E995A-0",
    BLK2_DATA_TAG: "F0564A44-0",
    BLT1_DATA_TAG: "025850E7-0",
    BLT2_DATA_TAG: "5A2202F0-0",
    PTN9_DATA_TAG: "D3E64271-0",
    AMG1_DATA_TAG: "F234AADF-0",
    AMG2_DATA_TAG: "62148F1B-0"
}

GENERATIVE_MODEL_CURRENT_API_KIND = {
    PCT1_DATA_TAG: "XGBOOST",
    PCT2_DATA_TAG: "XGBOOST",
    RBG1_DATA_TAG: "XGBOOST",
    RBG2_DATA_TAG: "XGBOOST",
    KTT1_DATA_TAG: "XGBOOST",
    KTT2_DATA_TAG: "XGBOOST",
    PTN9_DATA_TAG: "XGBOOST",
    BLK1_DATA_TAG: "XGBOOST",
    BLK2_DATA_TAG: "XGBOOST",
    BLT1_DATA_TAG: "XGBOOST",
    BLT2_DATA_TAG: "XGBOOST",
    AMG1_DATA_TAG: "XGBOOST",
    AMG2_DATA_TAG: "XGBOOST"
}

MODEL_CONVERTER_NAMES = {
    PCT1_DATA_TAG: [],
    PCT2_DATA_TAG: [],
    RBG1_DATA_TAG: [],
    RBG2_DATA_TAG: [],
    KTT1_DATA_TAG: [],
    KTT2_DATA_TAG: [],
    PTN9_DATA_TAG: [],
    BLK1_DATA_TAG: [],
    BLK2_DATA_TAG: [],
    BLT1_DATA_TAG: [],
    BLT2_DATA_TAG: [],
    AMG1_DATA_TAG: [],
    AMG2_DATA_TAG: []
}

MODEL_CONVERTER_API_KINDS = {
    PCT1_DATA_TAG: [],
    PCT2_DATA_TAG: [],
    RBG1_DATA_TAG: [],
    RBG2_DATA_TAG: [],
    KTT1_DATA_TAG: [],
    KTT2_DATA_TAG: [],
    BLT1_DATA_TAG: [],
    BLT2_DATA_TAG: [],
    BLK1_DATA_TAG: [],
    BLK2_DATA_TAG: [],
    PTN9_DATA_TAG: [],
    AMG1_DATA_TAG: [],
    AMG2_DATA_TAG: []
}

REAL_TIME_DATE_COLUMN_NAME = "timestamp"

MINUTE_INPUT_KIND = "minute_input"
DAY_INPUT_KIND = "day_input"
SENSOR_INPUT_KIND = "sensor_input"
META_INFO_INPUT_KIND = "meta_input"
PRESENT_INDICES = "present_indices"
PRESENT_INPUT = "present_input"

DATE_FORMAT: str = '%Y-%m-%d %H:%M:%S'
# We use this date as an offset because it is beginning of the
# year, beginning of the month and also a monday.
DATE_OFFSET = datetime.datetime(2001, 1, 1)
MINUTES_IN_A_DAY = 1440  # (60 * 24)

GENERATION_COUNT = 100

MINUTE_INPUT_KIND = "minute_input"
DAY_INPUT_KIND = "day_input"
MV_SENSOR_INPUT_KIND = "mv_sensor_input"
CV_SENSOR_INPUT_KIND = "cv_sensor_input"
META_INFO_INPUT_KIND = "meta_input"
PRESENT_INDICES = "present_indices"
CV_PRESENT_INPUT = "cv_present_input"
MV_PRESENT_INPUT = "mv_present_input"

CSV_DATASET_MAPPER = {
    PCT1_DATA_TAG: 'BAT_realtime_dataset_pct1.csv',
    PCT2_DATA_TAG: 'BAT_realtime_dataset_pct2.csv',
    RBG1_DATA_TAG: 'BAT_realtime_dataset_rbg1.csv',
    RBG2_DATA_TAG: 'BAT_realtime_dataset_rbg2.csv',
    KTT1_DATA_TAG: "BAT_realtime_dataset_ktt1.csv",
    KTT2_DATA_TAG: "BAT_realtime_dataset_ktt2.csv",
    PTN9_DATA_TAG: "BAT_realtime_dataset_ptn9v6.csv",
    BLK1_DATA_TAG: "BAT_realtime_dataset_blk1.csv",
    BLK2_DATA_TAG: "BAT_realtime_dataset_blk2.csv",
    BLT1_DATA_TAG: "BAT_realtime_dataset_blt1.csv",
    BLT2_DATA_TAG: "BAT_realtime_dataset_blt2.csv",
    AMG1_DATA_TAG: "BAT_realtime_dataset_amg1.csv",
    AMG2_DATA_TAG: "BAT_realtime_dataset_amg2.csv"
}

MOT_ESTIMATOR_DIRECTORY = "models_implementations/mill_outlet_temp_models"
MOT_MODEL_NAME = {
    "TAA1": "EA943FF1-2",
    "TAA2": "EA943FF1-0",
    "RBG1": "EA943FF1-2",
    "RBG2": "EA943FF1-0",
    "PCT1": "SKV102DE-0",
    "PCT2": "SKV102DE-0",
}