import datetime

'''
THIS FILE CONTAINS HARDCODED VARIABLES AND REQUIRED PARAMS
'''

ZIP_FORECASTING_MODELS_DIRECTORY = "zipped_forecasting_models"
ZIP_GENERATIVE_MODELS_DIRECTORY = "zipped_generative_models"
ZIP_DATASET_CONTRACTS_DIRECTORY = "zipped_dataset_contracts"
ZIP_MODEL_CONVERTERS_DIRECTORY = "zipped_model_converters"
ZIP_MODEL_CONTRACTS_DIRECTORY = "zipped_model_contracts"
SENSOR_LIST_DIRECTORY = "data"

DEPLOYMENT_CURR_VERSION = 'v1.0'
DEPLOYMENT_LAST_UPDATE = '30-11-2023'

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
AMG1_DATA_TAG = "AMG1"
AMG2_DATA_TAG = "AMG2"

EXCESS_OXYGEN_SOKET_2 = "Excess Oxygen Sensor"
EXCESS_OXYGEN_FORECASTING_MODEL_TAG = "Excess Oxygen Forecaster"
EFFICIENCY_FORECASTING_MODEL_TAG = "Efficiency Forecaster"

EFFICIENCY_TAG = "Efficiency"
SA_TO_PA_RATIO_TAG = "SA to PA Ratio"
AIR_TO_FUEL_RATIO_TAG = "Air to Fuel Ratio"

SUBOPTIMAL_EFFICIENCY_THRESHOLD = 90
EFFICIENCY_CAP = 100

FORECASTING_MODEL_CURRENT_NAMES = {
    PCT1_DATA_TAG: {
        "Excess Oxygen Sensor": "22B15E72-0"
    },
    PCT2_DATA_TAG: {
        "Excess Oxygen Sensor": "6DC4EBE2-0",
    },
    RBG1_DATA_TAG: {
        EXCESS_OXYGEN_SOKET_2: "C62511DD-0"
    },
    RBG2_DATA_TAG: {
        EXCESS_OXYGEN_SOKET_2: None
    },
    KTT1_DATA_TAG: {
        "Excess Oxygen B Side 1": "065686E3-0",
        "Excess Oxygen A Side 1": "DEB77C98-0"
    },
    KTT2_DATA_TAG: {
        "Excess Oxygen B Side 1": "8108893D-0",
        "Excess Oxygen A Side 1": "7F745E15-0"
    },
    AMG1_DATA_TAG: {
        "Excess Oxygen B Side 1": "DFB88A43-0",
        "Excess Oxygen A Side 1": "67B674DA-0"
    },
    AMG2_DATA_TAG: {
        "Excess Oxygen B Side 1": "987281DB-0",
        "Excess Oxygen A Side 1": "2F157080-0"
    }
}

FORECASTING_MODEL_CURRENT_API_KINDS = {
    PCT1_DATA_TAG: {
        "Excess Oxygen Sensor": "XGBOOST"
    },
    PCT2_DATA_TAG: {
        "Excess Oxygen Sensor": "XGBOOST"
    },
    RBG1_DATA_TAG: {
        EXCESS_OXYGEN_SOKET_2: "XGBOOST"
    },
    RBG2_DATA_TAG: {
        EXCESS_OXYGEN_SOKET_2: "KERAS"
    },
    KTT1_DATA_TAG: {
        "Excess Oxygen B Side 1": "XGBOOST",
        "Excess Oxygen A Side 1": "XGBOOST"
    },
    KTT2_DATA_TAG: {
        "Excess Oxygen B Side 1": "XGBOOST",
        "Excess Oxygen A Side 1": "XGBOOST"
    },
    AMG1_DATA_TAG: {
        "Excess Oxygen B Side 1": "XGBOOST",
        "Excess Oxygen A Side 1": "XGBOOST"
    },
    AMG2_DATA_TAG: {
        "Excess Oxygen B Side 1": "XGBOOST",
        "Excess Oxygen A Side 1": "XGBOOST"
    },
}

GENERATIVE_MODEL_CURRENT_NAME = {
    PCT1_DATA_TAG: "308E4223-0",
    PCT2_DATA_TAG: "4C399600-0",
    RBG1_DATA_TAG: "42C094B2-0",
    RBG2_DATA_TAG: None,
    KTT1_DATA_TAG: "4CB42CCC-0",
    KTT2_DATA_TAG: "3D19DA55-0",
    AMG1_DATA_TAG: "F234AADF-0",
    AMG2_DATA_TAG: "EBD508A3-0"
}

GENERATIVE_MODEL_CURRENT_API_KIND = {
    PCT1_DATA_TAG: "XGBOOST",
    PCT2_DATA_TAG: "XGBOOST",
    RBG1_DATA_TAG: "XGBOOST",
    RBG2_DATA_TAG: "XGBOOST",
    KTT1_DATA_TAG: "XGBOOST",
    KTT2_DATA_TAG: "XGBOOST",
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

GENERATION_COUNT = 200

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
    RBG2_DATA_TAG: None,
    KTT1_DATA_TAG: "BAT_realtime_dataset_ktt1.csv",
    KTT2_DATA_TAG: "BAT_realtime_dataset_ktt2.csv",
    AMG1_DATA_TAG: "BAT_realtime_dataset_amg1.csv",
    AMG2_DATA_TAG: "BAT_realtime_dataset_amg2.csv"
}

O2_RECOMMENDATION_LOWER_THRESHOLD = {
    KTT1_DATA_TAG: -1.0,
    KTT2_DATA_TAG: -0.7
}
O2_RECOMMENDATION_UPPER_THRESHOLD = {
    KTT1_DATA_TAG: 1.0,
    KTT2_DATA_TAG: 0.7
}

# We ignore the prediction when absolute rec. bias value is below this threshold
O2_RECOMMENDATION_SMALL_THRESHOLD = 0.01