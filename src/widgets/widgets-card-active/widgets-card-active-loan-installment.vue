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
import { getWithDashLowercaseString } from '@/utils/strings';
import useProductStore from '@/stores/useProductStore';
// import { ApplicationDescription } from '~~/.nuxt/components';
import { TrackGTMEvent } from '../../composables/useGTMtrackEvent';
import { useSessionStorage } from '@/composables/useSessionStorage';
import useContentfulSlug from '@/composables/useContentfulSlug';
import useCtaRoute from '@/composables/useCtaRoute';
import useComposite from '@/composables/useComposite';
import { computed, onBeforeMount, onMounted, ref } from 'vue';
import LoanCard from '@/components/LoanCard.vue';
import ScheduledPaymentBanner from '@/components/ScheduledPaymentBanner.vue';
import BaseSkeletonLoader from '@/components/base/BaseSkeletonLoader.vue';
import LoanTrackerBanner from '@/components/LoanTrackerBanner.vue';
import BaseLoanTracker from '@/components/base/BaseLoanTracker.vue';
import BaseBanner from '@/components/base/BaseBanner.vue';
import WidgetsBannerDashboard from '../widgets-banner-dashboard.vue';

const { setItem, removeItem } = useSessionStorage();

const props = defineProps<{
  product: ProductSummary;
  application: ApplicationSummary;
}>();

const slugSummaryCard = ref()
const slugAlertBanner = ref()

const link = {
  label: 'E-sign now',
  url: '/loan-summary',
};
const { mapCtaRoutes } = useCtaRoute();
const { getLoanTracker } = useComposite();
const { setProduct } = useProductStore();

const loanTrackerDetails = ref<LoanTrackerResponse>(null);
const balanceForCard = computed(() => props?.product?.balanceAmount);
const showRefinanceButton = ref(false);
const isOnline = computed (() => props?.product?.channelCode === "ONLINE")

onBeforeMount(async () => {
  loanTrackerDetails.value = await getLoanTracker(props.product?.productId);
  showRefinanceButton.value =
    props?.product?.eligibleTransaction?.isEligibleforRefinance ||
    (props.application?.refinance &&
      !(
        props.product.productId ==
        props.application?.refinance.originalProductId
      ));
});

onMounted(async ()=>{

  slugSummaryCard.value = await useContentfulSlug({
    slug: 'widget-loan-summary-card-payday',
    contentTypeId: 'pageWidgetLoanSummaryCard',
  });

  slugAlertBanner.value = await useContentfulSlug({
    slug: 'widget-alert-banner-dashboard-payday-extended-payment-plan',
    contentTypeId: 'pageWidgetAlertBanner',
  });

});

const loanItems = computed(() => {
  if(!slugSummaryCard || !slugSummaryCard?.value) return {};
  return (
    slugSummaryCard?.value &&
    props?.product &&
    [
      slugSummaryCard?.value?.labels?.statusLabel,
      slugSummaryCard?.value?.labels?.dueAmountLabel,
      slugSummaryCard?.value?.labels?.dueDateLabel,
    ].map((label) => ({
      title: label,
      value: getLabelValue(label),
    })) 
  );
});

