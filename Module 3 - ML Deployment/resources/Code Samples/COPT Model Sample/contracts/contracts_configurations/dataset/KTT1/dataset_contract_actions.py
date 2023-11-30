import sys

if "../../actions" not in sys.path:
    sys.path.append("../../actions")

TAG_ASSOCIATIONS = {

    # Custom Formula associations
    "Excess Oxygen A Side 2": None,
    "Excess Oxygen B Side 2": None,
    "Coal HHV": None,
    "Efficiency": None,
    "Efficiency Nominal": None,
    "Main Steam Temperature": None,
    'Main Steam Pressure': None,
    'Hot Reheat Steam Pressure': None,
    'Cold Reheat Steam Pressure': None,
    'Cold Reheat Steam Temperature': None,
    'SH Spray Water Flow': None,
    'Reheat Spray Water Flow': None,
    'Reheat Steam Flow': None,
    'Feed Water Flow': None,
    'Main Steam Flow': None,
    'Mill A Outlet Temperature': None,
    'Mill B Outlet Temperature': None,
    'Mill C Outlet Temperature': None,
    'Mill D Outlet Temperature': None,
    'Mill E Outlet Temperature': None,
    "Mill F Outlet Temperature": None,
    'Hot Reheat Steam Temperature': None,
    'Reheat Spray Temperature': None,
    'Reheat Spray Water Pressure': None,
    'Over-Fire-Air Dampers 1': None,
    'Over-Fire-Air Dampers 2': None,
    'Over-Fire-Air Dampers 3': None,
    'Over-Fire-Air Dampers 4': None,
    "Burner Tilt Position 1L": None,
    "Burner Tilt Position 1R": None,
    "Burner Tilt Position 2L": None,
    "Burner Tilt Position 2R": None,
    "Burner Tilt Position 3L": None,
    "Burner Tilt Position 3R": None,
    "Burner Tilt Position 4L": None,
    "Burner Tilt Position 4R": None,
    'SH Spray Water Pressure': None,
    'SH Spray Temperature': None,
    "Feed Water Flow": None,
    "Feed Water Pressure": None,
    "Feed Water Temperature": None,
    "Total Secondary Air Flow plus": None,
    "Furnace Temperature plus": None,
    "Bed Pressure": None,
    "Bed Pressure plus": None,
    "Bed Temperature plus": None,
    'SA Heater Out Press': None,
    'PA Heater Out Press': None,
    "Total Secondary Air Flow Avg": None,
    "Total Secondary Air Flow plus Avg": None,
    "Total Secondary Air Flow Sides Sum": None,
    "Total Secondary Air Flow Sides": None,
    'FDF Fan Air Flow Calc': None,


    # Multiple associations
    "Total Secondary Air Flow": {
        "KALTIM1.SIGNAL.AI.10HHL11CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "KALTIM1.SIGNAL.AI.10HHL12CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "KALTIM1.SIGNAL.AI.10HHL13CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "KALTIM1.SIGNAL.AI.10HHL14CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "KALTIM1.SIGNAL.AI.10HHL21CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "KALTIM1.SIGNAL.AI.10HHL22CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "KALTIM1.SIGNAL.AI.10HHL23CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "KALTIM1.SIGNAL.AI.10HHL24CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5
    },
    "Total Primary Air Flow": {
        "KALTIM1.SIGNAL.AI.10HHL02CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "KALTIM1.SIGNAL.AI.10HHL03CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "KALTIM1.SIGNAL.AI.10HHL04CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "KALTIM1.SIGNAL.AI.10HEW11CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "KALTIM1.SIGNAL.AI.10HFE11CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "KALTIM1.SIGNAL.AI.10HFE12CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "KALTIM1.SIGNAL.AI.10HEW12CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "KALTIM1.SIGNAL.AI.10HFE21CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "KALTIM1.SIGNAL.AI.10HFE22CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "KALTIM1.SIGNAL.AI.10HFE32CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "KALTIM1.SIGNAL.AI.10HEW13CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "KALTIM1.SIGNAL.AI.10HFE31CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "KALTIM1.SIGNAL.AI.10HEW14CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "KALTIM1.SIGNAL.AI.10HFE41CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "KALTIM1.SIGNAL.AI.10HFE42CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "KALTIM1.SIGNAL.AI.10HEW15CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "KALTIM1.SIGNAL.AI.10HFE51CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "KALTIM1.SIGNAL.AI.10HFE52CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "KALTIM1.SIGNAL.AI.10HEW16CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "KALTIM1.SIGNAL.AI.10HFE61CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "KALTIM1.SIGNAL.AI.10HFE62CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5
    },

    "Excess Oxygen A Side 1": {
        "KALTIM1.SIGNAL.AI.10HBK31CQ101": None
    },

    "Excess Oxygen B Side 1": {
        "KALTIM1.SIGNAL.AI.10HBK41CQ101": None
    },

    "Furnace Pressure": {
        "KALTIM1.SIGNAL.AI.10HBK11CP101": None,
        "KALTIM1.SIGNAL.AI.10HBK21CP101": None
    },

    "Bed Temperature": {
        "KALTIM1.SIGNAL.TC.10HBK30CT101": None,
        "KALTIM1.SIGNAL.TC.10HBK30CT102": None,
        "KALTIM1.SIGNAL.TC.10HBK30CT103": None,
        "KALTIM1.SIGNAL.TC.10HBK30CT104": None,
        "KALTIM1.SIGNAL.TC.10HBK30CT105": None,
        "KALTIM1.SIGNAL.TC.10HBK30CT106": None,
        "KALTIM1.SIGNAL.TC.10HBK30CT107": None,
        "KALTIM1.SIGNAL.TC.10HBK30CT108": None,
        "KALTIM1.SIGNAL.TC.10HBK40CT101": None,
        "KALTIM1.SIGNAL.TC.10HBK40CT102": None,
        "KALTIM1.SIGNAL.TC.10HBK40CT103": None,
        "KALTIM1.SIGNAL.TC.10HBK40CT104": None
    },

    "Coal Flow": {
        "KALTIM1.SIGNAL.AI.MCS12MCS01A02": None
    },

    "Furnace Temperature": {
        "KALTIM1.SIGNAL.TC.10HBK11CT101": None,
        "KALTIM1.SIGNAL.TC.10HBK21CT101": None
    },

    # Single Associations
    "Windbox-to-Furnace Diff. Press A": {
        "KALTIM1.SIGNAL.AI.10HBK11CP102": None
    },

    "Windbox-to-Furnace Diff. Press B": {
        "KALTIM1.SIGNAL.AI.10HBK21CP102": None
    },

    "Stack NOx": {
        "KALTIM 0.SIGNAL.AI.10HNA30CQ104": None
    },
    "Stack CO": {
        "KALTIM 0.SIGNAL.AI.10HNA30CQ105": None
    },
    "Generator Gross Load": {
        "KALTIM1.SIGNAL.AI.10MKA01CE004": None
    },
    "Excess Oxygen Sensor": {
        "KALTIM1.SIGNAL.AI.10HBK31CQ101": None,
        "KALTIM1.SIGNAL.AI.10HBK41CQ101": None
    }
}

