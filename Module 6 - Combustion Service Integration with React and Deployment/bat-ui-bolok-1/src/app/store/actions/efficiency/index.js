import jwtService from 'app/services/jwtService';
import { SET_EFFICIENCY } from 'app/store/constants';
import { showMessage } from 'app/store/fuse/messageSlice';
import axios from 'axios';
import moment from 'moment';

const baseURL = process.env.REACT_APP_API_URL;

export const getFrontStatusIndicator = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(
        `${baseURL}/service/bat/sootblow/front-status`
      );
      await dispatch({
        type: SET_EFFICIENCY,
        payload: {
          efficiencyIndicator: {
            sootblowOperationIndicator:
              +response.data?.object?.OPERATION_SOPT || 0,
            sootblowWatchdogIndicator:
              +response.data?.object?.WATCHDOG_SOPT || 0,
            sootblowSafeguardIndicator:
              +response.data?.object?.SAFEGUARD_SOPT || 0,
            combustionOperationIndicator:
              +response.data?.object?.OPERATION_COPT || 0,
            combustionWatchdogIndicator:
              +response.data?.object?.WATCHDOG_COPT || 0,
            combustionSafeguardIndicator:
              +response.data?.object?.SAFEGUARD_COPT || 0,
          },
        },
      });
    } catch (error) {
      await dispatch(
        showMessage({
          message: error.response?.data?.message || error.message,
          variant: 'error',
        })
      );
      await dispatch({
        type: SET_EFFICIENCY,
        payload: {
          error: error.response?.data?.message || error.message,
        },
      });
    }
  };
};

export const getEfficiencyData = () => {
  return async (dispatch, getState) => {
    const {
      efficiencyReducer: { filterStartDate, filterEndDate },
    } = getState();

    const timeFormat = (timestamp, timeformat = "YYYY-MM-DD HH:mm'") => {
      return moment(timestamp).format(timeformat);
    };

    const START_DATE = filterStartDate ? timeFormat(filterStartDate) : '';
    const END_DATE = filterEndDate ? timeFormat(filterEndDate) : '';
    await dispatch({
      type: SET_EFFICIENCY,
      payload: {
        loading: true,
      },
    });
    await axios
      .get(
        `${baseURL}/service/bat/sootblow/efficiency?startDate=${START_DATE}&endDate=${END_DATE}`,
        {
          headers: {
            Authorization: `Bearer ${jwtService.getAccessToken()}`,
          },
        }
      )
      .then((response) => {
        dispatch({
          type: SET_EFFICIENCY,
          payload: {
            improvementEfficiency:
              response?.data?.object.improvementEfficiency || '',
            baselineEfficiency: response?.data?.object.baselineEfficiency || '',
            currentEfficiency: response?.data?.object.currentEfficiency || '',
            chart: response?.data?.object.chart || [],
            referenceValue: response?.data?.object.referenceValue || '',
            dateCurrent: response?.data?.object?.dateCurrent
              ? timeFormat(
                  response?.data?.object?.dateCurrent,
                  'DD/MM/YYYY HH:mm'
                )
              : '',
            dateBaseline: response?.data?.object?.dateBaseline
              ? timeFormat(
                  response?.data?.object?.dateBaseline,
                  'DD/MM/YYYY HH:mm'
                )
              : '',
            loading: false,
          },
        });
      })
      .catch((error) => {
        dispatch(
          showMessage({
            message: error.response?.data?.message || error.message,
            variant: 'error',
          })
        );
        dispatch({
          type: SET_EFFICIENCY,
          payload: {
            error: error.response?.data?.message || error.message,
            loading: false,
          },
        });
      });
  };
};

export const changeEfficiency = (data) => {
  return async (dispatch) => {
    dispatch({
      type: SET_EFFICIENCY,
      payload: data,
    });
  };
};
