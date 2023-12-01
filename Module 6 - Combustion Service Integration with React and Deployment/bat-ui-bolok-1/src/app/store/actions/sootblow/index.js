import axios from 'axios';
import { SET_SOOTBLOW } from 'app/store/constants';
import { showMessage } from 'app/store/fuse/messageSlice';
import moment from 'moment';

const baseURL = process.env.REACT_APP_API_URL;

export const exportSootblowLogRulesSettings = (id = '', label = '') => {
  return async (dispatch, getState) => {
    const {
      sootblowReducer: { filterStartDate, filterEndDate },
    } = getState();

    const formatDate = (date) => {
      return moment(date).format('YYYY-MM-DD');
    };

    const startDate = formatDate(filterStartDate);
    const endDate = formatDate(filterEndDate);

    await dispatch({
      type: SET_SOOTBLOW,
      payload: {
        loadingExport: true,
        errorExport: false,
      },
    });

    try {
      const response = await axios.get(
        `${baseURL}/service/bat/sootblow/export/rules-history/${id}?startDate=${startDate}&endDate=${endDate}`,
        {
          responseType: 'blob',
        }
      );
      const fileName = `${process.env.REACT_APP_UNIT_NAME}_SOOTBLOW-${label}_RULES_SETTINGS_HISTORY_LOG.csv`;
      const url = await window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName); // or any other extension
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      await dispatch({
        type: SET_SOOTBLOW,
        payload: {
          loadingExport: false,
        },
      });
      await dispatch(
        showMessage({
          message: `Rules (${label}) settings log data have been successfully exported`,
          variant: 'success',
        })
      );
      return true;
    } catch (error) {
      await dispatch(
        showMessage({
          message: error.response?.data?.message || error.message,
          variant: 'error',
        })
      );
      await dispatch({
        type: SET_SOOTBLOW,
        payload: {
          errorExport: error.response?.data?.message || error.message,
          loadingExport: false,
        },
      });
      return false;
    }
  };
};

export const exportSootblowLogParameterSettings = () => {
  return async (dispatch, getState) => {
    const {
      sootblowReducer: { filterStartDate, filterEndDate },
    } = getState();

    const formatDate = (date) => {
      return moment(date).format('YYYY-MM-DD');
    };

    const startDate = formatDate(filterStartDate);
    const endDate = formatDate(filterEndDate);

    await dispatch({
      type: SET_SOOTBLOW,
      payload: {
        loadingExport: true,
        errorExport: false,
      },
    });

    try {
      const response = await axios.get(
        `${baseURL}/service/bat/sootblow/export/parameter-history?startDate=${startDate}&endDate=${endDate}`,
        {
          responseType: 'blob',
        }
      );
      const fileName = `${process.env.REACT_APP_UNIT_NAME}_SOOTBLOW-PARAMETER_SETTINGS_HISTORY_LOG.csv`;
      const url = await window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName); // or any other extension
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      await dispatch({
        type: SET_SOOTBLOW,
        payload: {
          loadingExport: false,
        },
      });
      await dispatch(
        showMessage({
          message:
            'Parameter settings log data have been successfully exported',
          variant: 'success',
        })
      );
      return true;
    } catch (error) {
      await dispatch(
        showMessage({
          message: error.response?.data?.message || error.message,
          variant: 'error',
        })
      );
      await dispatch({
        type: SET_SOOTBLOW,
        payload: {
          errorExport: error.response?.data?.message || error.message,
          loadingExport: false,
        },
      });
      return false;
    }
  };
};

export const exportSootblowLogSootblowerSettings = () => {
  return async (dispatch, getState) => {
    const {
      sootblowReducer: { filterStartDate, filterEndDate },
    } = getState();

    const formatDate = (date) => {
      return moment(date).format('YYYY-MM-DD');
    };

    const startDate = formatDate(filterStartDate);
    const endDate = formatDate(filterEndDate);

    await dispatch({
      type: SET_SOOTBLOW,
      payload: {
        loadingExport: true,
        errorExport: false,
      },
    });

    try {
      const response = await axios.get(
        `${baseURL}/service/bat/sootblow/export/sootblower-history?startDate=${startDate}&endDate=${endDate}`,
        {
          responseType: 'blob',
        }
      );
      const fileName = `${process.env.REACT_APP_UNIT_NAME}_SOOTBLOW-SOOTBLOWER_SETTINGS_HISTORY_LOG.csv`;
      const url = await window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName); // or any other extension
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      await dispatch({
        type: SET_SOOTBLOW,
        payload: {
          loadingExport: false,
        },
      });
      await dispatch(
        showMessage({
          message:
            'Sootblower settings log data have been successfully exported',
          variant: 'success',
        })
      );
      return true;
    } catch (error) {
      await dispatch(
        showMessage({
          message: error.response?.data?.message || error.message,
          variant: 'error',
        })
      );
      await dispatch({
        type: SET_SOOTBLOW,
        payload: {
          errorExport: error.response?.data?.message || error.message,
          loadingExport: false,
        },
      });
      return false;
    }
  };
};

