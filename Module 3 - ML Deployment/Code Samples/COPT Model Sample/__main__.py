import prediction as p
from config import CSV_DATASET_MAPPER, PCT1_DATA_TAG, RBG1_DATA_TAG,\
    RBG2_DATA_TAG, KTT1_DATA_TAG, KTT2_DATA_TAG, AMG1_DATA_TAG, \
    AMG2_DATA_TAG, PCT2_DATA_TAG, BLT1_DATA_TAG, BLT2_DATA_TAG, \
    PTN9_DATA_TAG, BLK1_DATA_TAG, BLK2_DATA_TAG

current_unit = BLK2_DATA_TAG

if __name__ == '__main__':
    main_flow = p.MainFlow(current_unit, "")
    main_flow.read_from_disk_realtime_data(CSV_DATASET_MAPPER[current_unit], 9000, 6000)
    main_flow.load_saved_data()
    print(main_flow.predict_inverse_mapping())
    # main_flow.save_to_db()
