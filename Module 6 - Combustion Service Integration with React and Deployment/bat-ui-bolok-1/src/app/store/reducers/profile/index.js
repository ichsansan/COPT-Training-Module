import { SET_PROFILE } from 'app/store/constants';

const initialState = {
  photoFile: null,
  postLoading: false,
  error: false,
};

const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PROFILE:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default profileReducer;
