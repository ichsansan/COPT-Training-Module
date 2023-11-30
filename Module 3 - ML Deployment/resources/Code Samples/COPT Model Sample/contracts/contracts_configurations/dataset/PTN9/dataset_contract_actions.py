import sys

if "../../actions" not in sys.path:
    sys.path.append("../../actions")

TAG_ASSOCIATIONS = {
    # Custom Formula associations - N/A

    # Single associations

    "Excess Oxygen Sensor": {"90AIR-O2-SEL.DROP10/60.UNIT1@NET0": None},
    "Efficiency Nominal": {"Efficiency": None},

    "Total Secondary Air Flow": {'90AIR-TOTSA-FLOW.DROP10/60.UNIT1@NET0': None},
    "Generator Gross Load": {"DEH1-MWGROSS.DROP41/91.UNIT1@NET0": None},
    "Total Primary Air Flow": {
        "90AIR-TOTPA-FLOW.DROP10/60.UNIT1@NET0": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
    },

    "Coal Flow": {"90FUE-TOT-FLOW.DROP10/60.UNIT1@NET0": None},
    "Furnace Pressure": {
        "90HBK10CP10X-SEL.DROP10/60.UNIT1@NET0": None,
    },

    # Multiple associations
    "Over-Fire-Air Dampers 1": {
        "90HHA01AA115XQ01.DROP10/60.UNIT1@NET0": None,
        "90HHA02AA115XQ01.DROP10/60.UNIT1@NET0": None,
        "90HHA03AA115XQ01.DROP10/60.UNIT1@NET0": None,
        "90HHA04AA115XQ01.DROP10/60.UNIT1@NET0": None,
    },
    "Over-Fire-Air Dampers 2": {
        "90HHA01AA116XQ01.DROP10/60.UNIT1@NET0": None,
        "90HHA02AA116XQ01.DROP10/60.UNIT1@NET0": None,
        "90HHA03AA116XQ01.DROP10/60.UNIT1@NET0": None,
        "90HHA04AA116XQ01.DROP10/60.UNIT1@NET0": None,
    },
    "Over-Fire-Air Dampers 3": {
        "90HHA01AA117XQ01.DROP10/60.UNIT1@NET0": None,
        "90HHA02AA117XQ01.DROP10/60.UNIT1@NET0": None,
        "90HHA03AA117XQ01.DROP10/60.UNIT1@NET0": None,
        "90HHA04AA117XQ01.DROP10/60.UNIT1@NET0": None,
    },
    "Burner Tilt Position 1L": {
        "90HHA01AA118YQ01.DROP10/60.UNIT1@NET0": None
    },
    "Burner Tilt Position 1R": {
        "90HHA01AA118BYQ01.DROP10/60.UNIT1@NET0": None
    },
    "Mill A Outlet Temperature": {
        "90HFC10CT30X-SEL.DROP3/53.UNIT1@NET0": None,
    },
    "Mill B Outlet Temperature": {
        "90HFC20CT30X-SEL.DROP3/53.UNIT1@NET0": None,
    },
    "Mill C Outlet Temperature": {
        "90HFC30CT30X-SEL.DROP3/53.UNIT1@NET0": None,
    },
    "Mill D Outlet Temperature": {
        "90HFC40CT30X-SEL.DROP8/58.UNIT1@NET0": None,

    },
    "Mill E Outlet Temperature": {
        "90HFC50CT30X-SEL.DROP8/58.UNIT1@NET0": None,
    },
    "Mill F Outlet Temperature": {
        "90HFC60CT30X-SEL.DROP8/58.UNIT1@NET0": None,
    },

    "Windbox-to-Furnace Diff. Press A": {
        "90HBK10CP150.DROP10/60.UNIT1@NET0": None,
        "90HBK10CP151.DROP10/60.UNIT1@NET0": None,
        "90HBK10CP152.DROP10/60.UNIT1@NET0": None,
    },

    # N/A
    "Over-Fire-Air Dampers 4": None,
    "Bed Pressure": None,
    "Bed Temperature": None,
    "Bed Temperature plus": None,
    "Furnace Temperature": None,
    "SH Spray Water Flow": None,
    "Coal HHV": None,
    "PA Heater Out Press": None,
    "Efficiency": None,
    "Excess Oxygen A Side 2": None,
    "Excess Oxygen B Side 2": None,
    "Excess Oxygen A Side 1": None,
    "Excess Oxygen B Side 1": None,
    "Total Secondary Air Flow Avg": None,
    "Total Secondary Air Flow plus Avg": None,
    "Total Secondary Air Flow Sides": None,
    "Total Secondary Air Flow Sides Sum": None,
    'FDF Fan Air Flow Calc': None,
    "SA Heater Out Press": None,
    "Total Secondary Air Flow plus": None,
    "Reheat Spray Water Flow": None,
    "Reheat Steam Flow": None,
    "Cold Reheat Steam Pressure": None,
    "Cold Reheat Steam Temperature": None,
    "Hot Reheat Steam Pressure": None,
    "Hot Reheat Steam Temperature": None,
    "Reheat Spray Temperature": None,
    "Reheat Spray Water Pressure": None,
    "Burner Tilt Position 2L": None,
    "Burner Tilt Position 2R": None,
    "Burner Tilt Position 3L": None,
    "Burner Tilt Position 3R": None,
    "Burner Tilt Position 4L": None,
    "Burner Tilt Position 4R": None,
    "Bed Pressure plus": None,
    "Furnace Temperature plus": None,
    "Stack NOx": None,
    "Stack CO": None,
    "Windbox-to-Furnace Diff. Press B": None,
    "Main Steam Pressure": None,
    "Feed Water Pressure": None,
    "SH Spray Water Pressure": None,
    "Main Steam Temperature": None,
    "Feed Water Temperature": None,
    "SH Spray Temperature": None,
    "Main Steam Flow": None,
    "Feed Water Flow": None,
}

