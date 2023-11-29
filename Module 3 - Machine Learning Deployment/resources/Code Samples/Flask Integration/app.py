# Mengimpor modul yang diperlukan
from flask import Flask, jsonify

# Inisialisasi aplikasi Flask
app = Flask(__name__)

# Menetapkan kunci rahasia untuk aplikasi Flask
app.secret_key = "FBA94BA948C0EBA8CAEB0141"

# Menetapkan rute untuk endpoint root ("/") yang mengembalikan pesan selamat datang
@app.route("/")
def home():
    return f"Selamat datang ke aplikasi Flask"

# Menjalankan aplikasi Flask jika skrip ini dijalankan sebagai program utama
if __name__ == '__main__':
    app.run('0.0.0.0', 5002, debug=True)