export const exportSootblowLogAlarmHistory = () => {
  return async (dispatch, getState) => {
    const {
      sootblowReducer: { filterStartDate, filterEndDate },
    } = getState();

    const formatDate = (date) => {
      return moment(date).format('YYYY-MM-DD');
    };

    const startDate = formatDate(filterStartDate);
    const endDate = formatDate(filterEndDate);

    await dispatch({
      type: SET_SOOTBLOW,
      payload: {
        loadingExport: true,
        errorExport: false,
      },
    });

    try {
      const response = await axios.get(
        `${baseURL}/service/bat/sootblow/export/alarm-history-log?startDate=${startDate}&endDate=${endDate}`,
        {
          responseType: 'blob',
        }
      );
      const fileName = `${process.env.REACT_APP_UNIT_NAME}_SOOTBLOW-ALARM_HISTORY_LOG.csv`;
      const url = await window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName); // or any other extension
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      await dispatch({
        type: SET_SOOTBLOW,
        payload: {
          loadingExport: false,
        },
      });
      await dispatch(
        showMessage({
          message: 'Alarm history log data have been successfully exported',
          variant: 'success',
        })
      );
      return true;
    } catch (error) {
      await dispatch(
        showMessage({
          message: error.response?.data?.message || error.message,
          variant: 'error',
        })
      );
      await dispatch({
        type: SET_SOOTBLOW,
        payload: {
          errorExport: error.response?.data?.message || error.message,
          loadingExport: false,
        },
      });
      return false;
    }
  };
};

export const exportSootblowLogTimeoutSettings = () => {
  return async (dispatch, getState) => {
    const {
      sootblowReducer: { filterStartDate, filterEndDate },
    } = getState();

    const formatDate = (date) => {
      return moment(date).format('YYYY-MM-DD');
    };

    const startDate = formatDate(filterStartDate);
    const endDate = formatDate(filterEndDate);

    await dispatch({
      type: SET_SOOTBLOW,
      payload: {
        loadingExport: true,
        errorExport: false,
      },
    });

    try {
      const response = await axios.get(
        `${baseURL}/service/bat/sootblow/export/timeout-history?startDate=${startDate}&endDate=${endDate}`,
        {
          responseType: 'blob',
        }
      );
      const fileName = `${process.env.REACT_APP_UNIT_NAME}_SOOTBLOW-TIMEOUT_SETTINGS_HISTORY_LOG.csv`;
      const url = await window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName); // or any other extension
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      await dispatch({
        type: SET_SOOTBLOW,
        payload: {
          loadingExport: false,
        },
      });
      await dispatch(
        showMessage({
          message: 'Timeout settings log data have been successfully exported',
          variant: 'success',
        })
      );
      return true;
    } catch (error) {
      await dispatch(
        showMessage({
          message: error.response?.data?.message || error.message,
          variant: 'error',
        })
      );
      await dispatch({
        type: SET_SOOTBLOW,
        payload: {
          errorExport: error.response?.data?.message || error.message,
          loadingExport: false,
        },
      });
      return false;
    }
  };
};

export const getSootblowSafeguardRuleDetail = () => {
  return async (dispatch) => {
    await dispatch({
      type: SET_SOOTBLOW,
      payload: {
        loading: true,
        sootblowSafeguardLabel: '',
        errorSafeguardDetailRule: false,
      },
    });
    try {
      const response = await axios.get(
        `${baseURL}/service/bat/sootblow/safeguardcheck`
      );
      await dispatch({
        type: SET_SOOTBLOW,
        payload: {
          sootblowSafeguardDetailRuleValue:
            response.data.object?.ruleValue || '',
          sootblowSafeguardDetailRuleLogic:
            response.data.object?.ruleLogic || '',
          sootblowSafeguardDetailRuleData:
            response.data.object?.detailRule || [],
          sootblowSafeguardLabel: response.data.object?.label,
          loading: false,
        },
      });
    } catch (error) {
      await dispatch(
        showMessage({
          message: error.response?.data?.message || error.message,
          variant: 'error',
        })
      );
      await dispatch({
        type: SET_SOOTBLOW,
        payload: {
          error: error.response?.data?.message || error.message,
          loading: false,
          errorSafeguardDetailRule: true,
        },
      });
    }
  };
};

export const postSootblowNewPreset = () => {
  return async (dispatch, getState) => {
    const {
      sootblowReducer: {
        sootblowDetailRule,
        sootblowRuleDetailData,
        sootblowNewPresetName,
      },
    } = getState();
    dispatch({
      type: SET_SOOTBLOW,
      payload: {
        loadingRuleUpdate: true,
      },
    });
    const data = {
      id: sootblowRuleDetailData.id,
      label: sootblowRuleDetailData.label,
      detailRule: sootblowDetailRule,
      presetName: sootblowNewPresetName,
    };
    const tempArr = [];

    for (let i = 0; i < sootblowDetailRule?.length; i++) {
      tempArr.push(
        sootblowDetailRule[i].bracketOpen,
        sootblowDetailRule[i].tagSensor,
        sootblowDetailRule[i].bracketClose
      );
    }
    // eslint-disable-next-line
    String.prototype.count = function (c) {
      let result = 0;
      let i = 0;
      for (i; i < this?.length; i++) if (this[i] === c) result++;
      return result;
    };

    const rule = tempArr.join('');

    const openBracketCount = rule.count('(');
    const closeBracketCount = rule.count(')');

    if (openBracketCount !== closeBracketCount) {
      dispatch(
        showMessage({
          message:
            openBracketCount > closeBracketCount
              ? "The rule expected to find a ')' to match the '('"
              : "The rule expected to find a '(' to match the ')'",
          variant: 'error',
        })
      );
      dispatch({
        type: SET_SOOTBLOW,
        payload: {
          loadingRuleUpdate: false,
        },
      });
    } else {
      try {
        await axios.post(`${baseURL}/service/bat/sootblow/preset`, data);

        await dispatch(
          showMessage({
            message: 'New preset has been added',
            variant: 'success',
          })
        );
        await dispatch({
          type: SET_SOOTBLOW,
          payload: {
            loadingRuleUpdate: false,
          },
        });
      } catch (error) {
        dispatch(
          showMessage({
            message: error.response?.data?.message || error?.message,
            variant: 'error',
          })
        );
        dispatch({
          type: SET_SOOTBLOW,
          payload: {
            error: error.response?.data?.message || error?.message,
            loadingRuleUpdate: false,
          },
        });
      }
    }
  };
};

