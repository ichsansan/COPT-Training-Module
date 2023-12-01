import FuseAnimate from '@fuse/core/FuseAnimate';
import {
  Button,
  CircularProgress,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core';
import { ChevronRight, DateRange } from '@material-ui/icons';
import DateRangeModal from 'app/fuse-layouts/shared-components/DateRangeModal';
import {
  changeEfficiency,
  getEfficiencyData,
  getFrontStatusIndicator,
} from 'app/store/actions';
import { showMessage } from 'app/store/fuse/messageSlice';
import clsx from 'clsx';
import { homeEfficiencySchema, timeFormat } from 'helpers';
import moment from 'moment-timezone';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { Chart } from './Components';
import './styles/index.css';

const useStyles = makeStyles(() => ({
  statusButtonOn: {
    color: '#FFF',
    backgroundColor: '#3D9140',
    '&:hover': {
      backgroundColor: '#327835',
    },
  },
  statusButtonOff: {
    color: '#FFF',
    backgroundColor: '#FA0000',
    '&:hover': {
      backgroundColor: '#bd291e',
    },
  },
  statusButtonOnNotHover: {
    color: '#FFF',
    backgroundColor: '#3D9140',
    '&:hover': {
      backgroundColor: '#3D9140',
    },
  },
  statusButtonOffNotHover: {
    color: '#FFF',
    backgroundColor: '#FA0000',
    '&:hover': {
      backgroundColor: '#FA0000',
    },
  },
}));

const Home = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const location = useLocation();
  const isHomePage = location.pathname === '/home';

  const efficiencyData = useSelector((state) => state.efficiencyReducer);

  const [openDateFilter, setOpenDateFilter] = useState(false);

  useEffect(() => {
    const getHomeEfficiencyData = () => {
      const TODAY = new Date();
      const DATE = new Date();
      const YESTERDAY = DATE.setDate(DATE.getDate() - 1);
      dispatch(
        changeEfficiency({
          filterStartDate: timeFormat(YESTERDAY, 'Asia/Kuala_Lumpur'),
          filterEndDate: timeFormat(TODAY, 'Asia/Kuala_Lumpur'),
        })
      );
      setTimeout(() => {
        dispatch(getFrontStatusIndicator());
        dispatch(getEfficiencyData());
      }, 0);
    };

    return getHomeEfficiencyData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const loadChart = () => {
      dispatch(changeEfficiency({ loading: true }));
      setTimeout(() => {
        dispatch(changeEfficiency({ loading: false }));
      }, 2000);
    };

    window.addEventListener('resize', loadChart);
  }, [dispatch]);

  useEffect(() => {
    const homeEfficiencyScheduler = setInterval(() => {
      dispatch(getFrontStatusIndicator());
    }, 30000);

    return () => clearInterval(homeEfficiencyScheduler);
  }, [dispatch]);

  const {
    improvementEfficiency,
    baselineEfficiency,
    currentEfficiency,
    referenceValue,
    loading,
    chart,
    filterStartDate,
    filterEndDate,
    previousStartDate,
    previousEndDate,
    dateCurrent,
    dateBaseline,
    efficiencyIndicator,
  } = efficiencyData;

  const {
    sootblowOperationIndicator,
    sootblowWatchdogIndicator,
    sootblowSafeguardIndicator,
    combustionOperationIndicator,
    combustionWatchdogIndicator,
    combustionSafeguardIndicator,
  } = efficiencyIndicator;

  const closeDateFilter = () => {
    setOpenDateFilter(false);
  };

  const cancelDateFilter = () => {
    const TODAY = new Date();
    const DATE = new Date();
    const YESTERDAY = DATE.setDate(DATE.getDate() - 1);
    closeDateFilter();
    dispatch(
      changeEfficiency({
        filterStartDate: timeFormat(
          previousStartDate || YESTERDAY,
          'Asia/Kuala_Lumpur'
        ),
        filterEndDate: timeFormat(
          previousEndDate || TODAY,
          'Asia/Kuala_Lumpur'
        ),
      })
    );
  };

  const confirmDateFilter = async () => {
    if (filterEndDate === null && filterStartDate === null) {
      await dispatch(
        showMessage({
          message: `Invalid date, select the date first!`,
          variant: 'error',
        })
      );
    } else if (filterStartDate === null) {
      await dispatch(
        showMessage({
          message: `Invalid start date`,
          variant: 'error',
        })
      );
    } else if (filterEndDate === null) {
      await dispatch(
        showMessage({
          message: `Invalid end date`,
          variant: 'error',
        })
      );
    } else if (filterEndDate !== '' || filterStartDate !== '') {
      const now = timeFormat(filterEndDate, 'Asia/Kuala_Lumpur');
      const end = timeFormat(filterStartDate, 'Asia/Kuala_Lumpur');
      const duration = moment.duration(now.diff(end));
      const days = duration.asDays();

      if (new Date(filterStartDate) > new Date(filterEndDate)) {
        await dispatch(
          showMessage({
            message: `Invalid date, end date cannot be before ${timeFormat(
              end,
              'Asia/Kuala_Lumpur'
            ).format('DD/MM/YYYY HH:mm')}`,
            variant: 'error',
          })
        );
      } else if (days >= 14) {
        await dispatch(
          showMessage({
            message: 'The maximum selected range of days is 2 weeks or 14 days',
            variant: 'error',
          })
        );
      } else {
        await dispatch(
          changeEfficiency({
            previousStartDate: filterStartDate,
            previousEndDate: filterEndDate,
          })
        );
        await closeDateFilter();
        await dispatch(getEfficiencyData());
        await dispatch(
          showMessage({
            message: 'Date has been changed',
            variant: 'success',
          })
        );
      }
    } else {
      await dispatch(
        showMessage({
          message: 'You must select date first',
          variant: 'error',
        })
      );
    }
  };

  const resetFilter = async () => {
    const TODAY = new Date();
    const DATE = new Date();
    const YESTERDAY = DATE.setDate(DATE.getDate() - 1);
    await dispatch(
      changeEfficiency({
        filterStartDate: timeFormat(YESTERDAY, 'Asia/Kuala_Lumpur'),
        filterEndDate: timeFormat(TODAY, 'Asia/Kuala_Lumpur'),
      })
    );

    await dispatch(
      showMessage({
        message: `Date filter has been reset`,
        variant: 'success',
      })
    );
  };

  const efficiencyValue =
    chart.length !== 0 ? chart?.map((item) => item[1]) : [0, 100];

  const maxEfficiencyValue = Math.max(...efficiencyValue);
  const minEfficiencyValue = Math.min(...efficiencyValue);

  const COPT_OFF =
    !combustionWatchdogIndicator || !combustionSafeguardIndicator;
  const SOPT_OFF = !sootblowWatchdogIndicator || !sootblowSafeguardIndicator;

  const COPT_NORMAL_DISABLED =
    !combustionOperationIndicator &&
    combustionWatchdogIndicator &&
    combustionSafeguardIndicator; // red, not blink
  const SOPT_NORMAL_DISABLED =
    !sootblowOperationIndicator &&
    sootblowWatchdogIndicator &&
    sootblowSafeguardIndicator; // red, not blink

  return (
    <main className="py-16 h-screen container px-0 mx-24 ">
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="h-full flex flex-col space-y-8">
          <section
            id="home-link-button"
            className="flex flex-col md:flex-row space-y-8 md:space-y-0  md:space-x-8 "
          >
            {isHomePage ? (
              <Link to="/combustion" className="w-full">
                <Button
                  fullWidth
                  variant="outlined"
                  className={clsx(
                    `h-full onboard__home-combustion-module ${
                      COPT_OFF ? 'blink' : ''
                    }`,
                    COPT_NORMAL_DISABLED || COPT_OFF
                      ? classes.statusButtonOff
                      : classes.statusButtonOn
                  )}
                >
                  <Typography className="text-12 md:text-20 lg:text-28">
                    Combustion Optimization
                  </Typography>
                </Button>
              </Link>
            ) : (
              <Button
                disableRipple
                fullWidth
                variant="outlined"
                className={clsx(
                  `h-full cursor-auto onboard__home-combustion-module ${
                    COPT_OFF ? 'blink' : ''
                  }`,
                  COPT_NORMAL_DISABLED || COPT_OFF
                    ? classes.statusButtonOffNotHover
                    : classes.statusButtonOnNotHover
                )}
              >
                <Typography className="text-12 md:text-20 lg:text-28">
                  Combustion Optimization
                </Typography>
              </Button>
            )}
            {isHomePage ? (
              <Link to="/sootblow" className="w-full">
                <Button
                  fullWidth
                  variant="outlined"
                  className={clsx(
                    `h-full onboard__home-sootblow-module ${
                      SOPT_OFF ? 'blink' : ''
                    }`,
                    SOPT_NORMAL_DISABLED || SOPT_OFF
                      ? classes.statusButtonOff
                      : classes.statusButtonOn
                  )}
                >
                  <Typography className="text-12 md:text-20 lg:text-28">
                    Sootblow Optimization
                  </Typography>
                </Button>
              </Link>
            ) : (
              <Button
                disableRipple
                fullWidth
                variant="outlined"
                className={clsx(
                  `h-full cursor-auto onboard__home-sootblow-module ${
                    SOPT_OFF ? 'blink' : ''
                  }`,
                  SOPT_NORMAL_DISABLED || SOPT_OFF
                    ? classes.statusButtonOffNotHover
                    : classes.statusButtonOnNotHover
                )}
              >
                <Typography className="text-12 md:text-20 lg:text-28">
                  Sootblow Optimization
                </Typography>
              </Button>
            )}
          </section>

          <section className="flex flex-col-reverse space-y-8 md:space-y-0 md:flex-row flex-1 w-full">
            <div className="w-full md:w-3/4 flex items-center flex-col md:p-10 flex-1 md:flex-initial">
              <div className="w-full mb-4 mt-8 md:mt-0 justify-end flex">
                <Button
                  onClick={() => setOpenDateFilter(true)}
                  title="Date Filter"
                  disabled={loading}
                  className="flex items-center gap-4"
                >
                  <DateRange className="mr-4" />
                  <Typography className="text-11 xl:text-16">
                    {timeFormat(filterStartDate, 'Asia/Kuala_Lumpur').format(
                      'DD/MM/YYYY HH:mm'
                    )}{' '}
                    WITA
                  </Typography>
                  <ChevronRight />
                  <Typography className="text-11 xl:text-16">
                    {timeFormat(filterEndDate, 'Asia/Kuala_Lumpur').format(
                      'DD/MM/YYYY HH:mm'
                    )}{' '}
                    WITA
                  </Typography>
                </Button>
              </div>

              {loading ? (
                <div className="w-full flex my-auto justify-center items-center">
                  <CircularProgress color="inherit" className="mt-10" />
                </div>
              ) : (
                <div className="w-full flex flex-col md:flex-row justify-center my-auto items-center">
                  <Chart
                    maxEfficiencyValue={maxEfficiencyValue}
                    minEfficiencyValue={minEfficiencyValue}
                    schema={homeEfficiencySchema}
                    loading={loading}
                    data={chart}
                    referenceValue={referenceValue}
                  />
                </div>
              )}
            </div>
            <div className="w-full md:w-1/4 flex flex-col space-y-8">
              <div className="flex-1 flex">
                <Paper
                  square
                  className="flex-1 flex flex-col gap-8 justify-between py-10 xl:py-24 items-center h-auto"
                >
                  <Typography className="text-center text-12 md:text-14 xl:text-24">
                    Current Efficiency
                  </Typography>
                  {loading ? (
                    <CircularProgress size="2em" color="inherit" />
                  ) : (
                    <Typography
                      className={
                        currentEfficiency < 0
                          ? 'text-red text-center text-16 md:text-36 font-semibold'
                          : 'text-light-green-A700 text-center text-16 md:text-36 font-semibold'
                      }
                    >
                      {currentEfficiency
                        ? Number(currentEfficiency).toFixed(2)
                        : Number(0).toFixed(2)}
                      %
                    </Typography>
                  )}
                  {loading ? (
                    <div />
                  ) : (
                    <Typography className="text-center text-12 xl:text-16">
                      Last Updated : <br />{' '}
                      {dateCurrent ? `${dateCurrent} WITA` : '-'}
                    </Typography>
                  )}
                </Paper>
              </div>
              <div className="flex-1 flex">
                <Paper
                  square
                  className="flex-1 flex flex-col gap-8 justify-between py-10 xl:py-24 items-center h-auto"
                >
                  <Typography className="text-center text-12 md:text-14 xl:text-24">
                    Efficiency Improvement
                  </Typography>
                  {loading ? (
                    <CircularProgress size="2em" color="inherit" />
                  ) : (
                    <Typography
                      className={
                        improvementEfficiency < 0
                          ? 'text-red text-center text-16 md:text-36 font-semibold'
                          : 'text-light-green-A700 text-center text-16 md:text-36 font-semibold'
                      }
                    >
                      {improvementEfficiency
                        ? Number(improvementEfficiency).toFixed(2)
                        : Number(0).toFixed(2)}
                      %
                    </Typography>
                  )}
                  <div />
                </Paper>
              </div>
              <div className="flex-1 flex">
                <Paper
                  square
                  className="flex-1 flex flex-col gap-8 justify-between py-10 xl:py-24 items-center h-auto"
                >
                  <Typography className="text-center text-12 md:text-14 xl:text-24">
                    Efficiency Baseline
                  </Typography>
                  {loading ? (
                    <CircularProgress size="2em" color="inherit" />
                  ) : (
                    <Typography className="text-orange-600 text-center text-16 md:text-36 font-semibold">
                      {baselineEfficiency
                        ? Number(baselineEfficiency).toFixed(2)
                        : Number(0).toFixed(2)}
                      %
                    </Typography>
                  )}
                  {loading ? (
                    <div />
                  ) : (
                    <Typography className="text-center text-12 xl:text-16">
                      Last Updated : <br />{' '}
                      {dateBaseline ? `${dateBaseline} WITA` : '-'}
                    </Typography>
                  )}
                </Paper>
              </div>
            </div>
          </section>
        </div>
      </FuseAnimate>
      {openDateFilter && (
        <DateRangeModal
          type="timedate"
          views={['date', 'hours', 'minutes']}
          title="Change date for boiler efficiency chart"
          subTitle="Please select a date range from 1 to 14 days."
          filterStartDateValue={timeFormat(
            filterStartDate,
            'Asia/Kuala_Lumpur'
          )}
          filterEndDateValue={timeFormat(filterEndDate, 'Asia/Kuala_Lumpur')}
          changeFilterStartDate={(e) =>
            dispatch(changeEfficiency({ filterStartDate: e }))
          }
          changeFilterEndDate={(e) =>
            dispatch(changeEfficiency({ filterEndDate: e }))
          }
          loading={false}
          format="YYYY-MM-DD HH:mm"
          openDateFilter={openDateFilter}
          resetFilterHandler={resetFilter}
          cancelDateFilterHandler={cancelDateFilter}
          confirmDateFilterHandler={confirmDateFilter}
        />
      )}
    </main>
  );
};

export default Home;
