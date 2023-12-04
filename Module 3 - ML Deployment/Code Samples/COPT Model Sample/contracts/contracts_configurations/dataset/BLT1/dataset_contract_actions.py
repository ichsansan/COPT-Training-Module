import sys

if "../../actions" not in sys.path:
    sys.path.append("../../actions")

TAG_ASSOCIATIONS = {
    # Custom Formula associations - N/A

    # Single associations
    #"Efficiency Nominal": {"Efficiency": None},
    "Efficiency Nominal": None,
    "Excess Oxygen Sensor": {"DPU_1_A:222": None},

    "Main Steam Pressure": {"DPU_1_A:15": None},
    "SH Spray Temperature": {"DPU_3_A:276": None},
    "Main Steam Flow": {"DPU_1_A:750": None},
    "Feed Water Flow": {"DPU_1_A:744": None},
    "Main Steam Temperature": {"DPU_1_A:369": None},
    "Feed Water Temperature": {"DPU_1_A:786": None},
    "Generator Gross Load": {"DPU_3_A:522": None},

    # Multiple associations
    "FDF Fan Air Flow Calc": {
        "DPU_1_A:780": None,
        "DPU_1_A:483": None
    },
    "SH Spray Water Flow": {
        "DPU_1_A:756": None,
        "DPU_1_A:759": None
    },
    "Feed Water Pressure": {
        "DPU_2_A:15": None,
        "DPU_2_A:18": None,
        "DPU_2_A:483": None
    },

    "SH Spray Water Pressure": {
        "DPU_2_A:15": None,
        "DPU_2_A:18": None,
        "DPU_2_A:483": None,
    },

    "Total Secondary Air Flow": {
        "DPU_1_A:714": None,
        "DPU_1_A:717": None
    },

    "Coal Flow": {
        "DPU_1_A:246": None,
        "DPU_1_A:282": None,
        "DPU_1_A:291": None
    },

    "Total Primary Air Flow": {
        "DPU_1_A:708": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "DPU_1_A:711": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
    },

    "Furnace Pressure": {
        #"DPU_1_A:33": None, commented out due to 
        "DPU_1_A:75": None
    },

    "Windbox-to-Furnace Diff. Press A": {
        "DPU_1_A:99": None,
        "DPU_1_A:141": None
    },

    "Bed Pressure": {
        "DPU_1_A:102": None,
        "DPU_1_A:144": None
    },

    "Bed Temperature": {
        "DPU_1_A:393": None,
        "DPU_1_A:453": None,
        "DPU_1_A:396": None,
        "DPU_1_A:450": None
    },
    "Bed Temperature plus": {
        "DPU_1_A:420": None,
        "DPU_1_A:408": None
    },
    "Furnace Temperature": {
        "DPU_1_A:399": None,
        "DPU_1_A:426": None
    },

    # N/A
    "Total Secondary Air Flow Sides Sum": None,
    "Total Secondary Air Flow Sides": None,
    "Coal HHV": None,
    "PA Heater Out Press": None,
    "Efficiency": None,
    "Excess Oxygen A Side 2": None,
    "Excess Oxygen B Side 2": None,
    "Excess Oxygen A Side 1": None,
    "Excess Oxygen B Side 1": None,
    "Total Secondary Air Flow Avg": None,
    "Total Secondary Air Flow plus Avg": None,
    "SA Heater Out Press": None,
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
    "Windbox-to-Furnace Diff. Press B": None,
    "Stack NOx": None,
    "Stack CO": None
}

TAGS_TO_ACTIONS = {
    "CONST_LIMITS": {
        "Furnace Pressure": lambda current_x, delta_x: (current_x + delta_x > -150) & (current_x + delta_x < 10),
        "Excess Oxygen Sensor": lambda current_x, delta_x: (current_x + delta_x >= 3),
        "Bed Temperature": lambda current_x, delta_x: (current_x + delta_x > 400) & (current_x + delta_x < 1000),
        #"Efficiency Nominal": lambda current_x, delta_x: (current_x + delta_x > 0) & (current_x + delta_x < 100),
    },
    "MODELLING_CONSTRAINT_FILTER": {
        # These constraints are based on thresholds for operationability of the boiler and concern training data
        # filtering and used only if they are in MODELLING_CONSTRAINT_VARIABLES Tag Group Mapping
        "Generator Gross Load": lambda x: x >= 10,
        "Excess Oxygen Sensor": lambda x: (x > 1) & (x < 12)
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
        "Excess Oxygen Sensor": lambda x: (x > 3) & (x <= 3.5),
        #"Efficiency Nominal": lambda x: x > 95,
    }
}

TAG_GROUP_MAP = {
    "RECOMMENDATION_MV_VARIABLES": {
        "Total Secondary Air Flow"
    },

    "RECOMMENDATION_TARGET_VARIABLES": {
        "Excess Oxygen Sensor"
    },
    "RECOMMENDATION_DIRECTION_VARIABLES": {},

    "DV_VARIABLES": {
        "Coal Flow",
        "Generator Gross Load",
        "Total Primary Air Flow",
        "Bed Pressure",
        "Bed Temperature plus",
        "FDF Fan Air Flow Calc",
        "Furnace Temperature",
        "Windbox-to-Furnace Diff. Press A"
    },
    "MV_DEPENDENT_CONSTRAINTS": {
        "Furnace Pressure",
        "Bed Temperature"
    },
    "MODELLING_CONSTRAINT_VARIABLES": {
        "Generator Gross Load",
        "Excess Oxygen Sensor"
    },
    "MODELLED_TAGS": {},
    "IGNORED_TAGS": {
        "Coal HHV",
        "PA Heater Out Press",
        "Efficiency",
        "Efficiency Nominal",
        "Excess Oxygen A Side 2",
        "Excess Oxygen B Side 2",
        "Excess Oxygen A Side 1",
        "Excess Oxygen B Side 1",
        "Total Secondary Air Flow Avg",
        "Total Secondary Air Flow plus Avg",
        "SA Heater Out Press",
        "Total Secondary Air Flow Sides",
        "Total Secondary Air Flow Sides Sum",
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
        "Windbox-to-Furnace Diff. Press B",
        "Stack NOx",
        "Stack CO"
    }
}
