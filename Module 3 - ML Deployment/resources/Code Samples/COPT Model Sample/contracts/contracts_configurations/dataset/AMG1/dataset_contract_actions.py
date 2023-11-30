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

    "Total Secondary Air Flow Avg": None,
    "Total Secondary Air Flow plus Avg": None,
    "Total Secondary Air Flow Sides Sum": None,
    "Total Secondary Air Flow Sides": None,
    'FDF Fan Air Flow Calc': None,

    "PA Heater Out Press": {
        "ALA30CP101": None
    },
    "Stack NOx": {
        "ANE31CQ103": None
    },
    "Stack CO": {
        "ANE31CQ102": None
    },
    "Bed Pressure": {
        "ABK10CP101": None,
    },
    "Bed Pressure plus": {
        "ABK10CP102": None
    },
    "Bed Temperature": {
        "ABED_T_11": None,
    },
    "Bed Temperature plus": {
        "ABED_T_12": None,
    },
    "Furnace Temperature": {
        "ABK10CT611": None
    },
    "Furnace Temperature plus": {
        "ABK10CT612": None
    },

    # Multiple associations
    "Main Steam Temperature": {
        "ABA10CT601": None,
        "ABA10CT611": None
    },
    "Total Secondary Air Flow": None,
    "Total Secondary Air Flow plus": {
        "ALA85CF1_1": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5
    },
    "Total Primary Air Flow": {
        "ALA15CF1_1": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "ALA50CF1_1": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "ALA31CF1_1": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "ALA32CF1_1": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5
    },

    "SH Spray Water Flow": {
        "A_B10CF131": None,
        "A_B10CF141": None
    },

    "Reheat Spray Water Flow": None,
    "Reheat Steam Flow": None,

    "Feed Water Flow": {
        "AAB10CF1_1": None
    },

    "Mill A Outlet Temperature": None,
    "Mill B Outlet Temperature": None,
    "Mill C Outlet Temperature": None,
    "Mill D Outlet Temperature": None,
    "Mill E Outlet Temperature": None,
    "Mill F Outlet Temperature": None,

    "Windbox-to-Furnace Diff. Press A": {"ABK10DP105": None},
    "Windbox-to-Furnace Diff. Press B": {"ABK10DP106": None},

    "Cold Reheat Steam Pressure": None,
    "Cold Reheat Steam Temperature": None,


    # Single Associations
    "Excess Oxygen A Side 1": {"ANA20CQ101": None},
    "Excess Oxygen B Side 1": {"ANA20CQ102": None},

    "SA Heater Out Press": {"ALA83CP101": None},

    "Furnace Pressure": {
        "ABK10CP23": None
    },

    "Main Steam Pressure": {"ABA10CP113": None},
    "Main Steam Flow": {"ABA10CF101": None},

    "Hot Reheat Steam Pressure": None,
    "Hot Reheat Steam Temperature": None,

    "Coal Flow": {
        "A_CF_FL1": None
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

    "SH Spray Water Pressure": {"AAB10CP121": None},
    "SH Spray Temperature": {"AAB10T621": None},

    "Feed Water Pressure": {
        "AAB10CP121": None,
        "AAB10CP121": None
    },

    "Feed Water Temperature": {
        "AAB10T621": None,
        "AAB10T622": None,
    },

    "Generator Gross Load": {"AC02FE001": None},
}

TAGS_TO_ACTIONS = {
    "CONST_LIMITS": {
        "Furnace Pressure": lambda current_x, delta_x: -50 > current_x + delta_x,
        "Windbox-to-Furnace Diff. Press A": lambda current_x, delta_x: 1.5 > current_x + delta_x,
        "Windbox-to-Furnace Diff. Press B": lambda current_x, delta_x: 1.5 > current_x + delta_x,
        # TODO: Add jump DV constraint criterion from SOKET1
        "Excess Oxygen A Side 1": lambda current_x, delta_x: (3.5 < current_x + delta_x) & (current_x + delta_x <= 100),
        "Excess Oxygen B Side 1": lambda current_x, delta_x: (3.5 < current_x + delta_x) & (current_x + delta_x <= 100),
        "Bed Pressure": lambda current_x, delta_x: 2.5 < current_x + delta_x,
        "Bed Pressure plus": lambda current_x, delta_x: 2.5 < current_x + delta_x,
        "Bed Temperature": lambda current_x, delta_x: (760 < current_x + delta_x) & (current_x + delta_x < 920),
        "Bed Temperature plus": lambda current_x, delta_x: (760 < current_x + delta_x) & (current_x + delta_x < 920),
        "Furnace Temperature": lambda current_x, delta_x: (800 < current_x + delta_x) & (current_x + delta_x < 950),
        "Furnace Temperature plus": lambda current_x, delta_x: (800 < current_x + delta_x) & (current_x + delta_x < 950),
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
        "Coal Flow": lambda x, scale_back=False: x * 3.6 if scale_back else x * 0.27777777777,
        "Main Steam Flow": lambda x, scale_back=False: x * 3.6 if scale_back else x * 0.27777777777,
        "Main Steam Pressure": lambda x, scale_back=False: x * 0.1 if scale_back else x * 10,
        "SH Spray Water Pressure": lambda x, scale_back=False: x * 0.1 if scale_back else x * 10,
        "Feed Water Pressure": lambda x, scale_back=False: x * 0.1 if scale_back else x * 10,
    },
    "TARGET_LIMITS": {
        "Excess Oxygen A Side 1": lambda x: (x > 3.5) & (x <= 4.5),
        "Excess Oxygen B Side 1": lambda x: (x > 3.5) & (x <= 4.5)
    }
}

TAG_GROUP_MAP = {
    "RECOMMENDATION_MV_VARIABLES": {
        "SA Heater Out Press"
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
        "Total Secondary Air Flow",
        "Coal HHV",
        "Excess Oxygen Sensor",
        "Excess Oxygen A Side 2",
        "Excess Oxygen B Side 2",
        "Efficiency",
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
        "Total Secondary Air Flow",
        "Total Secondary Air Flow Sides",
        'FDF Fan Air Flow Calc',
        "Efficiency Nominal"
    }
}
