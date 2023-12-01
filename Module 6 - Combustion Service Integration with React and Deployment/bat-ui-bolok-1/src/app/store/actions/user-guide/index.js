import { SET_USER_GUIDE } from 'app/store/constants';
import { showMessage } from 'app/store/fuse/messageSlice';
import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL;

export const updateWorkInstructionFile = ({ data }) => {
  return async (dispatch) => {
    dispatch({
      type: SET_USER_GUIDE,
      payload: {
        postLoading: true,
      },
    });
    try {
      await axios.post(
        `${baseURL}/service/bat/sootblow/upload-instruksi-kerja`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      // setTimeout(() => {
      await dispatch(
        showMessage({
          message: 'Work instruction file was successfully updated',
          variant: 'success',
        })
      );
      await dispatch({
        type: SET_USER_GUIDE,
        payload: {
          postLoading: false,
        },
      });
      // window.location.reload();
      return true;
      // }, 3000);
    } catch (error) {
      dispatch(
        showMessage({
          message: error.response?.data?.message || error?.message,
          variant: 'error',
        })
      );
      dispatch({
        type: SET_USER_GUIDE,
        payload: {
          postLoading: false,
        },
      });
      return false;
    }
  };
};

export const updateUserGuideFile = ({ data }) => {
  return async (dispatch) => {
    dispatch({
      type: SET_USER_GUIDE,
      payload: {
        postLoading: true,
      },
    });
    try {
      await axios.post(`${baseURL}/service/bat/sootblow/upload`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // setTimeout(() => {
      await dispatch(
        showMessage({
          message: 'User guide file was successfully updated',
          variant: 'success',
        })
      );
      await dispatch({
        type: SET_USER_GUIDE,
        payload: {
          postLoading: false,
        },
      });
      // window.location.reload();
      return true;
      // }, 3000);
    } catch (error) {
      dispatch(
        showMessage({
          message: error.response?.data?.message || error?.message,
          variant: 'error',
        })
      );
      dispatch({
        type: SET_USER_GUIDE,
        payload: {
          postLoading: false,
        },
      });
      return false;
    }
  };
};

export const changeUserGuide = (data) => {
  return async (dispatch) => {
    dispatch({
      type: SET_USER_GUIDE,
      payload: data,
    });
  };
};
