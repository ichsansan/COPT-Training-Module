import sys

if "../../../../actions" not in sys.path:
    sys.path.append("../../../../actions")

from actions.model_contract_action_implementations import pin_model_associations

TAG_ASSOCIATIONS = {
    # Custom Formula associations
    "Generative Model": pin_model_associations(
        general_hyper_para={
            "additional_variables": ["Excess Oxygen A Side 1"],
            "efficiency_generative": False,

            "recommendation_condition_variable": "Generator Gross Load",
            "min_rcv": 15,
            "max_rcv": 350

        },
        label_hyper_para={
            # Condition variables
            "SA Heater Out Press": {'colsample_bytree': 0.8,
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
                                 },
            "Furnace Temperature": {'colsample_bytree': 0.8,
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
            "Furnace Temperature plus": {'colsample_bytree': 0.8,
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
            "Bed Pressure": {'colsample_bytree': 0.8,
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
            "Bed Pressure plus": {'colsample_bytree': 0.8,
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
            "Bed Temperature": {'colsample_bytree': 0.8,
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
            "Bed Temperature plus": {'colsample_bytree': 0.8,
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
        timeserie_input_tags={"Total Secondary Air Flow": {},
                              "Windbox-to-Furnace Diff. Press A": {},
                              "Windbox-to-Furnace Diff. Press B": {},
                              "Furnace Pressure": {},
                              "Furnace Temperature": {}}
    ),

    # Multiple associations
    "Excess Oxygen Forecaster": pin_model_associations(
        label_hyper_para={'Excess Oxygen B Side 1': {}},
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
    "Efficiency Forecaster": None,
}

TAGS_TO_ACTIONS = {
    "GET_SWEET_SPOT": {
        "Excess Oxygen Forecaster": {
            "Excess Oxygen A Side 1": 4,
            "Excess Oxygen B Side 1": 4
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
