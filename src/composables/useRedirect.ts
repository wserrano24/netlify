// Perform the conditions for the programmatic navigation
import {
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
} from '@/constants/income-routes';
import { Routes, navigationSchemas, queries } from '@/constants/pages';
import { useRouter } from 'vue-router';

export default () => {

  const router = useRouter();

  function getFinancialBankInformationRedirect() {
    return router.push(
      navigationSchemas[Routes.FinancialBankInformation].bankInfo
    );
  }

  // TODO: Add names for the inputs in order avoid order change issues
  function getFinancialJobStatusRedirect(input) {
    if (input.value === input.options[0]) {
      return router.push(navigationSchemas[Routes.FinancialJobStatus].employed);
    }
    if (input.value === input.options[1]) {
      return router.push(
        navigationSchemas[Routes.FinancialJobStatus].selfEmployed
      );
    }
    if (input.value === input.options[2]) {
      return router.push(navigationSchemas[Routes.FinancialJobStatus].retired);
    }
  }

  function getFinancialEmployerInformationRedirect() {
    return router.push(
      navigationSchemas[Routes.FinancialEmployerInformation].employerName
    );
  }

  function getFinancialPaymentFrequencyRedirect(...args) {
    const input = args[0];

    // Employed
    if (args[1] === queries[Routes.FinancialJobStatus].employed) {
      return router.push(
        navigationSchemas[Routes.FinancialPaymentFrequency].regular
      );
    }

    // Self employed + non regular payment
    if (
      input.value === input.options[4] &&
      args[1] === queries[Routes.FinancialJobStatus].selfEmployed
    ) {
      return router.push(
        navigationSchemas[Routes.FinancialPaymentFrequency]
          .nonRegularSelfEmployed
      );
    }

    // Self employed
    if (args[1] === queries[Routes.FinancialJobStatus].selfEmployed) {
      return router.push(
        navigationSchemas[Routes.FinancialPaymentFrequency].selfEmployed
      );
    }

    // Receive assistance
    return router.push(
      navigationSchemas[Routes.FinancialPaymentFrequency].retired
    );
  }

  function getFinancialIncomeInformationRedirect() {
    return router.push(
      navigationSchemas[Routes.FinancialIncomeInformation].income
    );
  }

  function getFinancialPaymentPeriodRedirect(...args) {
    // Self employed and + non regular
    if (
      args[0] === queries[Routes.FinancialJobStatus].selfEmployed &&
      args[1] === queries[Routes.FinancialPaymentFrequency].nonRegular
    ) {
      return router.push(
        navigationSchemas[Routes.FinancialPaymentPeriod].selfEmployedNonRegular
      );
    }

    // Self employed
    if (args[0] === queries[Routes.FinancialJobStatus].selfEmployed) {
      return router.push(
        navigationSchemas[Routes.FinancialPaymentPeriod].selfEmployed
      );
    }

    // Employed
    if (args[0] === queries[Routes.FinancialJobStatus].employed) {
      return router.push(
        navigationSchemas[Routes.FinancialPaymentPeriod].employed
      );
    }

    // Receive assistance
    return router.push(navigationSchemas[Routes.FinancialPaymentPeriod].retired);
  }

  function getFinancialPaymentTypeRedirect() {
    return router.push(navigationSchemas[Routes.FinancialPaymentType].summary);
  }

  function getFinancialSummaryRedirect() {
    return router.push(navigationSchemas[Routes.FinancialSummary].jobStatus);
  }

  //  Re-Apply, Re-Finance & Manage Employment Redirect
  function getBankInformationRedirect(currentPathname, data) {
    let route;
    // First step check if bank account is exist or not, based on that redirect to missing account page
    if (!data?.isBankAccountExist) {
      route =
        navigationSchemas[EmployeeIncomeVerificationRoutes[currentPathname]]
          ?.missingBank.path;
      return router.push(route);
    }
    // Second step check if user can update bank account redirect to bank info page otherwise to address info page
    if (data?.canUpdate) {
      route =
        navigationSchemas[EmployeeIncomeVerificationRoutes[currentPathname]]
          ?.bank.path;
      return router.push(route);
    } else {
      route =
        navigationSchemas[EmployeeIncomeVerificationRoutes[currentPathname]]
          ?.address.path;
      return router.push(route);
    }
  }

  function getAddressInformationRedirect(currentPathname) {
    return router.push(
      navigationSchemas[AddressVerificationRoutes[currentPathname]]?.address
    );
  }

  function getIdentityInformationRedirect(currentPathname) {
    return router.push(
      navigationSchemas[AddressProceedVerificationRoutes[currentPathname]]
        ?.identity
    );
  }

  function getDisclosuresRedirect(currentPathname) {
    return router.push(
      navigationSchemas[AddressProceedVerificationRoutes[currentPathname]]
        ?.disclosures
    );
  }

  function getBankUpdateInformationRedirect(currentPathname) {
    return router.push(
      navigationSchemas[AddressVerificationRoutes[currentPathname]]?.update
    );
  }

  function getAddAnotherIncomeRedirect(currentPathname) {
    return router.push(
      navigationSchemas[EmployeeIncomeVerificationRoutes[currentPathname]]
        ?.jobStatus
    );
  }

  function getAddressUpdateInformationRedirect(currentPathname) {
    return router.push(
      navigationSchemas[AddressProceedVerificationRoutes[currentPathname]]
        ?.update
    );
  }

  function getJobStatusRedirect(input, currentPathname) {
    if (input.value === input.options[0]) {
      return router.push(
        navigationSchemas[JobStatusRoutes[currentPathname]]?.employed
      );
    }
    if (input.value === input.options[1]) {
      return router.push(
        navigationSchemas[JobStatusRoutes[currentPathname]]?.selfEmployed
      );
    }
    if (input.value === input.options[2]) {
      return router.push(
        navigationSchemas[JobStatusRoutes[currentPathname]]?.retired
      );
    }
  }

  function getEmployerInformationRedirect(currentPathname) {
    return router.push(
      navigationSchemas[EmployerInformationRoutes[currentPathname]]
        ?.employerName
    );
  }

  function getPaymentFrequencyRedirect(...args) {
    const input = args[0];
    const currentPathname = args[2];
    // Employed
    if (args[1] === queries[JobStatusRoutes[currentPathname]]?.employed) {
      return router.push(
        navigationSchemas[PaymentFrequencyRoutes[currentPathname]]?.regular
      );
    }

    // Self employed + non regular payment
    if (
      input.value === input.options[4] &&
      args[1] === queries[JobStatusRoutes[currentPathname]]?.selfEmployed
    ) {
      return router.push(
        navigationSchemas[PaymentFrequencyRoutes[currentPathname]]
          ?.nonRegularSelfEmployed
      );
    }

    // Self employed
    if (args[1] === queries[JobStatusRoutes[currentPathname]]?.selfEmployed) {
      return router.push(
        navigationSchemas[PaymentFrequencyRoutes[currentPathname]]?.selfEmployed
      );
    }

    // Receive assistance
    return router.push(
      navigationSchemas[PaymentFrequencyRoutes[currentPathname]]?.retired
    );
  }

  function getPaymentPeriodRedirect(...args) {
    const currentPathname = args[2];
    // Self employed and + non regular
    if (
      args[0] === queries[JobStatusRoutes[currentPathname]]?.selfEmployed &&
      args[1] === queries[PaymentFrequencyRoutes[currentPathname]]?.nonRegular
    ) {
      return router.push(
        navigationSchemas[PaymentPeriodRedirectRoutes[currentPathname]]
          ?.selfEmployedNonRegular
      );
    }

    // Self employed
    if (args[0] === queries[JobStatusRoutes[currentPathname]]?.selfEmployed) {
      return router.push(
        navigationSchemas[PaymentPeriodRedirectRoutes[currentPathname]]
          ?.selfEmployed
      );
    }

    // Employed
    if (args[0] === queries[JobStatusRoutes[currentPathname]]?.employed) {
      return router.push(
        navigationSchemas[PaymentPeriodRedirectRoutes[currentPathname]]
          ?.employed
      );
    }

    // Receive assistance
    return router.push(
      navigationSchemas[PaymentPeriodRedirectRoutes[currentPathname]]?.retired
    );
  }

  function getPaymentTypeRedirect(currentPathname) {
    return router.push(
      navigationSchemas[PaymentTypeRoutes[currentPathname]]?.summary
    );
  }

  function getIncomeInformationRedirect(currentPathname) {
    return router.push(
      navigationSchemas[IncomeInformationRoutes[currentPathname]]?.income
    );
  }

  function getAddAnotherSourceOfIncomeRedirect(currentPathname) {
    return router.push(
      navigationSchemas[AddAnotherSourceOfIncomeRoutes[currentPathname]]
        ?.jobStatus
    );
  }

  return {
    getFinancialBankInformationRedirect,
    getAddAnotherSourceOfIncomeRedirect,
    getAddressInformationRedirect,
    getAddressUpdateInformationRedirect,
    getBankInformationRedirect,
    getBankUpdateInformationRedirect,
    getDisclosuresRedirect,
    getFinancialEmployerInformationRedirect,
    getFinancialIncomeInformationRedirect,
    getFinancialJobStatusRedirect,
    getFinancialPaymentFrequencyRedirect,
    getFinancialPaymentPeriodRedirect,
    getFinancialPaymentTypeRedirect,
    getFinancialSummaryRedirect,
    getIdentityInformationRedirect,
    getPaymentTypeRedirect,
    getEmployerInformationRedirect,
    getJobStatusRedirect,
    getPaymentFrequencyRedirect,
    getPaymentPeriodRedirect,
    getAddAnotherIncomeRedirect,
    getIncomeInformationRedirect,
  };
};
