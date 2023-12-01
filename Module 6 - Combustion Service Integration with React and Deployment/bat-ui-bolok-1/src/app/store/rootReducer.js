import auth from 'app/auth/store';
import { combineReducers } from 'redux';
import fuse from './fuse';
import i18n from './i18nSlice';
import {
  combustionReducer,
  efficiencyReducer,
  profileReducer,
  sootblowReducer,
  userGuideReducer,
  userManagementReducer,
  combustionTagDetailReducer,
} from './reducers';

const createReducer = (asyncReducers) =>
  combineReducers({
    auth,
    fuse,
    i18n,
    combustionTagDetailReducer,
    userGuideReducer,
    profileReducer,
    sootblowReducer,
    combustionReducer,
    efficiencyReducer,
    userManagementReducer,
    ...asyncReducers,
  });

export default createReducer;
