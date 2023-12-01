import { SET_COMBUSTION_TAG_DETAIL_REDUCER } from 'app/store/constants';

const initialState = {
  data: null,
  loading: false,
  error: '',
};

const combustionTagDetailReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_COMBUSTION_TAG_DETAIL_REDUCER:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default combustionTagDetailReducer;
