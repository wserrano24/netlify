<script setup lang="ts">
import {
  ApplicationSummary,
  ProductSummary,
  ProductType,
} from '@/constants/product';
import { Routes } from '@/constants/pages';
import { currency, currencyFormatting } from '@/constants/masks';
import { IconNames } from '@/constants/icons';
import { LoanTrackerResponse } from '@/types/loan-tracker';
import { compareDateWithCurrentDate } from '@/composables/schemas/useDate';
import { formatDate } from '@/composables/schemas/useDate';
// import { getWithDashLowercaseString } from '@/utils/strings';
import useProductStore from '@/stores/useProductStore';
// import { ApplicationDescription } from '~~/.nuxt/components';
import { TrackGTMEvent } from '../../composables/useGTMtrackEvent';
import { useSessionStorage } from '@/composables/useSessionStorage';
import useContentful from '@/composables/useContentful';
import useCtaRoute from '@/composables/useCtaRoute';
import useComposite from '@/composables/useComposite';
import { computed, onBeforeMount, ref } from 'vue';
import LoanCard from '@/components/LoanCard.vue';
import BaseSkeletonLoader from '@/components/base/BaseSkeletonLoader.vue';
import ScheduledPaymentBanner from '@/components/ScheduledPaymentBanner.vue';
import LoanTrackerBanner from '@/components/LoanTrackerBanner.vue';
import BaseLoanTracker from '@/components/base/BaseLoanTracker.vue';
import BaseBanner from '@/components/base/BaseBanner.vue';
import WidgetsBannerDashboard from '../widgets-banner-dashboard.vue';

const { setItem, removeItem } = useSessionStorage();
const { setProduct } = useProductStore();

const props = defineProps<{
  product: ProductSummary;
  application: ApplicationSummary;
}>();

const {
  getLoanDetailsSummaryCardData,
  getAlertBannerData,
  getCtaData
} = useContentful();
const { data: loanCardData, pending: loanCardDataPending } =
  getLoanDetailsSummaryCardData('widget-loan-summary-card-payday');
const { data, pending } = getAlertBannerData(
  'widget-alert-banner-dashboard-payday-extended-payment-plan'
);
const { data: refinanceData, pending: refinancePending } = getCtaData(
  'widget-cta-product-details'
);

const link = {
  label: 'E-sign now',
  url: '/loan-summary',
};
const { mapCtaRoutes } = useCtaRoute();
const { getLoanTracker } = useComposite();

const loanTrackerDetails = ref<LoanTrackerResponse>(null);
const availableCredit = ref();
const creditLimit = ref();
const showDrawButton = ref(false);
const isOnline = computed (() => props?.product?.channelCode === "ONLINE")

onBeforeMount(async () => {
  loanTrackerDetails.value = await getLoanTracker(props.product?.productId);
  availableCredit.value = props?.product?.availableCredit;
  creditLimit.value = props?.product?.creditLimit ||'--';
  showDrawButton.value =
    props?.product?.eligibleTransaction?.isEligibleToWithdraw
});

const loanItems = computed(() => {
  return (
    loanCardData?.value &&
    props?.product &&
    loanCardData?.value?.loanItems?.map((label) => ({
      title: label,
      value: getLabelValue(label),
    }))
  );
});

const getLabelValue = (label: string): string => {
  const statusLabel = loanCardData?.value?.loanItems[0];
  const minimumDueLabel = loanCardData?.value?.loanItems[1];
  const dueDateLabel = loanCardData?.value?.loanItems[2];
  switch (label) {
    case statusLabel:
      return (
        loanCardData.value?.productStatus[props?.product?.productStatus] || '--'
      );
    case minimumDueLabel:
      return (
        currencyFormatting(
          Number(props?.product?.paymentAmtDue),
          'en',
          customCurrencyFormat
        ) || '--'
      );
    case dueDateLabel:
      return formatDate(props?.product?.dueDate);
    default:
      return '';
  }
};

// will need fraction(.00) so overriding default value(0) with custom currency format object.
const customCurrencyFormat = {
  ...currency,
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
};

const loanAmount = computed(() =>
  currencyFormatting(+props?.product?.loanAmount)
);

const canUserMakePayment = computed(
  () => props.product?.eligibleTransaction?.canMakePayment
);

// The loan tracker banner will appear on the application/loan
// when the current date is less than or equal to the bannerExpDate
const showLoanTrackerSection = computed(() => {
  const expDate = loanTrackerDetails.value?.bannerExpiryDate;
  return !!expDate && compareDateWithCurrentDate(expDate) >= 0;
});

const trackerBannerProps = computed(() => ({
  label: loanCardData.value?.trackerContent?.approvedOnLabel,
  date: loanTrackerDetails.value?.applicationApprovalDate,
}));

/*  NOTE: The scheduledPaymentFlag is not giving the correct flag. In order for scheduled payment notice to display, the user
     must be able to make a payment and there must be a scheduled payment upcoming.
     When canUserMakePayment is false, scheduledPaymentFlag still returns "Y" from qfund/backend.*/

const showScheduledForBanner = computed(() => props.product?.schedulePayments[0]?.scheduledPaymentFlag === 'Y')

