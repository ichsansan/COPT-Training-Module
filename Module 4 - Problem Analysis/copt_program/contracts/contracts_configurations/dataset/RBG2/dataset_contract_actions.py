import sys

if "../../actions" not in sys.path:
    sys.path.append("../../actions")

TAG_ASSOCIATIONS = {

    # Custom Formula associations
    "Coal HHV": None,
    "Efficiency": None,
    "Efficiency Nominal": None,

    "Stack NOx": None,
    "Stack CO": None,
    "Bed Temperature": None,
    "Furnace Temperature": None,
    "Total Secondary Air Flow plus": None,
    "Furnace Temperature plus": None,
    "Bed Pressure": None,
    "Bed Pressure plus": None,
    "Bed Temperature plus": None,
    'SA Heater Out Press': None,
    'PA Heater Out Press': None,
    'Excess Oxygen A Side 1': None,
    'Excess Oxygen A Side 2': None,
    'Excess Oxygen B Side 1': None,
    'Excess Oxygen B Side 2': None,
    "Total Secondary Air Flow Avg": None,
    "Total Secondary Air Flow plus Avg": None,
    "Total Secondary Air Flow Sides Sum": None,
    "Total Secondary Air Flow Sides": None,
    'FDF Fan Air Flow Calc': None,

    # Multiple associations
    "Main Steam Temperature": {
        "OPC.1PDAS:TE202806.PNT": None,
        "OPC.1PDAS:TE202807.PNT": None
    },

    "Total Secondary Air Flow": {
        "OPC.1AIRFLOW_1:HLACFA1.PNT": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "OPC.1AIRFLOW_1:HLACFA2.PNT": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "OPC.1AIRFLOW_2:HLACFB1.PNT": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "OPC.1AIRFLOW_2:HLACFB2.PNT": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5
    },
    "Total Primary Air Flow": {
        "OPC.1MILLAHCAD_2:CALCA2.RO01": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "OPC.1MILLAHCAD_2:CALCA3.RO01": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "OPC.1MILLBHCAD_2:CALCA2.RO01": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "OPC.1MILLBHCAD_2:CALCA3.RO01": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "OPC.1MILLCHCAD_2:CALCA2.RO01": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "OPC.1MILLCHCAD_2:CALCA3.RO01": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "OPC.1MILLDHCAD_2:CALCA2.RO01": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "OPC.1MILLDHCAD_2:CALCA3.RO01": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "OPC.1MILLEHCAD_2:CALCA2.RO01": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "OPC.1MILLEHCAD_2:CALCA3.RO01": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5
    },

    "SH Spray Water Flow": {
        "OPC.1PDAS:FT201407.PNT": None,
        "OPC.1PDAS:FT201302.PNT": None,
        "OPC.1PDAS:FT201402.PNT": None,
        "OPC.1PDAS:FT201303.PNT": None,
        "OPC.1PDAS:FT201403.PNT": None
    },

    "Excess Oxygen Sensor": {
        "OPC.1OXYGEN:SIGSEL1.OUT": None
    },

    "Reheat Spray Water Flow": {
        "OPC.1PDAS:FT201301.PNT": None,
        "OPC.1PDAS:FT201401.PNT": None,
        "OPC.1PDAS:FT201307.PNT": None
    },

    "Reheat Steam Flow": None,

    "Feed Water Flow": {
        "OPC.1FWFLOW:FT200604C.PNT": None,
        "OPC.1FWFLOW:FT200704C.PNT": None,
        "OPC.1FWFLOW:FT200804C.PNT": None
    },

    "Mill A Outlet Temperature": {
        "OPC.1JDAS:RT130501.PNT": None,
        "OPC.1PDAS:RT201701.PNT": None,
        "OPC.1PDAS:RT201801.PNT": None
    },
    "Mill B Outlet Temperature": {
        "OPC.1JDAS:RT130504.PNT": None,
        "OPC.1PDAS:RT201702.PNT": None,
        "OPC.1PDAS:RT201802.PNT": None
    },
    "Mill C Outlet Temperature": {
        "OPC.1KDAS:RT140501.PNT": None,
        "OPC.1PDAS:RT201703.PNT": None,
        "OPC.1PDAS:RT201803.PNT": None
    },
    "Mill D Outlet Temperature": {
        "OPC.1KDAS:RT140504.PNT": None,
        "OPC.1PDAS:RT201704.PNT": None,
        "OPC.1PDAS:RT201804.PNT": None
    },
    "Mill E Outlet Temperature": {
        "OPC.1LDAS:RT150501.PNT": None,
        "OPC.1PDAS:RT201705.PNT": None,
        "OPC.1PDAS:RT201805.PNT": None
    },

    "Windbox-to-Furnace Diff. Press A": {
        "OPC.1PDAS:PT201502.PNT": None,
        "OPC.1PDAS:PT201602.PNT": None
    },
    "Windbox-to-Furnace Diff. Press B": {
        "OPC.1PDAS:PT201504.PNT": None,
        "OPC.1PDAS:PT201604.PNT": None
    },

    "Cold Reheat Steam Pressure": {
        "OPC.1ODAS:PT193102.PNT": None,
        "OPC.1ODAS:PT193103.PNT": None
    },
    "Cold Reheat Steam Temperature": {
        "OPC.1ODAS:TE193406.PNT": None,
        "OPC.1ODAS:TE193407.PNT": None
    },


    # Single Associations
    "Furnace Pressure": {"OPC.1FURPRESS:AINFURPRE.PNT": None},

    "Main Steam Pressure": {"OPC.1ODAS:PT193101.PNT": None},
    "Main Steam Flow": {"OPC.1MSTFLOW:CALCA2.RO01": None},

    "Hot Reheat Steam Pressure": {"OPC.1ODAS:PT193104.PNT": None},
    "Hot Reheat Steam Temperature": {"OPC.1ODAS:TE193503.PNT": None},

    "Coal Flow": {"OPC.1FUELMASTER:AINCOAL.PNT": None},
    "Reheat Spray Temperature": {"OPC.1ODAS:TE193504.PNT": None},
    "Reheat Spray Water Pressure": {"OPC.1ODAS:PT193105.PNT": None},

    "Over-Fire-Air Dampers 1": {"OPC.1QDAS:ZT210205.PNT": None},
    "Over-Fire-Air Dampers 2": {"OPC.1QDAS:ZT210402.PNT": None},
    "Over-Fire-Air Dampers 3": {"OPC.1QDAS:ZT210507.PNT": None},
    "Over-Fire-Air Dampers 4": {"OPC.1QDAS:ZT210704.PNT": None},

    "Burner Tilt Position 1L": {"OPC.1QDAS:ZT210705.PNT": None},
    "Burner Tilt Position 1R": {"OPC.1QDAS:ZT210706.PNT": None},
    "Burner Tilt Position 2L": {"OPC.1QDAS:ZT210707.PNT": None},
    "Burner Tilt Position 2R": {"OPC.1QDAS:ZT210708.PNT": None},
    "Burner Tilt Position 3L": {"OPC.1QDAS:ZT210801.PNT": None},
    "Burner Tilt Position 3R": {"OPC.1QDAS:ZT210802.PNT": None},
    "Burner Tilt Position 4L": {"OPC.1QDAS:ZT210803.PNT": None},
    "Burner Tilt Position 4R": {"OPC.1QDAS:ZT210804.PNT": None},

    "SH Spray Water Pressure": {"OPC.1ODAS:PT193106.PNT": None},
    "SH Spray Temperature": {"OPC.1ODAS:TE193505.PNT": None},

    "Feed Water Pressure": {"OPC.1ODAS:PT193201.PNT": None},
    "Feed Water Temperature": {"OPC.1PDAS:TE202808.PNT": None},

    "Generator Gross Load": {"OPC.1SDAS:AI174108.PNT": None},
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
        # "Excess Oxygen Sensor": lambda current_x, delta_x: (2 <= current_x + delta_x) & (current_x + delta_x <= 100),
        "Total Secondary Air Flow": lambda current_x, delta_x: abs(delta_x) <= 0.15 * current_x,
        "Generator Gross Load": lambda current_x, delta_x: current_x + delta_x >= 220
    },

    "MODELLING_CONSTRAINT_FILTER": {
        # These constraints are based on thresholds for operationability of the boiler and concern training data
        # filtering and used only if they are in MODELLING_CONSTRAINT_VARIABLES Tag Group Mapping
        "Generator Gross Load": lambda x: x >= 175
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
        "Excess Oxygen Sensor": lambda x: (x > 2) & (x <= 3.5)
    }
}

