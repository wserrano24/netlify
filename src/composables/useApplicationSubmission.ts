import { Routes } from '@/constants/pages';
import { useRouter } from 'vue-router';
import { usePage } from './usePage';
import { useCookie } from '@/utils/cookie';
const router = useRouter();
export enum ConditionalFlowInitiator {
  DASHBOARD = 'dashboard',
  FLOW_LOAN_APPLICATION = 'loan-application',
  FLOW_RE_APPLY_LOAN_APPLICATION = 're-apply-loan-application',
  FLOW_IN_STORE_LOAN_APPLICATION = 'in-store-loan-application',
  FLOW_REFINANCE_LOAN_APPLICATION = 'refinance-loan-application',
  FLOW_LEAD_GEN = 'lead-gen',
}

const ConditionalFlowInitiatorRouteMap:any = {
  [ConditionalFlowInitiator.FLOW_LOAN_APPLICATION]: Routes.LoanOriginationEsign,
  [ConditionalFlowInitiator.FLOW_RE_APPLY_LOAN_APPLICATION]:
    Routes.LoanOriginationReapplyEsign,
  [ConditionalFlowInitiator.FLOW_IN_STORE_LOAN_APPLICATION]:
    Routes.LoanOriginationInStoreEsign,
  [ConditionalFlowInitiator.FLOW_REFINANCE_LOAN_APPLICATION]:
    Routes.LoanOriginationRefinanceEsign,
  [ConditionalFlowInitiator.FLOW_LEAD_GEN]: Routes.LeadGenEsign,
};

export const useApplicationSubmission = () => {

  const { value: submissionDataCookie, set: submissionData } = useCookie('submissionData');


  const updateSubmissionData = (response:any): void => {
    submissionData(JSON.stringify(response?.data));
  };

  const submissionRedirection = (): void => {
    const { isApproved, isDenied } = JSON.parse( submissionDataCookie);
    

    if (isApproved) {
      router.push(Routes.LoanOriginationOffers);
    }

    if (isDenied) {
      router.push(Routes.LoanDenied);
    }
  };

  const getConditionalFlowRoute = () => {
    const flow = getFlowFromUrlQueryParam();
    
    return ConditionalFlowInitiatorRouteMap[flow] || Routes.Dashboard;
  };

  const getFlowFromUrlQueryParam = (): '' | ConditionalFlowInitiator => {
    const { getQueryString } = usePage();
    const flow = getQueryString('flow') as ConditionalFlowInitiator;

    return Object.values(ConditionalFlowInitiator).includes(flow) ? flow : '';
  };

  
  const isSkipAndContinue = () => {
    const { getQueryString } = usePage();
    const isSkipAndContinue = getQueryString('isSkipAndContinue') as string;
    return Boolean(isSkipAndContinue);
  };

  return {
    getConditionalFlowRoute,
    getFlowFromUrlQueryParam,
    isSkipAndContinue,
    submissionData: JSON.parse(submissionDataCookie),
    submissionRedirection,
    updateSubmissionData,
  };
};
