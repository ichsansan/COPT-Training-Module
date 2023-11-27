import streamlit as st
import json, requests
from config import *
from generate_report import *
import warnings
warnings.filterwarnings('ignore')

def main_page():
  """
  Main page for prediction
  """
  st.set_page_config(page_title='Iris-Classification', layout='wide')

  st.title('Web UI Demo Machine Learning')
  st.markdown("""<div style="text-align: justify;"> Dataset bunga Iris pertama kali diperkenalkan pada tahun 1936 oleh ahli statistik Inggris Ronald Fisher dalam makalahnya 
  <a href=https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1469-1809.1936.tb02137.x>"The Use of Multiple Measurements in Taxonomic Problems."</a> Fisher mengumpulkan data sebagai bagian dari karyanya tentang analisis diskriminan linier, sebuah metode statistik untuk memprediksi kelas suatu objek berdasarkan pengukurannya. Saat ini, kumpulan data ini umum digunakan dalam pembelajaran mesin, khususnya untuk tugas klasifikasi. Dataset berisi pengukuran panjang sepal, lebar sepal, panjang kelopak, dan lebar kelopak tiga spesies bunga iris: Iris setosa, Iris versicolor, dan Iris virginica. Tujuan dari tugas klasifikasi adalah untuk memprediksi spesies bunga iris berdasarkan pengukuran tersebut. Kumpulan datanya kecil, hanya 150 contoh, menjadikannya kumpulan data yang baik untuk menguji dan membandingkan kinerja berbagai algoritma klasifikasi. Selain itu, kumpulan datanya seimbang, dengan 50 contoh dari setiap spesies, memastikan bahwa setiap kelas terwakili secara setara dalam data. Aplikasi web ini memprediksi Iris Flower sebagai demo kasus penerapan pembelajaran mesin.</div>""", unsafe_allow_html=True)
  st.image('https://content.codecademy.com/programs/machine-learning/k-means/iris.svg', 'Iris Flower (image source: kaggle.com/code/necibecan/iris-dataset-eda-n)')


  st.write('Isi Data Bunga')

  # get input data from user
  sepal_length = st.number_input('Panjang Sepal (cm):', step=0.01, min_value=0.0, format='%.f')
  sepal_width = st.number_input('Lebar Sepal (cm):', step=0.01, min_value=0.0, format='%.f') 
  petal_length = st.number_input('Panjang Petal (cm):', step=0.01, min_value=0.0, format='%.f')
  petal_width = st.number_input('Lebar Petal (cm):', step=0.01, min_value=0.0, format='%.f') 
  
  submitted = st.button('Prediksi')
  if submitted:
    
    sample = {
      "sepal_length": sepal_length,
      "sepal_width": sepal_width,
      "petal_length": petal_length,
      "petal_width": petal_width,
    }
    
    results = requests.post(f"{DT_API}", json=sample)
    
    results = json.loads(results.text)
    st.info(f'{results["prediction"]}')

    reset = st.button('Hapus')	
    if reset:      
      submitted=False
      del results

  generate_report = st.button('Report')

  if generate_report:
    create_report()
    st.success("report berhasil dibuat!")

if __name__ == "__main__":
  main_page()