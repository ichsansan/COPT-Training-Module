import os
from ucimlrepo import fetch_ucirepo
import pandas as pd
import numpy as np
import warnings
warnings.filterwarnings("ignore")

def prepare_directory() -> str:
    """
    Menyiapkan direktori tempat data akan disimpan.

    Returns:
        str: Path ke direktori data
    """
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    data_dir = f"{base_dir}/data"
    if not os.path.exists(data_dir):
        os.makedirs(data_dir)
    return data_dir


def collect_data(data_dir: str) -> pd.DataFrame:
    """
    Mengambil data dari Repositori Machine Learning UCI dan simpan ke file CSV.

    Args:
        data_dir (str): Path ke direktori data.
    
    Returns:
        pd.DataFrame: data dalam dalam bentuk dataframe.
    """
    if "data.csv" not in os.listdir(data_dir):
        # Extract
        iris = fetch_ucirepo(id=53)

        # transform
        data = pd.concat([iris.data.features, iris.data.targets], axis=1)
        data.columns = [s.replace(" ", "_") if " " in s else s for s in data.columns]

        # load
        data.to_csv(f"{data_dir}/data.csv", index=False)
    else:
        # load
        data = pd.read_csv(f"{data_dir}/data.csv")
    return data
    

def create_simulation_data(data: pd.DataFrame, data_dir: str) -> None:
    """
    Membuat data simulasi dengan menambahkan noise ke data asli.

    Args:
        data (pd.DataFrame): Data asli.
        data_dir (str): Path ke direktori data.
    """
    simulation_data = pd.concat([data] * 7)
    simulation_data = simulation_data.sample(frac=1)
    simulation_data.reset_index(inplace=True, drop=True)

    for col in simulation_data.columns[:-1]:
        noise_percentage = np.random.uniform(0.5, 0.75)
        num_elements_to_change = int(noise_percentage * simulation_data.shape[0])
        indices_to_change = np.random.choice(
            simulation_data.shape[0], num_elements_to_change, replace=False
        )
        min_val = simulation_data[col].min().min() * noise_percentage
        max_val = simulation_data[col].max().max() * noise_percentage
        simulation_data[col][indices_to_change] += np.random.normal(
            min_val, max_val, num_elements_to_change
        )
        simulation_data[col] = simulation_data[col].apply(lambda x: abs(x))
    
    simulation_data.to_csv(f"{data_dir}/simulation_data.csv", index=False)


if __name__ == "__main__":
    data_dir = prepare_directory()
    data = collect_data(data_dir)
    create_simulation_data(data, data_dir)