import {
  AppBar,
  Dialog,
  DialogContent,
  IconButton,
  makeStyles,
  Tab,
  Tabs,
  Toolbar,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Close, CloudDownload } from '@material-ui/icons';
import Confirmation from 'app/fuse-layouts/shared-components/Confirmation';
import DateRangeModal from 'app/fuse-layouts/shared-components/DateRangeModal';
import {
  changeCombustion,
  exportCombustionRecommendationHistory,
} from 'app/store/actions';
import { showMessage } from 'app/store/fuse/messageSlice';
import moment from 'moment';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Rule from './Rule';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

const Detail = ({
  openRecommendationDetail,
  closeRecommendationDetailHandler,
}) => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const combustionReducer = useSelector((state) => state.combustionReducer);

  const {
    loading,
    combustionRecommendationLabel,
    filterStartDate,
    filterEndDate,
    loadingExport,
  } = combustionReducer;

  const [activeTab, setActiveTab] = useState(0);
  const [openExportConfirmation, setOpenExportConfirmation] = useState(false);
  const [openDateFilter, setOpenDateFilter] = useState(false);

  const handleChangeTab = (e, value) => {
    setActiveTab(value);
  };

  function tabProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const closeExportConfirmation = () => {
    setOpenExportConfirmation(false);
  };

  const cancelDateFilterHandler = () => {
    setOpenDateFilter(false);
  };

  const confirmExportHandler = async () => {
    const isSuccess = await dispatch(exportCombustionRecommendationHistory());
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

  return (
    <Dialog
      maxWidth="md"
      fullWidth
      open={openRecommendationDetail}
      aria-labelledby="responsive-dialog-title"
    >
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <Tabs
            value={activeTab}
            onChange={handleChangeTab}
            aria-label="simple tabs example"
          >
            <Tab label="Rule" {...tabProps(0)} />
          </Tabs>
          <Typography
            className="text-16 my-24 mx-16 flex-grow text-right"
            id="responsive-dialog-title"
          >
            <code>
              {!loading
                ? combustionRecommendationLabel || 'Recommendation Detail'
                : 'Recommendation Detail'}
            </code>
          </Typography>
          {activeTab === 1 && (
            <Tooltip title="Export Recommendation History Data" arrow>
              <span>
                <IconButton
                  aria-label="export recommendation history data"
                  disabled={loading}
                  onClick={() => setOpenDateFilter(true)}
                >
                  <CloudDownload />
                </IconButton>
              </span>
            </Tooltip>
          )}
          <IconButton
            onClick={() => {
              closeRecommendationDetailHandler();
              setActiveTab(0);
            }}
          >
            <Close />
          </IconButton>
        </Toolbar>
      </AppBar>

      <DialogContent>
        <TabPanel value={activeTab} index={0}>
          <Rule />
        </TabPanel>
      </DialogContent>
      {openDateFilter && (
        <DateRangeModal
          format="YYYY-MM-DD"
          views={['date']}
          title="Please select a time range to export recommendation history data"
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
        loading={loadingExport}
        open={openExportConfirmation}
        title="Export Recommendation History Data"
        contentText="Confirm to export combustion recommendation history data?"
        cancelHandler={closeExportConfirmation}
        confirmHandler={confirmExportHandler}
      />
    </Dialog>
  );
};

export default Detail;
