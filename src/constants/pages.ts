export enum Pages {
  AccountDetails = 'account-details',
  BankStatement = 'bank-statement',
  ContactUs = 'contact-us',
  ConnectPlaid = 'connect-plaid',
  DigitalWallet = 'digital-wallet',
  Dashboard = 'dashboard',
  DriverLicense = 'driver-license',
  GovernmentID = 'government-id',
  LandingPage = 'landing-page',
  LineOfCredit = 'line-of-credit',
  LoanApplicationTimeline = 'loan-application-timeline',
  LoanInformation = 'loan-information',
  PhotoOfYouWithId = 'photo-of-you-with-id',
  Profile = 'profile',
  ProofOfAddress = 'proof-of-address',
  ProofOfIncome = 'proof-of-income',
  OtherDocuments = 'other-documents',
  StoreLocator = 'store-locator',
  Refinance = 're-finance',
  ReviewDisclosures = 'review-disclosures',
  UploadNewDocument = 'upload-new-document',
}

export enum Routes {
  AccountDetails = '/profile/account-details',
  AccountDetailsMenu = '/profile/account-details',
  AddPayment = '/add-payment',
  AddressReApplyVerification = '/re-apply/information-verification/address-info',
  ApplicationFailed = '/application-failed',
  BankHoliday = '/notifications/bank-holiday',
  BankStatement = '/verify-identity/bank-statement',
  ConnectPlaid = '/connect-finances/connect-plaid',
  ContactUs = '/profile/contact-us',
  Dashboard = '/dashboard',
  DigitalWallet = '/profile/digital-wallet',
  DigitalWalletEditPayment = '/profile/digital-wallet/edit-payment-method',
  DocumentsSummary = '/loan-origination/payday-loan/documents-summary',
  ExitAplication = '/loan-application/exit-application',
  FinanceReApplyVerification = '/re-apply/information-verification/bank-info',
  FinancialBankInformation = '/loan-application/step-two/bank-information',
  FinancialEmployerInformation = '/loan-application/step-two/employer-information',
  FinancialIncomeInformation = '/loan-application/step-two/income-information',
  FinancialJobStatus = '/loan-application/step-two/job-status',
  FinancialPaymentFrequency = '/loan-application/step-two/payment-frequency',
  FinancialPaymentPeriod = '/loan-application/step-two/payment-period',
  FinancialPaymentType = '/loan-application/step-two/payment-type',
  FinancialSuccessMessage = '/loan-application/step-two/success-message',
  FinancialSummary = '/loan-application/step-two/financial-summary',
  FindStore = '/store-locator',
  ForgotPassword = '/signin/forgot-password',
  GovernmentID = '/verify-identity/government-id',
  InstallmentLoanLoanProductDetails = '/installment-loan/product-details',
  InStoreAccountFind = '/loan-application/find-your-account',
  InStoreAccountFound = '/loan-application/in-store-account-found',
  Lagging = '/notifications/system-lag',
  Landing = '/',
  LoanApplicationTimeline = '/dashboard/loan-application-timeline',
  LoanDenied = '/loan-application/loan-denied',
  LoanHistory = '/loan-history',
  LoanInformation = '/re-apply/loan-information',
  RefinanceDenied = '/loan-application/refinance-denied',

  // Loan Origination
  ManageDebitCard = '/manage-debit-card',
  LoanOriginationDocumentsSummary = '/loan-origination/documents-summary',

  // Online
  LoanOriginationOffers = '/loan-origination/multi-offer',
  LoanOriginationMarried = '/loan-origination/marital-status',
  LoanOriginationDisbursement = '/loan-origination/loan-disbursement',
  LoanOriginationRepayment = '/loan-origination/loan-repayment',
  LoanOriginationEsign = '/loan-origination/esign-confirmation',
  LoanOriginationSuccess = '/loan-origination/success-message',