TAGS_TO_ACTIONS = {
    "CONST_LIMITS": {
        #"Burner Tilt Position 1L": lambda current_x, delta_x: current_x + delta_x > -35,
        #"Burner Tilt Position 1R": lambda current_x, delta_x: current_x + delta_x > -35,
        "Excess Oxygen Sensor": lambda current_x, delta_x: current_x + delta_x >= 2,
        "Furnace Pressure": lambda current_x, delta_x: (current_x + delta_x > -100) & (current_x + delta_x < 0),
        "Windbox-to-Furnace Diff. Press A": lambda current_x, delta_x: (current_x + delta_x > 0) & (current_x + delta_x < 25),
        "Efficiency Nominal": lambda current_x, delta_x: (current_x + delta_x > 0) & (current_x + delta_x < 100),
        "Mill A Outlet Temperature": lambda current_x, delta_x: (current_x + delta_x > -5) & (current_x + delta_x < 105),
        "Mill B Outlet Temperature": lambda current_x, delta_x: (current_x + delta_x > -5) & (current_x + delta_x < 105),
        "Mill C Outlet Temperature": lambda current_x, delta_x: (current_x + delta_x > -5) & (current_x + delta_x < 105),
        "Mill D Outlet Temperature": lambda current_x, delta_x: (current_x + delta_x > -5) & (current_x + delta_x < 105),
        "Mill E Outlet Temperature": lambda current_x, delta_x: (current_x + delta_x > -5) & (current_x + delta_x < 105),
        "Mill F Outlet Temperature": lambda current_x, delta_x: (current_x + delta_x > -5) & (current_x + delta_x < 105),
        "Generator Gross Load": lambda current_x, delta_x: (current_x + delta_x) >= 330
    },
    "MODELLING_CONSTRAINT_FILTER": {
        # These constraints are based on thresholds for operationability of the boiler and concern training data
        # filtering and used only if they are in MODELLING_CONSTRAINT_VARIABLES Tag Group Mapping
        "Generator Gross Load": lambda x: x >= 290
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
        "Excess Oxygen Sensor": lambda x: (x > 2.2) & (x <= 2.8),
        #"Efficiency Nominal": lambda x: x > 95,
    }
}

TAG_GROUP_MAP = {
    "RECOMMENDATION_MV_VARIABLES": {
        "Total Secondary Air Flow",
        "Burner Tilt Position 1L",
        "Burner Tilt Position 1R"
    },

    "RECOMMENDATION_TARGET_VARIABLES": {
        "Excess Oxygen Sensor"
    },
    "RECOMMENDATION_DIRECTION_VARIABLES": {},

    "DV_VARIABLES": {
        "Coal Flow",
        "Generator Gross Load",
        "Total Primary Air Flow",
        "Burner Tilt Position 1L",
        "Burner Tilt Position 1R"
    },
    "MV_DEPENDENT_CONSTRAINTS": {
        "Furnace Pressure",
    },
    "MODELLING_CONSTRAINT_VARIABLES": {
        "Generator Gross Load"
    },
    "MODELLED_TAGS": {},
    "IGNORED_TAGS": {
        "Over-Fire-Air Dampers 4",
        "Coal HHV",
        "PA Heater Out Press",
        "Efficiency",
        "Excess Oxygen A Side 2",
        "Excess Oxygen B Side 2",
        "Excess Oxygen A Side 1",
        "Excess Oxygen B Side 1",
        "Total Secondary Air Flow Avg",
        "Total Secondary Air Flow plus Avg",
        "Total Secondary Air Flow Sides",
        "Total Secondary Air Flow Sides Sum",
        "Windbox-to-Furnace Diff. Press B",
        'FDF Fan Air Flow Calc',
        "SA Heater Out Press",
        "Total Secondary Air Flow plus",
        "Reheat Spray Water Flow",
        "Reheat Steam Flow",
        "Cold Reheat Steam Pressure",
        "Cold Reheat Steam Temperature",
        "Hot Reheat Steam Pressure",
        "Hot Reheat Steam Temperature",
        "Reheat Spray Temperature",
        "Reheat Spray Water Pressure",
        "Burner Tilt Position 2L",
        "Burner Tilt Position 2R",
        "Burner Tilt Position 3L",
        "Burner Tilt Position 3R",
        "Burner Tilt Position 4L",
        "Burner Tilt Position 4R",
        "Bed Pressure plus",
        "Furnace Temperature plus",
        "Furnace Temperature",
        "Stack NOx",
        "Stack CO",
        "Main Steam Temperature",
        "SH Spray Water Pressure",
        "Feed Water Temperature",
        "Main Steam Flow",
        "Feed Water Flow",
        "SH Spray Temperature",
        "Main Steam Pressure",
        "Feed Water Pressure",
        "SH Spray Water Flow",
        "Bed Pressure",
        "Bed Temperature",
        "Bed Temperature plus"
    }
}
