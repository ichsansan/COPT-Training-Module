from tag_contract_factory import ModelTagAssociationKind


TAG_TO_ASSOCIATION_KIND = {
    # Custom Formula associations
    "Generative Model": ModelTagAssociationKind.MultipleModel,
    "Efficiency Forecaster": ModelTagAssociationKind.SingleModel,

    # Multiple associations
    "Excess Oxygen Forecaster": ModelTagAssociationKind.SingleModel
}

TAG_ACTIONS = {
    "GET_SWEET_SPOT"
}

TAG_GROUPS = {
    "GENERATIVE_MODELS",
    "FORECASTING_MODELS",
    "IGNORED_TAGS"
}
