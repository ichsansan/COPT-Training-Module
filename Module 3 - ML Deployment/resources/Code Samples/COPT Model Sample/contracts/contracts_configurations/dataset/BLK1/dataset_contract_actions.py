import sys

if "../../actions" not in sys.path:
    sys.path.append("../../actions")

TAG_ASSOCIATIONS = {
    # Custom Formula associations
    "Total Secondary Air Flow Sides Sum": lambda df_before, df_after:
        df_before["A1FT107_A"].values + \
        df_before["A1FT107_B"].values,

    # Single associations
    "Efficiency Nominal": {"Efficiency": None},
    "Excess Oxygen Sensor": {"A1AT102": None},
    "Generator Gross Load": {"A1G_Power": None},
    "Windbox-to-Furnace Diff. Press A": {"A1PdT134A": None},
    "Windbox-to-Furnace Diff. Press B": {"A1PdT134B": None},

    # Multiple associations
    "Coal Flow": {
        "A1M105A_A1": None,
        "A1M105B_A1": None,
        "A1M105C_A1": None},
    "Total Primary Air Flow": {
        "A1FT104_A": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "A1FT104B": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
    },
    "Furnace Pressure": {
        "A1PT119A": None,
        "A1PT119B": None
    },
    "Bed Pressure": {
        "A1PdT135A": None,
        "A1PdT135B": None
    },
    "Bed Temperature": {
        "A1TE115A": None,
        "A1TE115B": None,
        "A1TE115C": None,
        "A1TE115D": None
    },

    "Furnace Temperature": {
        "A1TE118A": None,
        "A1TE118B": None
    },
    "SH Spray Water Flow": {
        "A1FT103A_1": None,
        "A1FT103B_1": None
    },

    # N/A
    "Bed Temperature plus": None,
    "Main Steam Pressure": None,
    "Feed Water Pressure": None,
    "SH Spray Water Pressure": None,
    "Main Steam Temperature": None,
    "Feed Water Temperature": None,
    "SH Spray Temperature": None,
    "Main Steam Flow": None,
    "Feed Water Flow": None,
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
    'FDF Fan Air Flow Calc': None,
    "SA Heater Out Press": None,
    "Total Secondary Air Flow": None,
    "Total Secondary Air Flow plus": None,
    "Reheat Spray Water Flow": None,
    "Reheat Steam Flow": None,
    "Mill A Outlet Temperature": None,
    "Mill B Outlet Temperature": None,
    "Mill C Outlet Temperature": None,
    "Mill D Outlet Temperature": None,
    "Mill E Outlet Temperature": None,
    "Mill F Outlet Temperature": None,
    "Cold Reheat Steam Pressure": None,
    "Cold Reheat Steam Temperature": None,
    "Hot Reheat Steam Pressure": None,
    "Hot Reheat Steam Temperature": None,
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
    "Bed Pressure plus": None,
    "Furnace Temperature plus": None,
    "Stack NOx": None,
    "Stack CO": None,
}

TAGS_TO_ACTIONS = {
    "CONST_LIMITS": {
        "Furnace Pressure": lambda current_x, delta_x: (-500 <= current_x + delta_x) & (current_x + delta_x <= 50),
        "Excess Oxygen Sensor": lambda current_x, delta_x: (2 <= current_x + delta_x),
        "Efficiency Nominal": lambda current_x, delta_x: (current_x + delta_x > 0) & (current_x + delta_x < 100),
    },
    "MODELLING_CONSTRAINT_FILTER": {
        # These constraints are based on thresholds for operationability of the boiler and concern training data
        # filtering and used only if they are in MODELLING_CONSTRAINT_VARIABLES Tag Group Mapping
        "Generator Gross Load": lambda x: x >= 10,
        "Efficiency Nominal": lambda x: (x > 0) & (x < 100),
        "Excess Oxygen Sensor": lambda x: (x > 1) & (x < 15)
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
        "Excess Oxygen Sensor": lambda x: x < 2,
        "Efficiency Nominal": lambda x: x > 100,
    }
}

TAG_GROUP_MAP = {
    "RECOMMENDATION_MV_VARIABLES": {
        "Total Secondary Air Flow Sides Sum"
    },

    "RECOMMENDATION_TARGET_VARIABLES": {
        "Efficiency Nominal"
    },
    "RECOMMENDATION_DIRECTION_VARIABLES": {
        "Excess Oxygen Sensor"
    },

    "DV_VARIABLES": {
        "Coal Flow",
        "Generator Gross Load",
        "Total Primary Air Flow"
    },
    "MV_DEPENDENT_CONSTRAINTS": {
        "Furnace Pressure",
    },
    "MODELLING_CONSTRAINT_VARIABLES": {
        "Generator Gross Load",
        "Efficiency Nominal",
        "Excess Oxygen Sensor"
    },
    "MODELLED_TAGS": {},
    "IGNORED_TAGS": {
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
        'FDF Fan Air Flow Calc',
        "SA Heater Out Press",
        "Total Secondary Air Flow",
        "Total Secondary Air Flow plus",
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
        "Bed Pressure plus",
        "Furnace Temperature plus",
        "Stack NOx",
        "Stack CO",
        "Bed Temperature plus",
        "Main Steam Pressure",
        "Feed Water Pressure",
        "SH Spray Water Pressure",
        "Main Steam Temperature",
        "Feed Water Temperature",
        "SH Spray Temperature",
        "Main Steam Flow",
        "Feed Water Flow"
    }
}
