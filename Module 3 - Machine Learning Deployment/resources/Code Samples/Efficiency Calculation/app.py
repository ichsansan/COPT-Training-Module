# Mengimpor modul yang diperlukan
from flask import Flask, jsonify
from flask_cors import CORS
from utils.process import PredictEfficiency
import requests, os, logging

# Inisialisasi aplikasi Flask
app = Flask(__name__)

# Menetapkan kunci rahasia untuk aplikasi Flask
app.secret_key = "FBA94BA948C0EBA8CAEB0141"

# Mengaktifkan CORS untuk mengizinkan permintaan dari berbagai sumber
CORS(app)

# Konfigurasi logging untuk aplikasi
logging.basicConfig(format='[%(asctime)s] - %(levelname)s - %(message)s', level=logging.INFO, datefmt='%Y-%m-%d %H:%M:%S')

# Mengonfigurasi logging untuk modul Werkzeug (bagian dari Flask)
log_werkzeug = logging.getLogger('werkzeug')
log_werkzeug.setLevel(logging.ERROR)

# Membuat logger untuk aplikasi utama
logger = logging.getLogger("main")
logger.setLevel(logging.INFO)

# Menetapkan rute untuk endpoint root ("/") yang mengembalikan pesan selamat datang
@app.route("/")
def home():
    return f"Welcome to efficiency prediction"

# Menetapkan rute untuk endpoint "/efficiency/predict" yang melakukan prediksi efisiensi
@app.route("/efficiency/predict")
def efficiency_prediction():
    ret = {
        'status': False,
        'message': '',
    }

    try:
        # Memanggil fungsi PredictEfficiency untuk mendapatkan prediksi efisiensi
        ret = PredictEfficiency()
    
    except Exception as E:
        # Menangkap dan mengatasi exception, kemudian menyimpan pesan error
        E = str(E).split('\n')[0]
        ret['message'] = E
    
    # Mengembalikan hasil prediksi dalam format JSON
    return jsonify(ret)

# Menjalankan aplikasi Flask jika skrip ini dijalankan sebagai program utama
if __name__ == '__main__':
    app.run('0.0.0.0', 5002, debug=True)