TAG_GROUP_MAP = {
    "RECOMMENDATION_MV_VARIABLES": {
        "Burner Tilt Position 1L",
        "Burner Tilt Position 1R",
        "Burner Tilt Position 2L",
        "Burner Tilt Position 2R",
        "Burner Tilt Position 3L",
        "Burner Tilt Position 3R",
        "Burner Tilt Position 4L",
        "Burner Tilt Position 4R",
        "Total Secondary Air Flow",
    },

    # For now, without the efficiency calculation, Excess Oxygen becomes target instead of direction variable
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
        'Excess Oxygen A Side 1',
        'Excess Oxygen A Side 2',
        'Excess Oxygen B Side 1',
        'Excess Oxygen B Side 2',
        "Total Secondary Air Flow plus",
        "Furnace Temperature plus",
        "Bed Pressure",
        "Bed Pressure plus",
        "Bed Temperature plus",
        'SA Heater Out Press',
        'PA Heater Out Press',
        "Coal HHV",
        "Efficiency",
        "Reheat Steam Flow",
        "Stack NOx",
        "Stack CO",
        "Bed Temperature",
        "Furnace Temperature",
        "Total Secondary Air Flow Avg",
        "Total Secondary Air Flow plus Avg",
        "Total Secondary Air Flow Sides Sum",
        "Total Secondary Air Flow plus",
        "Total Secondary Air Flow Sides",
    },
}
