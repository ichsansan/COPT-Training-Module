import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Build, CloudDownload, ExpandMore, History } from '@material-ui/icons';
import {
  changeSootblow,
  exportSootblowLogTimeoutSettings,
  exportSootblowTimeoutSettings,
  getSootblowData,
  getSootblowTimeoutByID,
  updateSootblowTimeoutData,
} from 'app/store/actions';
import { showMessage } from 'app/store/fuse/messageSlice';
import clsx from 'clsx';
import Confirmation from 'app/fuse-layouts/shared-components/Confirmation';
import InputNumberCustom from 'app/fuse-layouts/shared-components/InputNumberCustom';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from '@fuse/hooks';
import moment from 'moment';
import DateRangeModal from 'app/fuse-layouts/shared-components/DateRangeModal';

const Accordion = withStyles({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: 'rgba(0, 0, 0, .03)',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '0',
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiAccordionDetails);

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
  saveButton: {
    backgroundColor: '#1976d2',
    color: '#FFF',
    '&:hover': {
      backgroundColor: '#21619e',
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
}));

const createTimeoutSettingsData = (id, areaName, areaCode, time) => {
  return { id, areaName, areaCode, time };
};

const TimeoutSettings = ({ expanded, handleChange }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const isLaptopScreen = useMediaQuery('(min-width: 1024px)');

  const sootblowReducer = useSelector((state) => state.sootblowReducer);
  const userReducer = useSelector((state) => state.auth);

  const containerRef = useRef(0);
  const totalContainerHeight = containerRef?.current?.clientHeight;
  const [containerHeight, setContainerHeight] = useState(0);

  const { user } = userReducer;

  const {
    loading,
    loadingExport,
    loadingSootblowData,
    sootblowData,
    sootblowTimeoutDetailData,
    loadingTimeoutSettingsUpdate,
    errorGetDetailTimeout,
    filterStartDate,
    filterEndDate,
  } = sootblowReducer;

  const { timeoutSettings } = sootblowData;

  const [openSootblowSettingUpdate, setOpenSootblowSettingUpdate] = useState(
    false
  );
  const [openExportConfirmation, setOpenExportConfirmation] = useState(false);
  const [sootblowTimeoutValue, setSootblowTimeoutValue] = useState(0);
  const [openLogExportConfirmation, setOpenLogExportConfirmation] = useState(
    false
  );
  const [openDateFilter, setOpenDateFilter] = useState(false);

  const sootblowTimeoutData = timeoutSettings?.map((item) =>
    createTimeoutSettingsData(
      item.areaId,
      item.areaName,
      item.areaCode,
      item.prosesTime
    )
  );

  const handleClickOpenSootblowSettingUpdate = () => {
    setOpenSootblowSettingUpdate(true);
  };

  const handleCloseSootblowSettingUpdate = () => {
    setOpenSootblowSettingUpdate(false);
  };

  const sootblowSettingDetailFetch = async (id = 0) => {
    await dispatch(getSootblowTimeoutByID(+id));
  };

  const updateSootblowTimeoutHandler = async (id, areaName, areaCode) => {
    if (sootblowTimeoutValue === '') {
      await dispatch(
        showMessage({
          message: 'Sorry, process timeout value cannot be empty',
          variant: 'error',
        })
      );
    } else {
      await dispatch(
        changeSootblow({
          loadingTimeoutSettingsUpdate: true,
        })
      );
      await dispatch(
        updateSootblowTimeoutData({
          areaId: id,
          areaName,
          areaCode,
          prosesTime:
            sootblowTimeoutValue || sootblowTimeoutDetailData.prosesTime,
        })
      );
      await handleCloseSootblowSettingUpdate();
      await dispatch(getSootblowData());
    }
  };

  const closeExportConfirmation = () => {
    setOpenExportConfirmation(false);
  };

  const confirmExportHandler = async () => {
    const isSuccess = await dispatch(exportSootblowTimeoutSettings());
    if (isSuccess) {
      closeExportConfirmation();
    }
  };

  const closeLogExportConfirmation = () => {
    setOpenLogExportConfirmation(false);
  };

  const confirmLogExportHandler = async () => {
    const isSuccess = await dispatch(exportSootblowLogTimeoutSettings());
    if (isSuccess) {
      closeLogExportConfirmation();
      cancelDateFilterHandler();
    }
  };

  const cancelDateFilterHandler = () => {
    setOpenDateFilter(false);
  };

  const confirmDateFilterHandler = async () => {
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
      const end = moment(filterStartDate);

      if (new Date(filterStartDate) > new Date(filterEndDate)) {
        await dispatch(
          showMessage({
            message: `Invalid date, end date cannot be before ${moment(
              end
            ).format('DD/MM/YYYY')}`,
            variant: 'error',
          })
        );
      } else {
        setOpenLogExportConfirmation(true);
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

  const resetFilterHandler = async () => {
    const TODAY = new Date();
    const DATE = new Date();
    const LAST_MONTH = DATE.setDate(DATE.getDate() - 30);
    await dispatch(
      changeSootblow({
        filterStartDate: LAST_MONTH,
        filterEndDate: TODAY,
      })
    );
    await dispatch(
      showMessage({
        message: `Date filter has been reset`,
        variant: 'success',
      })
    );
  };

  useEffect(() => {
    if (!isLaptopScreen) return;
    if (!containerRef.current) return; // wait for the containerRef to be available
    const resizeObserver = new ResizeObserver(() => {
      setContainerHeight(containerRef.current?.clientHeight - 60);
      // Do what you want to do when the size of the element changes
    });
    resizeObserver.observe(containerRef.current);
    // eslint-disable-next-line consistent-return
    return () => resizeObserver.disconnect(); // clean up
  }, [containerRef, isLaptopScreen, totalContainerHeight]);

  return (
    <>
      <Accordion
        className={
          expanded === 'panel4'
            ? 'flex-1 w-full overflow-auto'
            : 'flex-initial w-full'
        }
        expanded={expanded === 'panel4'}
        onChange={handleChange('panel4')}
        square
        ref={containerRef}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel4a-content"
          id="panel4a-header"
          className="w-full"
        >
          <div className="flex items-center gap-4 justify-between flex-1">
            <Typography className="text-12 xl:text-16 text-light-blue-300 font-600">
              Timeout Settings
            </Typography>
            <div className="flex items-center gap-4">
              <Tooltip title="Export Timeout Settings History Log Data" arrow>
                <span>
                  <IconButton
                    disabled={loadingSootblowData}
                    size="small"
                    onClick={async (event) => {
                      event.stopPropagation();
                      setOpenDateFilter(true);
                    }}
                    aria-label="export timeout settings history log data"
                  >
                    <History fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Export Timeout Settings Data" arrow>
                <span>
                  <IconButton
                    disabled={loadingSootblowData}
                    size="small"
                    onClick={async (event) => {
                      event.stopPropagation();
                      setOpenExportConfirmation(true);
                    }}
                    aria-label="export timeout settings data"
                  >
                    <CloudDownload fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            </div>
          </div>
        </AccordionSummary>
        <AccordionDetails className="p-0">
          {loadingSootblowData ? (
            <div className="flex-1 flex min-h-96 justify-center items-center py-4 md:p-0 mb-8 md:mb-0">
              <Typography className="text-12 xl:text-16">Loading</Typography>
            </div>
          ) : sootblowTimeoutData?.length !== 0 ? (
            <TableContainer
              style={{
                maxHeight: isLaptopScreen ? containerHeight || 480 : '100%',
                height: isLaptopScreen ? containerHeight || 480 : '100%',
              }}
              className="overflow-auto "
            >
              <Table stickyHeader size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell
                      align="center"
                      className="text-11 xl:text-16 py-auto text-light-blue-300"
                    >
                      Area Name
                    </TableCell>
                    <TableCell
                      align="center"
                      className="text-11 xl:text-16 py-auto text-light-blue-300"
                    >
                      Area Code
                    </TableCell>
                    <TableCell
                      align="center"
                      className="text-11 xl:text-16 py-auto text-light-blue-300"
                    >
                      Timeout
                    </TableCell>
                    {user && user.role && user.role[0] === 'ENGINEER' && (
                      <TableCell
                        align="center"
                        className="text-11 xl:text-16 py-auto text-light-blue-300"
                      >
                        Modify
                      </TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sootblowTimeoutData?.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell
                        align="center"
                        className="text-10 xl:text-14 py-4"
                      >
                        {row.areaName || '-'}
                      </TableCell>
                      <TableCell
                        align="center"
                        className="text-10 xl:text-14 py-4"
                      >
                        {row.areaCode || '-'}
                      </TableCell>
                      <TableCell
                        align="center"
                        className="text-10 xl:text-14 py-4"
                      >
                        {row.time || 0} seconds
                      </TableCell>
                      {user && user.role && user.role[0] === 'ENGINEER' && (
                        <TableCell
                          align="center"
                          className="py-4 text-14 xl:text-16"
                        >
                          <IconButton
                            onClick={async () => {
                              setSootblowTimeoutValue(row?.time);
                              await handleClickOpenSootblowSettingUpdate();
                              await sootblowSettingDetailFetch(row.id);
                            }}
                            size="small"
                          >
                            <Build className="text-14 xl:text-16" />
                          </IconButton>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <div className="flex-1 flex-col flex min-h-96 justify-center items-center py-4 md:p-0 ">
              <Typography className="text-12 xl:text-16">
                No Timeout Settings to Show
              </Typography>
            </div>
          )}
        </AccordionDetails>
      </Accordion>

      <Dialog
        fullWidth
        open={openSootblowSettingUpdate}
        aria-labelledby="responsive-dialog-title"
      >
        <Typography className="text-16 m-24" id="responsive-dialog-title">
          Modify this timeout setting value?
        </Typography>
        <DialogContent>
          {loading ? (
            <LinearProgress color="secondary" />
          ) : errorGetDetailTimeout ? (
            <div className="flex-1 flex min-h-96 justify-center items-center py-4 md:p-0 text-red ">
              <Typography className="text-12 xl:text-16">
                Sorry something went wrong!
              </Typography>
            </div>
          ) : (
            <Grid container spacing={1}>
              <Grid container alignItems="baseline" item xs={12}>
                <Grid
                  item
                  xs={12}
                  md={3}
                  className="text-14 text-light-blue-300"
                >
                  Area Name
                </Grid>
                <Grid item xs={12} md={9} className="text-14">
                  {sootblowTimeoutDetailData.areaName}
                </Grid>
              </Grid>
              <Grid container alignItems="center" item xs={12}>
                <Grid
                  item
                  xs={12}
                  md={3}
                  className="text-14 text-light-blue-300"
                >
                  Area Code
                </Grid>
                <Grid item xs={12} md={9} className="text-14">
                  {sootblowTimeoutDetailData.areaCode}
                </Grid>
              </Grid>
              <Grid container alignItems="baseline" item xs={12}>
                <Grid
                  item
                  xs={12}
                  md={3}
                  className="text-14 text-light-blue-300"
                >
                  Timeout
                </Grid>
                <Grid item xs={12} md={9}>
                  <TextField
                    defaultValue={
                      sootblowTimeoutDetailData?.prosesTime ||
                      sootblowTimeoutValue ||
                      0
                    }
                    fullWidth
                    size="small"
                    color="secondary"
                    onChange={(e) => setSootblowTimeoutValue(e.target.value)}
                    InputProps={{
                      inputComponent: InputNumberCustom,
                      endAdornment: (
                        <InputAdornment position="end">seconds</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions className="p-24">
          {!loadingTimeoutSettingsUpdate && (
            <Button
              onClick={handleCloseSootblowSettingUpdate}
              variant="outlined"
              className="text-12 px-6"
            >
              Cancel
            </Button>
          )}
          {loadingTimeoutSettingsUpdate ? (
            <Button
              disabled
              variant="contained"
              className={clsx('text-12 px-6')}
            >
              Saving
            </Button>
          ) : (
            <Button
              onClick={() =>
                updateSootblowTimeoutHandler(
                  sootblowTimeoutDetailData.areaId,
                  sootblowTimeoutDetailData.areaName,
                  sootblowTimeoutDetailData.areaCode
                )
              }
              disabled={loading || errorGetDetailTimeout}
              variant="contained"
              autoFocus
              className={clsx(classes.saveButton, 'text-12 px-6')}
            >
              Save
            </Button>
          )}
        </DialogActions>
      </Dialog>
      {openExportConfirmation && (
        <Confirmation
          confirmText={loadingExport ? 'Exporting' : 'OK'}
          loading={loadingExport}
          open={openExportConfirmation}
          title="Export Timeout Settings Data"
          contentText="Confirm to export sootblow timeout settings data?"
          cancelHandler={closeExportConfirmation}
          confirmHandler={confirmExportHandler}
        />
      )}

      {openLogExportConfirmation && (
        <Confirmation
          confirmText={loadingExport ? 'Exporting' : 'OK'}
          loading={loadingExport}
          open={openLogExportConfirmation}
          title="Export Timeout Settings History Log Data"
          contentText="Confirm to export sootblow timeout settings history log data?"
          cancelHandler={closeLogExportConfirmation}
          confirmHandler={confirmLogExportHandler}
        />
      )}
      {openDateFilter && (
        <DateRangeModal
          format="YYYY-MM-DD"
          views={['date']}
          title="Please select a time range to export timeout settings history log data"
          filterStartDateValue={filterStartDate}
          filterEndDateValue={filterEndDate}
          changeFilterStartDate={(e) =>
            dispatch(changeSootblow({ filterStartDate: e }))
          }
          changeFilterEndDate={(e) =>
            dispatch(changeSootblow({ filterEndDate: e }))
          }
          loading={false}
          openDateFilter={openDateFilter}
          resetFilterHandler={resetFilterHandler}
          cancelDateFilterHandler={cancelDateFilterHandler}
          confirmDateFilterHandler={confirmDateFilterHandler}
        />
      )}
    </>
  );
};

export default TimeoutSettings;
