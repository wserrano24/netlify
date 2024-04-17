import {
  MIN_BIRTHDAY_DATE_VALUE,
  addDays,
  compareDateTimeWithCurrent,
  compareDateWithPrevious,
  subtractDays,
  subtractYears,
} from '@/composables/schemas/useDate';
import { array, boolean, date, number, object, string } from 'yup';
import { useCcpaBanner } from '@/composables/useCcpaBanner';
import  useFinancialBank  from '@/composables/useFinancialBank';
import { useErrorMessages } from '@/composables/useErrorMessages';
import { useFormatter } from '@/composables/useFormatter';
import { useMask } from './useMask';
import { useCompositeValidState } from './useCompositeValidState';

// Using Same regex pattern as Okta email validation.
const emailRegexPattern =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// NOTE: Holds bank information associated to routing number
const { getFinancialBankName, getValidIncomeDates } = useFinancialBank();
const { formatStringToNumber } = useFormatter();
const { getUnMaskedPhoneNumber } = useMask();

export const useSchema = () => {
  const { errors } = useErrorMessages();

  const handleRoutingNumber = async (value:any) => {
    const state = await getFinancialBankName(value);
    return state;
  };

  const getDates = async () => {
    const { getCompositeValidState } = useCompositeValidState();
    const id = await getCompositeValidState;
    const data = await getValidIncomeDates(id.value);
    const minFirstDateAllowed = data?.data?.minFirstDateAllowed;
    const maxFirstDateAllowed = data?.data?.maxFirstDateAllowed;

    const maxDaysAllowedForSecondPayDate =
      data?.data?.maxDaysAllowedForSecondPayDate;
    const minDaysAllowedForSecondPayDate =
      data?.data?.minDaysAllowedForSecondPayDate;

    return {
      minFirstDateAllowed,
      maxFirstDateAllowed,
      maxDaysAllowedForSecondPayDate,
      minDaysAllowedForSecondPayDate,
    };
  };

  const formValidations = {
    account: string().required(errors?.value?.account),
    address: string().required(errors?.value?.address),
    amount: number().required(errors?.value?.amount),
    bankName: string().required(errors?.value?.bankName),
    dateOfBirth: date()
      .required(errors?.value?.dateOfBirthRequired)
      .max(`${subtractYears(18)}`, errors?.value?.dateOfBirthMax)
      .typeError(errors?.value?.dateOfBirthTypeError)
      .test(
        'min-date-of-birth',
        `${errors?.value?.dateOfBirthMinDate}${MIN_BIRTHDAY_DATE_VALUE}`,
        function (_, context:any) {
          // Note: It was necessary to take the original value,
          // since the date returned by yup, for the year 0001 is equal to 1901
          const year = Number(
            context?.originalValue
              ?.split('-')
              ?.filter((v) => v.length === 4)?.[0] || ''
          );
          return year >= MIN_BIRTHDAY_DATE_VALUE;
        }
      ),
    cardHolder: string().required(errors?.value?.cardHolder),
    cardNumber: string()
      .min(16, errors?.value?.cardNumberMin)
      .required(errors?.value?.cardNumberRequired),
    cardCvv: string()
      .min(3, errors?.value?.cardCvvMin)
      .required(errors?.value?.cardCvvRequired),
    checkbox: boolean()
      .required(errors?.value?.checkboxRequired)
      .oneOf([true], errors?.value?.checkboxRequired),
    checkingAccNumber: string()
      .required(errors?.value?.checkingAccNumberRequired)
      .min(4, errors?.value?.checkingAccNumberMin)
      .max(17, errors?.value?.checkingAccNumberMax)
      .matches(/^[0-9]*$/, errors?.value?.checkingAccNumberMatches),
    confirmCheckingAccNumber: string().test(
      'account-match',
      errors?.value?.confirmCheckingAccNumber,
      function (value) {
        return this.parent.checkingAccNumber === value;
      }
    ),
    disclosureTennessee: string(),
    driversLicense: string()
      .min(4, errors?.value?.driversLicenseLength)
      .max(15, errors?.value?.driversLicenseLength)
      .matches(/^[a-z0-9]+$/i, errors?.value?.driversLicenseMatches)
      .test(
        'date-license',
        errors?.value?.driversLicenseDateLicense,
        function (value) {
          return value !== '';
        }
      )
      .required(errors?.value?.driversLicenseOrStateRequired),
    driversLicenseExpiration: date()
      .required(errors?.value?.driversLicenseExpirationRequired)
      .test(
        'drivers-license-expiration',
        errors?.value?.driversLicenseExpirationExpiration,
        function (value) {
          return compareDateTimeWithCurrent(value);
        }
      )
      .typeError(errors?.value?.driversLicenseDateLicense),
    email: string()
      .matches(emailRegexPattern, errors?.value?.email)
      .required(errors?.value?.emailRequired),
    employerName: string().required(errors?.value?.employerName),
    exitStatus: string().required(''),
    expirationDate: date()
      .nullable()
      .transform((curr, orig) => (orig === '' ? null : curr))
      .required(errors?.value?.expirationDateRequired)
      .min(new Date(), errors?.value?.expirationDateMin),
    firstName: string()
      .required(errors?.value?.firstNameRequired)
      .matches(
        /^(?!.*[!@#$%])\s*[A-Za-z][A-Za-z ]*$/,
        errors?.value?.firstNameMatches
      )
      .test(
        'check-empty',
        errors?.value?.firstNameCheckEmpty,
        function (value) {
          return value?.length > 0;
        }
      ),
    income: string()
      .required(errors?.value?.incomeRequired)
      .test('income', errors?.value?.incomeIncomeTest, function (value) {
        let testValue;
        if (value) {
          testValue = formatStringToNumber(value);
        }
        if (testValue > 99.99) {
          return true;
        }
      })
      .min(5, errors?.value?.incomeIncomeTest),
    inputDate: date().required(errors?.value?.inputDate),
    inputDateMinMax: date()
      .required(errors?.value?.inputDateMinMaxRequired)
      .min('2008-03-26', errors?.value?.inputDateMinMaxMin)
      .max('2022-03-26', errors?.value?.inputDateMinMaxMax),
    jobStatus: string().required(''),
    lastName: string()
      .required(errors?.value?.lastNameRequired)
      .matches(
        /^(?!.*[!@#$%])\s*[A-Za-z][A-Za-z ]*$/,
        errors?.value?.lastNameMatches
      )
      .test('check-empty', errors?.value?.lastNameCheckEmpty, function (value) {
        return value?.length > 0;
      }),
    manageDebitCards: string().required(errors?.value?.manageDebitCards),
    netIncome: string()
      .required(errors?.value?.netIncomeRequired)
      .test(
        'net-income-smaller-than-income',
        errors?.value?.netIncomeSmallerIncome,
        function (value) {
          let beforeTax;
          let afterTax;
          if (value && this?.parent?.monthlyIncome) {
            beforeTax = formatStringToNumber(this?.parent?.monthlyIncome);
            afterTax = formatStringToNumber(value);
            return beforeTax >= afterTax;
          }
        }
      )
      .test(
        'net-income-smaller-is-zero',
        errors?.value?.netIncomeBiggerIncome,
        function (value) {
          let testValue;
          if (value) {
            testValue = formatStringToNumber(value);
            return testValue === 0 ? false : true;
          }
        }
      ),
    password: string()
      .required(errors?.value?.passwordRequired)
      .min(8, errors?.value?.passwordMin)
      .matches(/[a-zA-Z]/, errors?.value?.passwordMatches),
    paymentAmount: string().required(errors?.value?.amount),
    paymentDate: date()
      .required(errors?.value?.paymentPeriod)
      .test(
        'payment-date-from-today-on',
        errors?.value?.paymentDate,
        function (value) {
          return compareDateTimeWithCurrent(value);
        }
      )
      .typeError(errors?.value?.paymentPeriod1TypeError),
    paymentFrequency: string().required(errors?.value?.paymentFrequency),
    paymentPayFrom: string().required(errors?.value?.paymentPayFrom),
    paymentPeriod: date().required(errors?.value?.paymentPeriod),
    paymentPeriod1: date()
      .required(errors?.value?.paymentPeriod1Required)
      .typeError(errors?.value?.paymentPeriod1TypeError)
      .min('2010-01-01', errors?.value?.paymentPeriod1Min)
      .max(new Date(), errors?.value?.paymentPeriod1Max),
    paymentPeriod2: date()
      .required(errors?.value?.paymentPeriod2Required)
      .min('2010-01-01', errors?.value?.paymentPeriod2Min)
      .test(
        'date-last-checked',
        errors?.value?.paymentPeriod2DateLast,
        function (value) {
          const result = subtractDays(value, this.parent.paymentPeriod1);
          return result <= 45;
        }
      )
      .test(
        'next-date-must-be-bigger-default',
        errors?.value?.paymentPeriod2DateBigger,
        function (value) {
          const result = compareDateWithPrevious(
            this.parent.paymentPeriod1,
            value
          );
          return result;
        }
      )
      .typeError(errors?.value?.paymentPeriod2TypeError),
    paymentPeriodDateofNextCheck: date()
      .test('date-must-be-weekday', function (value) {
        const date = new Date(value);

        return date.getDay() == 0 || date.getDay() == 6
          ? this.createError({
              message: `${errors?.value?.weekends}`,
            })
          : true;
      })
      .typeError(errors?.value?.paymentPeriod2BiTypeError)
      .required(errors?.value?.paymentPeriod2WeeklyRequired)
      .test('date-must-be-in-range-of-days', async function (value) {
        const { maxFirstDateAllowed, minFirstDateAllowed } = await getDates();
        if (
          !compareDateWithPrevious(
            value,
            new Date(maxFirstDateAllowed.replaceAll('-', '/') + ' ')
          )
        ) {
          return this.createError({
            message: `${errors?.value?.SelectValidateDateWithin} ${minFirstDateAllowed} ${errors?.value?.SelectValidateDateWithinAnd} ${maxFirstDateAllowed}`,
          });
        } else if (
          !compareDateWithPrevious(
            new Date(minFirstDateAllowed.replaceAll('-', '/')),
            value
          )
        ) {
          return this.createError({
            message: `${errors?.value?.SelectValidateDateWithin} ${minFirstDateAllowed} ${errors?.value?.SelectValidateDateWithinAnd} ${maxFirstDateAllowed}`,
          });
        } else {
          return true;
        }
      })
      .typeError(errors?.value?.paymentPeriod2WeeklyTypeError),
    paymentPeriod2TwiceMonth: date()
      .required(errors?.value?.paymentPeriod2BiWeeklyRequired)
      .test('date-must-be-weekday', function (value) {
        const date = new Date(value);

        return date.getDay() == 0 || date.getDay() == 6
          ? this.createError({
              message: `${errors?.value?.weekends}`,
            })
          : true;
      })
      .test('next-date-must-be-in-range-of-days', async function (value) {
        const {
          minDaysAllowedForSecondPayDate,
          maxDaysAllowedForSecondPayDate,
        } = await getDates();
        const newMinDate = addDays(
          this.parent.paymentPeriod1,
          minDaysAllowedForSecondPayDate
        );
        const newMaxDate = addDays(
          this.parent.paymentPeriod1,
          maxDaysAllowedForSecondPayDate
        );
        if (!compareDateWithPrevious(newMinDate, value) && newMinDate) {
          return this.createError({
            message: `${errors?.value?.SelectValidateDateWithin} ${newMinDate
              .toISOString()
              .substring(0, 10)} ${
              errors?.value?.SelectValidateDateWithinAnd
            } ${newMaxDate.toISOString().substring(0, 10)}`,
          });
        } else if (!compareDateWithPrevious(value, newMaxDate) && newMaxDate) {
          return this.createError({
            message: `${errors?.value?.SelectValidateDateWithin} ${newMinDate
              .toISOString()
              .substring(0, 10)} ${
              errors?.value?.SelectValidateDateWithinAnd
            } ${newMaxDate.toISOString().substring(0, 10)}`,
          });
        } else {
          return true;
        }
      })
      .typeError(errors?.value?.paymentPeriod2BiTypeError),
    paymentType: string().required(errors?.value?.paymentType),
    phoneNumber: string()
      .required(errors?.value?.phoneNumberRequired)
      .test(
        'phone-number',
        errors?.value?.phoneNumberInvalid,
        function (value) {
          const phoneNumber = getUnMaskedPhoneNumber(value);
          return phoneNumber?.length === 10 && /^\d{10}$/.test(phoneNumber);
        }
      )
      .test('check-empty', errors?.value?.phoneNumberEmpty, function (value) {
        return value?.length > 0;
      }),
    radioSet1: string().required(errors?.value?.radioSet1),
    routingNumber: string()
      .required(errors?.value?.routingNumberRequired)
      .length(9, errors?.value?.routingNumberLength)
      .matches(/^[0-9]*$/, errors?.value?.routingNumberMatches)
      // TODO: This validation test function needs improvement
      .test(
        'invalid-routing',
        errors?.value?.routingNumberInvalidRouting,
        async function (value) {
          if (value.length === 9) {
            const state = await handleRoutingNumber(value);
            if (state) {
              return true;
            }
          }
        }
      )
      .default(''),
    selectInput1: string().required(errors?.value?.selectInput1),
    selectInput2: array().required(errors?.value?.selectInput2),
    ssn: string()
      .required('')
      .length(9, errors?.value?.ssnRequired)
      .matches(/^[0-9]*$/, errors?.value?.ssnMatches),
    ssnConfirm: string().test(
      'ssn-match',
      errors?.value?.ssnConfirmMatch,
      function (value) {
        return this.parent.ssn === value;
      }
    ),
    signature: string().required(errors?.value?.signature),
    smsOptin: boolean(),
    states: string().required(errors?.value?.states),
    surveyOption: string().required(errors?.value?.surveyOption),
    zipCode: string()
      .required(errors?.value?.zipCodeRequired)
      .length(5, errors?.value?.zipCodeLength)
      .matches(/^(\d{5})?$/, errors?.value?.zipCodeMatches),
  };

  const usePersonalAddressSchema = () => {
    const { bannerState, handleBannerState } = useCcpaBanner();
    return (isValidAddress) => {
      return object().shape({
        address1: string()
          .required(errors?.value?.address)
          .test(
            'personal-address-match',
            errors?.value?.address1Match,
            function () {
              return isValidAddress;
            }
          )
          .test(
            'personal-address-empty',
            errors?.value?.address1Required,
            function (value) {
              if (bannerState && !value) {
                handleBannerState(false);
              }
              return value !== '';
            }
          ),
      });
    };
  };

  const usePersonalInformationSchema = () =>
    object().shape({
      currentPhone: formValidations?.phoneNumber,
      dateOfBirth: formValidations?.dateOfBirth,
      firstName: formValidations?.firstName,
      lastName: formValidations?.lastName,
      smsOptin: formValidations?.smsOptin,
    });

  const useZipcodeSchema = () =>
    object().shape({
      zipCode: formValidations?.zipCode,
    });

  const useLoginFormValidations = () =>
    object().shape({
      firstName: formValidations?.firstName,
      lastName: formValidations?.lastName,
      email: formValidations?.email,
      phoneNumber: formValidations?.phoneNumber,
      optionCheck1: formValidations?.checkbox,
      optionCheck2: formValidations?.checkbox,
      radioSet1: formValidations?.radioSet1,
      inputDate1: formValidations?.inputDate,
      inputDate2: formValidations?.inputDateMinMax,
      selectInput1: formValidations?.selectInput1,
      selectInput2: formValidations?.selectInput2,
      password: formValidations?.password,
    });

  const useUpdatePersonalInformationSchema = () =>
    object().shape({
      currentPhone: formValidations?.phoneNumber,
      firstName: formValidations?.firstName,
      lastName: formValidations?.lastName,
      smsOptin: formValidations?.smsOptin,
    });

  const useAccountDetailsUpdateEmailSchema = () =>
    object().shape({
      email: formValidations?.email,
    });

  const usePersonalIdentitySchema = () =>
    object().shape({
      driversLicense: formValidations?.driversLicense,
      driversLicenseExpiration: formValidations?.driversLicenseExpiration,
      driversLicenseState: formValidations?.states,
    });

  const usePersonalSsnSchema = () =>
    object().shape({
      ssn: formValidations?.ssn,
      ssnConfirm: formValidations?.ssnConfirm,
    });

  const useFindAccountSchema = () =>
    object().shape({
      ssn: formValidations?.ssn,
      dateOfBirth: date()
        .required('')
        .max(`${subtractYears(18)}`, errors?.value?.dateOfBirthMax)
        .typeError(errors?.value?.dateOfBirthTypeError),
    });

  const useBankInformationSchema = () =>
    object().shape({
      checkingAccNumber: formValidations?.checkingAccNumber,
      confirmCheckingAccNumber: formValidations?.confirmCheckingAccNumber,
      routingNumber: formValidations?.routingNumber,
    });

  const useJobStatusSchema = () =>
    object().shape({
      jobStatus: formValidations?.jobStatus,
    });

  const useLoanStatusSchema = () =>
    object().shape({
      loanStatus: formValidations?.disclosureTennessee,
    });

  const useEmployerInformationSchema = () =>
    object().shape({
      employerName: formValidations?.employerName,
    });

  const useSignatureSchema = () =>
    object().shape({
      signature: formValidations?.signature,
    });

  const usePaymentFrequencySchema = () =>
    object().shape({
      paymentFrequency: formValidations?.paymentFrequency,
    });

  const useManageDebitCardSchema = () =>
    object().shape({
      manageDebitCards: formValidations?.manageDebitCards,
    });

  const usePaymentPeriodSchema = () =>
    object().shape({
      paymentPeriod1: formValidations?.paymentPeriod1,
      paymentPeriod2: formValidations?.paymentPeriod2,
    });

  const usePaymentPeriodSchemaSingleField = () =>
    object().shape({
      paymentPeriod1: formValidations?.paymentPeriodDateofNextCheck,
    });

  const usePaymentPeriodSchemaTwiceMonth = () =>
    object().shape({
      paymentPeriod1: formValidations?.paymentPeriodDateofNextCheck,
      paymentPeriod2: formValidations?.paymentPeriod2TwiceMonth,
    });

  const useIncomeInformationSchema = () =>
    object().shape({
      monthlyIncome: formValidations?.income,
      netIncome: formValidations?.netIncome,
    });

  const useIncomeInformationSchemaNonRegular = () =>
    object().shape({
      monthlyIncome: formValidations?.income,
    });

  const useIncomeInformationSchemaNonRegularReceiveAssistance = () =>
    object().shape({
      grossIncome: formValidations?.income,
    });

  const usePaymentTypeSchema = () =>
    object().shape({
      paymentType: formValidations?.paymentType,
    });

  const useExitStatusSchema = () =>
    object().shape({
      exitStatus: formValidations?.exitStatus,
    });

  const useModalEmail = () =>
    object().shape({
      email: formValidations?.email,
    });

  const useSurveyOptions = () =>
    object().shape({
      surveyOption: formValidations?.surveyOption,
    });

  const useAddDebitCard = () =>
    object().shape({
      cardHolder: formValidations?.cardHolder,
      cardNumber: formValidations?.cardNumber,
      expirationDate: formValidations?.expirationDate,
      cardCvv: formValidations?.cardCvv,
    });

  const useWithdrawalSchema = () =>
    object().shape({
      account: formValidations?.account,
      amount: formValidations?.amount,
      date: formValidations?.inputDate,
    });

  const usePreferencesValidations = () => object().shape({});

  const useMakePaymentSchema = () =>
    object().shape({
      amount: formValidations?.paymentAmount,
      payFrom: formValidations?.paymentPayFrom,
      paymentDate: formValidations?.paymentDate,
    });

  const useUpdateEmailSchema = () =>
    object().shape({
      email: string()
        .matches(emailRegexPattern, errors?.value?.updateEmail)
        .required(errors?.value?.emailRequired),
    });

  return {
    useAccountDetailsUpdateEmailSchema,
    useAddDebitCard,
    useBankInformationSchema,
    useEmployerInformationSchema,
    useExitStatusSchema,
    useFindAccountSchema,
    useIncomeInformationSchema,
    useIncomeInformationSchemaNonRegular,
    useIncomeInformationSchemaNonRegularReceiveAssistance,
    useJobStatusSchema,
    useLoanStatusSchema,
    useLoginFormValidations,
    useMakePaymentSchema,
    useManageDebitCardSchema,
    useModalEmail,
    usePaymentFrequencySchema,
    usePaymentPeriodSchema,
    usePaymentPeriodSchemaTwiceMonth,
    usePaymentPeriodSchemaSingleField,
    usePaymentTypeSchema,
    usePersonalAddressSchema,
    usePersonalIdentitySchema,
    usePersonalInformationSchema,
    usePersonalSsnSchema,
    usePreferencesValidations,
    useSignatureSchema,
    useSurveyOptions,
    useUpdateEmailSchema,
    useUpdatePersonalInformationSchema,
    useWithdrawalSchema,
    useZipcodeSchema,
  };
};
