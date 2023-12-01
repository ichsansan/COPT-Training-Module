import axios from 'axios';
import { SET_COMBUSTION } from 'app/store/constants';
import { showMessage } from 'app/store/fuse/messageSlice';
import moment from 'moment';

const baseURL = process.env.REACT_APP_API_URL;

export const exportCombustionLogParameterSettings = () => {
  return async (dispatch, getState) => {
    const {
      combustionReducer: { filterStartDate, filterEndDate },
    } = getState();

    const formatDate = (date) => {
      return moment(date).format('YYYY-MM-DD');
    };

    const startDate = formatDate(filterStartDate);
    const endDate = formatDate(filterEndDate);

    await dispatch({
      type: SET_COMBUSTION,
      payload: {
        loadingExport: true,
        errorExport: false,
      },
    });

    try {
      const response = await axios.get(
        `${baseURL}/service/copt/bat/combustion/export/log-parameter-settings?startDate=${startDate}&endDate=${endDate}`,
        {
          responseType: 'blob',
        }
      );
      const fileName = `${process.env.REACT_APP_UNIT_NAME}_COMBUSTION-PARAMETER_SETTINGS_HISTORY_LOG.csv`;
      const url = await window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName); // or any other extension
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      await dispatch({
        type: SET_COMBUSTION,
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
        type: SET_COMBUSTION,
        payload: {
          errorExport: error.response?.data?.message || error.message,
          loadingExport: false,
        },
      });
      return false;
    }
  };
};

export const exportCombustionLogRulesSettings = (id = '', label = '') => {
  return async (dispatch, getState) => {
    const {
      combustionReducer: { filterStartDate, filterEndDate },
    } = getState();

    const formatDate = (date) => {
      return moment(date).format('YYYY-MM-DD');
    };

    const startDate = formatDate(filterStartDate);
    const endDate = formatDate(filterEndDate);

    await dispatch({
      type: SET_COMBUSTION,
      payload: {
        loadingExport: true,
        errorExport: false,
      },
    });

    try {
      const response = await axios.get(
        `${baseURL}/service/copt/bat/combustion/export/get-rules-log?rulesId=${id}&startDate=${startDate}&endDate=${endDate}`,
        {
          responseType: 'blob',
        }
      );
      const fileName = `${process.env.REACT_APP_UNIT_NAME}_COMBUSTION-${label}_RULES_SETTINGS_HISTORY_LOG.csv`;
      const url = await window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName); // or any other extension
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      await dispatch({
        type: SET_COMBUSTION,
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
        type: SET_COMBUSTION,
        payload: {
          errorExport: error.response?.data?.message || error.message,
          loadingExport: false,
        },
      });
      return false;
    }
  };
};

export const exportCombustionRecommendationHistory = () => {
  return async (dispatch, getState) => {
    const {
      combustionReducer: {
        filterStartDate,
        filterEndDate,
        combustionSafeguardAddressNumber,
      },
    } = getState();

    await dispatch({
      type: SET_COMBUSTION,
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
        `${baseURL}/service/bat/combustion/export/recommendation/${combustionSafeguardAddressNumber}/history?startDate=${startDate}&endDate=${endDate}`,
        {
          responseType: 'blob',
        }
      );
      const fileName = `${process.env.REACT_APP_UNIT_NAME}_COMBUSTION-RECOMMENDATION_HISTORY.csv`;
      const url = await window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName); // or any other extension
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      await dispatch({
        type: SET_COMBUSTION,
        payload: {
          loadingExport: false,
        },
      });
      await dispatch(
        showMessage({
          message:
            'Combustion recommendation history data have been successfully exported',
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
        type: SET_COMBUSTION,
        payload: {
          errorExport: error.response?.data?.message || error.message,
          loadingExport: false,
        },
      });
      return false;
    }
  };
};

