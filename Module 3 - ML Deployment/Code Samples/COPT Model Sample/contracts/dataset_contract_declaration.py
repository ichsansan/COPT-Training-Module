from tag_contract_factory import DatasetTagAssociationKind


TAG_TO_ASSOCIATION_KIND = {
    # Custom Formula associations
    "Coal HHV": DatasetTagAssociationKind.CustomFormulaPriorMapping,
    "Efficiency": DatasetTagAssociationKind.CustomFormulaPostMapping,
    "Efficiency Nominal": DatasetTagAssociationKind.Single,

    # Multiple associations
    "Main Steam Temperature": DatasetTagAssociationKind.MultipleAverage,
    "Feed Water Temperature": DatasetTagAssociationKind.MultipleAverage,
    "Feed Water Pressure": DatasetTagAssociationKind.MultipleAverage,

    "Cold Reheat Steam Pressure": DatasetTagAssociationKind.MultipleAverage,
    "Cold Reheat Steam Temperature": DatasetTagAssociationKind.MultipleAverage,

    "Total Secondary Air Flow": DatasetTagAssociationKind.MultipleSum,
    "Total Secondary Air Flow plus": DatasetTagAssociationKind.MultipleSum,
    "Total Secondary Air Flow Sides": DatasetTagAssociationKind.MultipleAverage,

    "Total Secondary Air Flow Avg": DatasetTagAssociationKind.MultipleAverage,
    "Total Secondary Air Flow plus Avg": DatasetTagAssociationKind.MultipleAverage,
    "Total Secondary Air Flow Sides Sum": DatasetTagAssociationKind.CustomFormulaPostMapping,
    "FDF Fan Air Flow Calc": DatasetTagAssociationKind.MultipleSum,

    "Total Primary Air Flow": DatasetTagAssociationKind.MultipleSum,

    "SH Spray Water Flow": DatasetTagAssociationKind.MultipleSum,
    "SH Spray Water Pressure": DatasetTagAssociationKind.MultipleAverage,

    "Reheat Spray Water Flow": DatasetTagAssociationKind.MultipleSum,
    "Reheat Steam Flow": DatasetTagAssociationKind.MultipleAverage,

    "Excess Oxygen Sensor": DatasetTagAssociationKind.MultipleAverage,

    "Feed Water Flow": DatasetTagAssociationKind.MultipleAverage,

    "Mill A Outlet Temperature": DatasetTagAssociationKind.MultipleAverage,
    "Mill B Outlet Temperature": DatasetTagAssociationKind.MultipleAverage,
    "Mill C Outlet Temperature": DatasetTagAssociationKind.MultipleAverage,
    "Mill D Outlet Temperature": DatasetTagAssociationKind.MultipleAverage,
    "Mill E Outlet Temperature": DatasetTagAssociationKind.MultipleAverage,
    "Mill F Outlet Temperature": DatasetTagAssociationKind.MultipleAverage,

    "Windbox-to-Furnace Diff. Press A": DatasetTagAssociationKind.MultipleAverage,
    "Windbox-to-Furnace Diff. Press B": DatasetTagAssociationKind.MultipleAverage,

    "Furnace Temperature": DatasetTagAssociationKind.MultipleAverage,
    "Furnace Temperature plus": DatasetTagAssociationKind.Single,
    "Furnace Pressure": DatasetTagAssociationKind.MultipleAverage,

    "Coal Flow": DatasetTagAssociationKind.MultipleSum,

    "Bed Pressure": DatasetTagAssociationKind.MultipleAverage,
    "Bed Pressure plus": DatasetTagAssociationKind.MultipleAverage,
    "Bed Temperature": DatasetTagAssociationKind.MultipleAverage,
    "Bed Temperature plus": DatasetTagAssociationKind.MultipleAverage,

    # Single Associations
    "Excess Oxygen A Side 1": DatasetTagAssociationKind.Single,
    "Excess Oxygen A Side 2": DatasetTagAssociationKind.Single,
    "Excess Oxygen B Side 1": DatasetTagAssociationKind.Single,
    "Excess Oxygen B Side 2": DatasetTagAssociationKind.Single,

    "PA Heater Out Press": DatasetTagAssociationKind.Single,
    "Stack NOx": DatasetTagAssociationKind.Single,
    "Stack CO": DatasetTagAssociationKind.Single,

    "Main Steam Pressure": DatasetTagAssociationKind.Single,
    "Main Steam Flow": DatasetTagAssociationKind.Single,

    "Hot Reheat Steam Pressure": DatasetTagAssociationKind.Single,
    "Hot Reheat Steam Temperature": DatasetTagAssociationKind.Single,


    "Reheat Spray Temperature": DatasetTagAssociationKind.Single,
    "Reheat Spray Water Pressure": DatasetTagAssociationKind.Single,

    "Over-Fire-Air Dampers 1": DatasetTagAssociationKind.MultipleAverage,
    "Over-Fire-Air Dampers 2": DatasetTagAssociationKind.MultipleAverage,
    "Over-Fire-Air Dampers 3": DatasetTagAssociationKind.MultipleAverage,
    "Over-Fire-Air Dampers 4": DatasetTagAssociationKind.MultipleAverage,

    "Burner Tilt Position 1L": DatasetTagAssociationKind.MultipleAverage,
    "Burner Tilt Position 1R": DatasetTagAssociationKind.MultipleAverage,
    "Burner Tilt Position 2L": DatasetTagAssociationKind.MultipleAverage,
    "Burner Tilt Position 2R": DatasetTagAssociationKind.MultipleAverage,
    "Burner Tilt Position 3L": DatasetTagAssociationKind.MultipleAverage,
    "Burner Tilt Position 3R": DatasetTagAssociationKind.MultipleAverage,
    "Burner Tilt Position 4L": DatasetTagAssociationKind.MultipleAverage,
    "Burner Tilt Position 4R": DatasetTagAssociationKind.MultipleAverage,

    "SH Spray Temperature": DatasetTagAssociationKind.Single,

    "Generator Gross Load": DatasetTagAssociationKind.Single,
    "SA Heater Out Press": DatasetTagAssociationKind.Single,
    
}

TAG_ACTIONS = {
    "CONST_LIMITS",
    "MODELLING_CONSTRAINT_FILTER",
    "TARGET_LIMITS",
    "RESCALE_SENSOR"
}

TAG_GROUPS = {
    "RECOMMENDATION_MV_VARIABLES",
    "RECOMMENDATION_TARGET_VARIABLES",
    "RECOMMENDATION_DIRECTION_VARIABLES",
    "DV_VARIABLES",
    "MV_DEPENDENT_CONSTRAINTS",
    "MODELLING_CONSTRAINT_VARIABLES",
    "MODELLED_TAGS",
    "IGNORED_TAGS",
}
