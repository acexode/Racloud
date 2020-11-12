import { roLocale } from 'ngx-bootstrap/locale';

export const roLocaleCustom = () => {
  const newLocale = {
    ...roLocale,
    ...{
      // Override datepicker day display.
      weekdaysShort: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
    },
  };
  return newLocale;
};
