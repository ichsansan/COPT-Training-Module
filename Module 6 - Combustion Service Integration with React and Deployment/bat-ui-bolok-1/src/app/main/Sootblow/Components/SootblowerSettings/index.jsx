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
import Confirmation from 'app/fuse-layouts/shared-components/Confirmation';
import InputNumberCustom from 'app/fuse-layouts/shared-components/InputNumberCustom';
import {
  changeSootblow,
  exportSootblowLogSootblowerSettings,
  exportSootblowSootblowerSettings,
  getSootblowData,
  getSootblowSettingByID,
  updateSootblowSettingData,
} from 'app/store/actions';
import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from '@fuse/hooks';
import { showMessage } from 'app/store/fuse/messageSlice';
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

const createSootblowSettingData = (label, maxTime, minTime, id) => {
  return { label, maxTime, minTime, id };
};

const SootblowerSettings = ({ expanded, handleChange }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const isLaptopScreen = useMediaQuery('(min-width: 1024px)');

  const sootblowReducer = useSelector((state) => state.sootblowReducer);
  const userReducer = useSelector((state) => state.auth);

  const { user } = userReducer;

  const {
    loading,
    loadingExport,
    loadingSootblowData,
    sootblowData,
    sootblowSettingDetailData,
    loadingSootblowUpdate,
    filterStartDate,
    filterEndDate,
  } = sootblowReducer;

  const { waitingTime } = sootblowData;

  const containerRef = useRef(0);
  const totalContainerHeight = containerRef?.current?.clientHeight;
  const [containerHeight, setContainerHeight] = useState(0);

  const [openSootblowSettingUpdate, setOpenSootblowSettingUpdate] = useState(
    false
  );

  const [sootblowSettingMaxValue, setSootblowSettingMaxValue] = useState(0);
  const [sootblowSettingMinValue, setSootblowSettingMinValue] = useState(0);
  const [openExportConfirmation, setOpenExportConfirmation] = useState(false);
  const [openLogExportConfirmation, setOpenLogExportConfirmation] = useState(
    false
  );
  const [openDateFilter, setOpenDateFilter] = useState(false);

  const sootblowSettingData = waitingTime?.map((item) =>
    createSootblowSettingData(item.label, item.maxTime, item.minTime, item.id)
  );

  const handleClickOpenSootblowSettingUpdate = () => {
    setOpenSootblowSettingUpdate(true);
  };

  const handleCloseSootblowSettingUpdate = () => {
    setOpenSootblowSettingUpdate(false);
  };

  const sootblowSettingDetailFetch = async (id) => {
    await dispatch(getSootblowSettingByID(id));
  };

  const updateSootblowSettingHandler = async (id, label) => {
    await dispatch(
      changeSootblow({
        loadingSootblowUpdate: true,
      })
    );
    await dispatch(
      updateSootblowSettingData({
        id,
        label,
        maxTime: sootblowSettingMaxValue || sootblowSettingDetailData?.maxTime,
        minTime: sootblowSettingMinValue || sootblowSettingDetailData?.minTime,
      })
    );
    await handleCloseSootblowSettingUpdate();
    await dispatch(getSootblowData());
  };

  const closeExportConfirmation = () => {
    setOpenExportConfirmation(false);
  };

  const confirmExportHandler = async () => {
    const isSuccess = await dispatch(exportSootblowSootblowerSettings());
    if (isSuccess) {
      closeExportConfirmation();
    }
  };

  const closeLogExportConfirmation = () => {
    setOpenLogExportConfirmation(false);
  };

  const confirmLogExportHandler = async () => {
    const isSuccess = await dispatch(exportSootblowLogSootblowerSettings());
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
          expanded === 'panel5'
            ? 'flex-1 w-full overflow-auto'
            : 'flex-initial w-full'
        }
        expanded={expanded === 'panel5'}
        onChange={handleChange('panel5')}
        square
        ref={containerRef}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel5a-content"
          id="panel5a-header"
          className="w-full"
        >
          <div className="flex items-center gap-4 justify-between flex-1">
            <Typography className="text-12 xl:text-16 text-light-blue-300 font-600">
              Sootblower Settings
            </Typography>
            <div className="flex items-center gap-4">
              <Tooltip
                title="Export Sootblower Settings History Log Data"
                arrow
              >
                <span>
                  <IconButton
                    disabled={loadingSootblowData}
                    size="small"
                    onClick={async (event) => {
                      event.stopPropagation();
                      setOpenDateFilter(true);
                    }}
                    aria-label="export sootblower settings history log data"
                  >
                    <History fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Export Sootblower Settings Data" arrow>
                <span>
                  <IconButton
                    disabled={loadingSootblowData}
                    size="small"
                    onClick={async (event) => {
                      event.stopPropagation();
                      setOpenExportConfirmation(true);
                    }}
                    aria-label="export sootblower settings data"
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
          ) : sootblowSettingData?.length !== 0 ? (
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
                      SB No
                    </TableCell>
                    <TableCell
                      align="center"
                      className="text-11 xl:text-16 py-auto text-light-blue-300"
                    >
                      Min Time
                    </TableCell>
                    <TableCell
                      align="center"
                      className="text-11 xl:text-16 py-auto text-light-blue-300"
                    >
                      Max Time
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
                  {sootblowSettingData?.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell
                        align="center"
                        className="text-10 xl:text-14 py-4"
                      >
                        {row.label || '-'}
                      </TableCell>
                      <TableCell
                        align="center"
                        className="text-10 xl:text-14 py-4"
                      >
                        {row.minTime ?? '-'} minutes
                      </TableCell>
                      <TableCell
                        align="center"
                        className="text-10 xl:text-14 py-4"
                      >
                        {row.maxTime ?? '-'} minutes
                      </TableCell>
                      {user && user.role && user.role[0] === 'ENGINEER' && (
                        <TableCell
                          align="center"
                          className="py-4 text-14 xl:text-16"
                        >
                          <IconButton
                            onClick={async () => {
                              setSootblowSettingMaxValue(row?.maxTime);
                              setSootblowSettingMinValue(row?.minTime);
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
                No Sootblow Settings to Show
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
          Modify this sootblow's setting value?
        </Typography>
        <DialogContent>
          {loading ? (
            <LinearProgress color="secondary" />
          ) : (
            <Grid container spacing={1}>
              <Grid container alignItems="baseline" item xs={12}>
                <Grid
                  item
                  xs={12}
                  md={3}
                  className="text-14 text-light-blue-300"
                >
                  SB No
                </Grid>
                <Grid item xs={12} md={9} className="text-14">
                  {sootblowSettingDetailData.label || '-'}
                </Grid>
              </Grid>
              <Grid container alignItems="baseline" item xs={12}>
                <Grid
                  item
                  xs={12}
                  md={3}
                  className="text-14 text-light-blue-300"
                >
                  Min Time
                </Grid>
                <Grid item xs={12} md={9}>
                  <TextField
                    color="secondary"
                    defaultValue={sootblowSettingDetailData.minTime}
                    fullWidth
                    size="small"
                    onChange={(e) => setSootblowSettingMinValue(e.target.value)}
                    InputProps={{
                      inputComponent: InputNumberCustom,
                      endAdornment: (
                        <InputAdornment position="end">minutes</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
              <Grid container alignItems="baseline" item xs={12}>
                <Grid
                  item
                  xs={12}
                  md={3}
                  className="text-14 text-light-blue-300"
                >
                  Max Time
                </Grid>
                <Grid item xs={12} md={9}>
                  <TextField
                    color="secondary"
                    defaultValue={sootblowSettingDetailData.maxTime}
                    fullWidth
                    size="small"
                    onChange={(e) => setSootblowSettingMaxValue(e.target.value)}
                    InputProps={{
                      inputComponent: InputNumberCustom,
                      endAdornment: (
                        <InputAdornment position="end">minutes</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions className="p-24">
          {!loadingSootblowUpdate && (
            <Button
              onClick={handleCloseSootblowSettingUpdate}
              variant="outlined"
              className="text-12 px-6"
            >
              Cancel
            </Button>
          )}
          {loadingSootblowUpdate ? (
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
                updateSootblowSettingHandler(
                  sootblowSettingDetailData.id,
                  sootblowSettingDetailData.label
                )
              }
              disabled={loading}
              variant="contained"
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
          title="Export Sootblower Settings Data"
          contentText="Confirm to export sootblower settings data?"
          cancelHandler={closeExportConfirmation}
          confirmHandler={confirmExportHandler}
        />
      )}
      {openLogExportConfirmation && (
        <Confirmation
          confirmText={loadingExport ? 'Exporting' : 'OK'}
          loading={loadingExport}
          open={openLogExportConfirmation}
          title="Export Sootblower Settings History Log Data"
          contentText="Confirm to export sootblow sootblower settings history log data?"
          cancelHandler={closeLogExportConfirmation}
          confirmHandler={confirmLogExportHandler}
        />
      )}
      {openDateFilter && (
        <DateRangeModal
          format="YYYY-MM-DD"
          views={['date']}
          title="Please select a time range to export sootblower settings history log data"
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

export default SootblowerSettings;