export const updateRuleData = () => {
  return async (dispatch, getState) => {
    const {
      sootblowReducer: { sootblowDetailRule, sootblowRuleDetailData },
    } = getState();
    dispatch({
      type: SET_SOOTBLOW,
      payload: {
        loadingRuleUpdate: true,
      },
    });
    const data = {
      id: sootblowRuleDetailData.id,
      label: sootblowRuleDetailData.label,
      detailRule: sootblowDetailRule,
      presetId: sootblowRuleDetailData.presetId,
    };
    const tempArr = [];

    for (let i = 0; i < sootblowDetailRule?.length; i++) {
      tempArr.push(
        sootblowDetailRule[i].bracketOpen,
        sootblowDetailRule[i].tagSensor,
        sootblowDetailRule[i].bracketClose
      );
    }
    // eslint-disable-next-line
    String.prototype.count = function (c) {
      let result = 0;
      let i = 0;
      for (i; i < this?.length; i++) if (this[i] === c) result++;
      return result;
    };

    const rule = tempArr.join('');

    const openBracketCount = rule.count('(');
    const closeBracketCount = rule.count(')');

    if (openBracketCount !== closeBracketCount) {
      dispatch(
        showMessage({
          message:
            openBracketCount > closeBracketCount
              ? "The rule expected to find a ')' to match the '('"
              : "The rule expected to find a '(' to match the ')'",
          variant: 'error',
        })
      );
      dispatch({
        type: SET_SOOTBLOW,
        payload: {
          loadingSootblowData: false,
          loadingRuleUpdate: false,
        },
      });
      return false;
    }
    try {
      await axios.post(`${baseURL}/service/bat/sootblow/rule`, data);

      await dispatch(
        showMessage({
          message: "Rule's data has been updated",
          variant: 'success',
        })
      );
      await dispatch({
        type: SET_SOOTBLOW,
        payload: {
          loadingRuleUpdate: false,
        },
      });
      return true;
    } catch (error) {
      if (error?.response?.status === 406) {
        dispatch(
          showMessage({
            message:
              'The writing of the rules is still wrong, please check again',
            variant: 'error',
          })
        );
        dispatch({
          type: SET_SOOTBLOW,
          payload: {
            error: error.response?.data?.message || error?.message,
            loadingSootblowData: false,
            loadingRuleUpdate: false,
          },
        });
      } else {
        dispatch(
          showMessage({
            message: error.response?.data?.message || error?.message,
            variant: 'error',
          })
        );
        dispatch({
          type: SET_SOOTBLOW,
          payload: {
            error: error.response?.data?.message || error?.message,
            loadingSootblowData: false,
            loadingRuleUpdate: false,
          },
        });
      }
      return false;
    }
  };
};

export const changeSootblowActivePreset = (ruleId, presetId) => {
  return async (dispatch) => {
    dispatch({
      type: SET_SOOTBLOW,
      payload: {
        loadingRuleUpdate: true,
      },
    });
    try {
      await axios.put(
        `${baseURL}/service/bat/sootblow/preset/status/${ruleId}/${presetId}`
      );

      await dispatch(
        showMessage({
          message: "Rule's active preset has been updated",
          variant: 'success',
        })
      );
      await dispatch({
        type: SET_SOOTBLOW,
        payload: {
          loadingRuleUpdate: false,
        },
      });
    } catch (error) {
      dispatch(
        showMessage({
          message: error.response?.data?.message || error?.message,
          variant: 'error',
        })
      );
      dispatch({
        type: SET_SOOTBLOW,
        payload: {
          error: error.response?.data?.message || error?.message,
          loadingRuleUpdate: false,
        },
      });
    }
  };
};

export const getRuleTags = () => {
  return async (dispatch) => {
    await dispatch({
      type: SET_SOOTBLOW,
      payload: {
        loading: true,
      },
    });
    try {
      const response = await axios.get(
        `${baseURL}/service/bat/sootblow/tags/rule`
      );
      await dispatch({
        type: SET_SOOTBLOW,
        payload: {
          sootblowRuleTags: response?.data?.object,
          loading: false,
        },
      });
    } catch (error) {
      await dispatch(
        showMessage({
          message: error.response?.data?.message || error?.message,
          variant: 'error',
        })
      );
      await dispatch({
        type: SET_SOOTBLOW,
        payload: {
          error: error.response?.data?.message || error?.message,
          loading: false,
        },
      });
    }
  };
};