  // In-store
  LoanOriginationInStoreMarried = '/loan-origination/in-store-offer/marital-status',
  LoanOriginationInStoreRepayment = '/loan-origination/in-store-offer/loan-repayment',
  LoanOriginationInStoreFinalize = '/loan-origination/in-store-offer/finalize-in-store',
  LoanOriginationInStoreEsign = '/loan-origination/in-store-offer/esign-confirmation',
  RequiredDocuments = '/loan-origination/in-store-offer/required-documents',

  // Reapply / Repeat customer
  //first 3 screens
  LoanOriginationReapplyHowItWorks = '/loan-origination/reapply/how-it-works',
  LoanOriginationReapplyEmploymentConfirmation = '/loan-origination/reapply/employment-confirmation',

  //reapply routes
  LoanOriginationReapplyOffers = '/loan-origination/reapply/multi-offer',
  LoanOriginationReapplyMarried = '/loan-origination/reapply/marital-status',
  LoanOriginationReapplyDisbursement = '/loan-origination/reapply/loan-disbursement',
  LoanOriginationReapplyRepayment = '/loan-origination/reapply/loan-repayment',
  LoanOriginationReapplyEsign = '/loan-origination/reapply/esign-confirmation',
  LoanOriginationReapplySuccess = '/loan-origination/reapply/success-message',

  //Refinance
  LoanOriginationRefinanceOffers = '/loan-origination/refinance/multi-offer',
  RefinanceInfo = '/loan-origination/refinance/refinance-info',
  RefinanceInfoPlus = '/loan-origination/refinance/refinance-info-plus',
  RefinanceMissingBank = '/re-finance/information-verification/missing-bank-account',
  LoanOriginationRefinanceMarried = '/loan-origination/refinance/marital-status',
  LoanOriginationRefinanceDisbursement = '/loan-origination/refinance/loan-disbursement',
  LoanOriginationRefinanceRepayment = '/loan-origination/refinance/loan-repayment',
  LoanOriginationRefinanceEsign = '/loan-origination/refinance/esign-confirmation',
  LoanOriginationRefinanceFailure = '/loan-origination/refinance/refinance-failure',
  LoanOriginationFundingFailure = '/loan-origination/refinance/funding-failure',

  // Lead Gen
  LeadGenLanding = '/lead-gen',
  LeadGenInvalidLink = '/lead-gen/invalid-error',
  LeadGenGeneralError = '/lead-gen/error',
  LeadGenStoreLocator = '/lead-gen/store-locator',
  LeadGenOffers = '/loan-origination/lead-gen/multi-offer',
  LeadGenDisbursement = '/loan-origination/lead-gen/loan-disbursement',
  LeadGenRepayment = '/loan-origination/lead-gen/loan-repayment',
  LeadGenMarried = '/loan-origination/lead-gen/marital-status',
  LeadGenEsign = '/loan-origination/lead-gen/esign-confirmation',
  LeadGenDenied = '/loan-origination/lead-gen/loan-denied',
  LeadGenAddPayment = '/lead-gen/add-payment',
  LeadGenManageDebit = '/lead-gen/manage-debit',
  LeadGenRegister = '/lead-gen/register-lead',

  // Delete list
  LoanOriginationPaydaySuccessMessage = '/loan-origination/installment-loan/success-message',