const getLabelValue = (label: string): string => {
  const statusLabel = slugSummaryCard?.value?.labels?.statusLabel;
  const minimumDueLabel = slugSummaryCard?.value?.labels?.dueAmountLabel;
  const dueDateLabel = slugSummaryCard?.value?.labels?.dueDateLabel;
  switch (label) {
    case statusLabel:
      return (
        slugSummaryCard?.value?.productStatus[props?.product?.productStatus].value ||
        '--'
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

const installmentPlusCriteria = computed(
  () => props.product?.eligibleTransaction?.isInstallmentPlusEligible
);
// progress update 6/15/23 4:24pm
// - Need to find out if ILP can be refinanced normally, or if it must have isInstallmentPlus

// The loan tracker banner will appear on the application/loan
// when the current date is less than or equal to the bannerExpDate
const showLoanTrackerSection = computed(() => {
  const expDate = loanTrackerDetails.value?.bannerExpiryDate;
  return !!expDate && compareDateWithCurrentDate(expDate) >= 0;
});

const trackerBannerProps = computed(() => ({
  label: slugSummaryCard?.value?.trackerContent?.approvedOnLabel.value,
  date: loanTrackerDetails.value?.applicationApprovalDate,
}));

const trackerContent = computed(() =>
    Object.keys(slugSummaryCard?.value?.trackerContent).reduce(
    (obj, key) => ({
      ...obj,
      [key]: slugSummaryCard?.value?.trackerContent[key].value,
    }),
    {}
  )
);

// NOTE: The scheduledPaymentFlag is not giving the correct flag. In order for scheduled payment notice to display, the user
//       must be able to make a payment and there must be a scheduled payment upcoming.
//       When canUserMakePayment is false, scheduledPaymentFlag still returns "Y" from qfund/backend.
//const showScheduledForBanner = computed(() => props.product?.schedulePayments[0]?.scheduledPaymentFlag === 'Y')
const showScheduledForBanner = computed(
  () => canUserMakePayment.value && props.product?.schedulePayments[0]
);
const scheduledForBannerProps = computed(() => ({
  label: slugSummaryCard?.value?.trackerContent?.scheduledForLabel.value,
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
  TrackGTMEvent('pwa - RC - ILP - Refinance');
  removeItem('productId');
  setItem('productId', props.product.productId);
};

const storeProductInfo = () => {
  setProduct(props.product);
  setItem('productId', props.product.productId);
  setItem('paymentType', props.product.productType);
}
</script>

<template>
  <LoanCard
    data-test-id="loan-installment-car"
    :amount="loanAmount"
    :balance-label="slugSummaryCard?.labels.balanceLabel || ''"
    :balance="balanceForCard"
    :is-loading="loanCardDataPending"
    :is-naked-card="isNoFooterCard"
    :loan-id="product?.productId"
    :loan-items="loanItems"
    :loan-label="isOnline ? slugSummaryCard?.productStatus?.isOnlineLoan.value : slugSummaryCard?.productStatus?.isStoreLoan.value"
    :loan-title="ProductType[props.product?.productType]"
    :loan-type="product.productType"
    badge-type="active"
  >
    <template #footerContent>
      <div v-if="showScheduledForBanner">
        <ScheduledPaymentBanner
          :date="scheduledForBannerProps.date"
          :icon-name="IconNames.Scheduled"
          :label="scheduledForBannerProps.label"
          :payment-due="scheduledForBannerProps.paymentDue"
          data-test-id="loan-installment-scheduled-for-notice"
        />
      </div>
      <div
        v-if="showRefinanceButton"
        class="theme-loan-card-btn theme-loan-card-footer-border"
      >
        <RouterLink
          data-test-id="loan-card-footer-refinance-button-yellow"
          :to="Routes.RefinanceInformationVerification"
          class="theme-btn btn d-flex justify-content-center align-items-center btn-primary"
          @click="setProductId"
        >
          {{ slugSummaryCard?.cta.refinanceLabel }}
        </RouterLink>
        <RouterLink
          v-if="canUserMakePayment"
          data-test-id="loan-card-footer-payment-button-dark"
          :to="mapCtaRoutes(slugSummaryCard?.cta.makePayment)"
          class="theme-btn btn d-flex justify-content-center align-items-center btn-secondary"
          @click="storeProductInfo"
        >
          {{ slugSummaryCard?.cta.makePayment }}
        </RouterLink>
      </div>
      <div
        v-else-if="canUserMakePayment"
        class="theme-loan-card-btn theme-loan-card-footer-border"
      >
        <RouterLink
          data-test-id="loan-card-footer-payment-button-solo"
          :to="Routes.MakeAPayment"
          class="theme-btn btn d-flex justify-content-center align-items-center payment-button"
          :class="showRefinanceButton ? 'btn-secondary' : 'btn-primary'"
          @click="storeProductInfo"
        >
          {{ slugSummaryCard?.cta.makePayment }}
        </RouterLink>
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
            data-test-id="loan-installment-type-five-tracker-status-text"
          />
        </BaseSkeletonLoader>
        <BaseLoanTracker
          :loan-tracker-details="loanTrackerDetails"
          :tracker-content="trackerContent"
          data-test-id="loan-installment-type-five-tracker-status"
        />
      </template>
      <BaseBanner
        v-if="isEppinated"
        data-test-id="installment-dashboard-card"
        :is-loading="false"
        :heading="slugAlertBanner?.title"
        :description="slugAlertBanner?.copy.letsFinalize"
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