export const getRuleByID = (id, presetId) => {
  return async (dispatch) => {
    await dispatch({
      type: SET_SOOTBLOW,
      payload: {
        loading: true,
        error: '',
      },
    });
    try {
      const response = await axios.get(
        `${baseURL}/service/bat/sootblow/preset/${id}/${presetId}`
      );
      // let rules = await response?.data?.object?.presetDetail;
      // const response = await axios.get(`${baseURL}/service/bat/sootblow/rule/${id}`);
      const rules = (await response?.data?.object.detailRule) || [];
      for (let i = 0; i < rules.length; i++) {
        rules[i].sequence = 0;
        rules[i].sequence = i + 1;
      }

      await dispatch({
        type: SET_SOOTBLOW,
        payload: {
          sootblowRuleDetailData: {
            label: response?.data?.object?.label,
            subLabel: response?.data?.object?.presetHeader,
            id: response?.data?.object?.ruleId,
            presetId: response?.data?.object?.currentPresetId,
            isActive: response?.data?.object?.isActiveCurrent,
            updateAt: response?.data?.object?.updateAt,
            updateBy: response?.data?.object?.updateBy,
            presetList: response?.data?.object?.presetList || [],
          },
          sootblowRuleSelectedPreset: response?.data?.object?.presetList.find(
            (item) => item.presetId === presetId
          ),
          // sootblowRuleSelectedPreset: response?.data?.object?.presetList.find(item => item.isActive === 1),
          sootblowDetailRule: rules,

          loading: false,
        },
      });
    } catch (error) {
      await dispatch(
        showMessage({
          message: error.response?.data?.message || error?.message,
          variant: 'error',
        })
      );
      await dispatch({
        type: SET_SOOTBLOW,
        payload: {
          error: error.response?.data?.message || error?.message,
          loading: false,
        },
      });
    }
  };
};

export const getSootblowCurrentProcess = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(
        `${baseURL}/service/bat/sootblow/current-proses`
      );
      let lastProcess = [];
      const process = (await response?.data?.object?.proses) || [];
      for (let i = 0; i < process.length; i++) {
        lastProcess.push(process[i].trim());
      }

      lastProcess = lastProcess.toString().replace(/,/g, ', ');
      await dispatch({
        type: SET_SOOTBLOW,
        payload: {
          sootblowCurrentProcessData: {
            lastProcess: lastProcess || '-',
            aphOutletTemp: response?.data?.object?.aphOutletTemperature,
            mainSteamTemp: response?.data?.object?.mainSteamTemperature,
            activePower: response?.data?.object?.activePower,
          },
          errorSootblowCurrentProcess: false,
          loadingSootblowCurrentProcess: false,
        },
      });
    } catch (error) {
      dispatch(
        showMessage({
          message:
            `Sootblow Current Process: ${error.response?.data?.message}` ||
            error.message,
          variant: 'error',
        })
      );
      dispatch({
        type: SET_SOOTBLOW,
        payload: {
          error: error.response?.data?.message || error.message,
          errorSootblowCurrentProcess: true,
          loadingSootblowCurrentProcess: false,
        },
      });
    }
  };
};

export const exportSootblowRecommendationHistory = () => {
  return async (dispatch, getState) => {
    const {
      sootblowReducer: {
        filterStartDate,
        filterEndDate,
        sootblowRecommendationZone,
      },
    } = getState();

    await dispatch({
      type: SET_SOOTBLOW,
      payload: {
        loadingExport: true,
        errorExport: false,
      },
    });

    const formatDate = (date) => {
      return moment(date).format('YYYY-MM-DD');
    };

    const startDate = formatDate(filterStartDate);
    const endDate = formatDate(filterEndDate);

    try {
      const response = await axios.get(
        `${baseURL}/service/bat/sootblow/export/recommendation/${sootblowRecommendationZone}/history?startDate=${startDate}&endDate=${endDate}`,
        {
          responseType: 'blob',
        }
      );
      const fileName = `${process.env.REACT_APP_UNIT_NAME}_SOOTBLOW-RECOMMENDATION_HISTORY.csv`;
      const url = await window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName); // or any other extension
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      await dispatch({
        type: SET_SOOTBLOW,
        payload: {
          loadingExport: false,
        },
      });
      await dispatch(
        showMessage({
          message:
            'Sootblow recommendation history data have been successfully exported',
          variant: 'success',
        })
      );
      return true;
    } catch (error) {
      await dispatch(
        showMessage({
          message: error.response?.data?.message || error.message,
          variant: 'error',
        })
      );
      await dispatch({
        type: SET_SOOTBLOW,
        payload: {
          errorExport: error.response?.data?.message || error.message,
          loadingExport: false,
        },
      });
      return false;
    }
  };
};

export const exportSootblowTimeoutSettings = () => {
  return async (dispatch) => {
    await dispatch({
      type: SET_SOOTBLOW,
      payload: {
        loadingExport: true,
        errorExport: false,
      },
    });

    try {
      const response = await axios.get(
        `${baseURL}/service/bat/sootblow/export/timeout-settings`,
        {
          responseType: 'blob',
        }
      );
      const fileName = `${process.env.REACT_APP_UNIT_NAME}_SOOTBLOW-TIMEOUT_SETTINGS.csv`;
      const url = await window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName); // or any other extension
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      await dispatch({
        type: SET_SOOTBLOW,
        payload: {
          loadingExport: false,
        },
      });
      await dispatch(
        showMessage({
          message: 'Timeout settings data have been successfully exported',
          variant: 'success',
        })
      );
      return true;
    } catch (error) {
      await dispatch(
        showMessage({
          message: error.response?.data?.message || error.message,
          variant: 'error',
        })
      );
      await dispatch({
        type: SET_SOOTBLOW,
        payload: {
          errorExport: error.response?.data?.message || error.message,
          loadingExport: false,
        },
      });
      return false;
    }
  };
};

