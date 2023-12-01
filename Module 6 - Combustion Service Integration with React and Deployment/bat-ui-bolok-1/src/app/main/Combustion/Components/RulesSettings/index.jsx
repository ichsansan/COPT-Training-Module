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
  changeCombustion,
  changeCombustionActivePreset,
  exportCombustionLogRulesSettings,
  exportCombustionRulesSettings,
  getCombustionRuleByID,
  updateCombustionRuleData,
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
}));

const createRuleSettingData = (label, id) => {
  return { label, id };
};

const RulesSettings = ({ expanded, handleChange }) => {
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
    loadingRuleUpdate,
    combustionRuleTags,
    combustionRuleDetail,
    combustionRuleDetailData,
    combustionRulesData,
    combustionRuleSelectedPreset,
    filterStartDate,
    filterEndDate,
  } = combustionReducer;

  const containerRef = useRef(0);
  const totalContainerHeight = containerRef?.current?.clientHeight;
  const [containerHeight, setContainerHeight] = useState(0);

  const [openRuleSettingUpdate, setOpenRuleSettingUpdate] = useState(false);
  const [openExportConfirmation, setOpenExportConfirmation] = useState(false);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [confirmationLoadingText, setConfirmationLoadingText] = useState('');
  const [confirmationTitle, setConfirmationTitle] = useState('');
  const [confirmationContentText, setConfirmationContentText] = useState('');
  const [confirmationType, setConfirmationType] = useState('');
  const [showNewPreset, setShowNewPreset] = useState(false);

  const [openLogExportConfirmation, setOpenLogExportConfirmation] = useState(
    false
  );
  const [openDateFilter, setOpenDateFilter] = useState(false);
  const [selectedRule, setSelectedRule] = useState({
    label: '',
    id: '',
    presetId: '',
  });

  const getTagListItem = (option) => {
    if (!option?.id)
      option = combustionRuleTags.find((op) => op.tagSensor === option);
    return option || null;
  };

  const getTagDescription = (tagSensor = '') => {
    const description = combustionRuleTags?.find(
      (item) => item.tagSensor === tagSensor
    );
    return description?.tagDescription || '';
  };

  const ruleSettingData = combustionRulesData.map((item) =>
    createRuleSettingData(item.label, item.id)
  );

  const handleClickOpenRuleUpdate = () => {
    setOpenRuleSettingUpdate(true);
  };

  const handleCloseRuleUpdate = () => {
    setOpenRuleSettingUpdate(false);
  };

  const ruleDetailFetch = async (id) => {
    await dispatch(getCombustionRuleByID(id));
  };

  const cancelConfirmationHandler = () => {
    setOpenConfirmation(false);
    setConfirmationLoadingText('');
    setConfirmationTitle('');
    setConfirmationContentText('');
    setConfirmationType('');
  };

  const presetActivationHandler = async () => {
    const { id, presetId } = combustionRuleDetailData;
    await dispatch(changeCombustionActivePreset(id, presetId));
    await cancelConfirmationHandler();
    await dispatch(getCombustionRuleByID(id, presetId));
    await setConfirmationType('');
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

  const updateRuleSettingHandler = async () => {
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
      // eslint-disable-next-line react/no-this-in-sfc
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
    } else {
      const updateRuleResponse = await dispatch(updateCombustionRuleData());
      if (updateRuleResponse) {
        await handleCloseRuleUpdate();
        await setConfirmationType('');
        await cancelConfirmationHandler();
      } else {
        await cancelConfirmationHandler();
        await setConfirmationType('');
      }
    }
  };

  const updateRuleOpenBracket = (value, id) => {
    const newRule = combustionRuleDetail.map((item, index) => {
      if (index === id) {
        return { ...item, bracketOpen: value };
      }
      return item;
    });

    dispatch(changeCombustion({ combustionRuleDetail: newRule }));
  };

  const updateRuleCloseBracket = (value, id) => {
    const newRule = combustionRuleDetail.map((item, index) => {
      if (index === id) {
        return { ...item, bracketClose: value };
      }
      return item;
    });

    dispatch(changeCombustion({ combustionRuleDetail: newRule }));
  };

  const updateRuleMaxViolated = (value, id) => {
    const newRule = combustionRuleDetail.map((item, index) => {
      if (index === id) {
        return { ...item, maxViolated: value };
      }
      return item;
    });

    dispatch(changeCombustion({ combustionRuleDetail: newRule }));
  };

  const changeTagHandler = (newValue, id) => {
    const newRule = combustionRuleDetail?.map((item, index) => {
      if (index === id) {
        return { ...item, tagSensor: newValue?.tagSensor };
      }
      return item;
    });

    dispatch(changeCombustion({ combustionRuleDetail: newRule }));
  };

  const addTagRuleRow = async (id) => {
    const insertRow = (arr, index, ...newRow) => [
      ...arr.slice(0, index),
      ...newRow,
      ...arr.slice(index),
    ];

    const newTagRow = insertRow(combustionRuleDetail, id + 1, {
      sequence: id + 1,
      bracketClose: '',
      bracketOpen: '',
      tagSensor: '',
      maxViolated: '',
    });

    for (let i = id + 1; i < newTagRow.length; i++) {
      // eslint-disable-next-line operator-assignment
      newTagRow[i].sequence = newTagRow[i].sequence + 1;
    }

    dispatch(changeCombustion({ combustionRuleDetail: newTagRow }));
  };

  const deleteTagRuleRow = (index) => {
    const newTagRow = [...combustionRuleDetail];
    newTagRow.splice(index, 1);
    for (let i = index; i < newTagRow.length; i++) {
      // eslint-disable-next-line operator-assignment
      newTagRow[i].sequence = newTagRow[i].sequence - 1;
    }
    dispatch(changeCombustion({ combustionRuleDetail: newTagRow }));
  };

  const onDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) return;
    if (combustionRuleDetail.length > 0) {
      const directionOfDrag =
        destination.index > source.index ? 'GREATER' : 'LESS';
      let affectedRange = [];
      if (directionOfDrag === 'GREATER') {
        affectedRange = range(source.index, destination.index + 1);
      } else if (directionOfDrag === 'LESS') {
        affectedRange = range(destination.index, source.index);
      }

      const reOrderedRuleSequence = combustionRuleDetail.map((item, index) => {
        if (index === +result.draggableId) {
          item.sequence = result.destination.index;
          return item;
        }
        if (affectedRange.includes(item.sequence)) {
          if (directionOfDrag === 'GREATER') {
            item.sequence -= 1;
            return item;
          }
          if (directionOfDrag === 'LESS') {
            item.sequence += 1;
            return item;
          }
        } else {
          return item;
        }
        return null;
      });

      const newData = orderBy(reOrderedRuleSequence, 'sequence');
      dispatch(changeCombustion({ combustionRuleDetail: newData }));
    }
  };

  const closeExportConfirmation = () => {
    setOpenExportConfirmation(false);
  };

  const confirmExportHandler = async () => {
    const isSuccess = await dispatch(exportCombustionRulesSettings());
    if (isSuccess) {
      closeExportConfirmation();
    }
  };

  const closeLogExportConfirmation = () => {
    setOpenLogExportConfirmation(false);
  };

  const confirmLogExportHandler = async () => {
    const { id, label } = selectedRule;
    const isSuccess = await dispatch(
      exportCombustionLogRulesSettings(id, label)
    );
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
    if (!isLaptopScreen) return undefined;
    if (!containerRef.current) return undefined; // wait for the containerRef to be available
    const resizeObserver = new ResizeObserver(() => {
      setContainerHeight(containerRef.current?.clientHeight - 60);
      // Do what you want to do when the size of the element changes
    });
    resizeObserver.observe(containerRef.current);
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
                  disabled={loadingCombustion}
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
          {loadingCombustion ? (
            <div className="flex-1 flex min-h-96 justify-center items-center py-4 md:p-0 mb-8 md:mb-0">
              <Typography className="text-12 xl:text-16">Loading</Typography>
            </div>
          ) : ruleSettingData.length !== 0 ? (
            <TableContainer
              style={{
                maxHeight: isLaptopScreen ? containerHeight || 480 : '100%',
                height: isLaptopScreen ? containerHeight || 480 : '100%',
              }}
              className="overflow-auto"
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
                    {user?.role[0] === 'ENGINEER' && (
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
                        {row.label || '-'}
                      </TableCell>
                      {user?.role[0] === 'ENGINEER' && (
                        <TableCell
                          align="center"
                          className="py-4 text-14 xl:text-16"
                        >
                          <IconButton
                            onClick={async () => {
                              await handleClickOpenRuleUpdate();
                              await ruleDetailFetch(row.id);
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
                              disabled={loadingCombustion}
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
        maxWidth={combustionRuleDetail?.length !== 0 ? 'lg' : 'md'}
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
                      {combustionRuleDetailData.label}
                    </span>
                  ) : (
                    'Rules Settings'
                  )}
                </Typography>
                <Typography variant="caption">
                  {!loading ? (
                    <span>{combustionRuleDetailData?.subLabel}</span>
                  ) : (
                    'Presets name'
                  )}
                </Typography>
              </div>

              {!loading && (
                <div className="flex flex-col-reverse md:flex-row md:items-center gap-12">
                  <Autocomplete
                    id="preset-list"
                    disabled={
                      combustionRuleDetailData?.presetList?.length === 0
                    }
                    options={combustionRuleDetailData?.presetList}
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
                          changeCombustion({
                            loading: true,
                            error: '',
                          })
                        );
                        await dispatch(
                          changeCombustion({
                            combustionRuleSelectedPreset: newValue,
                          })
                        );
                        await dispatch(
                          getCombustionRuleByID(
                            newValue.ruleId,
                            newValue.presetId
                          )
                        );
                      }
                    }}
                    value={combustionRuleSelectedPreset || ''}
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
                        {combustionRuleDetailData?.updateBy || '-'}
                      </Typography>
                    </div>

                    <div className="flex gap-4">
                      <Typography className=" w-80 ">Updated at</Typography>
                      <span> : </span>
                      <Typography className=" ml-4 text-light-blue-300">
                        {combustionRuleDetailData?.updateAt || '-'}
                      </Typography>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Toolbar>
        </AppBar>
        <DialogContent>
          {loading ? (
            <LinearProgress color="secondary" />
          ) : (
            <div className="space-y-10">
              {combustionRuleDetail?.length === 0 ? (
                <Grid container alignItems="center" item xs={12}>
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
                        {combustionRuleDetail?.map((item, index) => (
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
                                    value={item.bracketOpen}
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
                                    style={{ minWidth: 360, maxWidth: '100%' }}
                                    id={`controlled-demo_${index}`}
                                    options={combustionRuleTags?.map(
                                      (option) => ({
                                        tagSensor: option?.tagSensor,
                                        tagDescription: option?.tagDescription,
                                      })
                                    )}
                                    getOptionSelected={(option, value) => {
                                      return (
                                        option?.id === getTagListItem(value)?.id
                                      );
                                    }}
                                    getOptionLabel={(label) =>
                                      label
                                        ? `${label?.tagSensor} (${label?.tagDescription}) `
                                        : ''
                                    }
                                    size="small"
                                    color="secondary"
                                    value={
                                      item.tagSensor
                                        ? {
                                            tagSensor: item.tagSensor,
                                            tagDescription: getTagDescription(
                                              item.tagSensor
                                            ),
                                          }
                                        : null
                                    }
                                    onChange={(event, newValue) =>
                                      changeTagHandler(newValue, index)
                                    }
                                    renderInput={(params) => (
                                      <Tooltip
                                        title={`${item.tagSensor} ${
                                          item?.tagSensor
                                            ? getTagDescription(item.tagSensor)
                                            : ''
                                        }`}
                                      >
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
                                    value={item.bracketClose}
                                    size="small"
                                    color="secondary"
                                    onChange={(e) =>
                                      updateRuleCloseBracket(
                                        e.target.value,
                                        index
                                      )
                                    }
                                  />
                                  <TextField
                                    variant="outlined"
                                    label="Max Violated (second)"
                                    value={item.maxViolated}
                                    size="small"
                                    color="secondary"
                                    type="number"
                                    onChange={(e) =>
                                      updateRuleMaxViolated(
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
                  combustionRuleDetailData?.isActive
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
                        combustionRuleDetailData?.isActive
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
                    {combustionRuleDetailData?.isActive
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
          contentText="Confirm to export combustion rules settings data?"
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
        title={combustionRuleDetailData.label}
        cancelHandler={() => setShowNewPreset(false)}
      />
      {openLogExportConfirmation && (
        <Confirmation
          confirmText={loadingExport ? 'Exporting' : 'OK'}
          loading={loadingExport}
          open={openLogExportConfirmation}
          title="Export Rule Settings History Log Data"
          contentText={`Confirm to export combustion ${selectedRule.label} history log data?`}
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

export default RulesSettings;
