import sys

if "../../actions" not in sys.path:
    sys.path.append("../../actions")

TAG_ASSOCIATIONS = {

    # Custom Formula associations
    "Coal HHV": None,
    "Efficiency": None,
    "Efficiency Nominal": None,
    "Excess Oxygen A Side 2": None,
    "Excess Oxygen B Side 2": None,
    "Excess Oxygen Sensor": None,
    "Stack NOx": None,

    "Stack CO": None,

    "Total Secondary Air Flow Avg": None,
    "Total Secondary Air Flow plus Avg": None,
    "Total Secondary Air Flow Sides Sum": None,
    "Total Secondary Air Flow Sides": None,
    'FDF Fan Air Flow Calc': None,

    "PA Heater Out Press": {
        "BLA30CP101": None
    },
    "Bed Pressure": {
        "BBK10CP101": None
    },
    "Bed Pressure plus": {
        "BBK10CP102": None
    },
    "Bed Temperature": {
        "BBED_T_11": None
    },
    "Bed Temperature plus": {
        "BBED_T_12": None
    },
    "Furnace Temperature": {
        "BBK10CT611": None
    },
    "Furnace Temperature plus": {
        "BBK10CT612": None
    },

    # Multiple associations
    "Main Steam Temperature": {
        "BBA10CT601": None,
        "BBA10CT611": None
    },
    "Total Secondary Air Flow": {
        "BLA84CF1_1": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5
    },
    "Total Secondary Air Flow plus": {
        "BLA85CF1_1": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5
    },
    "Total Primary Air Flow": {
        "BLA15CF1_1": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "BLA50CF1_1": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "BLA31CF1_1": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "BLA32CF1_1": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5
    },

    "SH Spray Water Flow": {
        "B_B10CF131": None,
        "B_B10CF141": None
    },

    "Reheat Spray Water Flow": None,
    "Reheat Steam Flow": None,

    "Feed Water Flow": {
        "BAB10CF1_1": None
    },

    "Mill A Outlet Temperature": None,
    "Mill B Outlet Temperature": None,
    "Mill C Outlet Temperature": None,
    "Mill D Outlet Temperature": None,
    "Mill E Outlet Temperature": None,
    "Mill F Outlet Temperature": None,

    "Windbox-to-Furnace Diff. Press A": {"BBK10DP105": None},
    "Windbox-to-Furnace Diff. Press B": {"BBK10DP106": None},

    "Cold Reheat Steam Pressure": None,
    "Cold Reheat Steam Temperature": None,


    # Single Associations
    "Excess Oxygen A Side 1": {"BNA20CQ101": None},
    "Excess Oxygen B Side 1": {"BNA20CQ102": None},

    "SA Heater Out Press": {"BLA83CP101": None},

    "Furnace Pressure": {
        "BBK10CP23": None
    },

    "Main Steam Pressure": {"BBA10CP101": None},
    "Main Steam Flow": {"BBA10CP113": None},

    "Hot Reheat Steam Pressure": None,
    "Hot Reheat Steam Temperature": None,

    "Coal Flow": {
        "B_CF_FL": None
    },
    "Reheat Spray Temperature": None,
    "Reheat Spray Water Pressure": None,

    "Over-Fire-Air Dampers 1": None,
    "Over-Fire-Air Dampers 2": None,
    "Over-Fire-Air Dampers 3": None,
    "Over-Fire-Air Dampers 4": None,

    "Burner Tilt Position 1L": None,
    "Burner Tilt Position 1R": None,
    "Burner Tilt Position 2L": None,
    "Burner Tilt Position 2R": None,
    "Burner Tilt Position 3L": None,
    "Burner Tilt Position 3R": None,
    "Burner Tilt Position 4L": None,
    "Burner Tilt Position 4R": None,

    "SH Spray Water Pressure": {"BAB10CP121": None},
    "SH Spray Temperature": {"BAB10T621": None},

    "Feed Water Pressure": {
        "BAB10CP121": None,
        "BAB10CP122": None
    },

    "Feed Water Temperature": {
        "BAB10T621": None,
        "BAB10T622": None,
    },

    "Generator Gross Load": {"BC02FE001": None},
}

