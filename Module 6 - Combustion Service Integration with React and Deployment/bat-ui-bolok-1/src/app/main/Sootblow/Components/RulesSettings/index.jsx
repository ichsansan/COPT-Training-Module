/* eslint-disable operator-assignment */
import { useMediaQuery } from '@fuse/hooks';
import {
  AppBar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from '@material-ui/core';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
  AddBoxRounded,
  Build,
  CloudDownload,
  ExpandMore,
  History,
  IndeterminateCheckBoxRounded,
} from '@material-ui/icons';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Confirmation from 'app/fuse-layouts/shared-components/Confirmation';
import DateRangeModal from 'app/fuse-layouts/shared-components/DateRangeModal';
import {
  changeSootblow,
  changeSootblowActivePreset,
  exportSootblowLogRulesSettings,
  exportSootblowRulesSettings,
  getRuleByID,
  getRuleTags,
  updateRuleData,
} from 'app/store/actions';
import { showMessage } from 'app/store/fuse/messageSlice';
import clsx from 'clsx';
import { orderBy, range } from 'lodash';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import NewPreset from './NewPreset';

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

const createRuleSettingData = (label, id, presetId) => {
  return { label, id, presetId };
};

const RulesSettings = ({ expanded, handleChange }) => {
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
    loadingRuleUpdate,
    sootblowRuleDetailData,
    sootblowRuleTags,
    sootblowDetailRule,
    sootblowRuleSelectedPreset,
    filterStartDate,
    filterEndDate,
  } = sootblowReducer;

  const { rules } = sootblowData;

  const containerRef = useRef(0);
  const totalContainerHeight = containerRef?.current?.clientHeight;
  const [containerHeight, setContainerHeight] = useState(0);

  const [openRuleSettingUpdate, setOpenRuleSettingUpdate] = useState(false);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [confirmationLoadingText, setConfirmationLoadingText] = useState('');
  const [confirmationTitle, setConfirmationTitle] = useState('');
  const [confirmationContentText, setConfirmationContentText] = useState('');
  const [confirmationType, setConfirmationType] = useState('');
  const [openExportConfirmation, setOpenExportConfirmation] = useState(false);
  const [openLogExportConfirmation, setOpenLogExportConfirmation] = useState(
    false
  );
  const [openDateFilter, setOpenDateFilter] = useState(false);
  const [selectedRule, setSelectedRule] = useState({
    label: '',
    id: '',
    presetId: '',
  });

  const [showNewPreset, setShowNewPreset] = useState(false);
  // const [preset, setPreset] = useState("Preset A")

  useEffect(() => {
    return dispatch(getRuleTags());
  }, [dispatch]);

  const ruleSettingData = rules.map((item) =>
    createRuleSettingData(item.label, item.id, item.usedPresetId)
  );

  const handleClickOpenRuleUpdate = () => {
    setOpenRuleSettingUpdate(true);
  };

  const handleCloseRuleUpdate = () => {
    setOpenRuleSettingUpdate(false);
  };

  const ruleDetailFetch = async (id, presetId) => {
    await dispatch(getRuleByID(id, presetId));
  };

  const confirmConfirmationHandler = () => {
    if (confirmationType === 'updateRule') {
      updateRuleSettingHandler();
    } else if (confirmationType === 'presetActivation') {
      presetActivationHandler();
    } else {
      cancelConfirmationHandler();
    }
  };

  const presetActivationHandler = async () => {
    const { id, presetId } = sootblowRuleDetailData;
    await dispatch(changeSootblowActivePreset(id, presetId));
    await cancelConfirmationHandler();
    await dispatch(getRuleByID(id, presetId));
    await setConfirmationType('');
  };

  const updateRuleSettingHandler = async () => {
    const updateRuleResponse = await dispatch(updateRuleData());
    if (updateRuleResponse) {
      await handleCloseRuleUpdate();
      await setConfirmationType('');
      await cancelConfirmationHandler();
    } else {
      await cancelConfirmationHandler();
      await setConfirmationType('');
    }
  };

  const updateRuleOpenBracket = (value, id) => {
    const newRule = sootblowDetailRule.map((item, index) => {
      if (index === id) {
        return { ...item, bracketOpen: value };
      }
      return item;
    });

    dispatch(changeSootblow({ sootblowDetailRule: newRule }));
  };

  const updateRuleCloseBracket = (value, id) => {
    const newRule = sootblowDetailRule.map((item, index) => {
      if (index === id) {
        return { ...item, bracketClose: value };
      }
      return item;
    });

    dispatch(changeSootblow({ sootblowDetailRule: newRule }));
  };

  const changeTagHandler = (newValue, id) => {
    const newRule = sootblowDetailRule.map((item, index) => {
      if (index === id) {
        return { ...item, tagSensor: newValue };
      }
      return item;
    });

    dispatch(changeSootblow({ sootblowDetailRule: newRule }));
  };

  const addTagRuleRow = async (id) => {
    const insertRow = (arr, index, ...newRow) => [
      ...arr.slice(0, index),
      ...newRow,
      ...arr.slice(index),
    ];

    const newTagRow = insertRow(sootblowDetailRule, id + 1, {
      sequence: id + 1,
      bracketClose: '',
      bracketOpen: '',
      tagSensor: '',
    });

    for (let i = id + 1; i < newTagRow.length; i++) {
      newTagRow[i].sequence = newTagRow[i].sequence + 1;
    }

    dispatch(changeSootblow({ sootblowDetailRule: newTagRow }));
  };

  const deleteTagRuleRow = (index) => {
    const newTagRow = [...sootblowDetailRule];
    newTagRow.splice(index, 1);
    for (let i = index; i < newTagRow.length; i++) {
      newTagRow[i].sequence = newTagRow[i].sequence - 1;
    }
    dispatch(changeSootblow({ sootblowDetailRule: newTagRow }));
  };

  const onDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) return;
    if (sootblowDetailRule.length > 0) {
      const directionOfDrag =
        destination.index > source.index ? 'GREATER' : 'LESS';
      let affectedRange = [];
      if (directionOfDrag === 'GREATER') {
        affectedRange = range(source.index, destination.index + 1);
      } else if (directionOfDrag === 'LESS') {
        affectedRange = range(destination.index, source.index);
      }

      const reOrderedRuleSequence = sootblowDetailRule.map((item, index) => {
        if (index === +result.draggableId) {
          item.sequence = result.destination.index;
          return item;
        }
        if (affectedRange.includes(item.sequence)) {
          if (directionOfDrag === 'GREATER') {
            item.sequence = item.sequence - 1;
            return item;
          }
          if (directionOfDrag === 'LESS') {
            item.sequence = item.sequence + 1;
            return item;
          }
        } else {
          return item;
        }
        return null;
      });

      const newData = orderBy(reOrderedRuleSequence, 'sequence');
      dispatch(changeSootblow({ sootblowDetailRule: newData }));
    }
  };

  const cancelConfirmationHandler = () => {
    setOpenConfirmation(false);
    setConfirmationLoadingText('');
    setConfirmationTitle('');
    setConfirmationContentText('');
    setConfirmationType('');
  };

  const closeExportConfirmation = () => {
    setOpenExportConfirmation(false);
  };

  const confirmExportHandler = async () => {
    const isSuccess = await dispatch(exportSootblowRulesSettings());
    if (isSuccess) {
      closeExportConfirmation();
    }
  };

  const closeLogExportConfirmation = () => {
    setOpenLogExportConfirmation(false);
  };

  const confirmLogExportHandler = async () => {
    const { id, label } = selectedRule;
    const isSuccess = await dispatch(exportSootblowLogRulesSettings(id, label));
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
          expanded === 'panel3'
            ? 'flex-1 w-full overflow-auto'
            : 'flex-initial w-full overflow-hidden'
        }
        expanded={expanded === 'panel3'}
        onChange={handleChange('panel3')}
        square
        ref={containerRef}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel3a-content"
          id="panel3a-header"
          className="w-full"
        >
          <div className="flex items-center gap-4 justify-between flex-1">
            <Typography className="text-12 xl:text-16 text-light-blue-300 font-600">
              Rules Settings
            </Typography>
            <Tooltip title="Export Rules Settings Data" arrow>
              <span>
                <IconButton
                  disabled={loadingSootblowData}
                  size="small"
                  onClick={async (event) => {
                    event.stopPropagation();
                    setOpenExportConfirmation(true);
                  }}
                  aria-label="export rules settings data"
                >
                  <CloudDownload fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </div>
        </AccordionSummary>
        <AccordionDetails className="p-0">
          {loadingSootblowData ? (
            <div className="flex-1 flex min-h-96 justify-center items-center py-4 md:p-0 mb-8 md:mb-0">
              <Typography className="text-12 xl:text-16">Loading</Typography>
            </div>
          ) : ruleSettingData.length !== 0 ? (
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
                      Rule
                    </TableCell>
                    {user && user.role && user.role[0] === 'ENGINEER' && (
                      <TableCell
                        align="center"
                        className="text-11 xl:text-16 py-auto text-light-blue-300"
                      >
                        Modify
                      </TableCell>
                    )}
                    <TableCell
                      align="center"
                      className="text-11 xl:text-16 py-auto text-light-blue-300"
                    >
                      Log
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ruleSettingData.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell
                        align="center"
                        className="text-10 xl:text-14 py-4"
                      >
                        {row.label}
                      </TableCell>
                      {user && user.role && user.role[0] === 'ENGINEER' && (
                        <TableCell
                          align="center"
                          className="py-4 text-14 xl:text-16"
                        >
                          <IconButton
                            onClick={async () => {
                              await handleClickOpenRuleUpdate();
                              await ruleDetailFetch(row.id, row.presetId);
                            }}
                            size="small"
                          >
                            <Build className="text-14 xl:text-16" />
                          </IconButton>
                        </TableCell>
                      )}
                      <TableCell
                        align="center"
                        className="text-10 xl:text-14 py-4"
                      >
                        <Tooltip
                          title={`Export ${row.label} history log data`}
                          arrow
                        >
                          <span>
                            <IconButton
                              disabled={loadingSootblowData}
                              size="small"
                              onClick={async (event) => {
                                event.stopPropagation();
                                setSelectedRule({
                                  label: row.label,
                                  id: row?.id,
                                  presetId: row?.presetId,
                                });
                                setOpenDateFilter(true);
                              }}
                              aria-label="export rule settings history log data"
                            >
                              <History fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <div className="flex-1 flex min-h-96 justify-center items-center py-4 md:p-0 ">
              <Typography className="text-12 xl:text-16">
                No Rules Settings to Show
              </Typography>
            </div>
          )}
        </AccordionDetails>
      </Accordion>

      <Dialog
        fullWidth
        maxWidth={sootblowDetailRule?.length !== 0 ? 'lg' : 'md'}
        open={openRuleSettingUpdate}
        aria-labelledby="responsive-dialog-title"
      >
        <AppBar position="static" className="relative">
          <Toolbar>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-8 py-14 w-full">
              <div className="flex flex-col">
                <Typography
                  className="text-16 text-left"
                  id="responsive-dialog-title"
                >
                  {!loading ? (
                    <span className=" text-light-blue-300">
                      {sootblowRuleDetailData.label}
                    </span>
                  ) : (
                    'Rules Settings'
                  )}
                </Typography>
                <Typography variant="caption">
                  {!loading ? (
                    <span>{sootblowRuleDetailData?.subLabel}</span>
                  ) : (
                    'Presets name'
                  )}
                </Typography>
              </div>

              {!loading && (
                <div className="flex flex-col-reverse md:flex-row md:items-center gap-12">
                  <Autocomplete
                    id="preset-list"
                    disabled={sootblowRuleDetailData?.presetList?.length === 0}
                    options={sootblowRuleDetailData?.presetList}
                    size="small"
                    color="secondary"
                    onChange={async (event, newValue) => {
                      if (newValue === null) {
                        dispatch(
                          showMessage({
                            message:
                              'Preset is not available, please choose another preset!',
                            variant: 'error',
                          })
                        );
                      } else {
                        await dispatch(
                          changeSootblow({
                            loading: true,
                            error: '',
                          })
                        );
                        await dispatch(
                          changeSootblow({
                            sootblowRuleSelectedPreset: newValue,
                          })
                        );
                        await dispatch(
                          getRuleByID(newValue.ruleId, newValue.presetId)
                        );
                      }
                    }}
                    value={sootblowRuleSelectedPreset || ''}
                    getOptionLabel={(option) => option.presetDesc || ''}
                    renderOption={(option) => (
                      <>
                        {option.isActive
                          ? `${option.presetDesc} (ACTIVE)`
                          : option.presetDesc}
                      </>
                    )}
                    style={{ minWidth: 300 }}
                    renderInput={(params) => (
                      <TextField
                        fullWidth
                        size="small"
                        color="secondary"
                        {...params}
                        label="Rule's Preset"
                        variant="outlined"
                      />
                    )}
                  />

                  <div className="flex flex-col gap-8">
                    <div className="flex gap-4">
                      <Typography className=" w-80 ">Updated by</Typography>
                      <span> : </span>
                      <Typography className=" ml-4 text-light-blue-300">
                        {sootblowRuleDetailData?.updateBy || '-'}
                      </Typography>
                    </div>

                    <div className="flex gap-4">
                      <Typography className=" w-80 ">Updated at</Typography>
                      <span> : </span>
                      <Typography className=" ml-4 text-light-blue-300">
                        {sootblowRuleDetailData?.updateAt || '-'} WITA
                      </Typography>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Toolbar>
        </AppBar>

        <DialogContent className="py-24">
          {loading ? (
            <LinearProgress color="secondary" />
          ) : (
            <div className="space-y-10">
              {sootblowDetailRule?.length === 0 ? (
                <Grid container alignItems="baseline" item xs={12} spacing={1}>
                  <Grid item xs={12} className="text-14">
                    Sorry, there is no rules to be changed
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      size="small"
                      color="secondary"
                      onClick={() => addTagRuleRow(0)}
                    >
                      ADD RULE
                    </Button>
                  </Grid>
                </Grid>
              ) : (
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="RULES">
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="flex flex-col space-y-6"
                      >
                        {sootblowDetailRule?.map((item, index) => (
                          <Draggable
                            draggableId={index.toString()}
                            index={item.sequence}
                            key={index}
                          >
                            {(subProvided) => (
                              <div
                                {...subProvided.dragHandleProps}
                                {...subProvided.draggableProps}
                                ref={subProvided.innerRef}
                                className="bg-black border w-full border-grey-50 p-6 flex md:items-center justify-between rounded-md flex-col md:flex-row gap-6"
                              >
                                <div className="flex flex-col md:flex-row flex-wrap md:items-center gap-12">
                                  <div className=" self-center rounded-full w-20 h-20 text-black text-12 flex items-center justify-center p-2 bg-light-blue-300 mr-4">
                                    {item.sequence}
                                  </div>
                                  <TextField
                                    color="secondary"
                                    variant="outlined"
                                    value={item.bracketOpen || ''}
                                    size="small"
                                    label="Open Bracket"
                                    onChange={(e) =>
                                      updateRuleOpenBracket(
                                        e.target.value,
                                        index
                                      )
                                    }
                                  />
                                  <Autocomplete
                                    id={`controlled-demo_${index}`}
                                    options={sootblowRuleTags.map(
                                      (option) =>
                                        `${option.tagSensor}(${option.tagDescription})`
                                    )}
                                    size="small"
                                    color="secondary"
                                    value={item?.tagSensor || ''}
                                    onChange={(event, newValue) =>
                                      changeTagHandler(newValue, index)
                                    }
                                    style={{ minWidth: 360, maxWidth: '100%' }}
                                    renderInput={(params) => (
                                      <Tooltip title={item.tagSensor || '-'}>
                                        <TextField
                                          fullWidth
                                          size="small"
                                          color="secondary"
                                          {...params}
                                          label="Tags"
                                          variant="outlined"
                                        />
                                      </Tooltip>
                                    )}
                                  />
                                  <TextField
                                    variant="outlined"
                                    label="Close Bracket"
                                    value={item.bracketClose || ''}
                                    size="small"
                                    color="secondary"
                                    onChange={(e) =>
                                      updateRuleCloseBracket(
                                        e.target.value,
                                        index
                                      )
                                    }
                                  />
                                </div>

                                <div className="flex items-center self-end gap-6">
                                  <Tooltip title="Delete Row">
                                    <IconButton
                                      onClick={() => deleteTagRuleRow(index)}
                                    >
                                      <IndeterminateCheckBoxRounded className="text-red-600" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Add Row">
                                    <IconButton
                                      onClick={() => addTagRuleRow(index)}
                                    >
                                      <AddBoxRounded className="text-green-600" />
                                    </IconButton>
                                  </Tooltip>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
            </div>
          )}
        </DialogContent>

        <DialogActions className="p-24 ">
          <div className="flex flex-col md:flex-row md:justify-between gap-8 items-stretch w-full">
            <div className="flex flex-col-reverse md:flex-row gap-8 items-stretch">
              <Button
                disabled={loadingRuleUpdate || loading}
                onClick={async () => {
                  setShowNewPreset(true);
                }}
                color="primary"
                variant="contained"
                className={clsx('text-12 px-6 w-full md:w-auto')}
              >
                Save as New Preset
              </Button>
              <Tooltip
                title={
                  sootblowRuleDetailData?.isActive
                    ? 'This preset is already activated'
                    : 'Click this button to activate this preset'
                }
              >
                <span>
                  <Button
                    disabled={
                      !!(
                        loadingRuleUpdate ||
                        loading ||
                        sootblowRuleDetailData?.isActive
                      )
                    }
                    variant="contained"
                    color="inherit"
                    className={clsx(
                      'text-12 px-6 w-full md:w-auto bg-green-800 hover:bg-green-900'
                    )}
                    onClick={async () => {
                      await setConfirmationContentText(
                        'Confirm to activate this preset?'
                      );
                      await setConfirmationTitle('Preset Activation');
                      await setConfirmationLoadingText('Activating');
                      await setConfirmationType('presetActivation');
                      await setOpenConfirmation(true);
                    }}
                  >
                    {sootblowRuleDetailData?.isActive
                      ? 'Activated'
                      : 'Preset Activation'}
                  </Button>
                </span>
              </Tooltip>
            </div>

            <div className="flex flex-col-reverse md:flex-row gap-8 items-stretch">
              <Button
                disabled={loadingRuleUpdate || loading}
                onClick={handleCloseRuleUpdate}
                variant="outlined"
                className="text-12 px-6 w-full md:w-auto"
              >
                Cancel
              </Button>

              <Button
                disabled={loadingRuleUpdate || loading}
                onClick={async () => {
                  await setConfirmationContentText(
                    'Confirm to save this rules?'
                  );
                  await setConfirmationTitle('Save Rules Confirmation');
                  await setConfirmationLoadingText('Saving');
                  await setOpenConfirmation(true);
                  await setConfirmationType('updateRule');
                }}
                variant="contained"
                className={clsx(
                  classes.saveButton,
                  'text-12 px-6 w-full md:w-auto'
                )}
              >
                {loadingRuleUpdate ? 'Saving' : 'Save'}
              </Button>
            </div>
          </div>
        </DialogActions>
      </Dialog>
      {openExportConfirmation ? (
        <Confirmation
          confirmText={loadingExport ? 'Exporting' : 'OK'}
          loading={loadingExport}
          open={openExportConfirmation}
          title="Export Rules Settings Data"
          contentText="Confirm to export sootblow rules settings data?"
          cancelHandler={closeExportConfirmation}
          confirmHandler={confirmExportHandler}
        />
      ) : (
        <Confirmation
          loading={loadingRuleUpdate}
          open={openConfirmation}
          title={confirmationTitle}
          contentText={confirmationContentText}
          cancelHandler={cancelConfirmationHandler}
          confirmHandler={confirmConfirmationHandler}
          loadingText={confirmationLoadingText}
        />
      )}
      <NewPreset
        open={showNewPreset}
        title={sootblowRuleDetailData.label}
        cancelHandler={() => setShowNewPreset(false)}
      />
      {openLogExportConfirmation && (
        <Confirmation
          confirmText={loadingExport ? 'Exporting' : 'OK'}
          loading={loadingExport}
          open={openLogExportConfirmation}
          title="Export Rule Settings History Log Data"
          contentText={`Confirm to export sootblow ${selectedRule.label} history log data?`}
          cancelHandler={closeLogExportConfirmation}
          confirmHandler={confirmLogExportHandler}
        />
      )}
      {openDateFilter && (
        <DateRangeModal
          format="YYYY-MM-DD"
          views={['date']}
          title={`Please select a time range to export ${selectedRule.label} history log data`}
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

export default RulesSettings;