export const exportSootblowAlarmHistory = () => {
  return async (dispatch, getState) => {
    const {
      sootblowReducer: { filterStartDate, filterEndDate },
    } = getState();

    await dispatch({
      type: SET_SOOTBLOW,
      payload: {
        loadingExport: true,
        errorExport: false,
      },
    });

    const formatDate = (date) => {
      return moment(date).format('YYYY-MM-DD');
    };

    const startDate = formatDate(filterStartDate);
    const endDate = formatDate(filterEndDate);

    try {
      const response = await axios.get(
        `${baseURL}/service/bat/sootblow/export/alarm-history?startDate=${startDate}&endDate=${endDate}`,
        {
          responseType: 'blob',
        }
      );
      const fileName = `${process.env.REACT_APP_UNIT_NAME}_SOOTBLOW-ALARM_HISTORY.csv`;
      const url = await window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName); // or any other extension
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      await dispatch({
        type: SET_SOOTBLOW,
        payload: {
          loadingExport: false,
        },
      });
      await dispatch(
        showMessage({
          message: 'Alarm history data have been successfully exported',
          variant: 'success',
        })
      );
      return true;
    } catch (error) {
      await dispatch(
        showMessage({
          message: error.response?.data?.message || error.message,
          variant: 'error',
        })
      );
      await dispatch({
        type: SET_SOOTBLOW,
        payload: {
          errorExport: error.response?.data?.message || error.message,
          loadingExport: false,
        },
      });
      return false;
    }
  };
};

export const exportSootblowSootblowerSettings = () => {
  return async (dispatch) => {
    await dispatch({
      type: SET_SOOTBLOW,
      payload: {
        loadingExport: true,
        errorExport: false,
      },
    });

    try {
      const response = await axios.get(
        `${baseURL}/service/bat/sootblow/export/sootblower-settings`,
        {
          responseType: 'blob',
        }
      );
      const fileName = `${process.env.REACT_APP_UNIT_NAME}_SOOTBLOW-SOOTBLOWER_SETTINGS.csv`;
      const url = await window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName); // or any other extension
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      await dispatch({
        type: SET_SOOTBLOW,
        payload: {
          loadingExport: false,
        },
      });
      await dispatch(
        showMessage({
          message: 'Sootblower settings data have been successfully exported',
          variant: 'success',
        })
      );
      return true;
    } catch (error) {
      await dispatch(
        showMessage({
          message: error.response?.data?.message || error.message,
          variant: 'error',
        })
      );
      await dispatch({
        type: SET_SOOTBLOW,
        payload: {
          errorExport: error.response?.data?.message || error.message,
          loadingExport: false,
        },
      });
      return false;
    }
  };
};

export const exportSootblowRecommendation = () => {
  return async (dispatch) => {
    await dispatch({
      type: SET_SOOTBLOW,
      payload: {
        loadingExport: true,
        errorExport: false,
      },
    });

    try {
      const response = await axios.get(
        `${baseURL}/service/bat/sootblow/export/recommendation`,
        {
          responseType: 'blob',
        }
      );
      const fileName = `${process.env.REACT_APP_UNIT_NAME}_SOOTBLOW-RECOMMENDATION_SETTINGS.csv`;
      const url = await window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName); // or any other extension
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      await dispatch({
        type: SET_SOOTBLOW,
        payload: {
          loadingExport: false,
        },
      });
      await dispatch(
        showMessage({
          message: 'Recommendation data have been successfully exported',
          variant: 'success',
        })
      );
      return true;
    } catch (error) {
      await dispatch(
        showMessage({
          message: error.response?.data?.message || error.message,
          variant: 'error',
        })
      );
      await dispatch({
        type: SET_SOOTBLOW,
        payload: {
          errorExport: error.response?.data?.message || error.message,
          loadingExport: false,
        },
      });
      return false;
    }
  };
};

export const exportSootblowRulesSettings = () => {
  return async (dispatch) => {
    await dispatch({
      type: SET_SOOTBLOW,
      payload: {
        loadingExport: true,
        errorExport: false,
      },
    });

    try {
      const response = await axios.get(
        `${baseURL}/service/bat/sootblow/export/rules-settings`,
        {
          responseType: 'blob',
        }
      );
      const fileName = `${process.env.REACT_APP_UNIT_NAME}_SOOTBLOW-RULES_SETTINGS.csv`;
      const url = await window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName); // or any other extension
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      await dispatch({
        type: SET_SOOTBLOW,
        payload: {
          loadingExport: false,
        },
      });
      await dispatch(
        showMessage({
          message: 'Rules settings data have been successfully exported',
          variant: 'success',
        })
      );
      return true;
    } catch (error) {
      await dispatch(
        showMessage({
          message: error.response?.data?.message || error.message,
          variant: 'error',
        })
      );
      await dispatch({
        type: SET_SOOTBLOW,
        payload: {
          errorExport: error.response?.data?.message || error.message,
          loadingExport: false,
        },
      });
      return false;
    }
  };
};

