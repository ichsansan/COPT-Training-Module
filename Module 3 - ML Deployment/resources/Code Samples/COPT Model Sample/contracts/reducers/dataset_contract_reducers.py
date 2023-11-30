import sys

if ".." not in sys.path:
    sys.path.append("..")

from tag_contract_factory import TagContract, DatasetTagAssociationKind
from typing import Union, List, Any, Dict
import numpy as np
import pandas as pd


def __combine_associated_elements(
        association_kind: DatasetTagAssociationKind,
        column_list: List[Union[float, np.ndarray]]) -> Union[None, np.ndarray]:

    column_count = len(column_list)

    if(column_count < 1):
        return None

    first_column = column_list[0]

    if association_kind == DatasetTagAssociationKind.Single:
        if column_count > 1:
            raise ValueError(
                "Association kind 'Single' requires only one column.")
        return first_column

    if association_kind == DatasetTagAssociationKind.MultipleSum:
        return np.sum(column_list, axis=0)

    if association_kind == DatasetTagAssociationKind.MultipleAverage:
        return np.mean(column_list, axis=0)

    return None


def __detect_and_label_outliers_as_nan(data, m=3):
    for column in data.columns:
        d = np.abs(data[column] - np.mean(data[column]))
        mdev = np.mean(d)
        s = d / mdev if mdev else np.zeros(d.shape)
        data.loc[s > m, column] = np.NaN

    return data


def __handle_nan_in_sensor_df(sensor_df: pd.DataFrame, act_on_na: bool):
    # Manual replacing for sensor we know the limits of
    if 'ZT1A011302_PNT' in sensor_df.columns:
        sensor_df.loc[sensor_df['ZT1A011302_PNT']
                      < 0, "ZT1A011302_PNT"] = np.NaN
    if 'ZT2A011302_PNT' in sensor_df.columns:
        sensor_df.loc[sensor_df['ZT2A011302_PNT']
                      < 0, "ZT2A011302_PNT"] = np.NaN
    if "V4::DPU1003.SH0067.AALM006701.PV" in sensor_df.columns:
        sensor_df.loc[sensor_df['V4::DPU1003.SH0067.AALM006701.PV']
                      == 0, "V4::DPU1003.SH0067.AALM006701.PV"] = np.NaN
    if "V4::DPU1003.SH0067.AALM006702.PV" in sensor_df.columns:
        sensor_df.loc[sensor_df['V4::DPU1003.SH0067.AALM006702.PV']
                      == 0, "V4::DPU1003.SH0067.AALM006702.PV"] = np.NaN

    # Replace the outliers with NaNs. This in necessary, in order to consolidate the all sources of bad values int NaN indicators.
    # TODO: Link statistics in a model contract for labelling such instances, as rather unseen by the models and in training data.
    # __detect_and_label_outliers_as_nan(sensor_df, 8)

    dataset_dates_set = set(sensor_df.index)
    all_dates = pd.Series(data=pd.date_range(
        start=sensor_df.index.min(), end=sensor_df.index.max(), freq='min'))
    mask = all_dates.isin(sensor_df.index)

    if all_dates[~mask].shape[0] > 0:
        all_data = np.empty((all_dates.shape[0], sensor_df.shape[1]))

        all_data[:] = np.nan
        for i in range(all_dates.shape[0]):
            date = all_dates[i]

            if date in dataset_dates_set:
                all_data[i, :] = sensor_df.loc[date].values

        sensor_df = pd.DataFrame(
            all_data, columns=sensor_df.columns, index=all_dates)

    if act_on_na:
        if sensor_df.isnull().values.any():
            sensor_df.interpolate(method='pad', inplace=True)
            sensor_df = sensor_df.fillna(
                sensor_df.fillna(sensor_df.rolling(6).mean()))
            sensor_df = sensor_df.fillna(method="bfill", limit=6)

    return sensor_df


def perform_config_action(
        contract: TagContract,
        tag: str,
        config_id: str,
        value: Union[float, np.ndarray]) -> Any:

    if tag in contract.tags_to_config_actions:
        config_actions = contract.tags_to_config_actions[tag]
        if config_id in config_actions:
            config_action = config_actions[config_id]
            return config_action(value)
        else:
            raise KeyError(
                f"The required config id'{config_id}' is not found.")

    raise KeyError(f"The required tag '{tag}' is not found.")


def scale_back(
        contract: TagContract,
        dataset: pd.DataFrame) -> pd.DataFrame:
    for tag in dataset.columns:
        if tag in contract.tags_to_actions["RESCALE_SENSOR"]:
            dataset[tag] = contract.tags_to_actions["RESCALE_SENSOR"][tag](
                x=dataset[tag].values, scale_back=True)
    return dataset


def modelling_filter(
        contract: TagContract,
        dataset: pd.DataFrame) -> pd.DataFrame:
    """Filters the dataset designed for training for when boiler is active based on initial constraints"""

    modelling_constraint_variables = contract.tag_groups_map["MODELLING_CONSTRAINT_VARIABLES"]
    for condition in modelling_constraint_variables:
        const_limit = contract.tags_to_actions["MODELLING_CONSTRAINT_FILTER"][condition]
        dataset = \
            dataset[dataset[condition].apply(lambda x: const_limit(x))]

    return dataset


