import sys

if "../../actions" not in sys.path:
    sys.path.append("../../actions")

TAG_ASSOCIATIONS = {

    # Custom Formula associations
    "Coal HHV": None,
    "Efficiency": None,
    "Efficiency Nominal": None,

    "Stack CO": None,
    "Bed Temperature": None,
    "Furnace Temperature": None,
    "Furnace Temperature plus": None,
    "Bed Pressure": None,
    "Bed Pressure plus": None,
    "Bed Temperature plus": None,
    'SA Heater Out Press': None,
    'PA Heater Out Press': None,
    "Total Secondary Air Flow": None,
    "Total Secondary Air Flow plus": None,
    "Total Secondary Air Flow Sides": None,

    # Multiple associations

    "Total Secondary Air Flow Avg": {
        "OPC.AW1002.1E_AIRFLOW.FURA1AIN.PNT": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "OPC.AW1002.1E_AIRFLOW.FURA2AIN.PNT": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
    },
    "Total Secondary Air Flow plus Avg": {
        "OPC.AW1002.1E_AIRFLOW.FURB1AIN.PNT": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "OPC.AW1002.1E_AIRFLOW.FURB2AIN.PNT": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
    },
    "Total Secondary Air Flow Sides Sum": lambda df_before, df_after:
        df_after["Total Secondary Air Flow Avg"].values + \
        df_after["Total Secondary Air Flow plus Avg"].values,

    "Coal Flow": {"OPC.AW1002.1E_FUELC.CALCA1OUT.PNT": None},
    "Generator Gross Load": {"OPC.AW1002.1EAI.AI052407.PNT": None},

    "Total Primary Air Flow": {
        "OPC.AW1002.1E_AIRFLOW.MSMA1AIN.PNT": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "OPC.AW1002.1E_AIRFLOW.MSMA2AIN.PNT": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "OPC.AW1002.1E_AIRFLOW.MSMB1AIN.PNT": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "OPC.AW1002.1E_AIRFLOW.MSMB2AIN.PNT": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "OPC.AW1002.1E_AIRFLOW.MSMC1AIN.PNT": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "OPC.AW1002.1E_AIRFLOW.MSMC2AIN.PNT": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "OPC.AW1002.1E_AIRFLOW.MSMD1AIN.PNT": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "OPC.AW1002.1E_AIRFLOW.MSMD2AIN.PNT": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "OPC.AW1002.1E_AIRFLOW.MSME1AIN.PNT": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "OPC.AW1002.1E_AIRFLOW.MSME2AIN.PNT": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5
    },

    "Mill A Outlet Temperature": {
        "OPC.AW1002.1GAI.AI070107.PNT": None,
        "OPC.AW1002.1EAI.AI050501.PNT": None,
        "OPC.AW1002.1EAI.AI050601.PNT": None
    },
    "Mill B Outlet Temperature": {
        "OPC.AW1002.1GAI.AI070307.PNT": None,
        "OPC.AW1002.1EAI.AI050502.PNT": None,
        "OPC.AW1002.1EAI.AI050602.PNT": None
    },
    "Mill C Outlet Temperature": {
        "OPC.AW1002.1HAI.AI090107.PNT": None,
        "OPC.AW1002.1EAI.AI050503.PNT": None,
        "OPC.AW1002.1EAI.AI050603.PNT": None
    },
    "Mill D Outlet Temperature": {
        "OPC.AW1002.1HAI.AI090307.PNT": None,
        "OPC.AW1002.1EAI.AI050504.PNT": None,
        "OPC.AW1002.1EAI.AI050604.PNT": None
    },
    "Mill E Outlet Temperature": {
        "OPC.AW1002.1IAI.AI100107.PNT": None,
        "OPC.AW1002.1EAI.AI050505.PNT": None,
        "OPC.AW1002.1EAI.AI050605.PNT": None
    },

    "Main Steam Temperature": {
        "OPC.AW1002.1FAI.AI060206.PNT": None,
        "OPC.AW1002.1FAI.AI060304.PNT": None
    },

    "SH Spray Water Flow": {
        "OPC.AW1002.1F_FLOW.1SHCALCA.RO01": None,
        "OPC.AW1002.1F_FLOW.2SHACALCA.RO01": None,
        "OPC.AW1002.1F_FLOW.2SHBCALCA.RO01": None,
        "OPC.AW1002.1F_FLOW.3SHACALCA.RO01": None,
        "OPC.AW1002.1F_FLOW.3SHBCALCA.RO01": None
    },

    "Reheat Spray Water Flow": {
        "OPC.AW1002.1F_FLOW.RHCALCA.RO01": None,
        "OPC.AW1002.1F_FLOW.RHACALCA.RO01": None,
        "OPC.AW1002.1F_FLOW.RHBCALCA.RO01": None
    },
    "Reheat Steam Flow": {
        "OPC.AW1002.1PMS.RSFLOW.RO01": None,
        "OPC.AW1002.1PMS.RSFLOW.RO02": None
    },

    "Feed Water Flow": {
        "OPC.AW1002.1M_FLOW.FW1AIN.PNT": None,
        "OPC.AW1002.1M_FLOW.FW2AIN.PNT": None,
        "OPC.AW1002.1M_FLOW.FW3AIN.PNT": None
    },

    "Windbox-to-Furnace Diff. Press A": {
        "OPC.AW1002.1EAI.AI051307.PNT": None,
        "OPC.AW1002.1EAI.AI051401.PNT": None
    },
    "Windbox-to-Furnace Diff. Press B": {
        "OPC.AW1002.1EAI.AI051403.PNT": None,
        "OPC.AW1002.1EAI.AI051501.PNT": None
    },

    "Cold Reheat Steam Pressure": {
        "OPC.AW1002.1LAI.AI140406.PNT": None,
        "OPC.AW1002.1LAI.AI140407.PNT": None
    },
    "Cold Reheat Steam Temperature": {
        "OPC.AW1002.1LAI.AI141706.PNT": None,
        "OPC.AW1002.1LAI.AI141707.PNT": None
    },
    "Excess Oxygen Sensor": {
        "OPC.AW1002.1EAI.AI051707.PNT": None,
        "OPC.AW1002.1EAI.AI052105.PNT": None,
        "OPC.AW1002.1EAI.AI052304.PNT": None,
        "OPC.AW1002.1EAI.AI052401.PNT": None
    },


    # Single Associations
    "Excess Oxygen A Side 1": {"OPC.AW1002.1EAI.AI051707.PNT": None},
    "Excess Oxygen A Side 2": {"OPC.AW1002.1EAI.AI052105.PNT": None},
    "Excess Oxygen B Side 1": {"OPC.AW1002.1EAI.AI052304.PNT": None},
    "Excess Oxygen B Side 2": {"OPC.AW1002.1EAI.AI052401.PNT": None},

    "Furnace Pressure": {"OPC.AW1002.1E_IDF.SIGSEL1OUT.PNT": None},

    "Stack NOx": {"OPC.AW1002.1LAI.AI142703.PNT": None},

    "Over-Fire-Air Dampers 1": {"OPC.AW1002.1FAI.AI061106.PNT": None},
    "Over-Fire-Air Dampers 2": {"OPC.AW1002.1FAI.AI061305.PNT": None},
    "Over-Fire-Air Dampers 3": {"OPC.AW1002.1FAI.AI061504.PNT": None},
    "Over-Fire-Air Dampers 4": {"OPC.AW1002.1FAI.AI061703.PNT": None},

    "Main Steam Pressure": {"OPC.AW1002.1LAI.AI140307.PNT": None},
    "Main Steam Flow": {"OPC.AW1002.1M_MSTFLOW.SWCH2OUT.PNT": None},

    "Hot Reheat Steam Pressure": {"OPC.AW1002.1LAI.AI140505.PNT": None},
    "Hot Reheat Steam Temperature": {"OPC.AW1002.1LAI.AI142102.PNT": None},

    "Reheat Spray Temperature": {"OPC.AW1002.1LAI.AI142103.PNT": None},
    "Reheat Spray Water Pressure": {"OPC.AW1002.1LAI.AI140506.PNT": None},

    "Burner Tilt Position 1L": {"OPC.AW1002.1FAI.AI062202.PNT": None},
    "Burner Tilt Position 1R": {"OPC.AW1002.1FAI.AI062203.PNT": None},
    "Burner Tilt Position 2L": {"OPC.AW1002.1FAI.AI062204.PNT": None},
    "Burner Tilt Position 2R": {"OPC.AW1002.1FAI.AI062205.PNT": None},
    "Burner Tilt Position 3L": {"OPC.AW1002.1FAI.AI062301.PNT": None},
    "Burner Tilt Position 3R": {"OPC.AW1002.1FAI.AI062302.PNT": None},
    "Burner Tilt Position 4L": {"OPC.AW1002.1FAI.AI062303.PNT": None},
    "Burner Tilt Position 4R": {"OPC.AW1002.1FAI.AI062304.PNT": None},

    "FDF Fan Air Flow Calc": {"OPC.AW1002.1E_FDF.MATH1OUT.PNT": None},

    "SH Spray Water Pressure": {"OPC.AW1002.1LAI.AI140507.PNT": None},
    "SH Spray Temperature": {"OPC.AW1002.1LAI.AI142104.PNT": None},

    "Feed Water Pressure": {"OPC.AW1002.1LAI.AI140606.PNT": None},
    "Feed Water Temperature": {"OPC.AW1002.1MAI.AI163307.PNT": None},

}