export const exportSootblowParameterSettings = () => {
  return async (dispatch) => {
    await dispatch({
      type: SET_SOOTBLOW,
      payload: {
        loadingExport: true,
        errorExport: false,
      },
    });

    try {
      const response = await axios.get(
        `${baseURL}/service/bat/sootblow/export/parameter-settings`,
        {
          responseType: 'blob',
        }
      );
      const fileName = `${process.env.REACT_APP_UNIT_NAME}_SOOTBLOW-PARAMETER_SETTINGS.csv`;
      const url = await window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName); // or any other extension
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      await dispatch({
        type: SET_SOOTBLOW,
        payload: {
          loadingExport: false,
        },
      });
      await dispatch(
        showMessage({
          message: 'Parameter settings data have been successfully exported',
          variant: 'success',
        })
      );
      return true;
    } catch (error) {
      await dispatch(
        showMessage({
          message: error.response?.data?.message || error.message,
          variant: 'error',
        })
      );
      await dispatch({
        type: SET_SOOTBLOW,
        payload: {
          errorExport: error.response?.data?.message || error.message,
          loadingExport: false,
        },
      });
      return false;
    }
  };
};

export const updateSootblowTimeoutData = (data) => {
  return async (dispatch) => {
    try {
      await axios.post(`${baseURL}/service/bat/sootblow/timeOut`, data);
      await dispatch({
        type: SET_SOOTBLOW,
        payload: {
          loadingTimeoutSettingsUpdate: false,
        },
      });
      await dispatch(
        showMessage({
          message: 'Timeout setting has been updated',
          variant: 'success',
        })
      );
    } catch (error) {
      await dispatch(
        showMessage({
          message: error.response?.data?.message || error.message,
          variant: 'error',
        })
      );
      await dispatch({
        type: SET_SOOTBLOW,
        payload: {
          error: error.response?.data?.message || error.message,
          loadingTimeoutSettingsUpdate: false,
        },
      });
    }
  };
};

export const getSootblowTimeoutByID = (id) => {
  return async (dispatch) => {
    await dispatch({
      type: SET_SOOTBLOW,
      payload: {
        loading: true,
        errorGetDetailTimeout: false,
        error: '',
      },
    });

    try {
      const response = await axios.get(
        `${baseURL}/service/bat/sootblow/timeOut/${id}`
      );
      await dispatch({
        type: SET_SOOTBLOW,
        payload: {
          sootblowTimeoutDetailData: response.data.object,
          loading: false,
        },
      });
    } catch (error) {
      await dispatch(
        showMessage({
          message: error.response?.data?.message || error.message,
          variant: 'error',
        })
      );
      await dispatch({
        type: SET_SOOTBLOW,
        payload: {
          error: error.response?.data?.message || error.message,
          loading: false,
          errorGetDetailTimeout: true,
        },
      });
    }
  };
};

export const getAlarmHistoryByID = (id) => {
  return async (dispatch) => {
    await dispatch({
      type: SET_SOOTBLOW,
      payload: {
        loading: true,
        errorGetDetailAlarmHistory: false,
      },
    });

    try {
      const response = await axios.get(
        `${baseURL}/service/bat/sootblow/detail/alarm-history/${id}`
      );
      await dispatch({
        type: SET_SOOTBLOW,
        payload: {
          sootblowAlarmHistoryDetailData: response.data.object,
          loading: false,
        },
      });
    } catch (error) {
      await dispatch(
        showMessage({
          message: error.response?.data?.message || error.message,
          variant: 'error',
        })
      );
      await dispatch({
        type: SET_SOOTBLOW,
        payload: {
          error: error.response?.data?.message || error.message,
          loading: false,
          errorGetDetailAlarmHistory: true,
        },
      });
    }
  };
};

export const updateAlarmHistoryData = (data) => {
  return async (dispatch) => {
    try {
      await axios.post(
        `${baseURL}/service/bat/sootblow/update/alarm-history`,
        data
      );
      await dispatch({
        type: SET_SOOTBLOW,
        payload: {
          loadingAlarmHistoryUpdate: false,
        },
      });
      await dispatch(
        showMessage({
          message: 'Alarm description has been updated',
          variant: 'success',
        })
      );
      return true;
    } catch (error) {
      await dispatch(
        showMessage({
          message: error.response?.data?.message || error.message,
          variant: 'error',
        })
      );
      await dispatch({
        type: SET_SOOTBLOW,
        payload: {
          error: error.response?.data?.message || error.message,
          loadingAlarmHistoryUpdate: false,
        },
      });
      return false;
    }
  };
};

export const postSootRecommendation = (addressNo) => {
  return async (dispatch) => {
    await dispatch({
      type: SET_SOOTBLOW,
      payload: {
        sootblowActionLoading: true,
      },
    });
    await axios
      .post(`${baseURL}/service/bat/sootblow/soot/${addressNo}`)
      .then(() => {
        dispatch(
          showMessage({
            message: `Recommendation for ${addressNo || '-'} has been sooted`,
            variant: 'success',
          })
        );
        dispatch({
          type: SET_SOOTBLOW,
          payload: {
            sootblowActionLoading: false,
          },
        });
      })
      .catch((error) => {
        if (error.response?.status === 500) {
          dispatch(
            showMessage({
              message: 'Sorry, something went wrong with the server',
              variant: 'error',
            })
          );
          dispatch({
            type: SET_SOOTBLOW,
            payload: {
              sootblowActionLoading: false,
            },
          });
        } else {
          dispatch(
            showMessage({
              message: error.response?.data?.message || error.message,
              variant: 'error',
            })
          );
          dispatch({
            type: SET_SOOTBLOW,
            payload: {
              sootblowActionLoading: false,
            },
          });
        }
      });
  };
};

