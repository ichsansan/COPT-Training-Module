import sys

if "../../../../actions" not in sys.path:
    sys.path.append("../../../../actions")

from actions.model_contract_action_implementations import pin_model_associations

TAG_ASSOCIATIONS = {
    "Generative Model": pin_model_associations(
        general_hyper_para={
            "additional_variables": ["Excess Oxygen Sensor"],
            "efficiency_generative": False,
        },
        label_hyper_para={
            # Condition variables
            "Burner Tilt Position 1L": {'colsample_bytree': 0.8,
                                        'gamma': 1,
                                        'learning_rate': 0.1,
                                        'min_child_weight': 1,
                                        'n_estimators': 100,
                                        'objective': 'reg:squarederror',
                                        'seed': 12,
                                        'subsample': 0.5,
                                        "retain_zero_ratio": 0.1,
                                        "near_zero_tolerance": 0.5,
                                        'alpha': 0.001
                                        },
            "Burner Tilt Position 1R": {'colsample_bytree': 0.8,
                                        'gamma': 1,
                                        'learning_rate': 0.1,
                                        'min_child_weight': 1,
                                        'n_estimators': 100,
                                        'objective': 'reg:squarederror',
                                        'seed': 12,
                                        'subsample': 0.5,
                                        "retain_zero_ratio": 0.8,
                                        "near_zero_tolerance": 0.6,
                                        'alpha': 0.001
                                        },

            "Total Secondary Air Flow": {'colsample_bytree': 0.8,
                                         'gamma': 1,
                                         'learning_rate': 0.1,
                                         'min_child_weight': 1,
                                         'n_estimators': 100,
                                         'objective': 'reg:squarederror',
                                         'seed': 12,
                                         'subsample': 0.5,
                                         "retain_zero_ratio": 0.8,
                                         "near_zero_tolerance": 0.6,
                                         'alpha': 0.001
                                         },
            "Furnace Pressure": {'colsample_bytree': 0.8,
                                 'gamma': 1,
                                 'learning_rate': 0.1,
                                 'min_child_weight': 1,
                                 'n_estimators': 100,
                                 'objective': 'reg:squarederror',
                                 'seed': 12,
                                 'subsample': 0.5,
                                 "retain_zero_ratio": 0.8,
                                 "near_zero_tolerance": 0.6,
                                 'alpha': 0.001
                                 }
        },
        flat_association_tags={},
        timeserie_input_tags={"Excess Oxygen Sensor": {},
                              "Total Primary Air Flow": {},
                              "Coal Flow": {},
                              "Generator Gross Load": {},
                              "Total Secondary Air Flow": {},
                              "FDF Fan Air Flow Calc": {},
                              "Bed Temperature": {},
                              "Windbox-to-Furnace Diff. Press A": {},
                              "Furnace Pressure": {}}
    ),

    "Excess Oxygen Forecaster": pin_model_associations(
        label_hyper_para={"Excess Oxygen Sensor": {}},
        flat_association_tags={},
        timeserie_input_tags={"Excess Oxygen Sensor": {},
                              "Total Primary Air Flow": {},
                              "Coal Flow": {},
                              "Generator Gross Load": {},
                              "Total Secondary Air Flow": {},
                              "FDF Fan Air Flow Calc": {},
                              "Bed Temperature": {},
                              "Windbox-to-Furnace Diff. Press A": {},
                              "Furnace Pressure": {}}
    ),
    "Efficiency Forecaster": pin_model_associations(
        label_hyper_para={"Efficiency Nominal": {}},
        flat_association_tags={},
        timeserie_input_tags={"Excess Oxygen Sensor": {},
                              "Total Primary Air Flow": {},
                              "Coal Flow": {},
                              "Generator Gross Load": {},
                              "Total Secondary Air Flow": {},
                              "FDF Fan Air Flow Calc": {},
                              "Bed Temperature": {},
                              "Windbox-to-Furnace Diff. Press A": {},
                              "Furnace Pressure": {}}
    )
}

TAGS_TO_ACTIONS = {
    "GET_SWEET_SPOT": {
        "Excess Oxygen Forecaster": {
            "Excess Oxygen Sensor": 2.5,
        }
    }
}

TAG_GROUP_MAP = {
    "GENERATIVE_MODELS": {"Generative Model"},
    "FORECASTING_MODELS": {"Excess Oxygen Forecaster", "Efficiency Forecaster"},
    "IGNORED_TAGS": {
        "Efficiency Forecaster"
    }
}