TAGS_TO_ACTIONS = {
    "CONST_LIMITS": {
        "Furnace Pressure": lambda current_x, delta_x: (current_x + delta_x <= -5.1),
        "Windbox-to-Furnace Diff. Press A": lambda current_x, delta_x: (current_x + delta_x <= 3726),
        "Windbox-to-Furnace Diff. Press B": lambda current_x, delta_x: (current_x + delta_x <= 3726),
        "Excess Oxygen Sensor": lambda current_x, delta_x: (2.0 <= current_x + delta_x),
        "Bed Temperature": lambda current_x, delta_x: (760 <= current_x + delta_x) & (current_x + delta_x <= 950),
        "Generator Gross Load": lambda current_x, delta_x: current_x + delta_x >= 50,
        # "Stack NOx": lambda current_x, delta_x: (current_x + delta_x) >= 0 & (current_x + delta_x < 2000),
        # "Stack CO": lambda current_x, delta_x: (current_x + delta_x) >= 0 & (current_x + delta_x < 500),

    },
    "MODELLING_CONSTRAINT_FILTER": {
        # These constraints are based on thresholds for operationability of the boiler and concern training data
        # filtering and used only if they are in MODELLING_CONSTRAINT_VARIABLES Tag Group Mapping
        "Generator Gross Load": lambda x: x >= 50
    },
    "RESCALE_SENSOR": {
        "Coal Flow": lambda x, scale_back=False: x * 3.6 if scale_back else x * 0.27777777777,
        "Furnace Pressure": lambda x, scale_back=False: x * 9.80665 if scale_back else x * 0.10197,
    },
    "TARGET_LIMITS": {
        "Excess Oxygen A Side 1": lambda x: (x > 2.9) & (x <= 3.1),
        "Excess Oxygen B Side 1": lambda x: (x > 2.9) & (x <= 3.1)
    },
}

