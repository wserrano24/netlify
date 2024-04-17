import { Routes } from '@/constants/pages';

export enum RouteName {
  ReApply = 're-apply',
  ReFinance = 're-finance',
  ManageEmployment = 'manage-employment',
  LoanOrigination = 'loan-origination'
}

const JobStatusRoutes = {
  [RouteName.ReApply]: Routes.ReApplyJobStatus,
  [RouteName.ReFinance]: Routes.ReFinanceJobStatus,
  [RouteName.ManageEmployment]: Routes.ManageEmploymentJobStatus,
};

const EmployerInformationRoutes = {
  [RouteName.ReApply]: Routes.ReApplyEmployerInformation,
  [RouteName.ReFinance]: Routes.ReFinanceEmployerInformation,
  [RouteName.ManageEmployment]: Routes.ManageEmploymentEmployerInformation,
};

const PaymentFrequencyRoutes = {
  [RouteName.ReApply]: Routes.ReApplyPaymentFrequency,
  [RouteName.ReFinance]: Routes.ReFinancePaymentFrequency,
  [RouteName.ManageEmployment]: Routes.ManageEmploymentPaymentFrequency,
};

const PaymentPeriodRedirectRoutes = {
  [RouteName.ReApply]: Routes.ReApplyPaymentPeriod,
  [RouteName.ReFinance]: Routes.ReFinancePaymentPeriod,
  [RouteName.ManageEmployment]: Routes.ManageEmploymentPaymentPeriod,
};

const PaymentTypeRoutes = {
  [RouteName.ReApply]: Routes.ReApplyPaymentType,
  [RouteName.ReFinance]: Routes.ReFinancePaymentType,
  [RouteName.ManageEmployment]: Routes.ManageEmploymentPaymentType,
};

const IncomeInformationRoutes = {
  [RouteName.ReApply]: Routes.ReApplyIncomeInformation,
  [RouteName.ReFinance]: Routes.ReFinanceIncomeInformation,
  [RouteName.ManageEmployment]: Routes.ManageEmploymentIncomeInformation,
};

const AddAnotherSourceOfIncomeRoutes = {
  [RouteName.ReApply]: Routes.ReApplyPaymentType,
  [RouteName.ReFinance]: Routes.ReFinancePaymentType,
  [RouteName.ManageEmployment]: Routes.ManageEmploymentPaymentType,
};

const EmployeeIncomeVerificationRoutes = {
  [RouteName.ReApply]: Routes.ReApplyEmployeeInformation,
  [RouteName.ReFinance]: Routes.ReFinanceEmployeeInformation,
  [RouteName.ManageEmployment]: Routes.ManageEmployment,
  [RouteName.LoanOrigination] : Routes.LoanOriginationReapplyEmploymentConfirmation
};

const AddressVerificationRoutes = {
  [RouteName.ReApply]: Routes.FinanceReApplyVerification,
  [RouteName.ReFinance]: Routes.ReFinanceBankVerification,
};

const AddressProceedVerificationRoutes = {
  [RouteName.ReApply]: Routes.AddressReApplyVerification,
  [RouteName.ReFinance]: Routes.ReFinanceAddressVerification,
};

const AddAnotherIncomeRoutes = {
  [RouteName.ReApply]: Routes.ReApplyJobStatus,
  [RouteName.ReFinance]: Routes.ReFinanceJobStatus,
};

export {
  AddAnotherIncomeRoutes,
  AddAnotherSourceOfIncomeRoutes,
  AddressProceedVerificationRoutes,
  AddressVerificationRoutes,
  EmployeeIncomeVerificationRoutes,
  EmployerInformationRoutes,
  IncomeInformationRoutes,
  JobStatusRoutes,
  PaymentFrequencyRoutes,
  PaymentPeriodRedirectRoutes,
  PaymentTypeRoutes,
};