export const getRecommendationHistory = () => {
  return async (dispatch, getState) => {
    const {
      sootblowReducer: {
        sootblowRecommendationHistoryPage,
        sootblowRecommendationHistoryLimit,
        sootblowRecommendationAddressNumber,
      },
    } = getState();

    await dispatch({
      type: SET_SOOTBLOW,
      payload: {
        sootblowRecommendationHistoryLoading: true,
        errorRecommendationHistory: false,
      },
    });
    try {
      const response = await axios.get(
        `${baseURL}/service/bat/sootblow/history_suggestion/${sootblowRecommendationAddressNumber}?page=${sootblowRecommendationHistoryPage}&limit=${sootblowRecommendationHistoryLimit}`
      );
      await dispatch({
        type: SET_SOOTBLOW,
        payload: {
          sootblowRecommendationHistoryLoading: false,
          sootblowRecommendationHistoryData: response?.data?.object,
          sootblowRecommendationHistoryTotal: response?.data?.total,
        },
      });
    } catch (error) {
      await dispatch(
        showMessage({
          message: error.response?.data?.message || error.message,
          variant: 'error',
        })
      );
      await dispatch({
        type: SET_SOOTBLOW,
        payload: {
          errorRecommendationHistory: true,
          sootblowRecommendationHistoryLoading: false,
        },
      });
    }
  };
};

export const getAlarmHistory = () => {
  return async (dispatch, getState) => {
    const {
      sootblowReducer: {
        sootblowAlarmHistoryLimit,
        sootblowAlarmHistoryData,
        sootblowAlarmHistoryPage,
      },
    } = getState();

    try {
      const response = await axios.get(
        `${baseURL}/service/bat/sootblow/alarm-history?page=${sootblowAlarmHistoryPage}&limit=${sootblowAlarmHistoryLimit}`
      );
      const alarmTotal = await response?.data?.total;
      if (
        sootblowAlarmHistoryData?.length >= alarmTotal ||
        alarmTotal <= sootblowAlarmHistoryLimit
      ) {
        await dispatch({
          type: SET_SOOTBLOW,
          payload: {
            sootblowAlarmHistoryData: response.data?.object
              ? [...sootblowAlarmHistoryData, ...response?.data?.object]
              : [],
            errorAlarmHistory: false,
            loadingAlarmHistory: false,
            sootblowAlarmHistoryTotal: response?.data?.total,
            hasMoreAlarmHistory: false,
          },
        });
      } else {
        await dispatch({
          type: SET_SOOTBLOW,
          payload: {
            sootblowAlarmHistoryData: response.data?.object
              ? [...sootblowAlarmHistoryData, ...response?.data?.object]
              : [],
            errorAlarmHistory: false,
            loadingAlarmHistory: false,
            sootblowAlarmHistoryTotal: response?.data?.total,
            hasMoreAlarmHistory: true,
          },
        });
      }
    } catch (error) {
      dispatch(
        showMessage({
          message:
            `Alarm history: ${error.response?.data?.message}` || error.message,
          variant: 'error',
        })
      );
      dispatch({
        type: SET_SOOTBLOW,
        payload: {
          hasMoreAlarmHistory: false,
          error: error.response?.data?.message || error.message,
          errorAlarmHistory: true,
          loadingAlarmHistory: false,
        },
      });
    }
  };
};

export const getSootblowData = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(
        `${baseURL}/service/bat/sootblow/indicator`
      );
      await dispatch({
        type: SET_SOOTBLOW,
        payload: {
          sootblowData: {
            sbPercentage: response?.data?.object?.available[0].value || '',
            indicator: response?.data?.object.indicator || {},
            sequence: response?.data?.object.sequence || [],
            parameter: response?.data?.object.parameter || [],
            waitingTime: response?.data?.object.waitingTime || [],
            control: response?.data?.object.control || [],
            rules: response?.data?.object.rules || [],
            fixedTimeSuggestion:
              response?.data?.object?.fixedTimeSuggestion || 0,
            timeoutSettings: response?.data?.object?.timeOut || [],
          },
          errorSootblow: false,
          loadingSootblowData: false,
        },
      });
    } catch (error) {
      // if (error.response?.status === 500) {
      // 	dispatch(
      // 		showMessage({
      // 			message: "Sorry, something went wrong with Sootblow's service",
      // 			variant: 'error'
      // 		})
      // 	);
      // 	// history.push({ pathname: '/errors/error-500' });
      // }
      dispatch(
        showMessage({
          message:
            `Sootblow: ${error.response?.data?.message}` || error.message,
          variant: 'error',
        })
      );
      dispatch({
        type: SET_SOOTBLOW,
        payload: {
          error: error.response?.data?.message || error.message,
          errorSootblow: true,
          loadingSootblowData: false,
        },
      });
    }
  };
};

export const getRecommendationRuleDetail = (id = 0, zone = 0) => {
  return async (dispatch) => {
    await dispatch({
      type: SET_SOOTBLOW,
      payload: {
        loading: true,
        sootblowRecommendationLabel: '',
        errorRecommendationDetailRule: false,
      },
    });
    try {
      const response = await axios.get(
        `${baseURL}/service/bat/sootblow/realtime/rule/${id}/${zone}`
      );

      await dispatch({
        type: SET_SOOTBLOW,
        payload: {
          sootblowRecomendationDetailRuleValue:
            response.data.object?.ruleValue || '',
          sootblowRecomendationDetailRuleLogic:
            response.data.object?.ruleLogic || '',
          sootblowRecommendationDetailRuleData:
            response.data.object?.detailRule || [],
          sootblowRecommendationLabel: response.data.object?.label,
          loading: false,
        },
      });
    } catch (error) {
      await dispatch(
        showMessage({
          message: error.response?.data?.message || error.message,
          variant: 'error',
        })
      );
      await dispatch({
        type: SET_SOOTBLOW,
        payload: {
          error: error.response?.data?.message || error.message,
          loading: false,
          errorRecommendationDetailRule: true,
        },
      });
    }
  };
};

