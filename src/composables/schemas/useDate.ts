// NOTE: According to ticket DE6170 this value must be a constant, equal to 1850
// https://rally1.rallydev.com/#/?detail=/defect/643089689321&fdp=true
export const MIN_BIRTHDAY_DATE_VALUE = 1850;

export const subtractYears = (numOfYears: number, date = new Date()) => {
  date.setFullYear(date.getFullYear() - numOfYears);
  return new Date(date).toISOString().slice(0, 10);
};

export const subtractDays = (date1: Date, date2: Date): number => {
  date1 = new Date(date1);
  date2 = new Date(date2);
  const timeResult: number = Math.abs(date2?.getTime() - date1?.getTime());
  const daysResult = Math.ceil(timeResult / (1000 * 60 * 60 * 24));
  return daysResult;
};
/*
 * Function that compares the current date with another date and validates
 * if the date is greater than the current date.
 * This function DOES consider time in the comparison.
 * NOTE: The date comparison is advised to be done in the backend
 */
export const compareDateTimeWithCurrent = (
  date: Date = new Date()
): boolean => {
  const currentDate = new Date().getTime();
  const dateTime = date.getTime();
  return dateTime >= currentDate;
};

/**
 * Compare date with the current date.
 * This function DOES NOT consider time in the comparison.
 * @param date {string} A valid date string which an be instantiated as a Date object
 * @returns `0`  if provided-date is equal to current-date => Today
 * @returns `1`  if provided-date is greater than current-date => Future
 * @returns `-1` if provided-date is lesser than current-date => Past
 */
export const compareDateWithCurrentDate = (date: string) => {
  if (!date) return;

  const currentDate = new Date().setHours(0, 0, 0, 0);
  const providedDate = new Date(date).setHours(0, 0, 0, 0);
  const diff = providedDate - currentDate;
  return Math.sign(diff);
};

export const compareDateWithPrevious = (date1: Date, date2: Date): boolean => {
  if (!(date1 instanceof Date) || !(date2 instanceof Date)) return;
  const lastDate = date1?.getTime();
  const nextDate = date2?.getTime();
  return lastDate <= nextDate;
};

export const todaysDate = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();

  const result = mm + '/' + dd + '/' + yyyy;
  return result;
};

/**
 * Given a date (string), return the required format
 * @param date
 * @param separator
 * @param format
 */
export const formatDate = (
  date: string,
  separator = '-',
  format = 'MM/DD/YYYY',
  placeholder = '--'
): string => {
  try {
    const splitDate = date?.split(separator);
    if (splitDate?.length !== 3) return placeholder;

    const year = +splitDate[0];
    const month = +splitDate[1];
    const day = +splitDate[2];

    const addZero = (value: number): string =>
      value <= 9 ? `0${value}` : value.toString();

    if (year && month && day && month <= 12 && day <= 31) {
      return format
        .replace('MM', addZero(month))
        .replace('DD', addZero(day))
        .replace('YYYY', year.toString());
    }

    return date;
  } catch (error) {
    console.error('formatDate ', error);
    return placeholder;
  }
};

export const addDays = (date: Date, days: number): Date => {
  if (!(date instanceof Date)) return;
  const result = new Date(date.getTime());
  result.setDate(result.getDate() + days);
  return result;
};