const scheduledForBannerProps = computed(() => ({
  label: loanCardData.value?.trackerContent?.scheduledForLabel,
  date: formatDate(props.product?.schedulePayments[0]?.scheduledPaymentDate),
  paymentDue:
    currencyFormatting(
      Number(props.product?.schedulePayments[0]?.scheduledPaymentAmount),
      'en',
      customCurrencyFormat
    ) || '--',
}));

const isEppinated = computed(
  () => props.product?.eligibleTransaction?.isEPPInitiated || false
);

const isNoFooterCard = computed(
  () => !canUserMakePayment && !showLoanTrackerSection
);

const setProductId = () => {
  TrackGTMEvent("pwa - RC - LOC");// TODO: properly set GTMs
  removeItem('productId');
  setProduct(props.product);
  setItem('productId', props.product.productId);
  setItem('paymentType', props.product.productType);
};

</script>

<template>
  <LoanCard
    data-test-id="loan-loc-card"
    :amount="creditLimit"
    :balance-label="loanCardData?.availableCreditLabel || ''"
    :balance="availableCredit"
    :is-loading="loanCardDataPending"
    :is-naked-card="isNoFooterCard"
    :loan-id="product?.productId"
    :loan-items="loanItems"
    :loan-label="isOnline ? loanCardData?.productStatus?.isOnlineLoan : loanCardData?.productStatus?.isStoreLoan"
    :loan-title="ProductType[props.product?.productType]"
    :loan-type="product.productType"
    badge-type="active"
  >
    <template #footerContent>
      <div v-if="showScheduledForBanner">
        <BaseSkeletonLoader :is-loading="!scheduledForBannerProps">
          <ScheduledPaymentBanner
            :date="scheduledForBannerProps.date"
            :icon-name="IconNames.Scheduled"
            :label="scheduledForBannerProps.label"
            :payment-due="scheduledForBannerProps.paymentDue"
            data-test-id="line-of-credit-scheduled-for-notice"
          />
        </BaseSkeletonLoader>
      </div>
      <div
        v-if="showDrawButton"
        class="theme-loan-card-btn theme-loan-card-footer-border"
      >
        <BaseSkeletonLoader :is-loading="loanCardDataPending">
        <div class="container">
          <div class="row">
          <div class="col-7">
          <RouterLink
            v-if="canUserMakePayment"
            data-test-id="loan-card-footer-payment-button-yellow"
            :to="mapCtaRoutes(loanCardData?.ctaList[0])"
            class="theme-btn btn d-flex justify-content-center align-items-center btn-primary"
            @click="storeProductInfo"
          >
            {{ loanCardData?.ctaList[0] }}
          </RouterLink>
          
          </div>
          <div class="col-5">
          <RouterLink
            data-test-id="loan-card-footer-draw-button-dark"
            :to="Routes.MakeAWithdrawal"
            class="theme-btn btn d-flex justify-content-center align-items-center btn-secondary"
            @click="setProductId"
          >
            {{ loanCardData?.ctaList[2] }}
          </RouterLink>
          </div>
          </div>
        </div>
        </BaseSkeletonLoader>
      </div>
      <div
        v-else-if="canUserMakePayment"
        class="theme-loan-card-btn theme-loan-card-footer-border"
      >
        <BaseSkeletonLoader :is-loading="loanCardDataPending">
          <RouterLink
            data-test-id="loan-card-footer-payment-button-solo"
            :to="Routes.MakeAPayment"
            class="theme-btn btn d-flex justify-content-center align-items-center payment-button"
            :class="showRefinanceButton ? 'btn-secondary' : 'btn-primary'"
            @click="setProductId"
          >
            {{ loanCardData?.ctaList[0] }}
          </RouterLink>
        </BaseSkeletonLoader>
      </div>
      
      <template
        v-if="
          showLoanTrackerSection &&
          props.product.eligibleTransaction.canMakePayment !== true
        "
      >
        <BaseSkeletonLoader :is-loading="!trackerBannerProps">
          <LoanTrackerBanner
            :date="trackerBannerProps.date"
            :icon-name="IconNames.Approved"
            :label="trackerBannerProps.label"
            data-test-id="line-of-credit-type-five-tracker-status-text"
          />
        </BaseSkeletonLoader>
        <BaseSkeletonLoader :is-loading="!loanTrackerDetails || !loanCardData?.trackerContent">
          <BaseLoanTracker
            :loan-tracker-details="loanTrackerDetails"
            :tracker-content="loanCardData?.trackerContent"
            data-test-id="line-of-credit-type-five-tracker-status"
          />
        </BaseSkeletonLoader>
      </template>
      <BaseBanner
        v-if="isEppinated"
        data-test-id="line-of-credit-dashboard-card"
        :is-loading="pending"
        :heading="data?.heading"
        :description="data?.description"
        :link="link"
        variation="warning"
        :is-with-card="true"
      />
      <WidgetsBannerDashboard
        v-else
        :product="props?.product"
        :application="props?.application"
      />
    </template>
  </LoanCard>
</template>
<style>
.refinance {
  margin: 24px;
}

.payment-button {
  min-width: 95%;
}
</style>
