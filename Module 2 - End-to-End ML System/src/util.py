import pandas as pd
import tensorflow as tf
from tensorflow.keras import layers
from typing import Any, Dict, Tuple

def ekstrak_sepal(data: pd.DataFrame) -> pd.DataFrame:
    """
    Ekstrak sepal sebagai fitur baru dari panjang dan lebar sepal.

    Parameters:
    - data (pd.DataFrame): pd.DataFrame yang berisi kolom 'sepal_length' dan 'sepal_width'.

    Returns:
    - pd.DataFrame: pd.DataFrame baru yang berisi kolom 'sepal' yang merupakan hasil perkalian 'sepal_length' dan 'sepal_width'.
    """
    data["sepal"] = data["sepal_length"].mul(data["sepal_width"])
    return data[["sepal"]]

def ekstrak_petal(data: pd.DataFrame) -> pd.DataFrame:
    """
    Ekstrak petal sebagai fitur baru dari panjang dan lebar petal.

    Parameters:
    - data (pd.DataFrame): pd.DataFrame yang berisi kolom 'petal_length' dan 'petal_width'.

    Returns:
    - pd.DataFrame: pd.DataFrame baru yang berisi kolom 'petal' yang merupakan hasil perkalian 'petal_length' dan 'petal_width'.
    """
    data["petal"] = data["petal_length"].mul(data["petal_width"])
    return data[["petal"]]

def df_to_dataset(DataFrame: pd.DataFrame, shuffle: bool = True, batch_size: int = 32) -> tf.data.Dataset:
    """
    Konversi pd.DataFrame menjadi TensorFlow Dataset.

    Parameters:
    - pd.DataFrame (pd.DataFrame): pd.DataFrame yang akan dikonversi.
    - shuffle (bool): Menentukan apakah dataset akan diacak. Default: True.
    - batch_size (int): Ukuran batch untuk dataset. Default: 32.

    Returns:
    - tf.data.Dataset: Dataset TensorFlow yang telah dikonversi.
    """
    df = DataFrame.copy()
    labels = df.pop('label')
    df = {key: value[:, tf.newaxis] for key, value in DataFrame.items()}
    ds = tf.data.Dataset.from_tensor_slices((dict(df), labels))
    if shuffle:
        ds = ds.shuffle(buffer_size=len(DataFrame))
    ds = ds.batch(batch_size)
    ds = ds.prefetch(batch_size)
    return ds

def get_normalization_layer(name: str, dataset: tf.data.Dataset) -> layers.Normalization:
    """
    Dapatkan layer normalisasi untuk fitur tertentu.

    Parameters:
    - name (str): Nama fitur yang akan dinormalisasi.
    - dataset (tf.data.Dataset): Dataset yang digunakan untuk menyesuaikan normalisasi.

    Returns:
    - layers.Normalization: Lapisan normalisasi yang telah diadaptasi.
    """
    # Buat lapisan Normalization untuk fitur.
    normalizer = layers.Normalization(axis=None)

    # Persiapkan Dataset yang hanya menghasilkan fitur.
    feature_ds = dataset.map(lambda x, y: x[name])

    # Pelajari statistik data.
    normalizer.adapt(feature_ds)

    return normalizer
