import { FlowType, useUserData } from '@/composables/useUserData';
import { Routes } from '@/constants/pages';
import { useDebitCardDisbursementFailure } from '@/composables/useDebitCardDisbursementFailure';
import { useErrorMessages } from '@/composables/useErrorMessages';
import { useNotification } from './useNotification';
import { useRouter } from 'vue-router';
import { useSession } from './useSession';
import { useCookie } from '@/utils/cookie';
import { getResourceSetData } from './useContentResourceData';
import { ref } from 'vue';
import useSsnAnother from './useSsnAnother';

export enum ErrorCodes {
  DisbursementFailure = 'DisbursementError',
  RefinanceFailure = 'RefinanceError',
  FundingFailure = 'FundingError',
  EmailAlreadyUsed = 'EmailAlreadyUsed',
  InvalidInputData = 'InvalidInputData',
  SsnAlreadySet = 'SsnAlreadySet',
  SsnAnotherOfflineAccountExists = 'SsnAnotherOfflineAccountExists',
  SsnAnotherOnlineAccountExists = 'SsnAnotherOnlineAccountExists',
  SsnOrDobMismatch = 'SsnOrDobMismatch',
  UnknownError = 'UnknownError',
  PhoneNumberAlreadyOptedIn = 'PhoneNumberAlreadyOptedIn',
}

type ErrorCode = `${ErrorCodes}`;

interface Error {
  data?: {
    errors: {
      code: ErrorCode;
      title: string;
      detail: string;
    }[];
    data: Record<string, string>;
  };
  status: number;
}

export type Context =
  | 'add-debit-card'
  | 'address'
  | 'applicant'
  | 'application-error'
  | 'composite'
  | 'contentful'
  | 'financial'
  | 'gmaps'
  | 'in-store'
  | 'lead-gen'
  | 'okta'
  | 'product'
  | 'session'
  | 'upload-file'
  | 'zipcode'
  | 'bank-connect'
  | 'payment-failed';

  const { value: existingOnlineSsnEmailCookie, set: existingOnlineSsnEmail, delete: deleteCookie } = useCookie('existingOnlineSsnEmail');
  export const useErrorResponse = () => {

  const updateExistingOnlineSsnEmail = (email: string): void => {
    existingOnlineSsnEmail(email);
  };

  return {
    existingOnlineSsnEmail: existingOnlineSsnEmailCookie,
    updateExistingOnlineSsnEmail,
  };
};

const isGeneralErrorModalVisible = ref<any>(false);

const { value: isContactSupportErrorModalVisibleCookie, set: isContactSupportErrorModalVisible } = useCookie('isContactSupportErrorModalVisible');
const { value: isJWTErrorModalVisibleCookie, set: isJWTErrorModalVisible } = useCookie('isJWTErrorModalVisible');
const { value: is504ErrorModalVisibleCookie, set: is504ErrorModalVisible } = useCookie('is504ErrorModalVisible');

export const useErrorModal = () => {


  const showContactSupportErrorModal = (value: boolean): void => {
    isContactSupportErrorModalVisible(value);
  };

  const showJWTErrorModal = (value: boolean): void => {
    isJWTErrorModalVisible(value);
  };

  const showGeneralErrorModal = (value: boolean): void => {
    isGeneralErrorModalVisible.value = value;
  };

  const show504ErrorModal = (value: boolean): void => {
    is504ErrorModalVisible(value);
  };

  return {
    isContactSupportErrorModalVisible: isContactSupportErrorModalVisibleCookie,
    isGeneralErrorModalVisible: isGeneralErrorModalVisible.value,
    isJWTErrorModalVisible: isJWTErrorModalVisibleCookie,
    is504ErrorModalVisible: is504ErrorModalVisibleCookie,
    showContactSupportErrorModal,
    showGeneralErrorModal,
    showJWTErrorModal,
    show504ErrorModal,
  };
};

