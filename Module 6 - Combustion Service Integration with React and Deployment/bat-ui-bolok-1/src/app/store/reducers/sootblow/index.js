import { SET_SOOTBLOW } from 'app/store/constants';

const initialState = {
  sootblowData: {
    sbPercentage: '',
    indicator: {},
    sequence: [],
    parameter: [],
    waitingTime: [],
    control: [],
    rules: [],
    timeoutSettings: [],
  },
  sootblowCurrentProcessData: {
    lastProcess: '',
    aphOutletTemp: 0,
    mainSteamTemp: 0,
    activePower: 0,
  },

  sootblowSafeguardHistoryData: [],
  sootblowSafeguardAddressNumber: '',
  sootblowSafeguardHistoryTotal: 0,
  sootblowSafeguardHistoryPage: 0,
  sootblowSafeguardHistoryLimit: 10,
  sootblowSuggestionAsTestData: { area: '', trigger: '' },

  sootblowSafeguardDetailRuleValue: '',
  sootblowSafeguardDetailRuleLogic: '',
  sootblowSafeguardDetailRuleData: [],
  sootblowSafeguardLabel: '',

  sootblowRecomendationDetailRuleValue: '',
  sootblowRecomendationDetailRuleLogic: '',
  sootblowRecommendationDetailRuleData: [],
  sootblowRecommendationLabel: '',

  sootblowAlarmHistoryData: [],
  sootblowParameterDetailData: {},
  sootblowRuleDetailData: {
    label: '',
    subLabel: '',
    id: '',
    isActive: '',
    updateAt: '',
    updateBy: '',
    presetList: [],
    presetId: '',
  },
  sootblowNewPresetName: '',
  sootblowRuleSelectedPreset: '',
  sootblowRuleTags: [],
  sootblowDetailRule: [],
  sootblowSettingDetailData: {},
  sootblowTimeoutDetailData: {},
  loading: true,
  loadingSootblowData: true,
  loadingAlarmHistory: true,
  loadingMasterControl: true,
  loadingParameterUpdate: false,
  loadingRuleUpdate: false,
  loadingSootblowUpdate: false,
  loadingTimeoutSettingsUpdate: false,
  loadingExport: false,
  errorExport: false,
  error: '',
  errorSootblow: false,
  errorAlarmHistory: false,
  errorGetDetailTimeout: false,
  errorRecommendationDetailRule: false,

  sootblowRecommendationHistoryData: [],
  sootblowRecommendationHistoryTotal: 0,
  sootblowRecommendationHistoryPage: 0,
  sootblowRecommendationHistoryLimit: 10,
  sootblowRecommendationAddressNumber: '',
  sootblowRecommendationZone: '',
  sootblowRecommendationHistoryLoading: true,
  hasMoreAlarmHistory: true,
  sootblowAlarmHistoryLimit: 100,
  sootblowAlarmHistoryPage: 0,
  sootblowAlarmHistoryTotal: 0,
  sootblowActionLoading: false,
};

const sootblowReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SOOTBLOW:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default sootblowReducer;
