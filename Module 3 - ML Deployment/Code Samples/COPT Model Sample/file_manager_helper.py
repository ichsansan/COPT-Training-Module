import os
import sys
import gzip
import hashlib
from keras.models import model_from_json
import numpy as np
import pandas as pd

if "contracts" not in sys.path:
    sys.path.append("contracts")

from contracts.tag_contract_factory import TagContract

from sklearn.pipeline import Pipeline
import dill as pickle

from enum import Enum, auto


class APIModelKind(Enum):
    XGBOOST = auto()
    SKLEARN = auto()
    KERAS = auto()


ZIPPED_FILES_EXTENSION = ".bin"
ZIPPED_JSON_FILES_EXTENSION = ".json"
ZIPPED_H5_FILES_EXTENSION = ".h5"

RESULTS_PLOTS_EXTENSION = ".pdf"
RESULTS_FILES_EXTENSION = ".tsv"
RESULTS_TABLES_SEP = "\t"
DATASET_EXTENSION = ".csv"


def get_records_bag_file_name(data_table_file_name: str) -> str:
    data_table_name = os.path.splitext(data_table_file_name)[0]

    return f"sensor_records-{data_table_name}"


def get_records_bag_file_path(data_table_file_name: str, directory: str) -> str:
    return os.path.join(directory,
                        get_records_bag_file_name(data_table_file_name) + ZIPPED_FILES_EXTENSION)


def get_model_benchmark_file_path(
        data_table_file_name: str,
        directory: str,
        benchmark_kind: str,
        period_kind: str,
        variable_kind: str,
        train_mass: int,
        test_mass: int,
        val_mass: int,
        seed: int) -> str:
    return os.path.join(directory,
                        __get_benchmark_name(data_table_file_name,
                                             benchmark_kind,
                                             period_kind,
                                             variable_kind,
                                             train_mass,
                                             test_mass,
                                             val_mass,
                                             seed) + ZIPPED_FILES_EXTENSION)


def load_bench_file(file_path: str) -> np.ndarray:
    file = gzip.GzipFile(file_path, "r")
    return np.load(file)


def load_model_bench_file(
        data_table_file_name: str,
        directory: str,
        benchmark_kind: str,
        period_kind: str,
        variable_kind: str,
        train_mass: int,
        test_mass: int,
        val_mass: int,
        seed: int):
    path = get_model_benchmark_file_path(
        data_table_file_name,
        directory,
        benchmark_kind,
        period_kind,
        variable_kind,
        train_mass,
        test_mass,
        val_mass,
        seed)

    return load_bench_file(path)


def save_model_bench_file(
        array: np.ndarray,
        data_table_file_name: str,
        directory: str,
        benchmark_kind: str,
        period_kind: str,
        variable_kind: str,
        train_mass: int,
        test_mass: int,
        val_mass: int,
        seed: int):
    path = get_model_benchmark_file_path(
        data_table_file_name,
        directory,
        benchmark_kind,
        period_kind,
        variable_kind,
        train_mass,
        test_mass,
        val_mass,
        seed)

    __save_bench_file(array, path)


def __save_bench_file(array: np.ndarray, file_path: str):
    with gzip.GzipFile(file_path, "w") as file:
        np.save(file, array)


def __get_benchmark_name(
        data_table_file_name: str,
        benchmark_kind: str,
        period_kind: str,
        variable_kind: str,
        train_mass: int,
        test_mass: int,
        val_mass: int,
        seed: int) -> str:
    data_table_name = get_records_bag_file_name(data_table_file_name)
    return f"ratio_{train_mass}_{test_mass}_{val_mass}-seed_{seed}-{period_kind}_period-{benchmark_kind}-" \
           f"{variable_kind}-{data_table_name}"


def get_model_plot_results_path(model_id: str, directory: str, rund_id: str):
    if not os.path.exists(directory):
        os.makedirs(directory)
    return os.path.join(directory, f"{model_id}-{rund_id}" + RESULTS_PLOTS_EXTENSION)


def get_benchmark_results_path(table_name: str, directory: str, model_kind: str, results_prefix: str):
    if not os.path.exists(directory):
        os.makedirs(directory)
    return os.path.join(directory, f"{results_prefix}-{model_kind}-{table_name}" + RESULTS_FILES_EXTENSION)


def load_model(directory: str, model_name: str, model_kind: str, input_specifics: bool) -> Pipeline:
    model_kind_enum = APIModelKind[model_kind]
    if(model_kind_enum == APIModelKind.KERAS):
        return __load_keras_model(directory=directory, model_name=model_name)
    elif(model_kind_enum == APIModelKind.SKLEARN):
        return __load_sklearn_model(directory=directory, model_name=model_name,
                                    input_specifics=input_specifics)
    elif(model_kind_enum == APIModelKind.XGBOOST):
        return __load_xgboost_model(directory=directory, model_name=model_name)
    else:
        raise ValueError(f"The model kind '{model_kind}' not supported.")


def save_model(directory: str, model_name: str, model_kind: str, pipeline: Pipeline):
    model_kind_enum = APIModelKind[model_kind]
    if(model_kind_enum == APIModelKind.KERAS):
        __save_keras_model(directory=directory, model_name=model_name, pipeline=pipeline)
    elif(model_kind_enum == APIModelKind.SKLEARN):
        __save_sklearn_model(directory=directory, model_name=model_name, pipeline=pipeline)
    elif(model_kind_enum == APIModelKind.XGBOOST):
        __save_xgboost_model(directory=directory, model_name=model_name, pipeline=pipeline)
    else:
        raise ValueError(f"The model kind '{model_kind}' not supported.")


