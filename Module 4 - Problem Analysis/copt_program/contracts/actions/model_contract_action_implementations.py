from typing import Dict, Any, Optional

LABEL_ASSOCIATION_TAG = "labels"
TIMESERIE_INPUT_ASSOCIATION_TAG = "timeserie_inputs"
FLAT_INPUT_ASSOCIATION_TAG = "flat_inputs"
GENERAL_ASSOCIATION_TAG = "general"


def pin_model_associations(
        general_hyper_para: Optional[Dict[str, Any]] = None,
        label_hyper_para: Optional[Dict[str, Dict[str, Any]]] = None,
        flat_association_tags: Optional[Dict[str, Dict[str, Any]]] = None,
        timeserie_input_tags: Optional[Dict[str, Dict[str, Any]]] = None) -> Dict[str, Dict[str, Dict[str, Any]]]:

    return {
        GENERAL_ASSOCIATION_TAG: general_hyper_para if general_hyper_para is not None else dict(),
        LABEL_ASSOCIATION_TAG: label_hyper_para if label_hyper_para is not None else dict(),
        FLAT_INPUT_ASSOCIATION_TAG: flat_association_tags if flat_association_tags is not None else dict(),
        TIMESERIE_INPUT_ASSOCIATION_TAG: timeserie_input_tags if timeserie_input_tags is not None else dict()
    }