TAGS_TO_ACTIONS = {
    "CONST_LIMITS": {
        "Furnace Pressure": lambda current_x, delta_x: -50 > current_x + delta_x,
        "Windbox-to-Furnace Diff. Press A": lambda current_x, delta_x: 1.5 > current_x + delta_x,
        "Windbox-to-Furnace Diff. Press B": lambda current_x, delta_x: 1.5 > current_x + delta_x,
        # TODO: Add jump DV constraint criterion from SOKET1
        "Excess Oxygen A Side 1": lambda current_x, delta_x: (2 < current_x + delta_x) & (current_x + delta_x <= 100),
        "Excess Oxygen B Side 1": lambda current_x, delta_x: (2 < current_x + delta_x) & (current_x + delta_x <= 100),
        "Bed Pressure": lambda current_x, delta_x: 2 < current_x + delta_x,
        "Bed Pressure plus": lambda current_x, delta_x: 2 < current_x + delta_x,
        "Bed Temperature": lambda current_x, delta_x: (760 < current_x + delta_x) & (current_x + delta_x < 930),
        "Bed Temperature plus": lambda current_x, delta_x: (760 < current_x + delta_x) & (current_x + delta_x < 930),
        "Furnace Temperature": lambda current_x, delta_x: (700 < current_x + delta_x) & (current_x + delta_x < 1000),
        "Furnace Temperature plus": lambda current_x, delta_x: (700 < current_x + delta_x) & (current_x + delta_x < 1000),
        "Generator Gross Load": lambda current_x, delta_x: current_x + delta_x >= 15
    },
    "MODELLING_CONSTRAINT_FILTER": {
        # These constraints are based on thresholds for operationability of the boiler and concern training data
        # filtering and used only if they are in MODELLING_CONSTRAINT_VARIABLES Tag Group Mapping
        "Generator Gross Load": lambda x: x >= 10
    },

    "RESCALE_SENSOR": {
        "Feed Water Flow": lambda x, scale_back=False: x * 3.6 if scale_back else x * 0.27777777777,
        "SH Spray Water Flow": lambda x, scale_back=False: x * 3.6 if scale_back else x * 0.27777777777,
        "Main Steam Flow": lambda x, scale_back=False: x * 3.6 if scale_back else x * 0.27777777777,
        "Main Steam Pressure": lambda x, scale_back=False: x * 0.1 if scale_back else x * 10,
        "SH Spray Water Pressure": lambda x, scale_back=False: x * 0.1 if scale_back else x * 10,
        "Feed Water Pressure": lambda x, scale_back=False: x * 0.1 if scale_back else x * 10,
    },
    "TARGET_LIMITS": {
        "Excess Oxygen A Side 1": lambda x: (x > 2.5) & (x <= 3.5),
        "Excess Oxygen B Side 1": lambda x: (x > 2.5) & (x <= 3.5)
    },
}

TAG_GROUP_MAP = {
    "RECOMMENDATION_MV_VARIABLES": {
        "SA Heater Out Press",
        "Coal Flow"
    },
    # TODO: Move Excess Oxygen to direction variables to generalize this section as distinct
    # from RECOMMENDATION_DIRECTION_VARIABLES
    "RECOMMENDATION_TARGET_VARIABLES": {
        "Excess Oxygen A Side 1",
        "Excess Oxygen B Side 1"
    },
    "RECOMMENDATION_DIRECTION_VARIABLES": {},

    "DV_VARIABLES": {
        "Coal Flow",
        "PA Heater Out Press",
        "Generator Gross Load"
    },
    "MV_DEPENDENT_CONSTRAINTS": {
        "Furnace Pressure",
        "Furnace Temperature",
        "Furnace Temperature plus",
        "Bed Pressure",
        "Bed Pressure plus",
        "Bed Temperature",
        "Bed Temperature plus"
    },
    "MODELLING_CONSTRAINT_VARIABLES": {
        "Generator Gross Load"
    },
    "MODELLED_TAGS": {},
    "IGNORED_TAGS": {
        "Coal HHV",
        "Efficiency",
        "Stack NOx",
        "Stack CO",
        "Excess Oxygen A Side 2",
        "Excess Oxygen B Side 2",
        "Excess Oxygen Sensor",
        "Reheat Spray Water Flow",
        "Reheat Steam Flow",
        "Mill A Outlet Temperature",
        "Mill B Outlet Temperature",
        "Mill C Outlet Temperature",
        "Mill D Outlet Temperature",
        "Mill E Outlet Temperature",
        "Mill F Outlet Temperature",

        "Cold Reheat Steam Pressure",
        "Cold Reheat Steam Temperature",

        "Hot Reheat Steam Pressure",
        "Hot Reheat Steam Temperature",

        "Reheat Spray Temperature",
        "Reheat Spray Water Pressure",

        "Over-Fire-Air Dampers 1",
        "Over-Fire-Air Dampers 2",
        "Over-Fire-Air Dampers 3",
        "Over-Fire-Air Dampers 4",

        "Burner Tilt Position 1L",
        "Burner Tilt Position 1R",
        "Burner Tilt Position 2L",
        "Burner Tilt Position 2R",
        "Burner Tilt Position 3L",
        "Burner Tilt Position 3R",
        "Burner Tilt Position 4L",
        "Burner Tilt Position 4R",
        "Total Secondary Air Flow Avg",
        "Total Secondary Air Flow plus Avg",
        "Total Secondary Air Flow Sides Sum",
        "Total Secondary Air Flow Sides",
        'FDF Fan Air Flow Calc',
        "Efficiency Nominal"
    }
}
