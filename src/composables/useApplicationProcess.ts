import { INACTIVE_APPLICATION_STATE } from '@/constants/application-state';
import { LastPage } from '@/constants/origination-pages';
import { Routes } from '@/constants/pages';
import { isJsonString } from '@/utils/isJsonString';
import { computed, ref } from 'vue';
import useGetApplicationProccess from './useGetApplicationProccess';

export interface Application {
  applicationId?: string;
  data?: unknown;
  exitReason?: string;
  isSaveAndExit?: boolean;
  page?: string;
  query?: string;
  lastPage: LastPage;
}

const INITIAL_STATE: Application = {
  applicationId: '',
  data: {},
  exitReason: '',
  isSaveAndExit: false,
  page: '',
  query: '',
  lastPage: LastPage.start,
};

export const useApplicationProcess = () => {
  const {
    postApplication,
    putApplication,
    getApplicationData,
    getActiveProducts,
  } = useGetApplicationProccess();

  const application = ref<any>(INITIAL_STATE);

  const setApplicationState = (payload?: Application): void => {
    application.value = { ...application.value, ...payload };
  };

  const createApplication = async ({
    data = {},
    exitReason = '',
    page = '',
    query = '',
  }: Application): Promise<Application['applicationId']> => {
    const payload = {
      data,
      exitReason,
      page,
      query,
    };

    const response = (await postApplication({
      lastApplicationPage: JSON.stringify(payload),
    })) as { data: { applicationId: string } };

    if (response) {
      const applicationId = response?.data?.applicationId;

      setApplicationState({ ...payload, applicationId });

      return applicationId;
    }
  };

  const getApplicationId = async (
    conditionalBool?: boolean
  ): Promise<Application['applicationId']> => {
    // NOTE: Try to get the id from the state/memory.
    const { applicationId } = await getApplicationData();
    if (application.value.applicationId) {
      return application.value.applicationId;
    }
    // NOTE: Otherwise get the id from the get application composite.
    else if (applicationId) {
      setApplicationState({ applicationId });
      return applicationId;
    } else if (conditionalBool) {
      return '';
    } else {
      // NOTE: Finally get the id from the post application composite.
      const newApplicationId = await createApplication({});
      return newApplicationId;
    }
  };

  const getApplicationIdWithoutCreatingBlank = async (): Promise<
    Application['applicationId']
  > => {
    // NOTE: Try to get the id from the state/memory.
    if (application.value.applicationId) {
      return application.value.applicationId;
    }

    // NOTE: Otherwise get the id from the get application composite.
    const { applicationId } = await getApplicationData();
    if (applicationId) {
      setApplicationState({ applicationId });

      return applicationId;
    }

    return null;
  };

  const updateApplicationProcess = async ({
    data = application.value.data || {},
    exitReason = '',
    page = application.value.page || '',
    query = application.value.query || '',
    isSaveAndExit = false,
  }: Partial<Application>): Promise<void> => {
    const applicationId = await getApplicationId();

    const payload = {
      data,
      exitReason,
      isSaveAndExit,
      page,
      query,
    };

    await putApplication(applicationId, {
      exitReason,
      lastApplicationPage: JSON.stringify(payload),
    });

    setApplicationState({ ...payload, applicationId });
  };

  const getLastApplicationPageURL = (lastApplicationPage?: string) => {
    if (!lastApplicationPage) return null;

    if (lastApplicationPage !== '' && isJsonString(lastApplicationPage)) {
      const parsedApplicationPage = JSON.parse(lastApplicationPage);

      const page = parsedApplicationPage?.page || '';
      const query = parsedApplicationPage?.query || '';
      const baseUrl = Routes[page] || Routes.PersonalInformation;

      return baseUrl + (query ? `?${query}` : '');
    } else {
      return lastApplicationPage;
    }
  };

  const getApplicationStatus = async () => {
    const activeProducts = await getActiveProducts();
    const allApplications = await getApplicationData(false);

    const firstActiveApplicationObject =
      activeProducts === undefined ? null : activeProducts?.applications[0];

    const lastApplication =
      activeProducts?.applications[activeProducts?.applications?.length - 1];

    const lastApplicationState = lastApplication?.state;

    const lastApplicationPageURL = getLastApplicationPageURL(
      lastApplication?.lastApplicationPage
    );

    const isApplicationStatePendingESign =
      lastApplicationState === INACTIVE_APPLICATION_STATE.PENDING_ESIGN;

    const isApplicationSubStatusConfirmOfferRequired =
      lastApplication?.subStatus === 'confirmOfferRequired';

    const isApplicationStatePreparing =
      lastApplicationState === INACTIVE_APPLICATION_STATE.PREPARING;

    const hasActiveProducts = Boolean(activeProducts?.products?.length > 0);

    const showUnfinishedApplication =
      isApplicationStatePreparing && !hasActiveProducts;
    // && !activeProducts.products.find((product) => product.productId == lastApplication.refinance.originalProductId)

    const showOpenLoanCard =
      isApplicationSubStatusConfirmOfferRequired &&
      isApplicationStatePendingESign &&
      hasActiveProducts &&
      !lastApplication.isRefinanceApp;
    // && !activeProducts?.products?.find((product) => product.productId == lastApplication.refinance.originalProductId)

    const showCloseLoanCard =
      isApplicationSubStatusConfirmOfferRequired &&
      isApplicationStatePendingESign &&
      !hasActiveProducts;

    const showAbandonedLoanCard =
      !showUnfinishedApplication && !showOpenLoanCard && !showCloseLoanCard;

    //TODO: add routing to confirm if user is refinance user or not to seperate routing for refinance flow.
    const isRefinance = null;

    // If user has more than 2 loans then this is reapply User
    // if the last application page gives us a reapply url, then automatically set reapply to true regardless of applications list DE8455 FIX
    const isReapplyUser =
      lastApplicationPageURL?.split('/')[2] === 'reapply'
        ? true
        : allApplications?.applicationList?.length >= 2;

    const isUserPendingEsign = () => {
      return isApplicationStatePendingESign;
    };

    const nextRedirectUrl = () => {
      if (isApplicationStatePreparing && lastApplicationPageURL) {
        return lastApplicationPageURL;
      }

      switch (getLastPage()) {
        case LastPage.start:
          // If user already started the process and logged out, this skips the disclosures pages.
          if (isApplicationStatePendingESign) {
            putLastPage(LastPage.offer);
            if (isReapplyUser) return Routes.LoanOriginationReapplyOffers;
          }
          return isReapplyUser
            ? Routes.LoanOriginationReapplyHowItWorks
            : Routes.LoanOriginationOffers;
        case LastPage.offer:
          if (isRefinance) {
            return Routes.LoanOriginationRefinanceOffers;
          }
          return isReapplyUser
            ? Routes.LoanOriginationReapplyOffers
            : Routes.LoanOriginationOffers;
        case LastPage.disbursement:
          return isReapplyUser
            ? Routes.LoanOriginationReapplyOffers
            : Routes.LoanOriginationOffers;
        case LastPage.repay:
          return isReapplyUser
            ? Routes.LoanOriginationReapplyOffers
            : Routes.LoanOriginationOffers;
        case LastPage.esign:
          return isReapplyUser
            ? Routes.LoanOriginationReapplyOffers
            : Routes.LoanOriginationOffers;
      }
    };

    return {
      isShowUnfinishedApplicationCard: computed(() => showUnfinishedApplication)
        ?.value,
      isShowOpenLoanCard: computed(() => showOpenLoanCard)?.value,
      isShowCloseLoanCard: computed(() => showCloseLoanCard)?.value,
      isShowAbandonedLoanCard: computed(() => showAbandonedLoanCard)?.value,
      nextRedirectUrl,
      lastApplicationState,
      firstActiveApplicationObject,
      isReapplyUser,
      isUserPendingEsign,
    };
  };

  const putLastPage = (page: LastPage) => {
    INITIAL_STATE.lastPage = page;
    return;
  };

  const getLastPage = () => {
    return INITIAL_STATE.lastPage;
  };

  return {
    createApplication,
    getApplication: computed(() => application.value),
    getApplicationId,
    getApplicationIdWithoutCreatingBlank,
    setApplicationState,
    updateApplicationProcess,
    getApplicationStatus,
    putLastPage,
    getLastPage,
  };
};
