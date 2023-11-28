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
            "FDF Fan Air Flow Calc": {'colsample_bytree': 0.8,
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
            "Burner Tilt Position 2L": {'colsample_bytree': 0.8,
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
            "Burner Tilt Position 2R": {'colsample_bytree': 0.8,
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
            "Burner Tilt Position 3L": {'colsample_bytree': 0.8,
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
            "Burner Tilt Position 3R": {'colsample_bytree': 0.8,
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
            "Burner Tilt Position 4L": {'colsample_bytree': 0.8,
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
            "Burner Tilt Position 4R": {'colsample_bytree': 0.8,
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
            "Total Secondary Air Flow Sides Sum": {'colsample_bytree': 0.8,
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

            "Windbox-to-Furnace Diff. Press A": {'colsample_bytree': 0.8,
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
            "Windbox-to-Furnace Diff. Press B": {'colsample_bytree': 0.8,
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
        timeserie_input_tags={"Burner Tilt Position 1L": {},
                              "Burner Tilt Position 1R": {},
                              "Burner Tilt Position 2L": {},
                              "Burner Tilt Position 2R": {},
                              "Burner Tilt Position 3L": {},
                              "Burner Tilt Position 3R": {},
                              "Burner Tilt Position 4L": {},
                              "Burner Tilt Position 4R": {},
                              "Total Secondary Air Flow": {},
                              "FDF Fan Air Flow Calc": {},
                              "Windbox-to-Furnace Diff. Press A": {},
                              "Windbox-to-Furnace Diff. Press B": {},
                              "Furnace Pressure": {}}
    ),

    "Excess Oxygen Forecaster": pin_model_associations(
        label_hyper_para={"Excess Oxygen Sensor": {}},
        flat_association_tags={},
        timeserie_input_tags={'Feed Water Flow': {},
                              'SH Spray Water Flow': {},
                              'Reheat Spray Water Flow': {},
                              'Main Steam Flow': {},
                              'Steam Drum Pressure': {},
                              'Main Steam Pressure': {},
                              'Cold Reheat Steam Pressure': {},
                              'Feed Water Pressure': {},
                              'SH Spray Water Pressure': {},
                              'Hot Reheat Steam Pressure': {},
                              'Cold Reheat Steam Temperature': {},
                              'SH Spray Temperature': {},
                              'Feed Water Temperature': {},
                              'Hot Reheat Steam Temperature': {},
                              'Main Steam Temperature': {},
                              'Coal Flow': {},
                              'Hot Reheat Steam Flow': {}}
    ),
    "Efficiency Forecaster": None
}

TAGS_TO_ACTIONS = {
    "GET_SWEET_SPOT": {
        "Excess Oxygen Forecaster": {
            "Excess Oxygen Sensor": 3,
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
