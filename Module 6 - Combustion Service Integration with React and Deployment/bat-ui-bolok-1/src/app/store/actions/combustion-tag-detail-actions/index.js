import { SET_COMBUSTION_TAG_DETAIL_REDUCER } from 'app/store/constants';
import { showMessage } from 'app/store/fuse/messageSlice';
import axios from 'axios';

export const getCombustionTagDetailData = (tag = '') => {
  return async (dispatch) => {
    dispatch({
      type: SET_COMBUSTION_TAG_DETAIL_REDUCER,
      payload: {
        error: '',
        loading: true,
      },
    });
    try {
      const response = await axios.get(
        `service/copt/bat/combustion/tag-information/${tag}`
      );
      dispatch({
        type: SET_COMBUSTION_TAG_DETAIL_REDUCER,
        payload: {
          data: response.data?.object?.object || null,
        },
      });
      return true;
    } catch (error) {
      dispatch({
        type: SET_COMBUSTION_TAG_DETAIL_REDUCER,
        payload: {
          data: null,
          error: error.response?.data?.message || error.message,
        },
      });
      dispatch(
        showMessage({
          message: error.response?.data?.message || error.message,
          variant: 'error',
        })
      );
      return false;
    } finally {
      dispatch({
        type: SET_COMBUSTION_TAG_DETAIL_REDUCER,
        payload: {
          loading: false,
        },
      });
    }
  };
};

export const changeCombustionTagDetailReducer = (data) => {
  return async (dispatch) => {
    dispatch({
      type: SET_COMBUSTION_TAG_DETAIL_REDUCER,
      payload: data,
    });
  };
};