  LoanSummaryPaydayLoanSuccess = '/loan-summary/success-message',
  LoanSummaryPaydayThankYou = '/loan-summary/thank-you',
  Login = '/signin/login',
  MakeAPayment = '/make-a-payment',
  MakeAWithdrawal = '/line-of-credit/make-a-withdrawal',
  ManageEmployment = '/profile/manage-employment/income-summary',
  ManageEmploymentEmployerInformation = '/profile/manage-employment/employer-information',
  ManageEmploymentIncomeInformation = '/profile/manage-employment/income-information',
  ManageEmploymentJobStatus = '/profile/manage-employment/job-status',
  ManageEmploymentPaymentFrequency = '/profile/manage-employment/payment-frequency',
  ManageEmploymentPaymentPeriod = '/profile/manage-employment/payment-period',
  ManageEmploymentPaymentType = '/profile/manage-employment/payment-type',
  ManagePassword = '/profile/manage-password',
  ManagePreferences = '/profile/manage-preference',
  MoreAboutYou = '/connect-finances/more-about-you',
  MyDocuments = '/profile/my-documents',
  NotFound = '/loan-application/not-found',
  PaymentAuthorizationAgreement = '/line-of-credit/payment-authorization-agreement',
  PaydayPaymentFailed = '/payment-failed',
  PersonalAddress = '/loan-application/step-one/personal-address',
  PersonalIdentity = '/loan-application/step-one/personal-identity',
  PersonalInformation = '/loan-application/step-one/personal-information',
  PersonalSsn = '/loan-application/step-one/personal-ssn',
  PersonalSsnExistingOfflineAccount = '/loan-application/step-one/existent-offline-account',
  PersonalSsnExistingOnlineAccount = '/loan-application/step-one/existent-online-account',
  PersonalSummary = '/loan-application/step-one/personal-summary',
  PhotoOfYouWithId = '/verify-identity/photo-of-you-with-id',
  Profile = '/profile',
  ProofOfAddress = '/verify-identity/proof-of-address',
  ProofOfIncome = '/verify-identity/proof-of-income',
  OtherDocuments = '/verify-identity/other-documents',
  ReApplyAddress = '/re-apply/address-information',
  ReApplyBankInformation = '/re-apply/information-verification/bank-info',
  ReApplyDisbursementFailure = '/re-apply/loan-origination/disbursement-failure',
  ReApplyEmployeeInformation = '/re-apply/information-verification',
  ReApplyEmployerInformation = '/re-apply/employer-information',
  ReApplyIdentity = '/re-apply/identity-information',
  ReApplyIncomeInformation = '/re-apply/income-information',
  ReApplyJobStatus = '/re-apply/job-status',
  ReApplyMissingBankAccount = '/re-apply/information-verification/missing-bank-account',
  ReApplyPaymentFrequency = '/re-apply/payment-frequency',
  ReApplyPaymentPeriod = '/re-apply/payment-period',
  ReApplyPaymentType = '/re-apply/payment-type',
  ReApplyUpdateBankInformation = '/re-apply/bank-information',
  Redirect = '/redirect',
  ReFinanceAddress = '/re-finance/address-information',
  ReFinanceAddressVerification = '/re-finance/information-verification/address-info',
  ReFinanceBankVerification = '/re-finance/information-verification/bank-info',
  ReFinanceEmployeeInformation = '/re-finance/information-verification',
  ReFinanceEmployerInformation = '/re-finance/employer-information',
  ReFinanceIdentity = '/re-finance/identity-information',
  ReFinanceIncomeInformation = '/re-finance/income-information',
  RefinanceInformationVerification = '/re-finance/information-verification',
  RefinanceInstallmentLoan = '/re-finance/installment-loan',
  ReFinanceJobStatus = '/re-finance/job-status',
  RefinancePaydayLoan = '/re-finance/payday-loan',
  RefinancePaydayLoanInformation = '/re-finance/payday-loan/loan-information',
  ReFinancePaymentFrequency = '/re-finance/payment-frequency',
  ReFinancePaymentPeriod = '/re-finance/payment-period',
  ReFinancePaymentType = '/re-finance/payment-type',
  ReFinanceReviewDisclosures = '/re-finance/review-disclosures',
  ReFinanceUpdateBankInformation = '/re-finance/bank-information',
  Register = '/signin/register',
  ReviewDisclosures = '/re-apply/review-disclosures',
  StoreLocator = '/store-locator',
  SystemMain = '/notifications/system-main',
  SystemOut = '/notifications/system-out',
  SystemSlow = '/notifications/system-slow',
  SystemOutage = '/notifications/system-outage',
  TitleLoanLoanProductDetail = '/title-loan/product-details',
  UpdateContactInfo = '/profile/account-details/contact-information',
  UpdateDriverLicense = '/profile/account-details/driver-license',
  UpdateEmail = '/profile/account-details/email-address',
  UpdateHomeAddress = '/profile/account-details/address-information',
  UploadNewDocument = '/profile/account-details/upload-new-document',
  Zipcode = '/loan-application/zip-code',
}