TAGS_TO_ACTIONS = {
    "CONST_LIMITS": {
        # These constrain is the value before rescaled, if rescaled change to commented value
        "Mill A Outlet Temperature": lambda current_x, delta_x: (53 <= current_x + delta_x + 0) & (current_x + delta_x + 0 <= 71),
        "Mill B Outlet Temperature": lambda current_x, delta_x: (53 <= current_x + delta_x + 0) & (current_x + delta_x + 0 <= 71),
        "Mill C Outlet Temperature": lambda current_x, delta_x: (53 <= current_x + delta_x + 0) & (current_x + delta_x + 0 <= 71),
        "Mill D Outlet Temperature": lambda current_x, delta_x: (53 <= current_x + delta_x + 0) & (current_x + delta_x + 0 <= 71),
        "Mill E Outlet Temperature": lambda current_x, delta_x: (53 <= current_x + delta_x + 0) & (current_x + delta_x + 0 <= 71),
        "Windbox-to-Furnace Diff. Press A": lambda current_x, delta_x: current_x + delta_x <= 1,
        "Windbox-to-Furnace Diff. Press B": lambda current_x, delta_x: current_x + delta_x <= 1,
        "Furnace Pressure": lambda current_x, delta_x: (-100 <= current_x + delta_x) & (current_x + delta_x <= -2),
        # TODO: Add jump DV constraint criterion from SOKET1
        "Excess Oxygen Sensor": lambda current_x, delta_x: (1 <= current_x + delta_x) & (current_x + delta_x <= 100),
        "Total Secondary Air Flow plus Avg": lambda current_x, delta_x: abs(delta_x) <= 0.15 * current_x,
        "Total Secondary Air Flow Avg": lambda current_x, delta_x: abs(delta_x) <= 0.15 * current_x,
        "Total Secondary Air Flow Sides Sum": lambda current_x, delta_x: abs(delta_x) <= 0.15 * current_x,
        "Generator Gross Load": lambda current_x, delta_x: current_x + delta_x >= 150,
    },
    "MODELLING_CONSTRAINT_FILTER": {
        # These constraints are based on thresholds for operationability of the boiler and concern training data
        # filtering and used only if they are in MODELLING_CONSTRAINT_VARIABLES Tag Group Mapping
        # TODO: Add as a general constraint for recommendation.
        "Generator Gross Load": lambda x: x >= 150
    },

    "RESCALE_SENSOR": {
        "Feed Water Flow": lambda x, scale_back=False: x * 3.6 if scale_back else x * 0.27777777777,
        "SH Spray Water Flow": lambda x, scale_back=False: x * 3.6 if scale_back else x * 0.27777777777,
        "Reheat Spray Water Flow": lambda x, scale_back=False: x * 3.6 if scale_back else x * 0.27777777777,
        "Reheat Steam Flow": lambda x, scale_back=False: x * 3.6 if scale_back else x * 0.27777777777,
        "Coal Flow": lambda x, scale_back=False: x * 3.6 if scale_back else x * 0.27777777777,
        "Main Steam Flow": lambda x, scale_back=False: x * 3.6 if scale_back else x * 0.27777777777,
        "Main Steam Pressure": lambda x, scale_back=False: x * 0.1 if scale_back else x * 10,
        "SH Spray Water Pressure": lambda x, scale_back=False: x * 0.1 if scale_back else x * 10,
        "Reheat Spray Water Pressure": lambda x, scale_back=False: x * 0.1 if scale_back else x * 10,
        "Hot Reheat Steam Pressure": lambda x, scale_back=False: x * 0.1 if scale_back else x * 10,
        "Feed Water Pressure": lambda x, scale_back=False: x * 0.1 if scale_back else x * 10,
        "Cold Reheat Steam Pressure": lambda x, scale_back=False: x * 0.1 if scale_back else x * 10,
        "Furnace Pressure": lambda x, scale_back=False: x * 9.80665 if scale_back else x * 0.10197,
        "Windbox-to-Furnace Diff. Press A": lambda x, scale_back=False: x * 1000 if scale_back else x * 0.001,
        "Windbox-to-Furnace Diff. Press B": lambda x, scale_back=False: x * 1000 if scale_back else x * 0.001
    },
    "TARGET_LIMITS": {
        "Excess Oxygen Sensor": lambda x: (x > 2) & (x <= 3.5),
    },
}

