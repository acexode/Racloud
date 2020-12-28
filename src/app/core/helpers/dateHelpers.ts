const MONTH_LONG = [
  'January',
  'February',
  'March', 'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];
const MONTH_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sept.',
  'Oct',
  'Nov',
  'Dec'
];
// long
const DAYS_LONG = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

// short
const DAYS_SHORT = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat'
];
const DAYS_IN_MONTH = [
  31,
  28,
  31,
  30,
  31,
  30,
  31,
  31,
  30,
  31,
  30,
  31
];

const UTCDate = (theDate: any) => {
  const dateInUTC = new Date(theDate) || new Date();
  const day = dateInUTC.getUTCDate();
  const month = dateInUTC.getUTCMonth();
  const year = dateInUTC.getUTCFullYear();
  // return new Date(date).toUTCString();
  return {
    day,
    month,
    year,
  }
}
export const getUTCdate = (theDate: any, longMonth: boolean = false) => {
  const dateInUTC = UTCDate(theDate);
  const {day, month, year} = dateInUTC;
  return `${ day } ${ MONTH_SHORT[month] }, ${ year }`;
};

export const getUTCLongMonthdate = (theDate: any) => {
  const dateInUTC = UTCDate(theDate);
  const { day, month, year } = dateInUTC;
    return `${ day } ${ MONTH_LONG[month] }, ${ year }`;
};

export const convertDateBackToUTCDate = (theDate: any) => {
  return new Date(theDate).toISOString();
}

