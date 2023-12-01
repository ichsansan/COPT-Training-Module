import {
  AppBar,
  Button,
  Dialog,
  DialogContent,
  Grid,
  makeStyles,
  Paper,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from '@material-ui/core';
import { ArrowBack, ZoomInOutlined } from '@material-ui/icons';
import Skeleton from '@material-ui/lab/Skeleton';
import {
  changeCombustion,
  getCombustionAlarmHistory,
  getCombustionIndicator,
  getCombustionRuleTags,
  getCombustionSafeguardRuleDetail,
} from 'app/store/actions';
import clsx from 'clsx';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import Joyride, { STATUS } from 'react-joyride';
import './styles/index.css';
import OnboardTooltip from 'app/fuse-layouts/shared-components/OnboardTooltip';
import {
  AlarmHistory,
  ParameterSettings,
  Recommendation,
  RulesSettings,
  SafeguardDetail,
  SvgBoiler,
} from './Components';

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

const Combustion = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const theme = useTheme();

  const combustionReducer = useSelector((state) => state.combustionReducer);
  const location = useLocation();
  const isCombustionPage = location.pathname === '/combustion';

  const {
    combustionAlarmHistoryData,
    combustionEnabled,
    combustionWatchdog,
    combustionSafeguard,
    combustionRecommendationData,
    combustionRecommendationTime,
    loadingCombustion,
  } = combustionReducer;

  const [openSVG, setOpenSVG] = useState(false);
  const [expanded, setExpanded] = useState('panel1');
  const [openSafeguardDetail, setOpenSafeguardDetail] = useState(false);

  const [{ run, steps }, setState] = useState({
    run: false,
    steps: [
      {
        content: (
          <>
            Welcome to the combustion optimization module, on the top of this
            page. There are 3 indicators that showing as operation control
          </>
        ),
        locale: { skip: <strong aria-label="skip">Skip</strong> },
        spotlightPadding: 8,
        target: '.onboard__combustion-operation-control',
        title: 'Combustion Optimization',
        disableBeacon: true,
        disableOverlayClose: true,
        hideCloseButton: true,
        placement: 'bottom',
      },
      {
        content: <>You can see the safeguard detail if you click this button</>,
        floaterProps: {
          disableAnimation: true,
        },
        spotlightPadding: 8,
        target: '.onboard__combustion-safeguard',
      },
      {
        content: (
          <>
            This is a button that can bring your back to the home or efficiency
            page{' '}
          </>
        ),
        floaterProps: {
          disableAnimation: true,
        },
        spotlightPadding: 8,
        target: '.onboard__combustion-back',
      },
      {
        content: <>Time when combustion's last recommendation happened</>,
        floaterProps: {
          disableAnimation: true,
        },
        spotlightPadding: 8,
        target: '.onboard__combustion-last-recommendation',
      },
      {
        content: (
          <>
            This is a real-time boiler schema from{' '}
            {process.env.REACT_APP_UNIT_NAME || 'Unit Name'}
          </>
        ),
        floaterProps: {
          disableAnimation: true,
        },
        spotlightPadding: 8,
        target: '.onboard__combustion-boiler-schema',
      },
      {
        content: <>Button to enlarge the boiler schema view</>,
        floaterProps: {
          disableAnimation: true,
        },
        spotlightPadding: 8,
        target: '.onboard__combustion-boiler-schema-zoom',
      },
      {
        content: (
          <>
            On this side you can see some features, these features are
            recommendations, operation parameter settings, rule settings, and
            alarm history
          </>
        ),
        floaterProps: {
          disableAnimation: true,
        },
        spotlightPadding: 8,
        target: '.onboard__combustion-features',
      },
      {
        content: (
          <>
            You can expand and hide every features section by arrow icon or this
            section
          </>
        ),
        floaterProps: {
          disableAnimation: true,
        },
        spotlightPadding: 8,
        target: '.onboard__combustion-features-expand',
      },
      {
        content: (
          <>
            On every features, there is cloud-icon as download button for
            exporting the data
          </>
        ),
        floaterProps: {
          disableAnimation: true,
        },
        spotlightPadding: 8,
        target: '.onboard__combustion-features-export',
      },
      {
        content: <>On every features show table that provide list of data</>,
        floaterProps: {
          disableAnimation: true,
        },
        spotlightPadding: 8,
        target: '.onboard__combustion-features-table',
      },
      {
        content: (
          <>
            For alarm history section, there is refresh button to get latest
            data{' '}
          </>
        ),
        floaterProps: {
          disableAnimation: true,
        },
        spotlightPadding: 8,
        target: '.onboard__combustion-features-refresh',
      },
    ],
  });

  useLayoutEffect(() => {
    const alreadyOnboard = window.localStorage.getItem(
      'onboard-combustion-done'
    );
    if (alreadyOnboard === 'true') {
      setState({ run: false });
    } else {
      setState({ run: false, steps });
    }
  }, [steps]);

  const getCombustionData = useCallback(() => {
    dispatch(getCombustionIndicator());
    dispatch(getCombustionAlarmHistory());
    dispatch(getCombustionRuleTags());
  }, [dispatch]);

  useEffect(() => {
    getCombustionData();
  }, [getCombustionData]);

  useEffect(() => {
    const getCombustionScheduler = setInterval(() => {
      dispatch(getCombustionIndicator());
    }, 5000);

    return () => clearInterval(getCombustionScheduler);
  }, [dispatch]);

  const openSafeguardDetailHandler = async () => {
    await setOpenSafeguardDetail(true);
    await dispatch(getCombustionSafeguardRuleDetail());
  };

  const closeSafeguardDetailHandler = () => {
    setOpenSafeguardDetail(false);
    dispatch(
      changeCombustion({
        combustionSafeguardLabel: '',
        combustionSafeguardHistoryData: [],
        combustionSafeguardAddressNumber: '',
        combustionSafeguardHistoryTotal: 0,
        combustionSafeguardHistoryPage: 0,
        combustionSafeguardHistoryLimit: 10,
        combustionSuggestionAsTestData: { area: '', trigger: '' },
      })
    );
  };

  const handleClose = () => {
    setOpenSVG(false);
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];
    if (finishedStatuses.includes(status)) {
      setState({ run: false });
      setExpanded('panel1');
      window.localStorage.setItem('onboard-combustion-done', 'true');
    }
  };

  return (
    <div className="h-full px-24 py-16 ">
      <Joyride
        disableCloseOnEsc
        disableOverlayClose
        callback={handleJoyrideCallback}
        continuous
        hideCloseButton
        run={run}
        tooltipComponent={OnboardTooltip}
        scrollToFirstStep
        showProgress
        showSkipButton
        steps={steps}
        styles={{
          options: {
            arrowColor: theme.palette.primary.main,
            zIndex: 10000,
            primaryColor: theme.palette.secondary.main,
          },
        }}
      />
      <Grid container className="md:flex-col flex-row h-full">
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
              <div id="combustion-back-link" className="flex items-center">
                {isCombustionPage && (
                  <Link
                    to="/home"
                    onClick={() =>
                      dispatch(
                        changeCombustion({
                          combustionAlarmHistoryData: [],
                          combustionAlarmHistoryPage: 0,
                          combustionAlarmHistoryTotal: 0,
                          loadingAlarmHistory: true,
                        })
                      )
                    }
                    className="text-20 xl:text-24 mr-8 onboard__combustion-back"
                  >
                    <ArrowBack color="action" fontSize="inherit" />
                  </Link>
                )}
                <Typography className="text-11 xl:text-16">
                  COMBUSTION OPTIMIZATION
                </Typography>
              </div>
            </Grid>
            <Grid
              className=" gap-8 onboard__combustion-operation-control"
              item
              container
              xs={12}
              md={9}
              justify="flex-end"
              alignItems="center"
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
                    Copt Enabled
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
                      combustionEnabled
                        ? classes.statusButtonGreen
                        : classes.statusButtonRed
                    )}
                  >
                    {loadingCombustion
                      ? 'LOADING'
                      : combustionEnabled
                      ? 'ENABLED'
                      : 'DISABLED'}
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
                      +combustionWatchdog === 1
                        ? classes.statusButtonGreen
                        : +combustionWatchdog === 0
                        ? classes.statusButtonRed
                        : classes.statusButtonYellow
                    )}
                  >
                    {loadingCombustion
                      ? 'LOADING'
                      : +combustionWatchdog === 0
                      ? 'DISCONNECTED'
                      : +combustionWatchdog === 1
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
                className="onboard__combustion-safeguard"
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
                        changeCombustion({
                          combustionSafeguardAddressNumber: '',
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
                      combustionSafeguard
                        ? classes.statusButtonGreen
                        : classes.statusButtonRed
                    )}
                  >
                    {loadingCombustion
                      ? 'LOADING'
                      : combustionSafeguard
                      ? 'READY'
                      : 'NOT READY'}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          className="flex-initial items-center flex w-full md:overflow-hidden justify-start gap-x-6 gap-y-6 my-6"
        >
          <Typography className="text-11 my-8 xl:text-16 onboard__combustion-last-recommendation">
            <span className="text-light-blue-300">
              Last Recommendation Time
            </span>{' '}
            :{' '}
            {!combustionRecommendationTime
              ? '-'
              : `${combustionRecommendationTime} WIB`}
          </Typography>
        </Grid>

        <Grid
          item
          className="flex-1 md:overflow-hidden flex md:flex-row flex-col w-full gap-y-8"
        >
          <Paper
            className={`onboard__combustion-boiler-schema ${
              expanded === 'panel1' && combustionRecommendationData.length !== 0
                ? 'md:w-5/12'
                : expanded === 'panel4' &&
                  combustionAlarmHistoryData.length !== 0
                ? 'md:w-4/12'
                : 'md:w-8/12'
            } w-full h-full flex justify-center md:mr-8 p-20 relative`}
            square
          >
            {loadingCombustion ? (
              <Skeleton variant="rect" className=" h-60 w-full md:h-full" />
            ) : (
              <>
                <Tooltip arrow title="Zoom Out">
                  <Button
                    size="small"
                    variant="contained"
                    className="absolute rounded-full right-16 bottom-16 z-10 p-4 onboard__combustion-boiler-schema-zoom"
                    aria-label="zoom-boiler-svg"
                    onClick={() => setOpenSVG(true)}
                  >
                    <ZoomInOutlined fontSize="small" />
                  </Button>
                </Tooltip>
                <SvgBoiler width="100%" height="100%" />
              </>
            )}
          </Paper>
          <div
            className={`${
              expanded === 'panel1' &&
              combustionRecommendationData?.length !== 0
                ? 'md:w-7/12'
                : expanded === 'panel4' &&
                  combustionAlarmHistoryData?.length !== 0
                ? 'md:w-8/12'
                : 'md:w-4/12'
            } flex flex-col flex-1 space-y-8`}
          >
            <div className="flex flex-1 flex-col pb-8 md:pb-0 overflow-hidden onboard__combustion-features">
              <Recommendation expanded={expanded} handleChange={handleChange} />
              <ParameterSettings
                expanded={expanded}
                handleChange={handleChange}
              />
              <RulesSettings expanded={expanded} handleChange={handleChange} />
              <AlarmHistory expanded={expanded} handleChange={handleChange} />
            </div>
          </div>
        </Grid>
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
          <SvgBoiler width="100%" height="100%" />
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

export default Combustion;
