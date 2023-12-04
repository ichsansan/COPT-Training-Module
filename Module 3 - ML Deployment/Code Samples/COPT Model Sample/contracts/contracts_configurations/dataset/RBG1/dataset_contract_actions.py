import sys

if "../../actions" not in sys.path:
    sys.path.append("../../actions")

TAG_ASSOCIATIONS = {

    # Custom Formula associations
    "Efficiency": None,
    "Coal HHV": None,
    "Stack NOx": None,
    "Stack CO": None,
    "Bed Temperature": None,
    "Furnace Temperature": None,
    "Furnace Temperature plus": None,
    "Bed Pressure": None,
    "Bed Pressure plus": None,
    "Bed Temperature plus": None,
    'SA Heater Out Press': None,
    'Excess Oxygen A Side 1': None,
    'Excess Oxygen A Side 2': None,
    'Excess Oxygen B Side 1': None,
    'Excess Oxygen B Side 2': None,
    'FDF Fan Air Flow Calc': None,
    "Mill F Outlet Temperature": None,
    "Total Secondary Air Flow Sides": None,
    "Burner Tilt Position 2L": None,
    "Burner Tilt Position 3L": None,
    "Burner Tilt Position 4L": None,
    "Burner Tilt Position 2R": None,
    "Burner Tilt Position 3R": None,
    "Burner Tilt Position 4R": None,
    "SH Spray Water Pressure": None,
    "SH Spray Temperature": None,
    "Feed Water Pressure": None,
    "Feed Water Temperature": None,
    "Reheat Steam Flow": None,
    "Main Steam Pressure": None,
    "Main Steam Flow": None,
    "Hot Reheat Steam Pressure": None,
    "Hot Reheat Steam Temperature": None,
    "Reheat Spray Temperature": None,
    "Reheat Spray Water Pressure": None,
    "Over-Fire-Air Dampers 1": None,
    "Over-Fire-Air Dampers 2": None,
    "Over-Fire-Air Dampers 3": None,
    "Over-Fire-Air Dampers 4": None,
    "Mill A Outlet Temperature": None,
    "Mill B Outlet Temperature": None,
    "Mill C Outlet Temperature": None,
    "Mill D Outlet Temperature": None,
    "Mill E Outlet Temperature": None,
    "Windbox-to-Furnace Diff. Press A": None,
    "Windbox-to-Furnace Diff. Press B": None,
    "Cold Reheat Steam Pressure": None,
    "Cold Reheat Steam Temperature": None,

    # Multiple associations

    # MV
    "Burner Tilt Position 1L": {
        "OPC.2QDAS:ZT210705.PNT": None,
        "OPC.2QDAS:ZT210707.PNT": None,
        "OPC.2QDAS:ZT210801.PNT": None,
        "OPC.2QDAS:ZT210803.PNT": None
    },
    "Burner Tilt Position 1R": {
        "OPC.2QDAS:ZT210706.PNT": None,
        "OPC.2QDAS:ZT210708.PNT": None,
        "OPC.2QDAS:ZT210802.PNT": None,
        "OPC.2QDAS:ZT210804.PNT": None
    },
    "Total Secondary Air Flow Avg": {
        "OPC.AIRFLOW_1:HLACFA1.PNT": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "OPC.AIRFLOW_1:HLACFA2.PNT": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
    },
    "Total Secondary Air Flow plus Avg": {
        "OPC.AW1002.1E_AIRFLOW.FURB1AIN.PNT": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "OPC.AW1002.1E_AIRFLOW.FURB2AIN.PNT": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
    },

    # MV
    "Total Secondary Air Flow Sides Sum": lambda df_before, df_after:
        df_after["Total Secondary Air Flow Avg"].values + \
        df_after["Total Secondary Air Flow plus Avg"].values,

    "Total Secondary Air Flow": {
        "OPC.AIRFLOW_1:HLACFA1.PNT": None,
        "OPC.AIRFLOW_1:HLACFA2.PNT": None
    },

    "Total Secondary Air Flow plus": {
        "OPC.AIRFLOW_2:HLACFB1.PNT": None,
        "OPC.AIRFLOW_2:HLACFB2.PNT": None
    },

    "Main Steam Temperature": {
        "OPC.2PDAS:TE202806.PNT": None,
        "OPC.2PDAS:TE202807.PNT": None
    },

    "Total Primary Air Flow": {
        "OPC.MILLAHCAD_2:CALCA2.RO01": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "OPC.MILLAHCAD_2:CALCA3.RO01": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "OPC.MILLBHCAD_2:CALCA2.RO01": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "OPC.MILLBHCAD_2:CALCA3.RO01": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "OPC.MILLCHCAD_2:CALCA2.RO01": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "OPC.MILLCHCAD_2:CALCA3.RO01": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "OPC.MILLDHCAD_2:CALCA2.RO01": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "OPC.MILLDHCAD_2:CALCA3.RO01": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "OPC.MILLEHCAD_2:CALCA2.RO01": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5,
        "OPC.MILLEHCAD_2:CALCA3.RO01": lambda x, scale_back=False: x * 2 if scale_back else x * 0.5
    },

    "SH Spray Water Flow": {
        "OPC.2PDAS:FT201407.PNT": None,
        "OPC.2PDAS:FT201302.PNT": None,
        "OPC.2PDAS:FT201402.PNT": None,
        "OPC.2PDAS:FT201303.PNT": None,
        "OPC.2PDAS:FT201403.PNT": None
    },

    "Reheat Spray Water Flow": {
        "OPC.2PDAS:FT201301.PNT": None,
        "OPC.2PDAS:FT201401.PNT": None,
        "OPC.2PDAS:FT201307.PNT": None
    },

    "Feed Water Flow": {
        "OPC.FWFLOW:FT200604C.PNT": None,
        "OPC.FWFLOW:FT200704C.PNT": None,
        "OPC.FWFLOW:FT200804C.PNT": None
    },

    # Single Associations
    "Efficiency Nominal": {"Efficiency": None},
    "Furnace Pressure": {"OPC.FURPRESS:AINFURPRE.PNT": None},
    "Coal Flow": {"OPC.FUELMASTER:AINCOAL.PNT": None},
    "PA Heater Out Press": {"OPC.AIRFLOW:MATH1.RO01": None},
    "Generator Gross Load": {"OPC.2SDAS:AI174108.PNT": None},
    "Excess Oxygen Sensor": {"OPC.OXYGEN:SIGSEL1.OUT": None},
}

