# Combustion Optimization App - Background Services Documentation

## Overview

This documentation provides details about the background services that support the Combustion Optimization app. These services are crucial for the proper functioning of the app, handling Machine Learning processes, and facilitating UI calls for the requested variables.

## Prerequisites
Participants are expected to have the following prerequisites:

- Basic understanding of frontend development and UI frameworks.
- Proficiency in Python programming at a **Medium to Advanced level**
- Familiarity with backend development concepts.
- Knowledge of RESTful API principles.
- Awareness of basic Machine Learning concepts.

## Getting Started

To begin the training module, follow these steps:

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/ichsansan/COPT-Training-Module.git
   ```

2. Navigate to the root directory:

   ```bash
   cd "Module 5 - Service COPT\Code Samples\Combustion-ServiceAPI-BLK1"
   ```

3. Running on local machine with this command:

   ```bash
   python3 CombustionAPI.py
   ```

4. Deploy into server:
   
   Set up the server database connection on `config.py` file, and server location on `build_docker.sh` and `run_service_tar.sh`.

   Run this command:

   ```bash
   ./build_docker.sh
   ```

## Additional Resources

For additional resources and references related to Background Service API, check the `References/` directory in this submodule.

## Support and Feedback

If you encounter any issues or have questions during the training, feel free to open an issue in this repository. We value your feedback and are here to help you succeed in mastering combustion optimization with machine learning.

Happy learning!
