import { useMediaQuery } from '@fuse/hooks';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  LinearProgress,
  MenuItem,
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
import DateRangeModal from 'app/fuse-layouts/shared-components/DateRangeModal';
import InputNumberCustom from 'app/fuse-layouts/shared-components/InputNumberCustom';
import {
  changeCombustion,
  exportCombustionLogParameterSettings,
  exportCombustionParameterSettings,
  getCombustionIndicator,
  getCombustionParameterByID,
  updateCombustionParameterData,
} from 'app/store/actions';
import { showMessage } from 'app/store/fuse/messageSlice';
import clsx from 'clsx';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

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

const createParameterData = (label, value, id) => {
  return { label, value, id };
};

const debugModeOptions = [
  { id: '0', value: '0', label: 'False' },
  { id: '1', value: '1', label: 'True' },
];

const ParameterSettings = ({ expanded, handleChange }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const isLaptopScreen = useMediaQuery('(min-width: 1024px)');

  const combustionReducer = useSelector((state) => state.combustionReducer);
  const userReducer = useSelector((state) => state.auth);

  const { user } = userReducer;

  const {
    loading,
    loadingCombustion,
    loadingExport,
    combustionParameterSettingData,
    combustionParameterDetailData,
    loadingParameterUpdate,
    filterStartDate,
    filterEndDate,
  } = combustionReducer;

  const containerRef = useRef(0);
  const totalContainerHeight = containerRef?.current?.clientHeight;
  const [containerHeight, setContainerHeight] = useState(0);

  const [openParameterUpdate, setOpenParameterUpdate] = useState(false);
  const [parameterValue, setParameterValue] = useState('');
  const [openExportConfirmation, setOpenExportConfirmation] = useState(false);

  const [openLogExportConfirmation, setOpenLogExportConfirmation] = useState(
    false
  );
  const [openDateFilter, setOpenDateFilter] = useState(false);

  const parameterData = combustionParameterSettingData.map((item) =>
    createParameterData(item.label, item.value, item.id)
  );

  const handleClickOpenParameterUpdate = () => {
    setOpenParameterUpdate(true);
  };

  const handleCloseParameterUpdate = () => {
    setOpenParameterUpdate(false);
  };

  const parameterDetailFetch = async (id) => {
    await dispatch(getCombustionParameterByID(id));
  };

  const updateParameterHandler = async (id, label) => {
    if (parameterValue === '') {
      await dispatch(
        showMessage({
          message: 'Sorry, value cannot be empty',
          variant: 'error',
        })
      );
    } else {
      await dispatch(
        changeCombustion({
          loadingParameterUpdate: true,
        })
      );
      await dispatch(
        updateCombustionParameterData({
          id,
          label,
          value: +parameterValue ?? +combustionParameterDetailData?.value,
          userId: user?.data?.id,
        })
      );
      await handleCloseParameterUpdate();
      await dispatch(getCombustionIndicator());
    }
  };

  const closeExportConfirmation = () => {
    setOpenExportConfirmation(false);
  };

  const confirmExportHandler = async () => {
    const isSuccess = await dispatch(exportCombustionParameterSettings());
    if (isSuccess) {
      closeExportConfirmation();
    }
  };

  const closeLogExportConfirmation = () => {
    setOpenLogExportConfirmation(false);
  };

  const confirmLogExportHandler = async () => {
    const isSuccess = await dispatch(exportCombustionLogParameterSettings());
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
      changeCombustion({
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
          expanded === 'panel2'
            ? 'flex-1 w-full overflow-auto'
            : 'flex-initial w-full overflow-hidden'
        }
        expanded={expanded === 'panel2'}
        onChange={handleChange('panel2')}
        square
        ref={containerRef}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel2a-content"
          id="panel2a-header"
          className="w-full"
        >
          <div className="flex items-center gap-4 justify-between flex-1">
            <Typography className="text-12 xl:text-16 text-light-blue-300 font-600">
              Operation Parameter Settings
            </Typography>
            <div className="flex items-center gap-4">
              <Tooltip title="Export Parameter Settings History Log Data" arrow>
                <span>
                  <IconButton
                    disabled={loadingCombustion}
                    size="small"
                    onClick={async (event) => {
                      event.stopPropagation();
                      setOpenDateFilter(true);
                    }}
                    aria-label="export parameter settings history log data"
                  >
                    <History fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Export Parameter Settings Data" arrow>
                <span>
                  <IconButton
                    disabled={loadingCombustion}
                    size="small"
                    onClick={async (event) => {
                      event.stopPropagation();
                      setOpenExportConfirmation(true);
                    }}
                    aria-label="export parameter settings data"
                  >
                    <CloudDownload fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            </div>
          </div>
        </AccordionSummary>
        <AccordionDetails className="p-0 ">
          {loadingCombustion ? (
            <div className="flex-1 flex min-h-96 justify-center items-center py-4 md:p-0 mb-8 md:mb-0">
              <Typography className="text-12 xl:text-16">Loading</Typography>
            </div>
          ) : parameterData.length !== 0 ? (
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
                      Parameter
                    </TableCell>
                    <TableCell
                      align="center"
                      className="text-11 xl:text-16 py-auto text-light-blue-300"
                    >
                      Value
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
                  {parameterData.map((row) => (
                    <TableRow key={row.label}>
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
                        {row.label === 'DEBUG_MODE'
                          ? row.value === 0
                            ? 'FALSE'
                            : 'TRUE'
                          : row.value || '-'}
                      </TableCell>
                      {user && user.role && user.role[0] === 'ENGINEER' && (
                        <TableCell
                          align="center"
                          className="py-4 text-14 xl:text-16"
                        >
                          {typeof row.value !== 'number' ? (
                            '-'
                          ) : (
                            <IconButton
                              onClick={async () => {
                                setParameterValue(row?.value);
                                await handleClickOpenParameterUpdate();
                                await parameterDetailFetch(row.id);
                              }}
                              size="small"
                            >
                              <Build className="text-14 xl:text-16" />
                            </IconButton>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <div className="flex-1 flex min-h-96 justify-center items-center py-4 md:p-0 ">
              <Typography className="text-12 xl:text-16">
                No Parameter to Show
              </Typography>
            </div>
          )}
        </AccordionDetails>
      </Accordion>

      <Dialog
        fullWidth
        open={openParameterUpdate}
        aria-labelledby="responsive-dialog-title"
      >
        <Typography className="text-16 m-24" id="responsive-dialog-title">
          Modify this parameter's value?
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
                  Parameter
                </Grid>
                <Grid item xs={12} md={9} className="text-14">
                  {combustionParameterDetailData.label || '-'}
                </Grid>
              </Grid>
              <Grid container alignItems="baseline" item xs={12}>
                <Grid
                  item
                  xs={12}
                  md={3}
                  className="text-14 text-light-blue-300"
                >
                  Value
                </Grid>
                <Grid item xs={12} md={9}>
                  {combustionParameterDetailData?.label === 'DEBUG_MODE' ? (
                    <TextField
                      color="secondary"
                      id="select-value"
                      variant="outlined"
                      select
                      defaultValue={combustionParameterDetailData.value}
                      size="small"
                      fullWidth
                      onChange={(e) => {
                        setParameterValue(e.target.value);
                      }}
                    >
                      {debugModeOptions?.map((item) => (
                        <MenuItem key={item.id} value={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  ) : (
                    <TextField
                      variant="outlined"
                      defaultValue={combustionParameterDetailData.value}
                      fullWidth
                      color="secondary"
                      size="small"
                      type="text"
                      onChange={(e) => setParameterValue(e.target.value)}
                      InputProps={{
                        inputComponent: InputNumberCustom,
                        endAdornment:
                          combustionParameterDetailData?.label ===
                            'RECOM_EXEC_INTERVAL' && 'minutes',
                      }}
                    />
                  )}
                </Grid>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions className="p-24">
          {!loadingParameterUpdate && (
            <Button
              onClick={handleCloseParameterUpdate}
              variant="outlined"
              className="text-12 px-6"
            >
              Cancel
            </Button>
          )}
          {loadingParameterUpdate ? (
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
                updateParameterHandler(
                  combustionParameterDetailData.id,
                  combustionParameterDetailData.label
                )
              }
              variant="contained"
              autoFocus
              disabled={loading}
              className={clsx(classes.saveButton, 'text-12 px-6')}
            >
              Save
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <Confirmation
        confirmText={loadingExport ? 'Exporting' : 'OK'}
        open={openExportConfirmation}
        title="Export Parameter Settings Data"
        contentText="Confirm to export combustion parameter settings data?"
        cancelHandler={closeExportConfirmation}
        confirmHandler={confirmExportHandler}
        loading={loadingExport}
      />
      {openLogExportConfirmation && (
        <Confirmation
          confirmText={loadingExport ? 'Exporting' : 'OK'}
          loading={loadingExport}
          open={openLogExportConfirmation}
          title="Export Parameter Settings History Log Data"
          contentText="Confirm to export combustion parameter settings history log data?"
          cancelHandler={closeLogExportConfirmation}
          confirmHandler={confirmLogExportHandler}
        />
      )}
      {openDateFilter && (
        <DateRangeModal
          format="YYYY-MM-DD"
          views={['date']}
          title="Please select a time range to export parameter settings history log data"
          filterStartDateValue={filterStartDate}
          filterEndDateValue={filterEndDate}
          changeFilterStartDate={(e) =>
            dispatch(changeCombustion({ filterStartDate: e }))
          }
          changeFilterEndDate={(e) =>
            dispatch(changeCombustion({ filterEndDate: e }))
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

export default ParameterSettings;
