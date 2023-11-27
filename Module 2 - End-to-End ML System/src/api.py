from flask import Flask, request, jsonify
from util import *
import pandas as pd
import tensorflow as tf
import pickle, warnings, json

warnings.filterwarnings('ignore')

app = Flask(__name__)

@app.route('/v1/predict/dt', methods=["POST"])
def rf_model():
  """
  Fungsi untuk memprediksi input dengan model decision tree

  Returns:
  - JSON: Input data dan hasil prediksi.
  """

  # 1. load file pipeline
  try:
    base_dir = "./utilities/"
    with open(f"{base_dir}label_encoder.bin", "rb") as f:
      label_encoder = pickle.load(f)
    with open(f"{base_dir}sklearn_dt_pipeline.bin", "rb") as f:
      rf_prod_pipeline = pickle.load(f)
  except FileNotFoundError:
    return jsonify({'Error': 'Saved pipeline not found.'}), 404

  # 2. membaca input data
  input_data = request.get_json()

  # 3. konversi ke dataframe
  input_df = pd.DataFrame().from_dict(input_data, orient="index").T

  # 4. melakukan prediksi
  prediction = rf_prod_pipeline.predict(input_df)

  # 5. Interpretasi hasil prediksi
  inference = label_encoder.inverse_transform([prediction])[0]

  return jsonify(input=json.dumps(input_data),
                 prediction=inference)

@app.route('/v1/predict/nn', methods=["POST"])
def dnn_pipeline():
  """
  Fungsi untuk memprediksi input dengan model neural network

  Returns:
  - JSON: Input data dan hasil prediksi.
  """

  # 1. load file pipeline
  try:
    base_dir = "./utilities/"
    with open(f"{base_dir}label_encoder.bin", "rb") as f:
      label_encoder = pickle.load(f)
    tf_pipeline = tf.keras.models.load_model(f"{base_dir}tf_pipeline.h5")
  except FileNotFoundError:
    return jsonify({'Error': 'Saved pipeline not found.'}), 404

  # 2. membaca input data
  input_data = request.get_json() 
  
  # 3. konversi ke tensor
  input_data_to_tensor = {name: tf.convert_to_tensor([value]) for name, value in input_data.items()}

  # 4. Melakukan prediksi
  prediction = tf_pipeline.predict(input_data_to_tensor, verbose=0)

  # 5. Interpretasi hasil prediksi
  inference = label_encoder.inverse_transform([prediction.argmax()])[0]

  return jsonify(input=json.dumps(input_data),
                 prediction=inference)
  
if __name__ == '__main__':
  app.run(debug=True, port=5002)