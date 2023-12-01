import { SET_USER_MANAGEMENT_REDUCER } from 'app/store/constants';
import { showMessage } from 'app/store/fuse/messageSlice';
import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL;

export const handleDeleteUser = (id, name) => {
  return async (dispatch) => {
    dispatch({
      type: SET_USER_MANAGEMENT_REDUCER,
      payload: {
        loadingDelete: true,
      },
    });
    const data = {
      id,
    };
    try {
      await axios.post(`${baseURL}/service/bat/user/delete`, data);
      dispatch(
        showMessage({
          message: `User ${name} has been deleted`,
          variant: 'success',
        })
      );
      return true;
    } catch (error) {
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
      return false;
    } finally {
      dispatch({
        type: SET_USER_MANAGEMENT_REDUCER,
        payload: {
          loadingDelete: false,
        },
      });
    }
  };
};

export const handleCreateNewUser = (data) => {
  return async (dispatch) => {
    try {
      await axios.post(`${baseURL}/service/bat/user/create`, data);
      return true;
    } catch (error) {
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
      return false;
    }
  };
};

export const handleEditUser = (data, id) => {
  return async (dispatch) => {
    try {
      await axios.post(`${baseURL}/service/bat/user/update`, data);
      return true;
    } catch (error) {
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
      return false;
    }
  };
};

export const getUserManagementDetail = (id) => {
  return async (dispatch) => {
    dispatch({
      type: SET_USER_MANAGEMENT_REDUCER,
      payload: {
        loadingDetail: true,
      },
    });
    try {
      const response = await axios.get(`${baseURL}/service/bat/user/${id}`);

      dispatch({
        type: SET_USER_MANAGEMENT_REDUCER,
        payload: {
          loadingDetail: false,
          detailData: {
            fullname: response?.data?.object?.fullname || '',
            username: response?.data?.object?.username || '',
            email: response?.data?.object?.email || '',
            role: response?.data?.object?.roleId || '',
            id: response?.data?.object?.id,
          },
        },
      });
      return true;
    } catch (error) {
      if (error?.response?.status === 500) {
        dispatch({
          type: SET_USER_MANAGEMENT_REDUCER,
          payload: {
            loadingDetail: false,
          },
        });
      } else {
        dispatch({
          type: SET_USER_MANAGEMENT_REDUCER,
          payload: {
            loadingDetail: false,
          },
        });
      }
      dispatch(
        showMessage({
          message: error.response?.data?.message || error.message,
          variant: 'error',
        })
      );
      return false;
    }
  };
};

export const getUserManagementList = () => {
  return async (dispatch, getState) => {
    const { userManagementReducer } = getState();

    const { search, sortBy, sortType, page, limit } = userManagementReducer;

    dispatch({
      type: SET_USER_MANAGEMENT_REDUCER,
      payload: {
        error: null,
        loading: true,
      },
    });
    try {
      const response = await axios.get(
        `${baseURL}/service/bat/user/list?filter=${search}&limit=${limit}&page=${page}&sortBy=${sortBy}&sort=${sortType}`
      );

      dispatch({
        type: SET_USER_MANAGEMENT_REDUCER,
        payload: {
          loading: false,
          data: response.data?.object || [],
          total: response.data?.total || 0,
        },
      });
    } catch (error) {
      if (error?.response?.status === 500) {
        dispatch({
          type: SET_USER_MANAGEMENT_REDUCER,
          payload: {
            error: 'Maaf, terjadi kesalahan. Silahkan dicoba kembali.',
            loading: false,
          },
        });
      } else {
        dispatch({
          type: SET_USER_MANAGEMENT_REDUCER,
          payload: {
            error: error.response?.data?.message || error.message,
            loading: false,
          },
        });
      }
      dispatch(
        showMessage({
          message: error.response?.data?.message || error.message,
          variant: 'error',
        })
      );
    }
  };
};

export const changeUserManagementReducer = (data) => {
  return async (dispatch) => {
    dispatch({
      type: SET_USER_MANAGEMENT_REDUCER,
      payload: data,
    });
  };
};
