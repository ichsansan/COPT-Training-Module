import {
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@material-ui/core';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import { withStyles } from '@material-ui/core/styles';
import {
  Cancel,
  CheckCircle,
  CloudDownload,
  ExpandMore,
  FlashOn,
  HourglassEmpty,
  Info,
  Redo,
  RemoveCircle,
} from '@material-ui/icons';
import Confirmation from 'app/fuse-layouts/shared-components/Confirmation';
import {
  changeSootblow,
  exportSootblowRecommendation,
  getRecommendationRuleDetail,
  getSootblowData,
  postSootRecommendation,
} from 'app/store/actions';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from '@fuse/hooks';
import Detail from './Detail';

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

const createSequenceData = (
  zone,
  area,
  zoneCode,
  executionStatus,
  ruleId,
  trigger,
  lastRunning,
  maxTime,
  minTime,
  status,
  addressNo,
  recommendationTime,
  isDisabled
) => {
  return {
    zone,
    area,
    zoneCode,
    executionStatus,
    ruleId,
    trigger,
    lastRunning,
    maxTime,
    minTime,
    status,
    addressNo,
    recommendationTime,
    isDisabled,
  };
};

const Recommendation = ({ expanded, handleChange }) => {
  const isLaptopScreen = useMediaQuery('(min-width: 1024px)');
  const dispatch = useDispatch();

  const sootblowReducer = useSelector((state) => state.sootblowReducer);

  const {
    loadingExport,
    loadingSootblowData,
    sootblowRecommendationAddressNumber,
    sootblowActionLoading,
    sootblowData,
  } = sootblowReducer;

  const { sequence, fixedTimeSuggestion } = sootblowData;

  const containerRef = useRef(0);
  const totalContainerHeight = containerRef?.current?.clientHeight;
  const [containerHeight, setContainerHeight] = useState(0);

  const [openSootblowDetail, setOpenSootblowDetail] = useState(false);
  const [openSootActionConfrimation, setOpenSootActionConfrimation] = useState(
    false
  );
  const [openExportConfirmation, setOpenExportConfirmation] = useState(false);

  const sequenceData = sequence?.map((item) =>
    createSequenceData(
      item.zone,
      item.area,
      item.zoneCode,
      item.executionStatus,
      item.ruleId,
      item.trigger,
      item.lastRunning,
      item.maxTime,
      item.minTime,
      item.status,
      item.addressNo,
      item.recommendationTime,
      item.isDisabled
    )
  );

  const closeSootActionConfirmation = () => {
    setOpenSootActionConfrimation(false);
    dispatch(
      changeSootblow({
        sootblowRecommendationAddressNumber: '',
      })
    );
  };

  const sootActionConfirmation = async () => {
    await dispatch(postSootRecommendation(sootblowRecommendationAddressNumber));
    await dispatch(getSootblowData());
    await setOpenSootActionConfrimation(false);
  };

  const closeSootblowDetailHandler = () => {
    setOpenSootblowDetail(false);
    dispatch(
      changeSootblow({
        sootblowRecommendationLabel: '',
        sootblowRecommendationHistoryData: [],
        sootblowRecommendationAddressNumber: '',
        sootblowRecommendationHistoryTotal: 0,
        sootblowRecommendationHistoryPage: 0,
        sootblowRecommendationHistoryLimit: 10,
      })
    );
  };

  const openSootblowDetailHandler = async (id, zone) => {
    await setOpenSootblowDetail(true);
    await dispatch(getRecommendationRuleDetail(id, zone));
  };

  const renderExecutionStatusIcon = (value) => {
    if (value === '0') {
      return (
        <Tooltip title="Waiting" arrow className="text-20">
          <HourglassEmpty fontSize="inherit" className="text-grey-600" />
        </Tooltip>
      );
    }
    if (value === '1') {
      return (
        <Tooltip title="Executing" arrow className="text-20">
          <FlashOn fontSize="inherit" className="text-yellow-600" />
        </Tooltip>
      );
    }
    if (value === '2') {
      return (
        <Tooltip title="Success" arrow className="text-20">
          <CheckCircle fontSize="inherit" className="text-green-600" />
        </Tooltip>
      );
    }
    if (value === '3') {
      return (
        <Tooltip title="Fail" arrow className="text-20">
          <RemoveCircle fontSize="inherit" className="text-orange-600" />
        </Tooltip>
      );
    }
    if (value === '4') {
      return (
        <Tooltip title="Skip" arrow className="text-20">
          <Redo fontSize="inherit" className="text-blue-600" />
        </Tooltip>
      );
    }
    return '-';
  };

  const closeExportConfirmation = () => {
    setOpenExportConfirmation(false);
  };

  const confirmExportHandler = async () => {
    const isSuccess = await dispatch(exportSootblowRecommendation());
    if (isSuccess) {
      closeExportConfirmation();
    }
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
        expanded={expanded === 'panel1'}
        onChange={handleChange('panel1')}
        className={
          expanded === 'panel1'
            ? 'flex-1 w-full overflow-auto'
            : 'flex-initial w-full overflow-hidden'
        }
        square
        ref={containerRef}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          className="w-full"
        >
          <div className="flex items-center gap-4 justify-between flex-1">
            <Typography className="text-12 xl:text-16 text-light-blue-300 font-600">
              Recommendation
            </Typography>
            <Tooltip title="Export Recommendation Data" arrow>
              <span>
                <IconButton
                  disabled={loadingSootblowData}
                  size="small"
                  onClick={async (event) => {
                    event.stopPropagation();
                    setOpenExportConfirmation(true);
                  }}
                  aria-label="export recommendation data"
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
          ) : sequenceData?.length !== 0 ? (
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
                      className="text-11 xl:text-16 py-4 px-8 text-light-blue-300"
                    >
                      Area
                    </TableCell>
                    <TableCell
                      align="center"
                      className="text-11 xl:text-16 py-4 px-8 text-light-blue-300"
                    >
                      Zone
                    </TableCell>
                    <TableCell
                      align="center"
                      className="text-11 xl:text-16 py-4 px-8 text-light-blue-300"
                    >
                      Last Running
                    </TableCell>
                    <TableCell
                      align="center"
                      className="text-11 xl:text-16 py-4 px-8 text-light-blue-300"
                    >
                      Trigger
                    </TableCell>
                    <TableCell
                      align="center"
                      className="text-11 xl:text-16 py-4 px-8 text-light-blue-300"
                    >
                      Execution Status
                    </TableCell>
                    {fixedTimeSuggestion !== 0 ? (
                      <>
                        <TableCell
                          align="center"
                          className="text-11 xl:text-16 py-4 px-8 text-light-blue-300"
                        >
                          Min Time
                        </TableCell>
                        <TableCell
                          align="center"
                          className="text-11 xl:text-16 py-4 px-8 text-light-blue-300"
                        >
                          Max Time
                        </TableCell>
                      </>
                    ) : null}
                    <TableCell
                      align="center"
                      className="text-11 xl:text-16 py-4 px-8 text-light-blue-300"
                    >
                      Action
                    </TableCell>
                    <TableCell
                      align="center"
                      className="text-11 xl:text-16 py-4 px-8 text-light-blue-300"
                    >
                      Detail
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sequenceData?.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell
                        component="th"
                        scope="row"
                        align="center"
                        className="text-10 xl:text-14 py-4 px-8"
                      >
                        {row.zoneCode === '' ? 'Unknown Area' : row.zoneCode}
                      </TableCell>
                      <TableCell
                        align="center"
                        className="text-10 xl:text-14 py-4 px-8"
                      >
                        {row.area}
                      </TableCell>
                      <TableCell
                        align="center"
                        className="text-10 xl:text-14 py-4 px-8"
                      >
                        {row.recommendationTime}
                      </TableCell>
                      <TableCell
                        align="center"
                        className="text-10 xl:text-14 py-4 px-8"
                      >
                        {row.trigger || '-'}
                      </TableCell>
                      <TableCell
                        align="center"
                        className="text-10 xl:text-14 py-4 px-8"
                      >
                        {!row.status ? (
                          <Tooltip title="Off" arrow className="text-20">
                            <Cancel
                              fontSize="inherit"
                              className="text-red-600"
                            />
                          </Tooltip>
                        ) : (
                          renderExecutionStatusIcon(
                            row.executionStatus.toString()
                          )
                        )}
                      </TableCell>
                      {fixedTimeSuggestion !== 0 ? (
                        <>
                          <TableCell
                            align="center"
                            className="text-10 xl:text-14 py-4 px-8"
                          >
                            {row.minTime || '-'}
                          </TableCell>
                          <TableCell
                            align="center"
                            className="text-10 xl:text-14 py-4 px-8"
                          >
                            {row.maxTime || '-'}
                          </TableCell>
                        </>
                      ) : null}
                      <TableCell
                        align="center"
                        className="text-10 xl:text-14 py-4 px-8"
                      >
                        <Button
                          onClick={async () => {
                            await dispatch(
                              changeSootblow({
                                sootblowRecommendationAddressNumber:
                                  row.addressNo,
                              })
                            );
                            await setOpenSootActionConfrimation(true);
                          }}
                          size="small"
                          className="text-12"
                          color="secondary"
                          variant="contained"
                          disabled={
                            +row.isDisabled === 1 || +row.executionStatus === 2
                          }
                        >
                          Soot
                        </Button>
                      </TableCell>
                      <TableCell
                        align="center"
                        className="text-14 xl:text-16 py-4 px-8"
                      >
                        <Tooltip arrow title="Rule Detail">
                          <IconButton
                            onClick={async () => {
                              await dispatch(
                                changeSootblow({
                                  sootblowRecommendationAddressNumber:
                                    row.addressNo,
                                  sootblowRecommendationZone: row.area,
                                })
                              );
                              await openSootblowDetailHandler(
                                row.ruleId,
                                row.area
                              );
                            }}
                            size="small"
                          >
                            <Info className="text-14 xl:text-16" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <div className="flex-1 flex min-h-96 justify-center items-center py-4 md:p-0 mb-8 md:mb-0">
              <Typography className="text-12 xl:text-16">
                No Recommendation
              </Typography>
            </div>
          )}
        </AccordionDetails>
      </Accordion>

      <Detail
        openSootblowDetail={openSootblowDetail}
        closeSootblowDetailHandler={closeSootblowDetailHandler}
      />
      {openExportConfirmation ? (
        <Confirmation
          confirmText={loadingExport ? 'Exporting' : 'OK'}
          loading={loadingExport}
          open={openExportConfirmation}
          title="Export Recommendation Data"
          contentText="Confirm to export sootblow recommendation data?"
          cancelHandler={closeExportConfirmation}
          confirmHandler={confirmExportHandler}
        />
      ) : (
        openSootActionConfrimation && (
          <Confirmation
            loading={sootblowActionLoading}
            open={openSootActionConfrimation}
            title="Soot Action Confirmation"
            contentText="Confirm to do soot for this recommendation?"
            cancelHandler={closeSootActionConfirmation}
            confirmHandler={sootActionConfirmation}
          />
        )
      )}
    </>
  );
};

export default Recommendation;
