import { SET_USER_GUIDE } from 'app/store/constants';

const initialState = {
  userGuideFile: null,
  workInstructionFile: null,
  postLoading: false,
  error: false,
};

const userGuideReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_GUIDE:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default userGuideReducer;