TAG_GROUP_MAP = {
    "RECOMMENDATION_MV_VARIABLES": {
        "FDF Fan Air Flow Calc",
        "Total Secondary Air Flow Sides Sum",
        "Burner Tilt Position 1L",
        "Burner Tilt Position 1R",
        "Burner Tilt Position 2L",
        "Burner Tilt Position 2R",
        "Burner Tilt Position 3L",
        "Burner Tilt Position 3R",
        "Burner Tilt Position 4L",
        "Burner Tilt Position 4R",
    },

    "RECOMMENDATION_TARGET_VARIABLES": {
        "Excess Oxygen Sensor"
    },
    "RECOMMENDATION_DIRECTION_VARIABLES": {},

    "DV_VARIABLES": {
        "Coal Flow",
        "Total Primary Air Flow",
        "Generator Gross Load"
    },
    "MV_DEPENDENT_CONSTRAINTS": {
        "Windbox-to-Furnace Diff. Press A",
        "Windbox-to-Furnace Diff. Press B",
        "Furnace Pressure",
    },
    "MODELLING_CONSTRAINT_VARIABLES": {
        "Generator Gross Load"
    },
    "MODELLED_TAGS": {},
    "IGNORED_TAGS": {
        "Main Steam Temperature",
        "Total Secondary Air Flow",
        "Total Secondary Air Flow plus",
        "Total Secondary Air Flow Sides",
        "Efficiency Nominal",
        "Furnace Temperature plus",
        "Bed Pressure",
        "Bed Pressure plus",
        "Bed Temperature plus",
        'SA Heater Out Press',
        'PA Heater Out Press',
        "Coal HHV",
        "Efficiency",
        "Stack CO",
        "Bed Temperature",
        "Furnace Temperature",
    },
}