export enum RouteLabels {
  AccountDetails = 'account details',
  BankStatement = 'bank statement',
  ContactUs = 'contact us',
  ConnectPlaid = 'connect with plaid',
  DigitalWallet = 'digital wallet',
  FindStore = 'find a store',
  LoanInformation = 'apply for a loan',
  GovernmentID = `government id/ driver's license`,
  LoanHistory = 'loan history',
  ManageEmployment = 'manage income source',
  ManagePassword = 'manage password',
  ManagePreferences = 'manage preferences',
  MyDocuments = 'my documents',
  Profile = 'profile',
  ProofOfAddress = 'proof of address',
  ProofOfIncome = 'proof of income',
  OtherDocuments = 'other documents',
  UpdateContactInfo = 'update contact information',
  UpdateDriverLicense = `update driver's license`,
  UpdateEmail = 'update email address',
  UpdateHomeAddress = 'update home address',
  UploadNewDocument = 'upload new document',
  RefinanceInformationVerification = 'refinance',
  MakeAPayment = 'make a payment',
  Dashboard = 'dashboard',
}

export enum FooterLabels {
  AboutUs = 'about us',
  Careers = 'careers',
  Videos = 'videos',
  CustomerReviews = 'customer reviews',
  MoneyTips = 'money tips',
  ContactUs = 'contact us',
  StoreLocator = 'store locator',
  Security = 'security',
  Accessibility = 'accessibility',
  SiteMap = 'site map',
  PrivacyAndTerms = 'privacy & terms',
  CookiesAndAdvertising = 'cookies & advertising',
}

export enum FooterLabelRoutes {
  AboutUs = 'https://www.advanceamerica.net/about-advance-america',
  Careers = 'https://jobs.havepurpose.com/advanceamerica',
  Videos = 'https://www.advanceamerica.net/our-videos',
  CustomerReviews = 'https://www.advanceamerica.net/customer-reviews',
  MoneyTips = 'https://www.advanceamerica.net/money-saving-tips',
  ContactUs = '/profile/contact-us',
  StoreLocator = '/store-locator',
  Security = 'https://www.advanceamerica.net/privacy-and-terms/security-information',
  Accessibility = 'https://www.advanceamerica.net/privacy-and-terms/site-accessibility',
  SiteMap = 'https://www.advanceamerica.net/sitemap',
  PrivacyAndTerms = 'https://www.advanceamerica.net/privacy-and-terms',
  CookiesAndAdvertising = 'https://www.advanceamerica.net/privacy-and-terms/cookies-and-targeted-advertising',
  Landing = '/',
}

export enum MoneyCardRoutes {
  VisaCard = '/services/prepaid-visa-cards',
  WesternUnion = 'https://www.advanceamerica.net/services/western-union',
}

export enum FooterSocialLinks {
  Facebook = 'https://www.facebook.com/login/?next=https%3A%2F%2Fwww.facebook.com%2FAdvanceAmerica',
  Twitter = 'https://twitter.com/UAdvanceAmerica',
  Instagram = 'https://www.instagram.com/advanceamerica/',
  'You Tube' = 'https://www.youtube.com/user/YouAdvanceAmerica',
  Pinterest = 'https://www.pinterest.com/youadvanceamerica/',
}

// Create a key value object with the name of the pages.
export const PageNames = Object.keys(Routes)
  .map((v) => ({ [v]: v }))
  .reduce((a, s) => ({ ...a, ...s }), {});

