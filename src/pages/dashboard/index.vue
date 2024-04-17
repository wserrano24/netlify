<script setup lang="ts">
import { ApplicationSummary, ProductSummary } from '@/constants/product';
import { LoanEligibilityCards } from '@/constants/eligibility-loan-cards';
import useProductStore from '@/stores/useProductStore';
import { useSplitIO } from '@/composables/useSplitIO';
import { TrackGTMEvent } from '@/composables/useGTMtrackEvent';
import { useCacheReset } from '../../composables/useCacheReset';
import { Routes } from '@/constants/pages';
import useUserStore from '@/stores/useUserStore';
import usePersonalInfo from '@/composables/usePersonalInfo';
import useComposite from '@/composables/useComposite';
import { useDomainVariables } from '@/composables/useDomainVariables';
import useAvailLoan from '@/composables/useAvailLoan';
import { useRouter } from 'vue-router';
import { useErrorModal } from '@/composables/useError';
import { useSessionStorage } from '@/composables/useSessionStorage';
import { useHead } from '@unhead/vue';
import { computed, onBeforeMount, onMounted, onUnmounted, reactive, ref, watchEffect } from 'vue';
import { useCookie } from '@/utils/cookie';
import WidgetsGlobalNavigation from '@/widgets/widgets-global-navigation.vue';
import WidgetsCardDashboardCoolOff from '@/widgets/widgets-card-dashboard-cool-off.vue';
import WidgetsCardDashboardAbandonedLoanCard from '@/widgets/widgets-card-dashboard-abandoned-loan-card.vue';
import PollingCard from '@/components/PollingCard.vue';
import WidgetsCardsDashboardLoans from '@/widgets/widgets-cards-dashboard-loans.vue';
import WidgetsCardDashboardLoanNotEligible from '@/widgets/widgets-card-dashboard-loan-not-eligible.vue';
import WidgetsCardDashboardLoanNonServiceableArea from '@/widgets/widgets-card-dashboard-loan-non-serviceable-area.vue';
import WidgetsCardDashboardLoanEligibility from '@/widgets/widgets-card-dashboard-loan-eligibility.vue';
import WidgetsCardDashboardClosedLoanEligibility from '@/widgets/widgets-card-dashboard-closed-loan-eligibility.vue';
import WidgetsCardDashboardUnfinishedApplicationsPreparing from '@/widgets/widgets-card-dashboard-unfinished-applications-preparing.vue';
import WidgetsCardDashboardOpenLoanIncompleteApplication from '@/widgets/widgets-card-dashboard-open-loan-incomplete-application.vue';
import WidgetsCardDashboardCloseLoanIncompleteApplication from '@/widgets/widgets-card-dashboard-close-loan-incomplete-application.vue';
import WidgetsCardDashboardMoneySlider from '@/widgets/widgets-card-dashboard-money-slider.vue';
import WidgetsCardDashboardReferFriend from '@/widgets/widgets-card-dashboard-refer-friend.vue';
import WidgetsModalGeneralError from '@/widgets/widgets-modal-general-error.vue';
import WidgetsModal504Error from '@/widgets/widgets-modal-504-error.vue';
import WidgetsStateUnavailable from '@/widgets/widgets-state-unavailable.vue';
import WidgetsFooterDashboard from '@/widgets/widgets-footer-dashboard.vue';

const {
  
  getAvailLoanData,
  getProductsPolling,
  getActiveProducts,
} = useComposite();
const {getPersonalInfo} = usePersonalInfo()
const env = useDomainVariables();
const { getAvailLoan, setAvailLoanData } = useAvailLoan();
// // const { logRocketIdentify } = useLogRocket();
const { client } = useSplitIO();
const router = useRouter();
const { setUserState, setUserZipcode, setUserPurposeId } = useUserStore();
const { setFirstName, setEsignPendingDetails, getEsignPendingDetails } =
  useProductStore();
const { isGeneralErrorModalVisible, is504ErrorModalVisible } = useErrorModal();
const { setItem } = useSessionStorage();
let pollingInterval;

const prodResponse = ref<ProductSummary[]>();
const appResponse = ref<ApplicationSummary[]>();
const hasEsignPending = ref();
const manualError = ref(false);

// useHead({
//   htmlAttrs: { lang: 'en' },
//   title: 'AA | Dashboard Page',
//   script: [
//     {
//       src: `${env.variables.value.OLA_SEAL_URL}&div=ola-member-seal`,
//       body: true,
//     },
//   ],
// });

// // definePageMeta({
// //   layout: false,
// //   middleware: 'auth',
// // });

const isPolling = reactive({
  progress: 10,
});
const prodTypeCookie = useCookie('productTypeCookie');

const pollingFunction = async () => {
  const pollResponse = await getProductsPolling(
    getEsignPendingDetails.applicationId
  );

  if (pollResponse?.applications?.length < 1 || isPolling.progress === 100) {
    if (isPolling.progress !== 100) {
      isPolling.progress = 100;
    }
    useCacheReset();
    const { products, applications } = await getActiveProducts();
    prodResponse.value = products;
    appResponse.value = applications;
    clearInterval(pollingInterval);
    setTimeout(async () => {
      hasEsignPending.value = false;
      prodTypeCookie.value = 'none';
      setEsignPendingDetails(false, '', '');
    }, 3000);
  } else if (pollResponse.applications[0].state === 'PENDING_ESIGN') {
    hasEsignPending.value = true;
    isPolling.progress += 10;
  } else {
    useCacheReset();
    const progressInterval = setInterval(() => {
      isPolling.progress += 20;
    }, 750);
    if (isPolling.progress >= 100) {
      clearInterval(progressInterval);
    }
    const { products, applications } = await getActiveProducts();
    prodResponse.value = products;
    appResponse.value = applications;
    clearInterval(pollingInterval);
    setTimeout(() => {
      hasEsignPending.value = false;
      prodTypeCookie.value = 'none';
      setEsignPendingDetails(false, '', '');
      clearInterval(progressInterval);
    }, 3000);
  }
};