def __load_keras_model(directory: str, model_name: str) -> Pipeline:
    pipeline_path = os.path.join(
        directory, f"{model_name}_pipeline{ZIPPED_FILES_EXTENSION}")
    json_model_path = os.path.join(
        directory, f"{model_name}_model{ZIPPED_JSON_FILES_EXTENSION}")
    h5_model_path = os.path.join(
        directory, f"{model_name}_model{ZIPPED_H5_FILES_EXTENSION}")

    json_file = open(json_model_path, 'r')
    loaded_model_json = json_file.read()
    json_file.close()
    loaded_model = model_from_json(loaded_model_json)
    loaded_model.load_weights(h5_model_path)

    pipeline = pickle.load(open(pipeline_path, 'rb'))
    pipeline["model"].model = loaded_model

    return pipeline


def __save_keras_model(pipeline: Pipeline, directory: str, model_name: str):
    if not os.path.exists(directory):
        os.makedirs(directory)

    model_path = os.path.join(directory, model_name)
    os.makedirs(model_path)

    pipeline_path = os.path.join(model_path, f"{model_name}_pipeline{ZIPPED_FILES_EXTENSION}")
    json_model_path = os.path.join(model_path, f"{model_name}_model{ZIPPED_JSON_FILES_EXTENSION}")
    h5_model_path = os.path.join(model_path, f"{model_name}_model{ZIPPED_H5_FILES_EXTENSION}")

    model = pipeline["model"].model

    model_json = model.to_json()
    with open(json_model_path, "w") as json_file:
        json_file.write(model_json)

    model.save_weights(h5_model_path)

    pipeline["model"].model = None
    pickle.dump(pipeline, open(pipeline_path, 'wb'))
    pipeline["model"].model = model


def __save_sklearn_model(model_name: str, directory: str, pipeline: Pipeline):
    if not os.path.exists(directory):
        os.makedirs(directory)

    model_path = os.path.join(directory, model_name)
    os.makedirs(model_path)

    pipeline_path = os.path.join(
        model_path, f"{model_name}_pipeline{ZIPPED_FILES_EXTENSION}")
    pickle.dump(pipeline, open(pipeline_path, 'wb'))


def __load_sklearn_model(model_name: str, directory: str, input_specifics: bool) -> Pipeline:
    model_path = os.path.join(directory, model_name)
    pipeline_path = os.path.join(
        model_path, f"{model_name}_pipeline{ZIPPED_FILES_EXTENSION}")
    pipeline = pickle.load(open(pipeline_path, 'rb'))

    if input_specifics:
        input_tags_path = os.path.join(
            model_path, f"{model_name}_input_tags{ZIPPED_FILES_EXTENSION}")
        input_tags = pickle.load(open(input_tags_path, 'rb'))
        pipeline = (pipeline, input_tags)

    return pipeline


def __save_xgboost_model(model_name: str, directory: str, pipeline: Pipeline):
    if not os.path.exists(directory):
        os.makedirs(directory)

    model_path = os.path.join(directory, model_name)
    os.makedirs(model_path)

    pipeline_path = os.path.join(model_path, f"{model_name}_pipeline{ZIPPED_FILES_EXTENSION}")
    pickle.dump(pipeline, open(pipeline_path, 'wb'))


def __load_xgboost_model(model_name: str, directory: str) -> Pipeline:
    model_path = os.path.join(directory, model_name)
    pipeline_path = os.path.join(model_path, f"{model_name}_pipeline{ZIPPED_FILES_EXTENSION}")
    pipeline = pickle.load(open(pipeline_path, 'rb'))

    return pipeline


def save_dataset_tag_contract(directory: str, contract: TagContract):
    h = hashlib.sha256(contract.alias.encode('utf8'))
    name = h.hexdigest()

    if not os.path.exists(directory):
        os.makedirs(directory)

    contract_path = os.path.join(
        directory, f"{name}_dataset_contract{ZIPPED_FILES_EXTENSION}")
    pickle.dump(contract, open(contract_path, 'wb'))


def load_dataset_tag_contract(contract_alias: str, directory: str) -> TagContract:
    h = hashlib.sha256(contract_alias.encode('utf8'))
    name = h.hexdigest()

    contract_path = os.path.join(
        directory, f"{name}_dataset_contract{ZIPPED_FILES_EXTENSION}")
    contract = pickle.load(open(contract_path, 'rb'))

    return contract


def save_model_tag_contract(directory: str, contract: TagContract):
    h = hashlib.sha256(contract.alias.encode('utf8'))
    name = h.hexdigest()

    if not os.path.exists(directory):
        os.makedirs(directory)

    contract_path = os.path.join(
        directory, f"{name}_model_contract{ZIPPED_FILES_EXTENSION}")
    pickle.dump(contract, open(contract_path, 'wb'))


def load_model_tag_contract(contract_alias: str, directory: str) -> TagContract:
    h = hashlib.sha256(contract_alias.encode('utf8'))
    name = h.hexdigest()

    contract_path = os.path.join(
        directory, f"{name}_model_contract{ZIPPED_FILES_EXTENSION}")
    contract = pickle.load(open(contract_path, 'rb'))

    return contract


def get_dataset_file_name(dataset_tag: str, dataset_suffix: str) -> str:
    return f"dataset_{dataset_tag}_{dataset_suffix}{DATASET_EXTENSION}"


def save_pandas_dataset(dataset: pd.DataFrame, dataset_tag: str, dataset_suffix: str, directory: str):
    dataset.to_csv(
        os.path.join(directory, get_dataset_file_name(
            dataset_tag=dataset_tag, dataset_suffix=dataset_suffix)),
        index=False)
