"""
Setting parameter untuk koneksi ke database.
"""
__version__ = 'v1.6'

_UNIT_CODE_ = "BLK1"
_UNIT_NAME_ = "PLTU Bolok 1"
_USER_ = "<masukkan ID database>"
_PASS_ = "<masukkan password database>"
_IP_ = "<masukkan IP database>" 
_LOCAL_IP_ = "<masukkan Local IP database>" 
_DB_NAME_ = "db_bat_blk1"

"Setting parameter nama variabel"

WATCHDOG_TAG = "WATCHDOG TIMEOUT"
SAFEGUARD_TAG = "SAFEGUARD:COMBUSTION"
SAFEGUARD_SOPT_TAG = "SAFEGUARD:SOOTBLOW"
SAFEGUARD_USING_MAX_VIOLATED = True

DESC_ENABLE_COPT = "COPT ENABLE STATUS"
DESC_ENABLE_COPT_BT = "BURN TILT ENABLE"
DESC_ENABLE_COPT_SEC = "SEC AIR ENABLE"
DESC_ENABLE_COPT_MOT = "MILL OUTLET ENABLE"
DESC_ALARM = "SAFEGUARD FAIL ALARM"
WATCHDOG_ALARM = "WATCHDOG FAIL"
DESC_ALARM_BIAS = "PERMISSIVE BIAS (SAFEGUARD)"

TAG_COPT_ISCALLING = "TAG:COPT_is_calling"
OXYGEN_STEADY_STATE_LEVEL = 0.01

PARAMETER_BIAS = 'bias_value'
PARAMETER_SET_POINT = 'value'

PARAMETER_WRITE = {
    # 'All Wind': PARAMETER_BIAS,
    'Excess Oxygen Sensor': PARAMETER_SET_POINT
    # 'Total Secondary Air Flow': PARAMETER_BIAS
}

REALTIME_OPC_TRANSFER_TAG = {
    'Efficiency': {
        'tb_bat_raw_tag': 'Efficiency',
        'opc_tag':'Efficiency'
    },
    'Efficiency Baseline': {
        'tb_bat_raw_tag': 'Eff_Baseline',
        'opc_tag':'Eff_Baseline'
    }
    # 'Safeguard Combustion': {
    #     'tb_bat_raw_tag': 'SAFEGUARD:COMBUSTION',
    #     'opc_tag':'OPC.AW2002.2E_FDF.COPT_ACT.BI07'
    # }
}

TEMP_FOLDER = 'data/temp/'

"Setting Karakter O2 di DCS"
DCS_X = [ 0, 400, 600, 800, 1000, 1200]
DCS_Y = [10,   6, 4.5, 3.5,    3,  2.5]