const comingSoon = ref(false);

onBeforeMount(async () => {
  const { clearHasReviewedDisclosures } = useProductStore();
  const { setItem } = useSessionStorage();
  clearHasReviewedDisclosures();
  setItem('hasReviewedDisclosures', false);

  let data;
  client.on(client.Event.SDK_READY, async () => {
    const validStates = JSON.parse(
      client.getTreatmentsWithConfig(['PWA_STATE_ALLOWED']).PWA_STATE_ALLOWED
        .config
    ).states;
    const { firstName, homeAddress } = await getPersonalInfo();
    const userState = homeAddress.stateCode || undefined;
    // Set store values as encoded cookies
    setUserState(userState);
    setItem('firstName', firstName);
    setUserZipcode(homeAddress?.zipCode);
    setUserPurposeId(homeAddress?.purposeId);
    setItem('userInfoGTM', {
      purposeId: homeAddress?.purposeId,
      state: userState,
      zipcode: homeAddress?.zipCode,
    });
    setItem('user-state', userState);
    setItem('manage-debit-back-route', null);
    setFirstName(firstName);

    if (validStates.includes(userState) || validStates.includes('*')) {
      data = await getAvailLoanData();
      setAvailLoanData(data);
    } else {
      redirectToLegacy();
    }
  });
  // logRocketIdentify();
});

onMounted(async () => {
  hasEsignPending.value = getEsignPendingDetails.hasBeenEsigned ? true : false;
  if (hasEsignPending.value) {
    console.log("am i polling?")
    useCacheReset();
    pollingInterval = await setInterval(pollingFunction, 3000);
  } else {
    useCacheReset();
    const newResponse = await getActiveProducts();
    if (newResponse === null || newResponse === undefined) {
      manualError.value = true;
      return;
    }
    prodResponse.value = newResponse?.products;
    appResponse.value = [...newResponse?.applications];
    if (newResponse?.applications[0].leadLandingUrl) {
      router.push(newResponse.applications[0].leadLandingUrl)//, { external: true })
    }
  }
  window.scrollTo({ top: 0, left: 0 });
});

onUnmounted(() => {
  clearInterval(pollingInterval);
  pollingInterval = null;
});

const redirectToLegacy = () => {
  comingSoon.value = true;
  setTimeout(() => {
    // navigateTo(`https://www.advanceamerica.net/`, { external: true });
    router.push(`https://www.advanceamerica.net/`)//, { external: true });
  }, 4000);
};

setTimeout(() => {
  const productType = useCookie('productTypeCookie');
  productType.value = 'none';
  const disbursementMethodCookie = useCookie('disbursementMethod');
  disbursementMethodCookie.value = 'none';
}, 4000);

const showLoanCard = computed(() => getAvailLoan.value?.data?.showCard);
const isInCoolOff = computed(() => getAvailLoan.value?.data?.isCoolOff);
const render = ref(false);
watchEffect(() => {
  if (
    prodResponse.value ||
    appResponse.value ||
    hasEsignPending.value ||
    is504ErrorModalVisible?.value ||
    isGeneralErrorModalVisible.value ||
    manualError.value
  ) {
    render.value = true;
  } else if(render.value !== true) {
    render.value = false;
  }
});
</script>

<template>
  <!-- for whatever reason this v-if needs to wrap everything or the payment page won't load?!
  TODO: look into why that is. -->
  <section v-if="render">
  <WidgetsGlobalNavigation />
  <main class="theme-dashboard">
    <div class="container">
      <div class="row">
        <div class="col-12 col-lg-5 offset-lg-1">
            <div v-if="isInCoolOff">
              <WidgetsCardDashboardCoolOff />
            </div>
            <div v-if="!hasEsignPending">
              <WidgetsCardDashboardAbandonedLoanCard
                :applications="appResponse"
              />
            </div>
            <PollingCard
              v-if="hasEsignPending"
              :progress="isPolling.progress"
            />
            <div v-if="!hasEsignPending">
              <WidgetsCardsDashboardLoans
                :has-esign-pending="hasEsignPending"
                :products="prodResponse"
                :applications="appResponse"
              />
              <WidgetsCardDashboardLoanNotEligible
                v-if="
                  showLoanCard === LoanEligibilityCards.CANT_ASSIST &&
                  isInCoolOff === false
                "
              />
              <WidgetsCardDashboardLoanNonServiceableArea
                v-else-if="showLoanCard === LoanEligibilityCards.NO_SERVICE"
              />
              <WidgetsCardDashboardLoanEligibility
                v-else-if="showLoanCard === LoanEligibilityCards.OPEN"
              />
              <WidgetsCardDashboardClosedLoanEligibility
                v-else-if="showLoanCard === LoanEligibilityCards.CLOSED"
              />
              <WidgetsCardDashboardUnfinishedApplicationsPreparing />
              <WidgetsCardDashboardOpenLoanIncompleteApplication />
              <WidgetsCardDashboardCloseLoanIncompleteApplication />
            </div>
          </div>
          <div class="col-12 col-lg-5">
            <WidgetsCardDashboardMoneySlider />
            <WidgetsCardDashboardReferFriend />
          </div>
        </div>
      </div>
      <WidgetsModalGeneralError :show-me="manualError" />
      <WidgetsModal504Error />
      <WidgetsStateUnavailable :unavailable="comingSoon" />
    </main>
    <WidgetsFooterDashboard />
  </section>
</template>
