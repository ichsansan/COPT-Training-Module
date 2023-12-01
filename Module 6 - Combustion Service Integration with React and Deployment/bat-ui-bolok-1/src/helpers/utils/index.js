import moment from 'moment-timezone';

export const truncateFilename = (str, num) => {
  const fileExtension = str.substr(str.indexOf('.') + 1);
  if (str.length <= num) {
    return str;
  }
  return `${str.slice(0, num)}...${fileExtension}`;
};

export const timeFormat = (time, timeZone = 'Asia/Jakarta') => {
  return moment(time).tz(timeZone);
};

export const passwordValidation = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export const usernameValidation = /^[a-zA-Z0-9]+$/;

export const roleOptions = [
  {
    id: 1,
    label: 'ENGINEER',
  },
  {
    id: 2,
    label: 'OPERATOR',
  },
];

export const convertDataToArray = (dataObject = []) => {
  return Object.entries(dataObject).map(([key, value]) => ({
    [key]: value,
  }));
};