def convert_dataset(
        contract: TagContract,
        dataset: pd.DataFrame,
        model_converters: Dict[str, Any],
        model_converters_association_tags: Dict[str, List[str]],
        act_on_na: bool = True) -> pd.DataFrame:
    """Maps the columns of a dataset with specific header tags to columns of a new dataset with headers the core tags provided as input."""

    dataset_headers = list()
    for tag in contract.tag_to_association_kind.keys():
        if tag not in contract.tag_groups_map["IGNORED_TAGS"]:
            dataset_headers.append(tag)

    # handle nans and bad values
    dataset = __handle_nan_in_sensor_df(dataset, act_on_na=act_on_na)

    converted_shape = list(dataset.shape)
    converted_shape[1] = len(dataset_headers)
    converted_array = np.empty(tuple(converted_shape))
    converted_dataset = pd.DataFrame(
        converted_array, columns=dataset_headers, index=dataset.index)

    real_tags = set(dataset.columns)

    for tag in contract.tag_to_association_kind:

        associationKind = contract.tag_to_association_kind[tag]
        real_tags_actions = contract.tags_associations[tag]

        if tag in contract.tag_groups_map["IGNORED_TAGS"]:

            # If the association is ignored, we don't define it and we skip.
            if real_tags_actions is None:
                continue
            else:
                raise ValueError(
                    f"The ignored tag should be 'None'(tag '{tag}').")

        elif tag in contract.tag_groups_map["MODELLED_TAGS"]:
            continue
        elif associationKind == DatasetTagAssociationKind.MultipleAverage or \
                associationKind == DatasetTagAssociationKind.MultipleSum:

            converted_columns = []

            for real_tag in real_tags_actions:
                if real_tag in real_tags:
                    action = real_tags_actions[real_tag]
                    if action is None:
                        converted_columns.append(dataset[real_tag].values)
                    else:
                        converted_columns.append(
                            action(dataset[real_tag].values))

            combined_column = __combine_associated_elements(
                association_kind=associationKind,
                column_list=converted_columns)

            if combined_column is not None:
                converted_dataset[tag] = combined_column

        elif associationKind == DatasetTagAssociationKind.CustomFormulaPriorMapping:
            if not callable(real_tags_actions):
                raise ValueError(
                    f"The core tag '{tag}' with association CustomFormulaPriorMapping requires callable action instead of '{type(real_tags_actions)}'.")
            converted_dataset[tag] = real_tags_actions(dataset)

        elif associationKind == DatasetTagAssociationKind.Single:
            if len(real_tags_actions) != 1:
                raise ValueError(
                    f"The core tag '{tag}' single association requires just one real tag.")

            keys = list(real_tags_actions.keys())
            values = list(real_tags_actions.values())
            key = keys[0]
            value = values[0]
            if value is None:
                converted_dataset[tag] = dataset[key]
            else:
                if not callable(value):
                    raise ValueError(
                        f"For tag '{key}' the actions should be callable.")
                converted_dataset[tag] = value(dataset[key])
        if tag in contract.tags_to_actions["RESCALE_SENSOR"]:
            converted_dataset[tag] = contract.tags_to_actions["RESCALE_SENSOR"][tag](
                converted_dataset[tag].values)

    for tag in contract.tag_to_association_kind:
        associationKind = contract.tag_to_association_kind[tag]
        real_tags_actions = contract.tags_associations[tag]

        if tag in contract.tag_groups_map["IGNORED_TAGS"]:
            # If the association is ignored, we don't define it and we skip.
            if real_tags_actions is None:
                continue
            else:
                raise ValueError(f"The ignored tag '{tag}' should be 'None'.")

        elif tag in contract.tag_groups_map["MODELLED_TAGS"]:
            coverted_headers = set(converted_dataset.columns)
            headers = set(dataset.columns)
            model_input_tags = model_converters_association_tags[tag]
            model_input = np.empty((dataset.shape[0], len(model_input_tags)))

            if tag in model_converters and tag in model_converters_association_tags:
                for i, association_tag in enumerate(model_input_tags):
                    if association_tag in headers:
                        model_input[:, i] = dataset[association_tag]
                    elif association_tag in coverted_headers:
                        model_input[:, i] = converted_dataset[association_tag]
                    else:
                        raise KeyError(
                            f"The model input association tag '{association_tag}' is not found for modelling the tag '{tag}.'")

                converted_dataset[tag] = model_converters[tag].predict(
                    model_input)
            else:
                raise KeyError(
                    f"The modelled tag '{tag}' there is not found any model and associated input tags.")

        elif associationKind == DatasetTagAssociationKind.CustomFormulaPostMapping:
            if not callable(real_tags_actions):
                raise ValueError(
                    f"For tag '{tag}' CustomFormulaPostMapping requires callable action instead of '{type(real_tags_actions)}'.")
            converted_dataset[tag] = real_tags_actions(
                dataset, converted_dataset)

    return converted_dataset, dataset