export const exportCombustionSafeguardHistory = () => {
  return async (dispatch, getState) => {
    const {
      combustionReducer: {
        filterStartDate,
        filterEndDate,
        combustionSafeguardAddressNumber,
      },
    } = getState();

    await dispatch({
      type: SET_COMBUSTION,
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
        `${baseURL}/service/copt/bat/combustion/export/recommendation/${combustionSafeguardAddressNumber}/history?startDate=${startDate}&endDate=${endDate}`,
        {
          responseType: 'blob',
        }
      );
      const fileName = `${process.env.REACT_APP_UNIT_NAME}_COMBUSTION-RECOMMENDATION_HISTORY.csv`;
      const url = await window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName); // or any other extension
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      await dispatch({
        type: SET_COMBUSTION,
        payload: {
          loadingExport: false,
        },
      });
      await dispatch(
        showMessage({
          message:
            'Combustion recommendation history data have been successfully exported',
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
        type: SET_COMBUSTION,
        payload: {
          errorExport: error.response?.data?.message || error.message,
          loadingExport: false,
        },
      });
      return false;
    }
  };
};

export const getCombustionSafeguardRuleDetail = () => {
  return async (dispatch) => {
    await dispatch({
      type: SET_COMBUSTION,
      payload: {
        loading: true,
        combustionSafeguardLabel: '',
        errorSafeguardDetailRule: false,
      },
    });
    try {
      const response = await axios.get(
        `${baseURL}/service/copt/bat/combustion/background/safeguardcheck`
      );

      await dispatch({
        type: SET_COMBUSTION,
        payload: {
          combustionSafeguardDetailRuleValue:
            response.data.object?.ruleValue || '',
          combustionSafeguardDetailRuleLogic:
            response.data.object?.ruleLogic || '',
          combustionSafeguardDetailRuleData:
            response.data.object?.detailRule || [],
          combustionSafeguardLabel: response.data.object?.label,
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
        type: SET_COMBUSTION,
        payload: {
          error: error.response?.data?.message || error.message,
          loading: false,
          errorSafeguardDetailRule: true,
        },
      });
    }
  };
};

export const exportCombustionRecommendation = () => {
  return async (dispatch, getState) => {
    const {
      combustionReducer: { filterStartDate, filterEndDate },
    } = getState();

    await dispatch({
      type: SET_COMBUSTION,
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
        `${baseURL}/service/copt/bat/combustion/export/recommendation`,
        {
          params: {
            startDate,
            endDate,
          },
          responseType: 'blob',
        }
      );
      const fileName = `${process.env.REACT_APP_UNIT_NAME}_COMBUSTION-RECOMMENDATION.csv`;
      const url = await window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName); // or any other extension
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      await dispatch({
        type: SET_COMBUSTION,
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
        type: SET_COMBUSTION,
        payload: {
          errorExport: error.response?.data?.message || error.message,
          loadingExport: false,
        },
      });
      return false;
    }
  };
};

export const exportCombustionParameterSettings = () => {
  return async (dispatch) => {
    await dispatch({
      type: SET_COMBUSTION,
      payload: {
        loadingExport: true,
        errorExport: false,
      },
    });

    try {
      const response = await axios.get(
        `${baseURL}/service/copt/bat/combustion/export/parameter-settings`,
        {
          responseType: 'blob',
        }
      );
      const fileName = `${process.env.REACT_APP_UNIT_NAME}_COMBUSTION-PARAMETER SETTINGS.csv`;
      const url = await window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName); // or any other extension
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      await dispatch({
        type: SET_COMBUSTION,
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
        type: SET_COMBUSTION,
        payload: {
          errorExport: error.response?.data?.message || error.message,
          loadingExport: false,
        },
      });
      return false;
    }
  };
};

export const exportCombustionRulesSettings = () => {
  return async (dispatch) => {
    await dispatch({
      type: SET_COMBUSTION,
      payload: {
        loadingExport: true,
        errorExport: false,
      },
    });

    try {
      const response = await axios.get(
        `${baseURL}/service/copt/bat/combustion/export/rules-settings`,
        {
          responseType: 'blob',
        }
      );
      const fileName = `${process.env.REACT_APP_UNIT_NAME}_COMBUSTION-RULES SETTINGS.csv`;
      const url = await window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName); // or any other extension
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      await dispatch({
        type: SET_COMBUSTION,
        payload: {
          loadingExport: false,
        },
      });
      await dispatch(
        showMessage({
          message: 'Rule settings data have been successfully exported',
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
        type: SET_COMBUSTION,
        payload: {
          errorExport: error.response?.data?.message || error.message,
          loadingExport: false,
        },
      });
      return false;
    }
  };
};