export const getRecommendationRuleByID = (id) => {
  return async (dispatch) => {
    await dispatch({
      type: SET_SOOTBLOW,
      payload: {
        loading: true,
      },
    });
    try {
      const response = await axios.get(
        `${baseURL}/service/bat/sootblow/realtime/rule/${id}`
      );
      let rules = (await response?.data?.object.detailRule) || [];
      if (rules?.length === 0) {
        rules = [];
      } else {
        for (let i = 0; i < rules?.length; i++) {
          rules[i].sequence = 0;
          rules[i].sequence = i + 1;
        }
      }

      await dispatch({
        type: SET_SOOTBLOW,
        payload: {
          sootblowRuleDetailData: {
            label: response?.data?.object.label,
            id: response?.data?.object.id,
          },
          sootblowDetailRule: rules || [],

          loading: false,
        },
      });
    } catch (error) {
      await dispatch(
        showMessage({
          message: error.response?.data?.message || error.message,
          variant: 'error',
        })
      );
      await dispatch({
        type: SET_SOOTBLOW,
        payload: {
          error: error.response?.data?.message || error.message,
          loading: false,
        },
      });
    }
  };
};

export const getParameterByID = (id) => {
  return async (dispatch) => {
    await dispatch({
      type: SET_SOOTBLOW,
      payload: {
        loading: true,
      },
    });

    try {
      const response = await axios.get(
        `${baseURL}/service/bat/sootblow/parameter/${id}`
      );
      await dispatch({
        type: SET_SOOTBLOW,
        payload: {
          sootblowParameterDetailData: response?.data?.object || {},
          loading: false,
        },
      });
    } catch (error) {
      await dispatch(
        showMessage({
          message: error.response?.data?.message || error.message,
          variant: 'error',
        })
      );
      await dispatch({
        type: SET_SOOTBLOW,
        payload: {
          error: error.response?.data?.message || error.message,
          loading: false,
        },
      });
    }
  };
};

export const getSootblowSettingByID = (id) => {
  return async (dispatch) => {
    await dispatch({
      type: SET_SOOTBLOW,
      payload: {
        loading: true,
      },
    });

    try {
      const response = await axios.get(
        `${baseURL}/service/bat/sootblow/waitingtime/${id}`
      );
      await dispatch({
        type: SET_SOOTBLOW,
        payload: {
          sootblowSettingDetailData: response?.data?.object,
          loading: false,
        },
      });
    } catch (error) {
      await dispatch(
        showMessage({
          message: error.response?.data?.message || error.message,
          variant: 'error',
        })
      );
      await dispatch({
        type: SET_SOOTBLOW,
        payload: {
          error: error.response?.data?.message || error.message,
          loading: false,
        },
      });
    }
  };
};

export const updateParameterData = (data) => {
  return async (dispatch) => {
    await axios
      .post(`${baseURL}/service/bat/sootblow/parameter`, data)
      .then(() => {
        dispatch(
          showMessage({
            message: "Parameter's value has been updated",
            variant: 'success',
          })
        );
        dispatch({
          type: SET_SOOTBLOW,
          payload: {
            loadingParameterUpdate: false,
          },
        });
      })
      .catch((error) => {
        if (error.response?.status === 500) {
          dispatch(
            showMessage({
              message: 'Sorry, something went wrong with the server',
              variant: 'error',
            })
          );
          dispatch({
            type: SET_SOOTBLOW,
            payload: {
              error: error.response?.data?.message || error.message,
              loadingSootblowData: false,
              loadingParameterUpdate: false,
            },
          });
        } else {
          dispatch(
            showMessage({
              message: error.response?.data?.message || error.message,
              variant: 'error',
            })
          );
          dispatch({
            type: SET_SOOTBLOW,
            payload: {
              error: error.response?.data?.message || error.message,
              loadingSootblowData: false,
              loadingParameterUpdate: false,
            },
          });
        }
      });
  };
};

export const updateSootblowSettingData = (data) => {
  return async (dispatch) => {
    await axios
      .post(`${baseURL}/service/bat/sootblow/waitingtime`, data)
      .then(() => {
        dispatch(
          showMessage({
            message: "Sootblow's setting has been updated",
            variant: 'success',
          })
        );
        dispatch({
          type: SET_SOOTBLOW,
          payload: {
            loadingSootblowUpdate: false,
          },
        });
      })
      .catch((error) => {
        if (error.response?.status === 500) {
          dispatch(
            showMessage({
              message: 'Sorry, something went wrong with the server',
              variant: 'error',
            })
          );
          dispatch({
            type: SET_SOOTBLOW,
            payload: {
              error: error.response?.data?.message || error.message,
              loadingSootblowData: false,
              loadingSootblowUpdate: false,
            },
          });
        } else {
          dispatch(
            showMessage({
              message: error.response?.data?.message || error.message,
              variant: 'error',
            })
          );
          dispatch({
            type: SET_SOOTBLOW,
            payload: {
              error: error.response?.data?.message || error.message,
              loadingSootblowData: false,
              loadingSootblowUpdate: false,
            },
          });
        }
      });
  };
};

export const changeSootblow = (data) => {
  return async (dispatch) => {
    dispatch({
      type: SET_SOOTBLOW,
      payload: data,
    });
  };
};
