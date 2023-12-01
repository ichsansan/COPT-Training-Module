import {
  AppBar,
  Button,
  Dialog,
  DialogContent,
  Grid,
  Paper,
  Toolbar,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  ArrowBack,
  NavigateBefore,
  NavigateNext,
  ZoomInOutlined,
} from '@material-ui/icons';
import Skeleton from '@material-ui/lab/Skeleton';
import {
  changeSootblow,
  getAlarmHistory,
  getSootblowCurrentProcess,
  getSootblowData,
  getSootblowSafeguardRuleDetail,
} from 'app/store/actions';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import {
  AlarmHistory,
  ParameterSettings,
  Recommendation,
  RulesSettings,
  SafeguardDetail,
  SootblowerSettings,
  SootblowSchema,
  TimeoutSettings,
} from './Components';
import './styles/index.css';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontWeight: theme.typography.fontWeightRegular,
  },
  formControl: {
    minWidth: '100%',
  },
  statusOn: {
    color: '#FA0000',
  },
  statusOff: {
    color: '#3D9140',
  },
  statusButton: {
    minWidth: 100,
  },
  statusButtonGreen: {
    color: '#FFF',
    backgroundColor: '#3D9140',
    '&:hover': {
      backgroundColor: '#327835',
    },
  },
  statusButtonRed: {
    color: '#FFF',
    backgroundColor: '#FA0000',
    '&:hover': {
      backgroundColor: '#bd291e',
    },
  },
  statusButtonYellow: {
    color: '#000',
    backgroundColor: 'rgb(255,238,0)',
    '&:hover': {
      backgroundColor: 'rgb(204,190,0)',
    },
  },
  container: {
    maxHeight: 200,
  },
  defaultButton: {
    padding: '0px 8px',
  },
  errorAlert: {
    backgroundColor: theme.palette.error.dark,
    color: theme.palette.getContrastText(theme.palette.error.dark),
  },
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Sootblow = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const location = useLocation();
  const isSootblowPage = location.pathname === '/sootblow';

  const sootblowReducer = useSelector((state) => state.sootblowReducer);

  const {
    loadingSootblowData,
    sootblowData,
    sootblowAlarmHistoryData,
  } = sootblowReducer;

  const { sequence, control, fixedTimeSuggestion } = sootblowData;

  const [expanded, setExpanded] = useState('panel1');
  const [showSecondPage, setShowSecondPage] = useState(false);
  const [openSVG, setOpenSVG] = useState(false);
  const [openSafeguardDetail, setOpenSafeguardDetail] = useState(false);

  const openSafeguardDetailHandler = async () => {
    await setOpenSafeguardDetail(true);
    await dispatch(getSootblowSafeguardRuleDetail());
  };

  const closeSafeguardDetailHandler = () => {
    setOpenSafeguardDetail(false);
    dispatch(
      changeSootblow({
        sootblowSafeguardLabel: '',
        sootblowSafeguardHistoryData: [],
        sootblowSafeguardAddressNumber: '',
        sootblowSafeguardHistoryTotal: 0,
        sootblowSafeguardHistoryPage: 0,
        sootblowSafeguardHistoryLimit: 10,
        sootblowSuggestionAsTestData: { area: '', trigger: '' },
      })
    );
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleClose = () => setOpenSVG(false);

  useEffect(() => {
    const getSootblowScheduler = () => {
      dispatch(getSootblowData());
      dispatch(getAlarmHistory());
      dispatch(getSootblowCurrentProcess());
    };

    return getSootblowScheduler();

    // eslint-disable-next-line
	}, [dispatch]);

  useEffect(() => {
    const getSootblowScheduler = setInterval(() => {
      dispatch(getSootblowData());
      // dispatch(getAlarmHistory());
    }, 5000);

    return () => clearInterval(getSootblowScheduler);
  }, [dispatch]);

  useEffect(() => {
    const getSootblowCurrentProcessScheduler = setInterval(() => {
      dispatch(getSootblowCurrentProcess());
    }, 10000);

    return () => clearInterval(getSootblowCurrentProcessScheduler);
  }, [dispatch]);

  const watchdogValue =
    control && control.find((item) => item.label === 'watchdog');
  const safeGuardValue =
    control && control.find((item) => item.label === 'safeguard');
  const operationControlValue =
    control && control.find((item) => item.label === 'operation_control');
  const recommendationTimeValue =
    control && control.find((item) => item.label === 'date_recommendation');

  const watchdogStatus = watchdogValue?.value || 0;
  const safeGuardStatus = safeGuardValue?.value || 0;
  const operationControlStatus = operationControlValue?.value || 0;
  const recommendationTime = recommendationTimeValue?.value;

  return (
    <div className="h-full px-24 py-16 ">
      <Grid container className="md:flex-col flex-row h-full">
        {/* Top Section */}
        <Grid item className="md:flex-initial w-full">
          <Grid container alignItems="center" justify="space-between">
            <Grid
              item
              container
              xs={12}
              md={3}
              className="justify-start mb-8 md:mb-0"
              alignItems="center"
            >
              {isSootblowPage && (
                <Link
                  to="/home"
                  onClick={() =>
                    dispatch(
                      changeSootblow({
                        sootblowAlarmHistoryPage: 0,
                        sootblowAlarmHistoryTotal: 0,
                        sootblowAlarmHistoryData: [],
                        loadingAlarmHistory: true,
                      })
                    )
                  }
                  className="text-20 xl:text-24 mr-8"
                >
                  <ArrowBack color="action" fontSize="inherit" />
                </Link>
              )}
              <Typography className="text-11 xl:text-16">
                SOOTBLOW OPTIMIZATION
              </Typography>
            </Grid>
            <Grid
              item
              container
              xs={12}
              md={9}
              justify="flex-end"
              alignItems="center"
              className=" gap-8  "
            >
              <Grid
                item
                container
                direction="column"
                alignItems="center"
                xs={12}
                md={3}
              >
                <Grid item className="w-full">
                  <Typography className="text-center text-11 xl:text-16">
                    Operation Control
                  </Typography>
                </Grid>
                <Grid item className="w-full">
                  <Button
                    disableFocusRipple
                    disableRipple
                    disableTouchRipple
                    fullWidth
                    variant="contained"
                    className={clsx(
                      'text-10 cursor-default xl:text-16',
                      operationControlStatus === 1
                        ? classes.statusButtonGreen
                        : classes.statusButtonRed
                    )}
                  >
                    {loadingSootblowData
                      ? 'LOADING'
                      : operationControlStatus === 1
                      ? 'ENABLE'
                      : 'DISABLE'}
                  </Button>
                </Grid>
              </Grid>
              <Grid
                item
                container
                direction="column"
                alignItems="center"
                xs={12}
                md={3}
              >
                <Grid item className="w-full">
                  <Typography className="text-center text-11 xl:text-16">
                    Watchdog Status
                  </Typography>
                </Grid>
                <Grid item className="w-full">
                  <Button
                    disableFocusRipple
                    disableRipple
                    disableTouchRipple
                    fullWidth
                    variant="contained"
                    className={clsx(
                      'text-10 cursor-default xl:text-16',
                      watchdogStatus === 1
                        ? classes.statusButtonGreen
                        : watchdogStatus === 0
                        ? classes.statusButtonRed
                        : classes.statusButtonYellow
                    )}
                  >
                    {loadingSootblowData
                      ? 'LOADING'
                      : watchdogStatus === 0
                      ? 'DISCONNECTED'
                      : watchdogStatus === 1
                      ? 'CONNECTED'
                      : 'LAGGED'}
                  </Button>
                </Grid>
              </Grid>
              <Grid
                item
                container
                direction="column"
                alignItems="center"
                xs={12}
                md={3}
              >
                <Grid item className="w-full">
                  <Typography className="text-center text-11 xl:text-16">
                    Safe Guard
                  </Typography>
                </Grid>
                <Grid item className="w-full">
                  <Button
                    onClick={async () => {
                      await dispatch(
                        changeSootblow({
                          sootblowSafeguardAddressNumber: '',
                        })
                      );
                      await openSafeguardDetailHandler();
                    }}
                    disableFocusRipple
                    disableRipple
                    disableTouchRipple
                    fullWidth
                    variant="contained"
                    className={clsx(
                      'text-10 cursor-pointer xl:text-16',
                      safeGuardStatus === 1
                        ? classes.statusButtonGreen
                        : classes.statusButtonRed
                    )}
                  >
                    {loadingSootblowData
                      ? 'LOADING'
                      : safeGuardStatus === 1
                      ? 'READY'
                      : 'NOT READY'}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {/* Top Section */}

        {/* Last Recommendation Section */}

        <Grid
          item
          className="flex-initial items-center flex w-full md:overflow-hidden justify-start gap-x-6 gap-y-6 my-6"
        >
          <Typography className="text-11 my-8 xl:text-16">
            <span className="text-light-blue-300">
              Last Recommendation Time
            </span>{' '}
            : {!recommendationTime ? '-' : `${recommendationTime} WITA`}
          </Typography>
        </Grid>

        {/* Last Recommendation Section */}

        {/* Main Content */}
        <Grid
          item
          className="flex-1 md:overflow-hidden flex md:flex-row flex-col w-full gap-8"
        >
          <Paper
            className={`${
              expanded === 'panel1' &&
              sequence.length !== 0 &&
              !fixedTimeSuggestion
                ? 'md:w-7/12'
                : expanded === 'panel1' &&
                  sequence.length !== 0 &&
                  fixedTimeSuggestion
                ? 'md:w-6/12'
                : expanded === 'panel6' && sootblowAlarmHistoryData.length !== 0
                ? 'md:w-6/12'
                : 'md:w-8/12'
            } w-full h-full flex justify-center p-20 relative`}
            square
          >
            {loadingSootblowData ? (
              <Skeleton variant="rect" className=" h-60 w-full md:h-full" />
            ) : (
              <>
                <SootblowSchema width="100%" height="100%" />
                <span className="absolute right-10 bottom-10 z-10 ">
                  <Tooltip arrow title="Zoom Out SVG">
                    <Button
                      onClick={() => setOpenSVG(true)}
                      size="small"
                      variant="contained"
                      className="rounded-full p-2"
                      aria-label="zoom-boiler-svg"
                    >
                      <ZoomInOutlined fontSize="small" />
                    </Button>
                  </Tooltip>
                </span>
              </>
            )}
          </Paper>
          <div
            className={`${
              expanded === 'panel1' &&
              sequence.length !== 0 &&
              !fixedTimeSuggestion
                ? 'md:w-5/12'
                : expanded === 'panel1' &&
                  sequence.length !== 0 &&
                  fixedTimeSuggestion
                ? 'md:w-6/12'
                : expanded === 'panel6' && sootblowAlarmHistoryData.length !== 0
                ? 'md:w-6/12'
                : 'md:w-4/12'
            } flex flex-col flex-1 space-y-8`}
          >
            <div className="flex flex-1 flex-col pb-8 md:pb-0 overflow-hidden">
              {!showSecondPage && (
                <>
                  <Recommendation
                    expanded={expanded}
                    handleChange={handleChange}
                  />
                  <ParameterSettings
                    expanded={expanded}
                    handleChange={handleChange}
                  />
                  <RulesSettings
                    expanded={expanded}
                    handleChange={handleChange}
                  />
                  <TimeoutSettings
                    expanded={expanded}
                    handleChange={handleChange}
                  />
                </>
              )}
              {showSecondPage && (
                <>
                  <SootblowerSettings
                    expanded={expanded}
                    handleChange={handleChange}
                  />
                  <AlarmHistory
                    expanded={expanded}
                    handleChange={handleChange}
                  />
                </>
              )}
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                onClick={(e) => {
                  setShowSecondPage(!showSecondPage);
                  setExpanded(!showSecondPage ? 'panel5' : 'panel1');
                }}
                startIcon={
                  showSecondPage ? <NavigateBefore /> : <NavigateNext />
                }
              >
                {showSecondPage ? 'Previous' : 'Next'}
              </Button>
            </div>
          </div>
        </Grid>
        {/* Main Content */}
      </Grid>
      <Dialog
        open={openSVG}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        fullScreen
        aria-describedby="alert-dialog-description"
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography
              className={clsx(
                'text-10 md:text-14 xl:text-16 font-bold',
                classes.title
              )}
              color="inherit"
            >
              {process.env.REACT_APP_UNIT_NAME || 'Site Name'}
            </Typography>
            <Button color="inherit" onClick={handleClose}>
              Close
            </Button>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <SootblowSchema width="100%" height="100%" />
        </DialogContent>
      </Dialog>
      {openSafeguardDetail && (
        <SafeguardDetail
          open={openSafeguardDetail}
          close={closeSafeguardDetailHandler}
        />
      )}
    </div>
  );
};

export default Sootblow;
