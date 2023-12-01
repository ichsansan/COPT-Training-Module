import { SET_USER_MANAGEMENT_REDUCER } from 'app/store/constants';

const initialState = {
  detailData: {
    fullname: '',
    username: '',
    email: '',
    role: '',
    id: '',
  },
  search: '',
  data: [],
  sortBy: 'id',
  sortType: 'desc',
  page: 0,
  limit: 100,
  total: 0,
  loading: true,
  loadingPost: false,
  loadingDelete: false,
  loadingDialog: false,
  loadingDetail: false,
  error: false,
  errorDialog: false,
  errorDetail: false,
};

const userManagementReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_MANAGEMENT_REDUCER:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default userManagementReducer;
