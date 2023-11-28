import prediction as p
from config import CSV_DATASET_MAPPER, PCT1_DATA_TAG, RBG1_DATA_TAG,\
	RBG2_DATA_TAG, KTT1_DATA_TAG, KTT2_DATA_TAG
import time
import config
import ast
import traceback
from flask import Flask, render_template, jsonify
import deployment_config

app = Flask(__name__)
debug_mode = True
fetch_realtime = False

@app.route("/copt_ml/get_recommendation/<unit>")
def prediction(unit):
	start_time = time.time()

	unit = deployment_config.UNIT_MAPPER[unit]
	time_logs = {
		'Load Saved Data': 0,
		'Fetch Sensor Data': 0,
		'Prediction Time': 0,
		'Construct Output Data Time': 0,
		'Saving to DB Time': 0,
	}
	recommendation = {}
	main_flow = p.MainFlow(unit, debug_mode=debug_mode, fetch_realtime=fetch_realtime)

	try:
		main_flow.load_saved_data()
		main_flow.read_realtime_data(n_minutes=config.HORIZON_STEP)
		main_flow.predict_inverse_mapping()
		message, recommendation = main_flow.construct_output_data()
		recommendation = ast.literal_eval(recommendation)
		main_flow.save_to_db()
		time_logs = main_flow.get_time_logs()
		main_flow.cleanup()
	except Exception as e:
		main_flow.cleanup()
		message = traceback.format_exc()

	end_time = time.time()

	saved_data_time = time_logs['Load Saved Data']
	fetch_sensor_time = time_logs['Fetch Sensor Data']
	prediction_time = time_logs['Prediction Time']
	construct_output_time = time_logs['Construct Output Data Time']
	saving_db_time = time_logs['Saving to DB Time']

	# printing logs on server for debugging purpose
	print(flush=True)
	print('###################################', flush=True)
	print(f'Version: {deployment_config.CURR_VERSION}', flush=True)
	print(f'Latest Update: {deployment_config.LATEST_UPDATE}', flush=True)
	print('API: BAT Combustion', flush=True)
	print('Status: Success', flush=True)
	print(f'Recommendation: {recommendation}', flush=True)
	print(f'Message: {message}', flush=True)
	print(f'Unit: {unit}', flush=True)
	print(f'Total Time: {(end_time - start_time) / 60} minutes', flush=True)
	print(f"Load Saved Data Time: {saved_data_time}", flush=True)
	print(f"Fetch Sensor Data Time: {fetch_sensor_time}", flush=True)
	print(f"Prediction Time: {prediction_time}", flush=True)
	print(f"Construct Output Time: {construct_output_time}", flush=True)
	print(f"Saving to DB Time: {saving_db_time}", flush=True)
	print('###################################', flush=True)

	return jsonify({
		'API': 'BAT Combustion API', 
		'unit': f'{unit}',
		'recommendation_time': f"{(end_time - start_time)} seconds",
		'recommendation_value': recommendation,
		'curr_version': f'{deployment_config.CURR_VERSION}',
		'last_update': f'{deployment_config.LATEST_UPDATE}',
	})

if __name__ == "__main__":
	if debug_mode:
		app.run(port=5050, debug=True)