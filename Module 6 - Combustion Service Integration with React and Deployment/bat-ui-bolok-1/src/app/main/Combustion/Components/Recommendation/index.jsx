import { useMediaQuery } from '@fuse/hooks';
import {
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
import { CloudDownload, ExpandMore } from '@material-ui/icons';
import Confirmation from 'app/fuse-layouts/shared-components/Confirmation';
import DateRangeModal from 'app/fuse-layouts/shared-components/DateRangeModal';
import {
  changeCombustion,
  exportCombustionRecommendation,
} from 'app/store/actions';
import { showMessage } from 'app/store/fuse/messageSlice';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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

const createRecommendationData = (
  timeStamp,
  tagName,
  value,
  biasValue,
  targetValue,
  status
) => {
  return { timeStamp, tagName, value, biasValue, targetValue, status };
};

const Recommendation = ({ expanded, handleChange }) => {
  const dispatch = useDispatch();
  const combustionReducer = useSelector((state) => state.combustionReducer);
  const isLaptopScreen = useMediaQuery('(min-width: 1024px)');

  const {
    loadingExport,
    loadingCombustion,
    combustionRecommendationData,
    filterStartDate,
    filterEndDate,
  } = combustionReducer;

  const containerRef = useRef(0);
  const totalContainerHeight = containerRef?.current?.clientHeight;
  const [containerHeight, setContainerHeight] = useState(0);

  const [openRecommendationDetail, setOpenRecommendationDetail] = useState(
    false
  );
  const [openExportConfirmation, setOpenExportConfirmation] = useState(false);

  const [openDateFilter, setOpenDateFilter] = useState(false);

  const recommendationData = combustionRecommendationData.map((item) =>
    createRecommendationData(
      item.timestamp,
      item.desc,
      item.currentValue,
      item.setValue,
      item.targetValue,
      item.status
    )
  );

  const closeExportConfirmation = () => {
    setOpenExportConfirmation(false);
  };

  const cancelDateFilterHandler = () => {
    setOpenDateFilter(false);
  };

  const confirmExportHandler = async () => {
    const isSuccess = await dispatch(exportCombustionRecommendation());
    if (isSuccess) {
      closeExportConfirmation();
      cancelDateFilterHandler();
    }
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
        setOpenExportConfirmation(true);
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

  const closeRecommendationDetailHandler = () => {
    setOpenRecommendationDetail(false);
    dispatch(
      changeCombustion({
        combustionRecommendationLabel: '',
        combustionRecommendationHistoryData: [],
        combustionRecommendationAddressNumber: '',
        combustionRecommendationHistoryTotal: 0,
        combustionRecommendationHistoryPage: 0,
        combustionRecommendationHistoryLimit: 10,
        combustionSuggestionAsTestData: { area: '', trigger: '' },
      })
    );
  };

  // const openRecommendationDetailHandler = async (id, area, trigger) => {
  // 	await setOpenRecommendationDetail(true);
  // 	await dispatch(changeCombustion({
  // 		combustionSuggestionAsTestData: { area: area, trigger: trigger },
  // 	}))
  // 	await dispatch(getCombustionSafeguardRuleDetail(id, area));
  // };

  useEffect(() => {
    if (!isLaptopScreen) return undefined;
    if (!containerRef.current) return undefined; /// wait for the containerRef to be available
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
          className="w-full onboard__combustion-features-expand"
        >
          <div className="flex items-center gap-4 justify-between flex-1">
            <Typography className="text-12 xl:text-16 text-light-blue-300 font-600">
              Recommendation
            </Typography>
            <Tooltip title="Export Recommendation History Data" arrow>
              <span>
                <IconButton
                  disabled={loadingCombustion}
                  size="small"
                  onClick={async (event) => {
                    event.stopPropagation();
                    setOpenDateFilter(true);
                  }}
                  aria-label="export recommendation history data"
                  className="onboard__combustion-features-export"
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
          ) : recommendationData.length !== 0 ? (
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
                      Date &amp; Time
                    </TableCell>
                    <TableCell
                      align="center"
                      className="text-11 xl:text-16 py-auto text-light-blue-300"
                    >
                      Description
                    </TableCell>
                    <TableCell
                      align="center"
                      className="text-11 xl:text-16 py-auto text-light-blue-300"
                    >
                      Current Value
                    </TableCell>
                    <TableCell
                      align="center"
                      className="text-11 xl:text-16 py-auto text-light-blue-300"
                    >
                      Set Value
                    </TableCell>
                    <TableCell
                      align="center"
                      className="text-11 xl:text-16 py-auto text-light-blue-300"
                    >
                      Target Value
                    </TableCell>
                    {/* <TableCell
											align="center"
											className="text-11 xl:text-16 py-auto text-light-blue-300"
										>
											Status
										</TableCell> */}
                    {/* <TableCell
											align="center"
											className="text-11 xl:text-16 py-auto text-light-blue-300"
										>
											Detail
										</TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recommendationData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell
                        component="th"
                        scope="row"
                        align="center"
                        className="text-10 xl:text-14 py-4"
                      >
                        {row.timeStamp || '-'}
                      </TableCell>
                      <TableCell
                        align="center"
                        className="text-10 xl:text-14 py-4"
                      >
                        {row.tagName || '-'}
                      </TableCell>
                      <TableCell
                        align="center"
                        className="text-10 xl:text-14 py-4"
                      >
                        {row.value || '-'}
                      </TableCell>
                      <TableCell
                        align="center"
                        className="text-10 xl:text-14 py-4"
                      >
                        {row.biasValue || '-'}
                      </TableCell>
                      <TableCell
                        align="center"
                        className="text-10 xl:text-14 py-4"
                      >
                        {row.targetValue || '-'}
                      </TableCell>
                      {/* <TableCell align="center" className="text-10 xl:text-14 py-4">
												{row.status || '-'}
											</TableCell> */}
                      {/* <TableCell align="center" className="text-14 xl:text-16 py-4">
												<Tooltip arrow title="Rule Detail">
													<IconButton
														onClick={async () => {
															await dispatch(
																changeCombustion({
																	combustionRecommendationAddressNumber: row.area,
																})
															);
															await openRecommendationDetailHandler(row.ruleId, row.area, row.trigger);
														}}
														size="small"
													>
														<Info className="text-14 xl:text-16" />
													</IconButton>
												</Tooltip>
											</TableCell> */}
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
        openRecommendationDetail={openRecommendationDetail}
        closeRecommendationDetailHandler={closeRecommendationDetailHandler}
      />
      {openDateFilter && (
        <DateRangeModal
          format="YYYY-MM-DD"
          views={['date']}
          title="Please select a time range to export recommendation data"
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
      <Confirmation
        confirmText={loadingExport ? 'Exporting' : 'OK'}
        open={openExportConfirmation}
        title="Export Recommendation Data"
        contentText="Confirm to export combustion recommendation data?"
        cancelHandler={closeExportConfirmation}
        confirmHandler={confirmExportHandler}
        loading={loadingExport}
      />
    </>
  );
};

export default Recommendation;
