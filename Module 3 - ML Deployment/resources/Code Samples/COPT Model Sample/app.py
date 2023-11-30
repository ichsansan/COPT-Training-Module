from flask import Flask, jsonify, request
import config
from prediction import MainFlow, Prediction
import time

app = Flask(__name__)
debug_mode = False
fetch_realtime = True

@app.route("/bat_combustion/<unit>/<fetch_type>")
def prediction(unit, fetch_type):
    start_time = time.time()
    backdate = False
    
    # determine fetching type (from realtime data or provided excel)
    if fetch_type == 'realtime':
        fetch_realtime = True
    elif fetch_type == 'excel':
        fetch_realtime = False
    elif fetch_type == 'backdate':
        fetch_realtime = True
        backdate = True

    mainflow = MainFlow(unit, debug_mode=debug_mode, fetch_realtime=fetch_realtime)
    mainflow.load_saved_data()
    if backdate:
        backdate_date = dict(request.values)
        mainflow.read_backdate_data('2023-06-09 22:45', config.HORIZON_STEP)
    else:
        mainflow.read_realtime_data(n_minutes=config.HORIZON_STEP)

    mainflow.pre_calculation()
    message, curr_efficiency = mainflow.predict_inverse_mapping()
    mainflow.post_calculation()
    mainflow.save_to_db()
    time_logs = mainflow.get_time_logs()

    end_time = time.time()

    saved_data_time = time_logs['Load Saved Data']
    fetch_sensor_time = time_logs['Fetch Sensor Data']
    prediction_time = time_logs['Prediction Time']
    saving_db_time = time_logs['Saving to DB Time']

    # printing logs on server for debugging purpose
    print(flush=True)
    print('###################################', flush=True)
    print(f'Version: {config.DEPLOYMENT_CURR_VERSION}', flush=True)
    print(f'Latest Update: {config.DEPLOYMENT_LAST_UPDATE}', flush=True)
    print('API: BAT Combustion', flush=True)
    print('Status: Success', flush=True)
    print(f'Message: {message}', flush=True)
    print(f'Unit: {unit}', flush=True)
    print(f'Total Time: {(end_time - start_time) / 60} minutes', flush=True)
    print(f"Load Saved Data Time: {saved_data_time}", flush=True)
    print(f"Fetch Sensor Data Time: {fetch_sensor_time}", flush=True)
    print(f"Prediction Time: {prediction_time}", flush=True)
    print(f"Saving to DB Time: {saving_db_time}", flush=True)
    print('###################################', flush=True)


    return jsonify(
        success=True,
        message=message,
        current_efficiency= curr_efficiency,
        version=f'{config.DEPLOYMENT_CURR_VERSION}',
        latest_update=f'{config.DEPLOYMENT_LAST_UPDATE}',
        unit=f'{unit}',
        total_time=f'{(end_time - start_time) / 60} min',
        load_saved_data_time=f'{saved_data_time}',
        fetch_sensor_data_time=f'{fetch_sensor_time}',
        prediction_time=f'{prediction_time}',
        saving_db_time=f'{saving_db_time}',
        api=f'BAT Combustion',
    )

if __name__ == "__main__":
    app.run('0.0.0.0', port=5002, debug=False)