TAGS_TO_ACTIONS = {
    "CONST_LIMITS": {
        # These constraint is the value before rescaled, if rescaled change to commented value
        "Furnace Pressure": lambda current_x, delta_x: (-2500 <= current_x + delta_x) & (current_x + delta_x <= 10),
        "Excess Oxygen Sensor": lambda current_x, delta_x: (1.5 <= current_x + delta_x) & (current_x + delta_x <= 20),
        "Total Secondary Air Flow Sides Sum": lambda current_x, delta_x: abs(delta_x) <= 0.15 * current_x,
        "Generator Gross Load": lambda current_x, delta_x: current_x + delta_x >= 220,
        "Efficiency Nominal": lambda current_x, delta_x: (current_x + delta_x > 0) & (current_x + delta_x < 100),
    },
    "MODELLING_CONSTRAINT_FILTER": {
        # These constraints are based on thresholds for operationability of the boiler and concern training data
        # filtering and used only if they are in MODELLING_CONSTRAINT_VARIABLES Tag Group Mapping
        "Generator Gross Load": lambda x: x >= 175,
        "Efficiency Nominal": lambda x: (x > 0) & (x < 100),
        "Excess Oxygen Sensor": lambda x: (x > 1) & (x < 12)
    },
    "RESCALE_SENSOR": {
        "Coal Flow": lambda x, scale_back=False: x * 3.6 if scale_back else x * 0.27777777777,
        "Furnace Pressure": lambda x, scale_back=False: x * 9.80665 if scale_back else x * 0.10197,
    },
    "TARGET_LIMITS": {
        "Excess Oxygen Sensor": lambda x: x < 2,
        "Efficiency Nominal": lambda x: x > 100,
    },
}

TAG_GROUP_MAP = {
    "RECOMMENDATION_MV_VARIABLES": {
        "PA Heater Out Press",
        "Burner Tilt Position 1L",
        "Burner Tilt Position 1R",
        "Total Secondary Air Flow Sides Sum",
    },

    # For now, without the efficiency calculation, Excess Oxygen becomes target instead of direction variable
    "RECOMMENDATION_TARGET_VARIABLES": {
        "Efficiency Nominal"
    },
    "RECOMMENDATION_DIRECTION_VARIABLES": {
        "Excess Oxygen Sensor"
    },
    "DV_VARIABLES": {
        "Coal Flow",
        "Total Primary Air Flow",
        "Total Secondary Air Flow",
        "Total Secondary Air Flow plus",
        "Generator Gross Load"
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
        "Efficiency",
        "Burner Tilt Position 2L",
        "Burner Tilt Position 3L",
        "Burner Tilt Position 4L",
        "Burner Tilt Position 2R",
        "Burner Tilt Position 3R",
        "Burner Tilt Position 4R",
        'Excess Oxygen A Side 1',
        'Excess Oxygen A Side 2',
        'Excess Oxygen B Side 1',
        'Excess Oxygen B Side 2',
        "Furnace Temperature plus",
        "Bed Pressure",
        "Bed Pressure plus",
        "Bed Temperature plus",
        'SA Heater Out Press',
        "Coal HHV",
        "Reheat Steam Flow",
        "Stack NOx",
        "Stack CO",
        "Bed Temperature",
        "Furnace Temperature",
        "Total Secondary Air Flow Sides",
        'FDF Fan Air Flow Calc',
        "Mill F Outlet Temperature",
        "Main Steam Pressure",
        "Main Steam Flow",
        "Reheat Steam Flow",
        "Main Steam Pressure",
        "Main Steam Flow",
        "Hot Reheat Steam Pressure",
        "Hot Reheat Steam Temperature",
        "Reheat Spray Temperature",
        "Reheat Spray Water Pressure",
        "SH Spray Water Pressure",
        "SH Spray Temperature",
        "Feed Water Pressure",
        "Feed Water Temperature",
        "Over-Fire-Air Dampers 1",
        "Over-Fire-Air Dampers 2",
        "Over-Fire-Air Dampers 3",
        "Over-Fire-Air Dampers 4",
        "Mill A Outlet Temperature",
        "Mill B Outlet Temperature",
        "Mill C Outlet Temperature",
        "Mill D Outlet Temperature",
        "Mill E Outlet Temperature",
        "Windbox-to-Furnace Diff. Press A",
        "Windbox-to-Furnace Diff. Press B",
        "Cold Reheat Steam Pressure",
        "Cold Reheat Steam Temperature",
    },
}