TAG_GROUP_MAP = {
    "RECOMMENDATION_MV_VARIABLES": {
        "Total Secondary Air Flow"
    },

    'RECOMMENDATION_DIRECTION_VARIABLES': {},

    "RECOMMENDATION_TARGET_VARIABLES": {
        "Excess Oxygen A Side 1",
        "Excess Oxygen B Side 1"
    },
    "DV_VARIABLES": {
        "Coal Flow",
        "Total Primary Air Flow",
        "Generator Gross Load",
        "Bed Temperature"
    },
    "MV_DEPENDENT_CONSTRAINTS": {
        "Windbox-to-Furnace Diff. Press A",
        "Windbox-to-Furnace Diff. Press B",
        "Furnace Pressure",
        "Furnace Temperature"
    },
    "MODELLING_CONSTRAINT_VARIABLES": {
        "Generator Gross Load"
    },
    "MODELLED_TAGS": {},
    "IGNORED_TAGS": {
        "Efficiency Nominal",
        'PA Heater Out Press',
        "Total Secondary Air Flow plus",
        "Furnace Temperature plus",
        "Bed Pressure plus",
        "Bed Temperature plus",
        'SA Heater Out Press',
        "Bed Pressure",
        "Excess Oxygen A Side 2",
        "Excess Oxygen B Side 2",
        "Coal HHV",
        "Efficiency",
        "Main Steam Temperature",
        'Main Steam Pressure',
        'Hot Reheat Steam Pressure',
        'Cold Reheat Steam Pressure',
        'Cold Reheat Steam Temperature',
        'SH Spray Water Flow',
        'Reheat Spray Water Flow',
        'Reheat Steam Flow',
        'Feed Water Flow',
        'Main Steam Flow',
        'Mill A Outlet Temperature',
        'Mill B Outlet Temperature',
        'Mill C Outlet Temperature',
        'Mill D Outlet Temperature',
        'Mill E Outlet Temperature',
        "Mill F Outlet Temperature",
        'Hot Reheat Steam Temperature',
        'Reheat Spray Temperature',
        'Reheat Spray Water Pressure',
        'Over-Fire-Air Dampers 1',
        'Over-Fire-Air Dampers 2',
        'Over-Fire-Air Dampers 3',
        'Over-Fire-Air Dampers 4',
        "Burner Tilt Position 1L",
        "Burner Tilt Position 1R",
        "Burner Tilt Position 2L",
        "Burner Tilt Position 2R",
        "Burner Tilt Position 3L",
        "Burner Tilt Position 3R",
        "Burner Tilt Position 4L",
        "Burner Tilt Position 4R",
        'SH Spray Water Pressure',
        'SH Spray Temperature',
        "Feed Water Flow",
        "Feed Water Pressure",
        "Feed Water Temperature",
        "Total Secondary Air Flow Avg",
        "Total Secondary Air Flow plus Avg",
        "Total Secondary Air Flow Sides Sum",
        "Total Secondary Air Flow plus",
        "Total Secondary Air Flow Sides",
        'FDF Fan Air Flow Calc'
    }
}
