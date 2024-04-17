export const useFormatter = () => {
  /**
   * Coverts a number into USD currency.
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
   * Example: formatPrice(3500) returns "$3,500"
   */
  const formatPrice = (
    value: number,
    options?: Intl.NumberFormatOptions,
    placeholder = '--'
  ): string => {
    try {
      const num = +value;
      const formatterOptions = {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
        ...options,
      };

      const formatter = new Intl.NumberFormat('en-US', formatterOptions);

      return formatter.format(num);
    } catch (error) {
      return placeholder;
    }
  };
  /**
   * Coverts a string into number.
   * Example: formatStringToNumber('3,500.55') returns 3500.00"
   */
  const formatStringToNumber = (value: string): number => {
    return Number(value.replace('$ ', '').replaceAll(',', ''));
  };

   /**
   * Floating point math is broken in javascript. If formatted price has a trailing 0 it will remove it.
   * Example: formatStringToNumber('3500') returns 3500.00"
   * if decimals = .00 then remove, otherwise make sure two decimal places are returned
   */
  const fixDecimalAmts = (val: number, noDecimal = false) => {
    const formattedNum = formatPrice(val, 
    {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).split("."); //grab trailing decimal in array

    //no decimal returned case
    if (noDecimal) {
      return formattedNum[0];
    }
    else if (!formattedNum[1]) {
      return formattedNum[0];
    } 
    //need to add an extra zero here
    else if (formattedNum[1].length < 2) {
      return formattedNum[0] + "." + formattedNum[1] + "0";
    } else {
      return formattedNum[0] + "." + formattedNum[1];
    }
  }

  return {
    formatPrice,
    formatStringToNumber,
    fixDecimalAmts,
  };
};
