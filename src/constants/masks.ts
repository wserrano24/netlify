export const Masks = {
  UsPhone: '+1 (###) ###-####',
  ZipCode: 'XXXXX',
  Ssn: '###-##-####',
  Income: '["$ #", "$ #.#", "$ #.##", "$ ##.##", "$ ###.##", "$ #,###.##", "$ ##,###.##", "$ ###,###.##", "$ #,###,###.##", "$ ##,###,###.##"]',
  ReservationCode: 'XXX-XXX-XXX-XXX',
  CardNumber: '**',
  DebitCardNumber: '####-####-####-####',
  CVVCardNumber: '###',
  SummaryCardMask: '****',
};

/**
 * Apply the mask to the SSN value to be displayed on summary pages
 */
export const ssnMask = (ssn: string): string =>
  ssn
    ? `${'*'.repeat(3)}-${'*'.repeat(2)}-${ssn.substring(
        ssn.length - 4,
        ssn.length
      )}`
    : '';

/**
 * Secures an email by masking it with asterisks.
 * @example
 * Gived jhondoe@gmail.com you'll get j**o@gmail.com
 */
export const maskEmail = (email: string): string => {
  if (!email) return '';

  const atSymbol = '@';
  const middlepart = '***';
  const [name, domain] = email.split(atSymbol);

  const maskedName = name[0] + middlepart + name[name.length - 1];
  const maskedEmail = maskedName + atSymbol + domain;

  return maskedEmail;
};

export const currency: Intl.NumberFormatOptions = {
  currency: 'USD',
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
  style: 'currency',
  useGrouping: true,
};
/**
 * Function that uses the browser's native function to format currencies.
 */
export const currencyFormatting = (
  value = 0,
  language = 'en',
  customCurrency = currency
): string =>
  value?.toLocaleString
    ? value.toLocaleString(language, customCurrency)
    : value.toString();
