import { SET_EFFICIENCY } from 'app/store/constants';

const TODAY = new Date();
const DATE = new Date();
const YESTERDAY = DATE.setDate(DATE.getDate() - 1);

const initialState = {
  improvementEfficiency: '',
  baselineEfficiency: '',
  currentEfficiency: '',
  referenceValue: '',
  dateCurrent: '',
  dateBaseline: '',
  efficiencyIndicator: {
    sootblowOperationIndicator: 0,
    sootblowWatchdogIndicator: 0,
    sootblowSafeguardIndicator: 0,
    combustionOperationIndicator: 0,
    combustionWatchdogIndicator: 0,
    combustionSafeguardIndicator: 0,
  },
  chart: [],
  filterStartDate: YESTERDAY,
  filterEndDate: TODAY,
  loading: true,
  error: false,
};

const efficiencyReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_EFFICIENCY:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default efficiencyReducer;