export const exportCombustionAlarmHistory = () => {
  return async (dispatch, getState) => {
    const {
      combustionReducer: { filterStartDate, filterEndDate },
    } = getState();

    await dispatch({
      type: SET_COMBUSTION,
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
        `${baseURL}/service/copt/bat/combustion/export/alarm-history?startDate=${startDate}&endDate=${endDate}`,
        {
          responseType: 'blob',
        }
      );
      const fileName = `${process.env.REACT_APP_UNIT_NAME}_COMBUSTION-ALARM HISTORY.csv`;
      const url = await window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName); // or any other extension
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      await dispatch({
        type: SET_COMBUSTION,
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
        type: SET_COMBUSTION,
        payload: {
          errorExport: error.response?.data?.message || error.message,
          loadingExport: false,
        },
      });
      return false;
    }
  };
};

export const updateCombustionBypassStatusData = (data) => {
  return async (dispatch) => {
    try {
      await axios.post(
        `${baseURL}/service/copt/bat/combustion/update/byPass`,
        data
      );
      await dispatch({
        type: SET_COMBUSTION,
        payload: {
          loadingBypassStatusUpdate: false,
        },
      });
      await dispatch(
        showMessage({
          message: 'Bypass status has been updated',
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
        type: SET_COMBUSTION,
        payload: {
          error: error.response?.data?.message || error.message,
          loadingBypassStatusUpdate: false,
        },
      });
    }
  };
};

export const getCombustionBypassStatusByID = (id) => {
  return async (dispatch) => {
    await dispatch({
      type: SET_COMBUSTION,
      payload: {
        loading: true,
        errorGetDetailBypassStatus: false,
      },
    });

    try {
      const response = await axios.get(
        `${baseURL}/service/copt/bat/combustion/detail/bypass-detail/${id}`
      );
      await dispatch({
        type: SET_COMBUSTION,
        payload: {
          combustionBypassStatusDetailData: response.data.object,
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
        type: SET_COMBUSTION,
        payload: {
          error: error.response?.data?.message || error.message,
          loading: false,
          errorGetDetailBypassStatus: true,
        },
      });
    }
  };
};

export const getCombustionBypassStatus = () => {
  return async (dispatch) => {
    await dispatch({
      type: SET_COMBUSTION,
      payload: {
        errorBypassStatus: false,
        loadingBypassStatus: true,
      },
    });
    try {
      const response = await axios.get(
        `${baseURL}/service/copt/bat/combustion/bypass-status`
      );
      await dispatch({
        type: SET_COMBUSTION,
        payload: {
          combustionBypassStatusData: response?.data?.object,
          errorBypassStatus: false,
          loadingBypassStatus: false,
        },
      });
    } catch (error) {
      dispatch(
        showMessage({
          message:
            `Bypass status: ${error.response?.data?.message}` || error.message,
          variant: 'error',
        })
      );
      dispatch({
        type: SET_COMBUSTION,
        payload: {
          error: error.response?.data?.message || error.message,
          errorBypassStatus: true,
          loadingBypassStatus: false,
        },
      });
    }
  };
};

export const updateCombustionParameterData = (data) => {
  return async (dispatch) => {
    await axios
      .post(`${baseURL}/service/copt/bat/combustion/parameter`, data)
      .then(() => {
        dispatch(
          showMessage({
            message: "Parameter's value has been updated",
            variant: 'success',
          })
        );
        dispatch({
          type: SET_COMBUSTION,
          payload: {
            loadingParameterUpdate: false,
          },
        });
      })
      .catch((error) => {
        if (error?.response?.status === 500) {
          dispatch(
            showMessage({
              message: 'Sorry, something went wrong with the server',
              variant: 'error',
            })
          );
          dispatch({
            type: SET_COMBUSTION,
            payload: {
              error: error.response?.data?.message || error.message,
              loadingCombustion: false,
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
            type: SET_COMBUSTION,
            payload: {
              error: error.response?.data?.message || error.message,
              loadingCombustion: false,
              loadingParameterUpdate: false,
            },
          });
        }
      });
  };
};

export const getCombustionParameterByID = (id) => {
  return async (dispatch) => {
    await dispatch({
      type: SET_COMBUSTION,
      payload: {
        loading: true,
      },
    });

    try {
      const response = await axios.get(
        `${baseURL}/service/copt/bat/combustion/parameter/${id}`
      );
      await dispatch({
        type: SET_COMBUSTION,
        payload: {
          combustionParameterDetailData: response.data.object || [],
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
        type: SET_COMBUSTION,
        payload: {
          error: error.response?.data?.message || error.message,
          loading: false,
        },
      });
    }
  };
};

export const updateCombustionAlarmHistoryData = (data) => {
  return async (dispatch) => {
    try {
      await axios.post(
        `${baseURL}/service/copt/bat/combustion/update/alarm-history`,
        data
      );
      await dispatch({
        type: SET_COMBUSTION,
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
        type: SET_COMBUSTION,
        payload: {
          error: error.response?.data?.message || error.message,
          loadingAlarmHistoryUpdate: false,
        },
      });
      return false;
    }
  };
};

export const changeCombustionActivePreset = (ruleId, presetId) => {
  return async (dispatch) => {
    dispatch({
      type: SET_COMBUSTION,
      payload: {
        loadingRuleUpdate: true,
      },
    });
    const data = {
      presetId,
      ruleId,
    };
    try {
      await axios.post(
        `${baseURL}/service/copt/bat/combustion/rule/preset/activated`,
        data
      );

      await dispatch(
        showMessage({
          message: "Rule's active preset has been updated",
          variant: 'success',
        })
      );

      await dispatch({
        type: SET_COMBUSTION,
        payload: {
          loadingRuleUpdate: false,
        },
      });
    } catch (error) {
      dispatch(
        showMessage({
          message: error.response?.data?.message || error.message,
          variant: 'error',
        })
      );
      dispatch({
        type: SET_COMBUSTION,
        payload: {
          error: error.response?.data?.message || error.message,
          loadingRuleUpdate: false,
        },
      });
    }
  };
};

export const postCombustionNewPreset = () => {
  // eslint-disable-next-line consistent-return
  return async (dispatch, getState) => {
    const {
      combustionReducer: {
        combustionRuleDetail,
        combustionRuleDetailData,
        combustionNewPresetName,
      },
      auth: { user },
    } = getState();
    dispatch({
      type: SET_COMBUSTION,
      payload: {
        loadingRuleUpdate: true,
      },
    });
    const data = {
      detailRule: combustionRuleDetail,
      ruleId: combustionRuleDetailData.id,
      userId: user?.data?.id || 'engineer',
      presetDesc: combustionNewPresetName,
    };
    const tempArr = [];

    for (let i = 0; i < combustionRuleDetail?.length; i++) {
      tempArr.push(
        combustionRuleDetail[i].bracketOpen,
        combustionRuleDetail[i].tagSensor,
        combustionRuleDetail[i].bracketClose,
        combustionRuleDetail[i].maxViolated
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
        type: SET_COMBUSTION,
        payload: {
          loadingRuleUpdate: false,
        },
      });
    } else {
      try {
        await axios.post(
          `${baseURL}/service/copt/bat/combustion/rule/preset`,
          data
        );

        await dispatch(
          showMessage({
            message: 'New preset has been added',
            variant: 'success',
          })
        );
        await dispatch({
          type: SET_COMBUSTION,
          payload: {
            loadingRuleUpdate: false,
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
          type: SET_COMBUSTION,
          payload: {
            error: error.response?.data?.message || error.message,
            loadingRuleUpdate: false,
          },
        });
        return false;
      }
    }
  };
};

export const updateCombustionRuleData = () => {
  // eslint-disable-next-line consistent-return
  return async (dispatch, getState) => {
    const {
      combustionReducer: { combustionRuleDetail, combustionRuleDetailData },
      auth: { user },
    } = getState();
    dispatch({
      type: SET_COMBUSTION,
      payload: {
        loadingRuleUpdate: true,
      },
    });
    const data = {
      id: combustionRuleDetailData.id,
      label: combustionRuleDetailData.label,
      detailRule: combustionRuleDetail,
      presetId: combustionRuleDetailData?.presetId,
      isActive: combustionRuleDetailData?.isActive,
      userId: user?.data?.id,
    };
    const tempArr = [];

    for (let i = 0; i < combustionRuleDetail.length; i++) {
      tempArr.push(
        combustionRuleDetail[i].bracketOpen,
        combustionRuleDetail[i].tagSensor,
        combustionRuleDetail[i].bracketClose,
        combustionRuleDetail[i].maxViolated
      );
    }
    // eslint-disable-next-line
    String.prototype.count = function (c) {
      let result = 0;
      let i = 0;
      for (i; i < this.length; i++) if (this[i] === c) result++;
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
        type: SET_COMBUSTION,
        payload: {
          loadingCombustion: false,
          loadingRuleUpdate: false,
        },
      });
    } else {
      try {
        await axios.post(`${baseURL}/service/copt/bat/combustion/rule`, data);

        await dispatch(
          showMessage({
            message: "Rule's data has been updated",
            variant: 'success',
          })
        );
        await dispatch({
          type: SET_COMBUSTION,
          payload: {
            loadingRuleUpdate: false,
          },
        });
        return true;
      } catch (error) {
        if (error.response?.status === 406) {
          dispatch(
            showMessage({
              message:
                'The writing of the rules is still wrong, please check again',
              variant: 'error',
            })
          );
          dispatch({
            type: SET_COMBUSTION,
            payload: {
              error: error.response?.data?.message || error.message,
              loadingCombustion: false,
              loadingRuleUpdate: false,
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
            type: SET_COMBUSTION,
            payload: {
              error: error.response?.data?.message || error.message,
              loadingCombustion: false,
              loadingRuleUpdate: false,
            },
          });
        }
        return false;
      }
    }
  };
};

export const getCombustionRuleByID = (id, presetId) => {
  return async (dispatch) => {
    await dispatch({
      type: SET_COMBUSTION,
      payload: {
        loading: true,
      },
    });

    try {
      if (presetId) {
        const response = await axios.get(
          `${baseURL}/service/copt/bat/combustion/rule/preset/detailed/${id}/${presetId}`
        );

        const rules = response?.data?.object.detailRule || [];
        for (let i = 0; i < rules.length; i++) {
          rules[i].sequence = 0;
          rules[i].sequence = i + 1;
        }

        const preset = await response?.data?.object?.presetList?.find(
          (presetItem) => +presetItem?.presetId === +presetId
        );

        await dispatch({
          type: SET_COMBUSTION,
          payload: {
            combustionRuleDetailData: {
              label: response?.data?.object?.label,
              subLabel: response?.data?.object?.presetHdr,
              id: response?.data?.object?.ruleId,
              presetId: response?.data?.object?.currentPresetId,
              isActive: response?.data?.object?.isActive,
              updateAt: preset?.presetUpdate || '',
              updateBy: response?.data?.object?.updateBy,
              presetList: response?.data?.object?.presetList || [],
            },
            combustionRuleSelectedPreset: response?.data?.object?.presetList?.find(
              (item) =>
                item.presetId === response?.data?.object?.currentPresetId
            ),
            combustionRuleDetail: rules || [],

            loading: false,
          },
        });
      } else {
        const response = await axios.get(
          `${baseURL}/service/copt/bat/combustion/rule/${id}`
        );
        const rules = await response.data.object.detailRule;
        const preset = await response?.data?.object?.presetList?.find(
          (presetItem) => +presetItem?.presetId === +presetId || 1
        );
        for (let i = 0; i < rules.length; i++) {
          rules[i].sequence = 0;
          rules[i].sequence = i + 1;
        }

        await dispatch({
          type: SET_COMBUSTION,
          payload: {
            combustionRuleDetailData: {
              label: response?.data?.object?.label,
              subLabel: response?.data?.object?.presetHdr,
              id: response?.data?.object?.ruleId,
              presetId: response?.data?.object?.currentPresetId,
              isActive: response?.data?.object?.isActive,
              updateAt: preset?.presetUpdate || '',
              updateBy: response?.data?.object?.updateBy,
              presetList: response?.data?.object?.presetList || [],
            },
            combustionRuleSelectedPreset: response?.data?.object?.presetList?.find(
              (item) =>
                item.presetId === response?.data?.object?.currentPresetId
            ),
            combustionRuleDetail: rules || [],

            loading: false,
          },
        });
      }
    } catch (error) {
      await dispatch(
        showMessage({
          message: `Error: ${error.response?.data?.message || error.message}`,
          variant: 'error',
        })
      );
      await dispatch({
        type: SET_COMBUSTION,
        payload: {
          error: error.response?.data?.message || error.message,
          loading: false,
        },
      });
    }
  };
};

export const getCombustionRuleTags = () => {
  return async (dispatch) => {
    await dispatch({
      type: SET_COMBUSTION,
      payload: {
        loading: true,
      },
    });
    try {
      const response = await axios.get(
        `${baseURL}/service/copt/bat/combustion/tags/rule`
      );
      await dispatch({
        type: SET_COMBUSTION,
        payload: {
          combustionRuleTags: response.data.object || [],
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
        type: SET_COMBUSTION,
        payload: {
          error: error.response?.data?.message || error.message,
          loading: false,
        },
      });
    }
  };
};

export const getCombustionAlarmHistoryByID = (id) => {
  return async (dispatch) => {
    await dispatch({
      type: SET_COMBUSTION,
      payload: {
        loading: true,
        errorGetDetailAlarmHistory: false,
      },
    });

    try {
      const response = await axios.get(
        `${baseURL}/service/copt/bat/combustion/detail/alarm-history/${id}`
      );
      await dispatch({
        type: SET_COMBUSTION,
        payload: {
          combustionAlarmHistoryDetailData: response.data.object || {},
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
        type: SET_COMBUSTION,
        payload: {
          error: error.response?.data?.message || error.message,
          loading: false,
          errorGetDetailAlarmHistory: true,
        },
      });
    }
  };
};

export const getCombustionAlarmHistory = () => {
  return async (dispatch, getState) => {
    const {
      combustionReducer: {
        combustionAlarmHistoryLimit,
        combustionAlarmHistoryData,
        combustionAlarmHistoryPage,
      },
    } = getState();

    try {
      const response = await axios.get(
        `${baseURL}/service/copt/bat/combustion/alarm-history?page=${combustionAlarmHistoryPage}&limit=${combustionAlarmHistoryLimit}`
      );
      if (combustionAlarmHistoryData?.length >= combustionAlarmHistoryData) {
        await dispatch({
          type: SET_COMBUSTION,
          payload: {
            combustionAlarmHistoryData: [
              ...combustionAlarmHistoryData,
              ...(response.data.object || []),
            ],
            errorAlarmHistory: false,
            loadingAlarmHistory: false,
            combustionAlarmHistoryTotal: response?.data?.total,
            hasMoreAlarmHistory: false,
          },
        });
        return false;
      }
      await dispatch({
        type: SET_COMBUSTION,
        payload: {
          combustionAlarmHistoryData: [
            ...combustionAlarmHistoryData,
            ...(response.data.object || []),
          ],
          errorAlarmHistory: false,
          loadingAlarmHistory: false,
          combustionAlarmHistoryTotal: response?.data?.total,
          hasMoreAlarmHistory: true,
        },
      });
      return true;
    } catch (error) {
      dispatch(
        showMessage({
          message:
            `Alarm history: ${error.response?.data?.message}` || error.message,
          variant: 'error',
        })
      );
      dispatch({
        type: SET_COMBUSTION,
        payload: {
          hasMoreAlarmHistory: false,
          error: error.response?.data?.message || error.message,
          errorAlarmHistory: true,
          loadingAlarmHistory: false,
        },
      });
      return false;
    }
  };
};

export const getCombustionIndicator = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(
        `${baseURL}/service/copt/bat/combustion/indicator`
      );
      const watchdog = response.data.object?.watchdog;
      const recommendationTime = response.data.object?.last_recommendation;
      const safeguard = response.data.object?.safeguard;
      const combustionEnabled = response.data?.object.comb_enable;
      const recommendationData = response.data?.object.recommendations;
      const rulesData = response.data.object?.rules;
      const parametersData = response.data.object?.parameter;
      const combTags = response?.data?.object?.comb_tags;

      const {
        bat_o2_bias,
        bias_accepted_btn,
        bias_rejected_btn,
        boiler_efficeincy,
        coal_bunker,
        coal_cyclone,
        coal_flow_1,
        coal_flow_2,
        coal_flow_3,
        coal_furnace,
        cold_id,
        cold_pa,
        cold_ret_a,
        cold_ret_b,
        cold_sa,
        cold_slag,
        cold_stack,
        copt_disabled_btn,
        copt_enabled_btn,
        cyclone_left_inlet_pres,
        cyclone_right_inlet_pres,
        dcs_o2_bias,
        drum_height_left,
        drum_height_right,
        drum_level_1,
        drum_level_2,
        drum_level_calc,
        furnace_pressure_1,
        furnace_pressure_2,
        furnace_pressure_calc,
        gross_load,
        hot_aph,
        hot_cyclone,
        hot_pa,
        hot_sa,
        idf_a_damper_position,
        idf_a_duration,
        idf_a_motor_current,
        idf_b_damper_position,
        idf_b_duration,
        idf_b_motor_current,
        inlet_aph_o2,
        outlet_aph_o2,
        paf_a_damper_position,
        paf_a_duration,
        paf_a_motor_current,
        paf_b_damper_position,
        paf_b_duration,
        paf_b_motor_current,
        primary_air_flow,
        primary_air_flow_a,
        primary_air_flow_b,
        return_fan_left_flow,
        return_fan_left_motor_current,
        return_fan_right_flow,
        return_fan_right_motor_current,
        rtf_a_duration,
        rtf_b_duration,
        saf_a_damper_position,
        saf_a_duration,
        saf_a_motor_current,
        saf_b_damper_position,
        saf_b_duration,
        saf_b_motor_current,
        secondary_air_flow,
        secondary_air_flow_a,
        secondary_air_flow_b,
        total_air_flow,
        total_coal_flow,
        winbox_air_flow_a,
        winbox_air_flow_b,
        bed_temperature_a,
        bed_temperature_b,
        bed_temperature_c,
        bed_temperature_d,
        cyclone_left_temp,
        cyclone_right_temp,
      } = combTags;

      await dispatch({
        type: SET_COMBUSTION,
        payload: {
          combustionEnabled: +combustionEnabled || 0,
          combustionWatchdog: +watchdog || 0,
          combustionSafeguard: +safeguard || 0,
          combustionRecommendationTime: recommendationTime || '',
          combustionTags: {
            bat_o2_bias: bat_o2_bias || '-',
            bias_accepted_btn: bias_accepted_btn || '-',
            bias_rejected_btn: bias_rejected_btn || '-',
            boiler_efficeincy: boiler_efficeincy || '-',
            coal_bunker: coal_bunker || '-',
            coal_cyclone: coal_cyclone || '-',
            coal_flow_1: coal_flow_1 || '-',
            coal_flow_2: coal_flow_2 || '-',
            coal_flow_3: coal_flow_3 || '-',
            coal_furnace: coal_furnace || '-',
            cold_id: cold_id || '-',
            cold_pa: cold_pa || '-',
            cold_ret_a: cold_ret_a || '-',
            cold_ret_b: cold_ret_b || '-',
            cold_sa: cold_sa || '-',
            cold_slag: cold_slag || '-',
            cold_stack: cold_stack || '-',
            copt_disabled_btn: copt_disabled_btn || '-',
            copt_enabled_btn: copt_enabled_btn || '-',
            cyclone_left_inlet_pres: cyclone_left_inlet_pres || '-',
            cyclone_right_inlet_pres: cyclone_right_inlet_pres || '-',
            dcs_o2_bias: dcs_o2_bias || '-',
            drum_height_left: drum_height_left || '-',
            drum_height_right: drum_height_right || '-',
            drum_level_1: drum_level_1 || '-',
            drum_level_2: drum_level_2 || '-',
            drum_level_calc: drum_level_calc || '-',
            furnace_pressure_1: furnace_pressure_1 || '-',
            furnace_pressure_2: furnace_pressure_2 || '-',
            furnace_pressure_calc: furnace_pressure_calc || '-',
            gross_load: gross_load || '-',
            hot_aph: hot_aph || '-',
            hot_cyclone: hot_cyclone || '-',
            hot_pa: hot_pa || '-',
            hot_sa: hot_sa || '-',
            idf_a_damper_position: idf_a_damper_position || '-',
            idf_a_duration: idf_a_duration || '-',
            idf_a_motor_current: idf_a_motor_current || '-',
            idf_b_damper_position: idf_b_damper_position || '-',
            idf_b_duration: idf_b_duration || '-',
            idf_b_motor_current: idf_b_motor_current || '-',
            inlet_aph_o2: inlet_aph_o2 || '-',
            outlet_aph_o2: outlet_aph_o2 || '-',
            paf_a_damper_position: paf_a_damper_position || '-',
            paf_a_duration: paf_a_duration || '-',
            paf_a_motor_current: paf_a_motor_current || '-',
            paf_b_damper_position: paf_b_damper_position || '-',
            paf_b_duration: paf_b_duration || '-',
            paf_b_motor_current: paf_b_motor_current || '-',
            primary_air_flow: primary_air_flow || '-',
            primary_air_flow_a: primary_air_flow_a || '-',
            primary_air_flow_b: primary_air_flow_b || '-',
            return_fan_left_flow: return_fan_left_flow || '-',
            return_fan_left_motor_current: return_fan_left_motor_current || '-',
            return_fan_right_flow: return_fan_right_flow || '-',
            return_fan_right_motor_current:
              return_fan_right_motor_current || '-',
            rtf_a_duration: rtf_a_duration || '-',
            rtf_b_duration: rtf_b_duration || '-',
            saf_a_damper_position: saf_a_damper_position || '-',
            saf_a_duration: saf_a_duration || '-',
            saf_a_motor_current: saf_a_motor_current || '-',
            saf_b_damper_position: saf_b_damper_position || '-',
            saf_b_duration: saf_b_duration || '-',
            saf_b_motor_current: saf_b_motor_current || '-',
            secondary_air_flow: secondary_air_flow || '-',
            secondary_air_flow_a: secondary_air_flow_a || '-',
            secondary_air_flow_b: secondary_air_flow_b || '-',
            total_air_flow: total_air_flow || '-',
            total_coal_flow: total_coal_flow || '-',
            winbox_air_flow_a: winbox_air_flow_a || '-',
            winbox_air_flow_b: winbox_air_flow_b || '-',
            bed_temperature_a: bed_temperature_a || '-',
            bed_temperature_b: bed_temperature_b || '-',
            bed_temperature_c: bed_temperature_c || '-',
            bed_temperature_d: bed_temperature_d || '-',
            cyclone_left_temp: cyclone_left_temp || '-',
            cyclone_right_temp: cyclone_right_temp || '-',
          },
          combustionRecommendationData: recommendationData || [],
          combustionRulesData: rulesData || [],
          combustionParameterSettingData: parametersData || [],
          errorCombustion: false,
          loadingCombustion: false,
        },
      });
    } catch (error) {
      dispatch(
        showMessage({
          message:
            `Combustion: ${error.response?.data?.message}` || error.message,
          variant: 'error',
        })
      );
      dispatch({
        type: SET_COMBUSTION,
        payload: {
          error: error.response?.data?.message || error.message,
          errorCombustion: true,
          loadingCombustion: false,
        },
      });
    }
  };
};

export const changeCombustion = (data) => {
  return async (dispatch) => {
    dispatch({
      type: SET_COMBUSTION,
      payload: data,
    });
  };
};
