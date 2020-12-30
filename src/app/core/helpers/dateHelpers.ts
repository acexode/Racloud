const MONTH_LONG = [
  'January',
  'February',
  'March',
  'April',
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
  const dateInUTC = new Date(theDate);
  const d = dateInUTC.getDate(); /* day */
  const m = dateInUTC.getMonth(); /* month */
  const y = dateInUTC.getFullYear(); /* year */
  console.log(d, m, y, theDate, dateInUTC);
  // return new Date(date).toUTCString();
  return {
    d,
    m,
    y,
  };
};
export const getUTCdate = (theDate: any, longMonth: boolean = false) => {
  const dateInUTC = UTCDate(theDate);
  const { d, m, y } = dateInUTC;
  return `${ d } ${ MONTH_SHORT[m] }, ${ y }`;
};

export const getUTCLongMonthDate = (theDate: string) => {
  const dateInUTC = UTCDate(theDate);
  const { d, m, y } = dateInUTC;
  return `${ d } ${ MONTH_LONG[m] }, ${ y }`;
};

export const convertDateBackToUTCDate = (passInDate: any) => {
  const newDate = new Date(`${passInDate} UTC`);
  return newDate.toISOString();
};

