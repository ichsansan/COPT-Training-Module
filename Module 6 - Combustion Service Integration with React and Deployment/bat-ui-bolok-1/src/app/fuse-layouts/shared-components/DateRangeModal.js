import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';
import MaterialCalendar from './MaterialCalendar';

const DateRangeModal = ({
  title,
  subTitle,
  filterStartDateValue,
  changeFilterStartDate,
  filterEndDateValue,
  changeFilterEndDate,
  loading,
  openDateFilter,
  resetFilterHandler,
  cancelDateFilterHandler,
  confirmDateFilterHandler,
  format,
  views,
  confirmText,
  type,
}) => {
  return (
    <Dialog
      fullWidth
      open={openDateFilter}
      aria-labelledby="responsive-dialog-title"
      maxWidth="sm"
    >
      <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <form className="flex flex-col gap-8" noValidate>
          <Typography className="text-12">{subTitle}</Typography>
          <MaterialCalendar
            type={type}
            label="Start Date"
            format={format}
            views={views}
            ampm={false}
            value={filterStartDateValue}
            onChange={changeFilterStartDate}
          />
          <MaterialCalendar
            type={type}
            label="End Date"
            format={format}
            views={views}
            ampm={false}
            value={filterEndDateValue}
            onChange={changeFilterEndDate}
          />
        </form>
      </DialogContent>
      <DialogActions className="p-24 flex justify-between items-stretch">
        <Button
          disabled={loading}
          variant="contained"
          color="primary"
          onClick={resetFilterHandler}
          className="text-12 px-6"
        >
          Reset Filter
        </Button>
        <div className="flex items-stretch gap-8">
          <Button
            disabled={loading}
            onClick={cancelDateFilterHandler}
            variant="outlined"
            className="text-12 px-6"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={loading}
            onClick={confirmDateFilterHandler}
            color="secondary"
            className="text-12 px-6"
          >
            {loading ? 'Loading' : confirmText}
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

DateRangeModal.defaultProps = {
  format: 'YYYY-MM-DD HH:mm',
  views: ['date', 'year', 'month', 'hours', 'minutes'],
  title: 'Pick a Date Range',
  subTitle: '',
  filterStartDateValue: new Date(),
  filterEndDateValue: new Date(),
  changeFilterStartDate: () => console.log('Change Filter Start Date'),
  changeFilterEndDate: () => console.log('Change Filter End Date'),
  loading: false,
  openDateFilterHandler: () => console.log('Open Filter Date'),
  resetFilterHandler: () => console.log('Reset Filter Date'),
  cancelDateFilterHandler: () => console.log('Cancel Filter Date'),
  confirmDateFilterHandler: () => console.log('Confirm Filter Date'),
  confirmText: 'Confirm',
  type: '',
};

DateRangeModal.propTypes = {
  format: PropTypes.string,
  views: PropTypes.array,
  title: PropTypes.string,
  subTitle: PropTypes.string,
  changeFilterStartDate: PropTypes.func.isRequired,
  changeFilterEndDate: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  openDateFilterHandler: PropTypes.func,
  resetFilterHandler: PropTypes.func,
  cancelDateFilterHandler: PropTypes.func,
  confirmDateFilterHandler: PropTypes.func,
  confirmText: PropTypes.string,
  type: PropTypes.string,
};

export default DateRangeModal;