export const useError = () => {
  const router = useRouter();

  const notification = useNotification();
  let data:any;

  ( async()=>{
    const { data:predata } = await getResourceSetData('login-messages');
    data = predata.value
  } )()


  const handleApplicantError = () => {

    notification.updateMessage(data?.accountCreated?.content);
    router?.push(Routes.Login);
  };

  const handleCompositeError = async (error: Error) => {
    const errorObj:any = error?.data?.errors[0];

    if (errorObj?.code === ErrorCodes.UnknownError) {
      return notification.updateMessage(data?.somethingWrong?.content);
    }

    return notification.updateMessage(errorObj?.detail);
  };

  const handleGeneralError = async (error?: Error, context?: Context) => {

    const { showGeneralErrorModal, showContactSupportErrorModal } = useErrorModal();

    if (context === 'applicant') {
      const { logOut } = useSession();
      showContactSupportErrorModal(true);
      await logOut();
      return;
    }

    showGeneralErrorModal(true);

    return router.push(Routes.Dashboard);
  };

  const handleTimeOutError = (error?: Error, context?: Context) => {
    const { show504ErrorModal } = useErrorModal();

    show504ErrorModal(true);
    return router.push(Routes.Dashboard);
  };
  const handleContentfulError = () => {
    handleGeneralError();
  };
  const handleGmapsError = () => {
    handleGeneralError();
  };
  const handleOktaError = () => {
    notification.updateMessage(data?.somethingWrong?.content);
    router?.push(Routes.Login);
  };

  const handleUnauthorizedError = async () => {
    const { logOut } = useSession();

    notification.updateMessage(data?.sessionExpired?.content);

    await logOut();

    router?.push(Routes.Login);
  };

  const handleConflictError = async (error: Error, _, payload) => {
    const errorObj:any = error?.data;
    const errorCode = errorObj?.errors[0]?.code;

    if (errorCode === ErrorCodes.SsnAnotherOnlineAccountExists) {
      const { updateExistingOnlineSsnEmail } = useErrorResponse();
      const { logOut } = useSession();

      updateExistingOnlineSsnEmail(errorObj?.data?.email);

      return await logOut(Routes.PersonalSsnExistingOnlineAccount);
    }

    if (errorCode === ErrorCodes.SsnAnotherOfflineAccountExists) {
      const { user } = useUserData();
      const { postPersonalSsnMergeAccounts, postFindAndMergeAccounts } = useSsnAnother();
      const { logOut } = useSession();

      if (user?.flow === FlowType.inStore) {
        const response = await postFindAndMergeAccounts(payload);

        if (response) {
          return await logOut(Routes.InStoreAccountFound);
        }
      }

      const response = await postPersonalSsnMergeAccounts();

      if (response) {
        return await logOut(Routes.PersonalSsnExistingOfflineAccount);
      }
    }

    if (errorCode === ErrorCodes.EmailAlreadyUsed) {
      const { errors } = useErrorMessages();
      return errors?.value?.updateEmail;
    }

    if (errorCode === ErrorCodes.PhoneNumberAlreadyOptedIn) {
      return new Error(errorObj?.errors[0].detail);
    }
  };

  const handleFailureError = async (error: Error) => {
    const { updateDisbursementFailureState } =
      useDebitCardDisbursementFailure();
    const errorObj = error?.data;
    const errorCode = errorObj?.errors[0]?.code;
    if (errorCode === ErrorCodes.DisbursementFailure) {
      updateDisbursementFailureState(true);
      
      return router.push(Routes.ReApplyDisbursementFailure);
    } else if (errorCode === ErrorCodes.RefinanceFailure) {
      updateDisbursementFailureState(true);
      return router.push(Routes.LoanOriginationRefinanceFailure);
    } else if (errorCode === ErrorCodes.FundingFailure) {
      updateDisbursementFailureState(true);
      return router.push(Routes.LoanOriginationFundingFailure);
    }
  };

  const handleBankConnectError = () => {
    const { user, updateUser } = useUserData();

    updateUser({
      ...user,
      plaidFailConnectionAttempts:
        (user?.plaidFailConnectionAttempts || 0) + 1,
    });
  };

  const contextTypes = {
    applicant: handleApplicantError,
    composite: handleCompositeError,
    contentful: handleContentfulError,
    gmaps: handleGmapsError,
    okta: handleOktaError,
  };

  const errorStatus = {
    '400': handleFailureError,
    '401': handleUnauthorizedError,
    '403': handleUnauthorizedError,
    '409': handleConflictError,
    '500': handleGeneralError,
    '504': handleTimeOutError,
  };

  const handleError = (
    error: Error,
    context: Context = 'composite',
    payload?: unknown
  ) => {
    const {
      showJWTErrorModal,
      showContactSupportErrorModal,
      show504ErrorModal,
    } = useErrorModal();

    try {
      if (context === 'financial') {
        return error;
      }

      if (context === 'product') {
        show504ErrorModal(true);
        return error;
      }

      if (context === 'in-store') {
        return error;
      }

      if (context === 'zipcode') {
        if (error.status === 504) {
          show504ErrorModal(true);
        }
        return error;
      }

      if (context === 'okta') {
        showContactSupportErrorModal(true);
        return;
      }
      if (context === 'session') {
        showJWTErrorModal(true);
        return;
      }

      if (context === 'upload-file') {
        return error;
      }

      if (context === 'add-debit-card') {
        return error;
      }
      if (context === 'application-error') {
        return error;
      }

      if (context === 'address') {
        return new Error(error?.data?.errors?.[0]?.detail);
      }

      if (context === 'bank-connect') {
        handleBankConnectError();
        return;
      }
      if (context === 'payment-failed') {
        return error;
      }
      if (context === 'lead-gen') {
        return error;
      }

      if (
        [ErrorCodes.SsnOrDobMismatch, ErrorCodes.SsnAlreadySet].includes(
          error?.data?.errors?.[0]?.code
        )
      ) {
        return error;
      }

      if (error?.status) {
        return errorStatus[error.status](error, context, payload);
      }

      // If the error status is not listed above it will be handled by it's context.
      contextTypes[context](error);
    } catch (error) {
      handleGeneralError(error, context);
    }
  };

  return {
    handleError,
  }

};
