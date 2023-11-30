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
        "KALTIM2.SIGNAL.AI.20HHL11CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "KALTIM2.SIGNAL.AI.20HHL12CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "KALTIM2.SIGNAL.AI.20HHL13CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "KALTIM2.SIGNAL.AI.20HHL14CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "KALTIM2.SIGNAL.AI.20HHL21CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "KALTIM2.SIGNAL.AI.20HHL22CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "KALTIM2.SIGNAL.AI.20HHL23CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "KALTIM2.SIGNAL.AI.20HHL24CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5
    },
    "Total Primary Air Flow": {
        "KALTIM2.SIGNAL.AI.20HHL02CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "KALTIM2.SIGNAL.AI.20HHL03CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "KALTIM2.SIGNAL.AI.20HHL04CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "KALTIM2.SIGNAL.AI.20HEW11CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "KALTIM2.SIGNAL.AI.20HFE11CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "KALTIM2.SIGNAL.AI.20HFE12CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "KALTIM2.SIGNAL.AI.20HEW12CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "KALTIM2.SIGNAL.AI.20HFE21CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "KALTIM2.SIGNAL.AI.20HFE22CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "KALTIM2.SIGNAL.AI.20HFE32CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "KALTIM2.SIGNAL.AI.20HEW13CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "KALTIM2.SIGNAL.AI.20HFE31CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "KALTIM2.SIGNAL.AI.20HEW14CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "KALTIM2.SIGNAL.AI.20HFE41CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "KALTIM2.SIGNAL.AI.20HFE42CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "KALTIM2.SIGNAL.AI.20HEW15CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "KALTIM2.SIGNAL.AI.20HFE51CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "KALTIM2.SIGNAL.AI.20HFE52CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "KALTIM2.SIGNAL.AI.20HEW16CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "KALTIM2.SIGNAL.AI.20HFE61CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "KALTIM2.SIGNAL.AI.20HFE62CF101": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5
    },

    "Excess Oxygen A Side 1": {
        "KALTIM2.SIGNAL.AI.20HBK31CQ101": None
    },

    "Excess Oxygen B Side 1": {
        "KALTIM2.SIGNAL.AI.20HBK41CQ101": None
    },

    "Furnace Pressure": {
        "KALTIM2.SIGNAL.AI.20HBK11CP101": None,
        "KALTIM2.SIGNAL.AI.20HBK21CP101": None
    },

    "Bed Temperature": {
        "KALTIM2.SIGNAL.TC.20HBK30CT101": None,
        "KALTIM2.SIGNAL.TC.20HBK30CT102": None,
        "KALTIM2.SIGNAL.TC.20HBK30CT103": None,
        "KALTIM2.SIGNAL.TC.20HBK30CT104": None,
        "KALTIM2.SIGNAL.TC.20HBK30CT105": None,
        "KALTIM2.SIGNAL.TC.20HBK30CT106": None,
        "KALTIM2.SIGNAL.TC.20HBK30CT107": None,
        "KALTIM2.SIGNAL.TC.20HBK30CT108": None,
        "KALTIM2.SIGNAL.TC.20HBK40CT101": None,
        "KALTIM2.SIGNAL.TC.20HBK40CT102": None,
        "KALTIM2.SIGNAL.TC.20HBK40CT103": None,
        "KALTIM2.SIGNAL.TC.20HBK40CT104": None
    },

    "Coal Flow": {
        "KALTIM2.SIGNAL.AI.20HFB10AF001XQ02": None,
        "KALTIM2.SIGNAL.AI.20HFB20AF001XQ02": None,
        "KALTIM2.SIGNAL.AI.20HFB30AF001XQ02": None,
        "KALTIM2.SIGNAL.AI.20HFB40AF001XQ02": None,
        "KALTIM2.SIGNAL.AI.20HFB50AF001XQ02": None,
        "KALTIM2.SIGNAL.AI.20HFB60AF001XQ02": None
    },

    "Furnace Temperature": {
        "KALTIM2.SIGNAL.TC.20HBK11CT101": None,
        "KALTIM2.SIGNAL.TC.20HBK21CT101": None,
    },

    # Single Associations
    "Windbox-to-Furnace Diff. Press A": {
        "KALTIM2.SIGNAL.AI.20HBK11CP102": None
    },

    "Windbox-to-Furnace Diff. Press B": {
        "KALTIM2.SIGNAL.AI.20HBK21CP102": None
    },

    "Stack NOx": {
        "KALTIM 0.SIGNAL.AI.20HNA30CQ104": None
    },
    "Stack CO": {
        "KALTIM 0.SIGNAL.AI.20HNA30CQ105": None
    },

    "Generator Gross Load": {
        "KALTIM2.SIGNAL.AI.20MKA01CE004": None
    },
    'Excess Oxygen Sensor': {
        "KALTIM2.SIGNAL.AI.20HBK31CQ101": None,
        "KALTIM2.SIGNAL.AI.20HBK41CQ101": None

    }
}

TAGS_TO_ACTIONS = {
    "CONST_LIMITS": {
        "Furnace Pressure": lambda current_x, delta_x: (current_x + delta_x <= -5.1),
        "Windbox-to-Furnace Diff. Press A": lambda current_x, delta_x: (current_x + delta_x <= 3726),
        "Windbox-to-Furnace Diff. Press B": lambda current_x, delta_x: (current_x + delta_x <= 3726),
        "Excess Oxygen Sensor": lambda current_x, delta_x: (2 <= current_x + delta_x),
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
        "Excess Oxygen B Side 1": lambda x: (x > 2.9) & (x <= 3.1),
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
        "Efficiency Nominal",
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
        'FDF Fan Air Flow Calc',
    }
}
