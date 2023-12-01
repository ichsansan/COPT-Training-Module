import { skyBlue } from '@fuse/colors';
import { createMuiTheme } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import { DateTimePicker, DatePicker } from '@material-ui/pickers';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ThemeProvider } from '@material-ui/styles';
import React from 'react';
import PropTypes from 'prop-types';

const defaultMaterialTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: skyBlue,
    secondary: {
      main: skyBlue[900],
    },
    background: {
      paper: '#1E2125',
      default: '#121212',
    },
    error: red,
  },
});

const MaterialCalendar = ({
  onChange,
  type = 'date',
  value = new Date(),
  format = 'YYYY-MM-DD HH:mm',
  label = 'Label',
  ampm = false,
  views = ['date', 'year', 'month', 'hours', 'minutes'],
}) => {
  return (
    <ThemeProvider theme={defaultMaterialTheme}>
      {type === 'timedate' ? (
        <DateTimePicker
          animateYearScrolling
          format={format}
          InputLabelProps={{ style: { fontSize: 12 } }}
          inputProps={{
            style: {
              fontSize: 14,
            },
          }}
          views={views}
          autoOk
          ampm={ampm}
          label={label}
          showTodayButton
          inputVariant="filled"
          color="secondary"
          value={value}
          onChange={onChange}
        />
      ) : (
        <DatePicker
          InputLabelProps={{ style: { fontSize: 12 } }}
          inputProps={{
            style: {
              fontSize: 14,
            },
          }}
          views={views}
          autoOk
          showTodayButton
          inputVariant="filled"
          format={format}
          label={label}
          value={value}
          onChange={onChange}
          animateYearScrolling
        />
      )}
    </ThemeProvider>
  );
};

MaterialCalendar.defaultProps = {
  onChange: () => console.log('Change date'),
  type: 'date',
  value: new Date(),
  format: 'YYYY-MM-DD HH:mm',
  label: 'Label',
  ampm: false,
  views: ['date', 'year', 'month', 'hours', 'minutes'],
};

MaterialCalendar.propTypes = {
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  format: PropTypes.string,
  label: PropTypes.string.isRequired,
  ampm: PropTypes.bool,
  views: PropTypes.array,
};

export default MaterialCalendar;
