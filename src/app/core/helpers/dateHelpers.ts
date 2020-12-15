export const dateHelperYear = (date: Date | string) => {
  try {
    const dateV = new Date(date);
    return dateV.getFullYear();
  } catch (err) {
    return '';
  }
};

const dateHelperDigitMonth = (singleDigitMonth) => {
  return ('0' + (singleDigitMonth + 1)).slice(-2);
};

export const dateHelperDMY = (date: Date | string) => {
  try {
    const dateV = new Date(date);
    return (
      dateV.getDate() +
      '.' +
      dateHelperDigitMonth(dateV.getMonth()) +
      '.' +
      dateV.getFullYear()
    );
  } catch (err) {
    return '';
  }
};
export const getTomorrowDate = () => {
  const today = new Date();
  const tomorrow = new Date( today );
  tomorrow.setDate( tomorrow.getDate() + 1 );
  return tomorrow;
};

// simple
export const getUTCdate = (pdate: any = null) => {
  const theDate = new Date(pdate) || new Date();
  const nowUtc = theDate.toISOString();
  return nowUtc;
};

export const getTommorrowUTCdate = () => {
  const getTomorrow = getTomorrowDate();
  const nowUtc = getTomorrow.toISOString();
  return nowUtc;
};