export const queries = {
  [Routes.FinancialJobStatus]: {
    employed: 'employed',
    selfEmployed: 'self-employed',
    retired: 'retired',
  },

  [Routes.ReApplyJobStatus]: {
    employed: 'employed',
    selfEmployed: 'self-employed',
    retired: 'retired',
  },

  [Routes.ReFinanceJobStatus]: {
    employed: 'employed',
    selfEmployed: 'self-employed',
    retired: 'retired',
  },

  [Routes.ManageEmploymentJobStatus]: {
    employed: 'employed',
    selfEmployed: 'self-employed',
    retired: 'retired',
  },

  [Routes.FinancialPaymentFrequency]: {
    nonRegular: 'non-regular',
  },

  [Routes.ReApplyPaymentFrequency]: {
    nonRegular: 'non-regular',
  },

  [Routes.ReFinancePaymentFrequency]: {
    nonRegular: 'non-regular',
  },

  [Routes.ManageEmploymentPaymentFrequency]: {
    nonRegular: 'non-regular',
  },
};

export const navigationSchemas = {
  [Routes.FinancialBankInformation]: {
    bankInfo: {
      path: Routes.FinancialJobStatus,
    },
  },

  [Routes.FinancialJobStatus]: {
    employed: {
      path: Routes.FinancialEmployerInformation,
      query: {
        jobStatus: queries[Routes.FinancialJobStatus].employed,
      },
    },
    selfEmployed: {
      path: Routes.FinancialPaymentFrequency,
      query: {
        jobStatus: queries[Routes.FinancialJobStatus].selfEmployed,
      },
    },
    retired: {
      path: Routes.FinancialPaymentFrequency,
      query: {
        jobStatus: queries[Routes.FinancialJobStatus].retired,
      },
    },
  },

  [Routes.FinancialEmployerInformation]: {
    employerName: {
      path: Routes.FinancialPaymentFrequency,
      query: {
        jobStatus: queries[Routes.FinancialJobStatus].employed,
      },
    },
  },

  [Routes.FinancialPaymentFrequency]: {
    regular: {
      path: Routes.FinancialPaymentPeriod,
      query: {
        jobStatus: queries[Routes.FinancialJobStatus].employed,
      },
    },
    selfEmployed: {
      path: Routes.FinancialPaymentPeriod,
      query: {
        jobStatus: queries[Routes.FinancialJobStatus].selfEmployed,
      },
    },
    nonRegularSelfEmployed: {
      path: Routes.FinancialIncomeInformation,
      query: {
        nonRegular: queries[Routes.FinancialPaymentFrequency].nonRegular,
        jobStatus: queries[Routes.FinancialJobStatus].selfEmployed,
      },
    },
    retired: {
      path: Routes.FinancialPaymentPeriod,
      query: {
        jobStatus: queries[Routes.FinancialJobStatus].retired,
      },
    },
  },

  [Routes.FinancialIncomeInformation]: {
    income: {
      path: Routes.FinancialPaymentType,
    },
  },

  [Routes.FinancialPaymentPeriod]: {
    employed: {
      path: Routes.FinancialIncomeInformation,
      query: {
        jobStatus: queries[Routes.FinancialJobStatus].employed,
      },
    },
    selfEmployed: {
      path: Routes.FinancialIncomeInformation,
      query: {
        jobStatus: queries[Routes.FinancialJobStatus].selfEmployed,
      },
    },
    selfEmployedNonRegular: {
      path: Routes.FinancialIncomeInformation,
      query: {
        jobStatus: queries[Routes.FinancialJobStatus].selfEmployed,
        paymentFrequency: queries[Routes.FinancialPaymentFrequency].nonRegular,
      },
    },
    retired: {
      path: Routes.FinancialIncomeInformation,
      query: {
        jobStatus: queries[Routes.FinancialJobStatus].retired,
      },
    },
  },

  [Routes.FinancialPaymentType]: {
    summary: {
      path: Routes.FinancialSummary,
    },
  },

  [Routes.FinancialSummary]: {
    jobStatus: {
      path: Routes.FinancialJobStatus,
    },
  },

  [Routes.ReApplyJobStatus]: {
    employed: {
      path: Routes.ReApplyEmployerInformation,
      query: {
        jobStatus: queries[Routes.ReApplyJobStatus].employed,
      },
    },
    selfEmployed: {
      path: Routes.ReApplyPaymentFrequency,
      query: {
        jobStatus: queries[Routes.ReApplyJobStatus].selfEmployed,
      },
    },
    retired: {
      path: Routes.ReApplyPaymentFrequency,
      query: {
        jobStatus: queries[Routes.ReApplyJobStatus].retired,
      },
    },
  },

  [Routes.ReApplyEmployerInformation]: {
    jobStatus: {
      path: Routes.ReApplyJobStatus,
    },
    employerName: {
      path: Routes.ReApplyPaymentFrequency,
      query: {
        jobStatus: queries[Routes.ReApplyJobStatus].employed,
      },
    },
  },

  [Routes.ReApplyPaymentFrequency]: {
    regular: {
      path: Routes.ReApplyPaymentPeriod,
      query: {
        jobStatus: queries[Routes.ReApplyJobStatus].employed,
      },
    },
    selfEmployed: {
      path: Routes.ReApplyPaymentPeriod,
      query: {
        jobStatus: queries[Routes.ReApplyJobStatus].selfEmployed,
      },
    },
    nonRegularSelfEmployed: {
      path: Routes.ReApplyIncomeInformation,
      query: {
        nonRegular: queries[Routes.ReApplyPaymentFrequency].nonRegular,
        jobStatus: queries[Routes.ReApplyJobStatus].selfEmployed,
      },
    },
    nonRegular: {
      path: Routes.ReApplyIncomeInformation,
      query: {
        nonRegular: queries[Routes.ReApplyPaymentFrequency].nonRegular,
      },
    },
    retired: {
      path: Routes.ReApplyPaymentPeriod,
      query: {
        jobStatus: queries[Routes.ReApplyJobStatus].retired,
      },
    },
  },

  [Routes.ReApplyPaymentPeriod]: {
    employed: {
      path: Routes.ReApplyIncomeInformation,
      query: {
        jobStatus: queries[Routes.ReApplyJobStatus].employed,
      },
    },
    selfEmployed: {
      path: Routes.ReApplyIncomeInformation,
      query: {
        jobStatus: queries[Routes.ReApplyJobStatus].selfEmployed,
      },
    },
    selfEmployedNonRegular: {
      path: Routes.ReApplyIncomeInformation,
      query: {
        jobStatus: queries[Routes.ReApplyJobStatus].selfEmployed,
        paymentFrequency: queries[Routes.ReApplyPaymentFrequency].nonRegular,
      },
    },
    retired: {
      path: Routes.ReApplyIncomeInformation,
      query: {
        jobStatus: queries[Routes.ReApplyJobStatus].retired,
      },
    },
  },

  [Routes.ReApplyPaymentType]: {
    summary: {
      path: Routes.ReApplyEmployeeInformation,
    },
    jobStatus: {
      path: Routes.ReApplyJobStatus,
    },
  },

  [Routes.LoanOriginationReapplyEmploymentConfirmation]: {
    income: {
      path: Routes.ReApplyPaymentType,
    },
  },

  [Routes.ReApplyIncomeInformation]: {
    income: {
      path: Routes.ReApplyPaymentType,
    },
  },

  [Routes.ReApplyEmployeeInformation]: {
    jobStatus: {
      path: Routes.ReApplyJobStatus,
    },
    bank: {
      path: Routes.FinanceReApplyVerification,
    },
    missingBank: {
      path: Routes.ReApplyMissingBankAccount,
    },
    address: {
      path: Routes.AddressReApplyVerification,
    },
  },

  [Routes.FinanceReApplyVerification]: {
    address: {
      path: Routes.AddressReApplyVerification,
    },
    update: {
      path: Routes.ReApplyUpdateBankInformation,
    },
  },

  [Routes.AddressReApplyVerification]: {
    identity: {
      path: Routes.ReApplyIdentity,
    },
    disclosures: {
      path: Routes.ReviewDisclosures,
    },
    update: {
      path: Routes.ReApplyAddress,
    },
  },

  // Re Finance Routes
  [Routes.ReFinanceEmployeeInformation]: {
    jobStatus: {
      path: Routes.ReFinanceJobStatus,
    },
    bank: {
      path: Routes.ReFinanceBankVerification,
    },
    address: {
      path: Routes.ReFinanceAddressVerification,
    },
    missingbank: {
      path: Routes.RefinanceMissingBank,
    },
  },

  [Routes.ReFinanceBankVerification]: {
    address: {
      path: Routes.ReFinanceAddressVerification,
    },
    update: {
      path: Routes.ReFinanceUpdateBankInformation,
    },
  },

  [Routes.ReFinanceAddressVerification]: {
    identity: {
      path: Routes.ReFinanceIdentity,
    },
    disclosures: {
      path: Routes.ReFinanceReviewDisclosures,
    },
    update: {
      path: Routes.ReFinanceAddress,
    },
  },

  [Routes.ReFinanceJobStatus]: {
    employed: {
      path: Routes.ReFinanceEmployerInformation,
      query: {
        jobStatus: queries[Routes.ReFinanceJobStatus].employed,
      },
    },
    selfEmployed: {
      path: Routes.ReFinancePaymentFrequency,
      query: {
        jobStatus: queries[Routes.ReFinanceJobStatus].selfEmployed,
      },
    },
    retired: {
      path: Routes.ReFinancePaymentFrequency,
      query: {
        jobStatus: queries[Routes.ReFinanceJobStatus].retired,
      },
    },
  },

  [Routes.ReFinanceEmployerInformation]: {
    jobStatus: {
      path: Routes.ReFinanceJobStatus,
    },
    employerName: {
      path: Routes.ReFinancePaymentFrequency,
      query: {
        jobStatus: queries[Routes.ReFinanceJobStatus].employed,
      },
    },
  },

  [Routes.ReFinancePaymentFrequency]: {
    regular: {
      path: Routes.ReFinancePaymentPeriod,
      query: {
        jobStatus: queries[Routes.ReFinanceJobStatus].employed,
      },
    },
    selfEmployed: {
      path: Routes.ReFinancePaymentPeriod,
      query: {
        jobStatus: queries[Routes.ReFinanceJobStatus].selfEmployed,
      },
    },
    nonRegularSelfEmployed: {
      path: Routes.ReFinanceIncomeInformation,
      query: {
        nonRegular: queries[Routes.ReFinancePaymentFrequency].nonRegular,
        jobStatus: queries[Routes.ReFinanceJobStatus].selfEmployed,
      },
    },
    nonRegular: {
      path: Routes.ReFinanceIncomeInformation,
      query: {
        nonRegular: queries[Routes.ReFinancePaymentFrequency].nonRegular,
      },
    },
    retired: {
      path: Routes.ReFinancePaymentPeriod,
      query: {
        jobStatus: queries[Routes.ReFinanceJobStatus].retired,
      },
    },
  },

  [Routes.ReFinancePaymentPeriod]: {
    employed: {
      path: Routes.ReFinanceIncomeInformation,
      query: {
        jobStatus: queries[Routes.ReFinanceJobStatus].employed,
      },
    },
    selfEmployed: {
      path: Routes.ReFinanceIncomeInformation,
      query: {
        jobStatus: queries[Routes.ReFinanceJobStatus].selfEmployed,
      },
    },
    selfEmployedNonRegular: {
      path: Routes.ReFinanceIncomeInformation,
      query: {
        jobStatus: queries[Routes.ReFinanceJobStatus].selfEmployed,
        paymentFrequency: queries[Routes.ReFinancePaymentFrequency].nonRegular,
      },
    },
    retired: {
      path: Routes.ReFinanceIncomeInformation,
      query: {
        jobStatus: queries[Routes.ReFinanceJobStatus].retired,
      },
    },
  },

  [Routes.ReFinancePaymentType]: {
    summary: {
      path: Routes.ReFinanceEmployeeInformation,
    },
    jobStatus: {
      path: Routes.ReFinanceJobStatus,
    },
  },

  [Routes.ReFinanceIncomeInformation]: {
    income: {
      path: Routes.ReFinancePaymentType,
    },
  },

  // Manage Employment Routes
  [Routes.ManageEmployment]: {
    jobStatus: {
      path: Routes.ManageEmploymentJobStatus,
    },
  },

  [Routes.ManageEmploymentJobStatus]: {
    employed: {
      path: Routes.ManageEmploymentEmployerInformation,
      query: {
        jobStatus: queries[Routes.ManageEmploymentJobStatus].employed,
      },
    },
    selfEmployed: {
      path: Routes.ManageEmploymentPaymentFrequency,
      query: {
        jobStatus: queries[Routes.ManageEmploymentJobStatus].selfEmployed,
      },
    },
    retired: {
      path: Routes.ManageEmploymentPaymentFrequency,
      query: {
        jobStatus: queries[Routes.ManageEmploymentJobStatus].retired,
      },
    },
  },
  [Routes.ManageEmploymentEmployerInformation]: {
    jobStatus: {
      path: Routes.ManageEmploymentJobStatus,
    },
    employerName: {
      path: Routes.ManageEmploymentPaymentFrequency,
      query: {
        jobStatus: queries[Routes.ManageEmploymentJobStatus].employed,
      },
    },
  },
  [Routes.ManageEmploymentPaymentFrequency]: {
    regular: {
      path: Routes.ManageEmploymentPaymentPeriod,
      query: {
        jobStatus: queries[Routes.ManageEmploymentJobStatus].employed,
      },
    },
    selfEmployed: {
      path: Routes.ManageEmploymentPaymentPeriod,
      query: {
        jobStatus: queries[Routes.ManageEmploymentJobStatus].selfEmployed,
      },
    },
    nonRegularSelfEmployed: {
      path: Routes.ManageEmploymentIncomeInformation,
      query: {
        nonRegular: queries[Routes.ManageEmploymentPaymentFrequency].nonRegular,
        jobStatus: queries[Routes.ManageEmploymentJobStatus].selfEmployed,
      },
    },
    nonRegular: {
      path: Routes.ManageEmploymentIncomeInformation,
      query: {
        nonRegular: queries[Routes.ManageEmploymentPaymentFrequency].nonRegular,
      },
    },
    retired: {
      path: Routes.ManageEmploymentPaymentPeriod,
      query: {
        jobStatus: queries[Routes.ManageEmploymentJobStatus].retired,
      },
    },
  },
  [Routes.ManageEmploymentPaymentPeriod]: {
    employed: {
      path: Routes.ManageEmploymentIncomeInformation,
      query: {
        jobStatus: queries[Routes.ManageEmploymentJobStatus].employed,
      },
    },
    selfEmployed: {
      path: Routes.ManageEmploymentIncomeInformation,
      query: {
        jobStatus: queries[Routes.ManageEmploymentJobStatus].selfEmployed,
      },
    },
    selfEmployedNonRegular: {
      path: Routes.ManageEmploymentIncomeInformation,
      query: {
        jobStatus: queries[Routes.ManageEmploymentJobStatus].selfEmployed,
        paymentFrequency:
          queries[Routes.ManageEmploymentPaymentFrequency].nonRegular,
      },
    },
    retired: {
      path: Routes.ManageEmploymentIncomeInformation,
      query: {
        jobStatus: queries[Routes.ManageEmploymentJobStatus].retired,
      },
    },
  },
  [Routes.ManageEmploymentPaymentType]: {
    summary: {
      path: Routes.ManageEmployment,
    },
    jobStatus: {
      path: Routes.ManageEmploymentJobStatus,
    },
  },
  [Routes.ManageEmploymentIncomeInformation]: {
    income: {
      path: Routes.ManageEmploymentPaymentType,
    },
  },
};

export enum FooterCtaRoutes {
  'Contact Us' = Routes.ContactUs,
  'Store Locator' = Routes.StoreLocator,
}
