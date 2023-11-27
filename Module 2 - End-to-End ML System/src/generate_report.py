import pandas as pd
import json, requests, os
import seaborn as sns
import matplotlib.pyplot as plt
from config import *
import warnings 
warnings.filterwarnings("ignore")

DATA_DIR = "../data/"

def load_trained_data() -> pd.DataFrame:
    """
    Memuat data yang telah dilatih dari file CSV.

    Returns:
    pd.DataFrame: DataFrame yang berisi data yang telah dilatih.
    """
    data = pd.read_csv(f"{DATA_DIR}/trained_data.csv")
    return data

def get_samples(n: int = 25) -> pd.DataFrame:
    """
    Mengambil sampel data baru dari file CSV simulasi.

    Args:
    n (int): Jumlah sampel yang diambil.

    Returns:
    pd.DataFrame: DataFrame yang berisi sampel data baru.
    """
    data = pd.read_csv(f"{DATA_DIR}/simulation_data.csv")
    data = data.sample(n)
    data.drop("class", axis=1, inplace=True)
    data.reset_index(inplace=True, drop=True)
    return data

def simulation(data: pd.DataFrame) -> pd.DataFrame:
    """
    Melakukan prediksi untuk data yang masukkan menggunakan API.

    Args:
    data (pd.DataFrame): DataFrame yang berisi data untuk diprediksi.

    Returns:
    pd.DataFrame: DataFrame yang berisi data awal dan kolom 'prediction'.
    """
    prediction = []
    for row in data.index:
        sample = data.loc[row].to_dict()
        headers = sample
        results = requests.post(f"{DT_API}", json=headers)

        results = json.loads(results.text)
        prediction += [results["prediction"]]
    data["prediction"] = prediction
    return data

def make_report(trained_data: pd.DataFrame, new_data: pd.DataFrame) -> None:
    """
    Membuat laporan perbandingan antara data yang telah dilatih dan data baru.

    Args:
    trained_data (pd.DataFrame): DataFrame yang berisi data yang telah dilatih.
    new_data (pd.DataFrame): DataFrame yang berisi data baru.
    """
    # Plot setting
    plt.style.use('seaborn')
    plt.rcParams['axes.titlesize'] = 24
    plt.rcParams['axes.labelsize'] = 20
    plt.rcParams['xtick.labelsize'] = 18.5
    plt.rcParams['ytick.labelsize'] = 18.5
    plt.rcParams['legend.fontsize'] = 16

    
    fig, axes = plt.subplots(nrows=4, ncols=1, figsize=(12, 12))
    for i, col in enumerate(new_data.columns[:-1]):
        # Plot histogram for both trained and new data
        sns.histplot(trained_data[col], bins=20, palette="crest", label='Trained Data', ax=axes[i], stat="percent")
        sns.histplot(new_data[col], bins=20, palette="rocket_r", label='New Data', ax=axes[i], stat="percent")
        axes[i].set_title(col)
        axes[i].legend()

    # Adjust layout
    plt.tight_layout()

    plt.savefig('../report/komparasi_data.pdf', dpi=300)
    new_data.to_csv("../report/data_baru.csv", index=False)

def prepare_directory() -> None:
    """
    Menyiapkan direktori tempat data akan disimpan.

    Returns:
        str: Path ke direktori data
    """
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    report_dir = f"{base_dir}/report"
    if not os.path.exists(report_dir):
        os.makedirs(report_dir)

def create_report():
    prepare_directory()
    new_data = simulation(get_samples())
    trained_data = load_trained_data()
    make_report(trained_data, new_data)

if __name__ == "__main__":
    create_report()