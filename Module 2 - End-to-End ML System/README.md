## 2. Development of End-to-End Machine Learning System

Welcome to the "Development of End-to-End Machine Learning System" submodule. In this section, we will guide you through the process of creating a simple yet effective machine learning model and deploying it on your localhost system.

### Module Overview:

1. **Simple Machine Learning Model:**
   - Learn the basics of choosing a suitable algorithm for combustion optimization.
   - Learn to develop efficient data pipeline.
   - Learn to build, evaluation, and analyze model ML.
   - Implement a simple ML model using popular libraries such as scikit-learn and TensorFlow.
2. **Local Deployment:**  
   - Explore the steps involved in setting up a local development environment.
   - Understand how to expose your ML model as a web service on your localhost.
   - Test and validate your model locally to ensure it functions as expected.

### Getting Started:

1. **Clone the Repository:**

   - If you haven't already, make sure to clone the main repository to your local machine.

   ```bash
   git clone https://github.com/ichsansan/COPT-Training-Module.git
   ```
   
2. **Navigate to the Development Submodule:**

   - Move to the submodule dedicated to development.

   ```bash
   cd "COPT-Training-Module/Module 2 - End-to-End ML System"
   ```
   
3. **Basic way to use this repo:**

- Create a virtual environment [Optional]
    ```bash
    python -m venv .e2e_ml_env
    ```

- Activate virtual environment (windows)
    ```bash
    .e2e_ml_env/Scripts/activate
    ```

- Install the necessary dependencies 
    ```bash
    pip install -r requirements.txt
    ```  

- Do Extract, Transform, Load:
    ```bash
    cd src
    python get_data.py
    ```  

- Complete the **data_processing_and_modelling.ipynb** notebook by filling in the `#YOUR CODE HERE` section.    

- Run the ML-API
    ```bash
    cd ..
    python src\api.py
    ```

- Run the Web App  
    ```bash
    cd src 
    streamlit run web_app.py
    ```

### Key Topics Covered:

- **Extract, Transform, Load (ETL):**
  - Learn how to collect data realtime with Extract, Transform, Load (ETL) Process.
- **Data Preprocessing:**
  - Learn how to clean and preprocess data for better model performance & Understand the importance of selecting relevant features to improve model accuracy.
- **Model Training, Evaluation, & Analysis:**
  - Implement a simple machine learning model, evaluate its performance using appropriate metrics, and analysis the model.
- **Local Deployment:**
  - Explore the basics of deploying a machine learning model locally using API with Flask. Optionally, the following will demonstrate how to use it on the Web and create reports

### Prerequisites:

- Concept / Theory
  - Python: intermediate to advance level
  - Machine learning: basic concepts understanding.

- System:
  - Python >= 3.10.2
  - OS: Windows / Linux / Mac
  - Free Space > 10 GB [Optional]
  - RAM Min. 8 Gb [Optional]

- Tools:
  - [VS Code](https://code.visualstudio.com/download)
  - Terminal
  - [Postman](https://www.postman.com/downloads/) [Optional]

### Additional Resources:

Enjoy the journey of developing and deploying your combustion optimization machine learning model locally! If you have any questions or encounter issues, feel free to reach out in the repository's issue section. Happy coding!