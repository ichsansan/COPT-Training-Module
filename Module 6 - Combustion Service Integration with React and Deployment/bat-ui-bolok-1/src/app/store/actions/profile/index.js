import { SET_PROFILE } from 'app/store/constants';
import { showMessage } from 'app/store/fuse/messageSlice';
import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL;

export const updateUserPassword = (data) => {
  return async (dispatch) => {
    await axios
      .put(`${baseURL}/service/bat/user/save`, data)
      .then(() => {
        dispatch(
          showMessage({
            message: 'User password has been updated',
            variant: 'success',
          })
        );
      })
      .catch((error) => {
        if (error.response?.status === 500) {
          dispatch(
            showMessage({
              message: 'Sorry, something went wrong with the server',
              variant: 'error',
            })
          );
        } else {
          dispatch(
            showMessage({
              message: error.response?.data?.message || error.message,
              variant: 'error',
            })
          );
        }
      });
  };
};

export const updatePhotoProfile = ({ data }) => {
  return async (dispatch) => {
    dispatch({
      type: SET_PROFILE,
      payload: {
        postLoading: true,
      },
    });
    try {
      await axios.post(`${baseURL}/service/bat/user/upload`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      await dispatch(
        showMessage({
          message: 'Your profile image was successfully updated',
          variant: 'success',
        })
      );
      await dispatch({
        type: SET_PROFILE,
        payload: {
          postLoading: false,
          photoFile: null,
        },
      });

      return true;
    } catch (error) {
      dispatch(
        showMessage({
          message: error.response?.data?.message || error.message,
          variant: 'error',
        })
      );
      dispatch({
        type: SET_PROFILE,
        payload: {
          postLoading: false,
        },
      });
      return false;
    }
  };
};

export const changeProfile = (data) => {
  return async (dispatch) => {
    dispatch({
      type: SET_PROFILE,
      payload: data,
    });
  };
};
