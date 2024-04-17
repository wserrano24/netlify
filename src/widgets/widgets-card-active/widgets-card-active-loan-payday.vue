<script setup lang="ts">
import {
  ApplicationSummary,
  ProductSummary,
  ProductType,
} from '@/constants/product';
import { currency, currencyFormatting } from '@/constants/masks';
import { IconNames } from '@/constants/icons';
import { LoanTrackerResponse } from '@/types/loan-tracker';
import { compareDateWithCurrentDate } from '@/composables/schemas/useDate';
import { formatDate } from '@/composables/schemas/useDate';
import { getWithDashLowercaseString } from '@/utils/strings';
// import useOriginationStore from '@/stores/useOriginationStore';
import useProductStore from '@/stores/useProductStore';
import { TrackGTMEvent } from '@/composables/useGTMtrackEvent';
import useContentfulSlug from '@/composables/useContentfulSlug';
import useCtaRoute from '@/composables/useCtaRoute';
import useComposite from '@/composables/useComposite';
import { useSessionStorage } from '@/composables/useSessionStorage';
import { computed, onBeforeMount, onMounted, ref } from 'vue';
import BaseSkeletonLoader from '@/components/base/BaseSkeletonLoader.vue';
import ScheduledPaymentBanner from '@/components/ScheduledPaymentBanner.vue';
import LoanTrackerBanner from '@/components/LoanTrackerBanner.vue';
import BaseLoanTracker from '@/components/base/BaseLoanTracker.vue';
import BaseBanner from '@/components/base/BaseBanner.vue';
import WidgetsBannerDashboard from '../widgets-banner-dashboard.vue';
import LoanCard from '@/components/LoanCard.vue';
import useContentful from '@/composables/useContentful';

const props = defineProps<{
  product: ProductSummary;
  application: ApplicationSummary;
}>();

const {  getAlertBannerData, getCtaData } =
  useContentful();
const { data, pending } = getAlertBannerData(
  'widget-alert-banner-dashboard-payday-extended-payment-plan'
);
const { data: refinanceData, pending: refinancePending } = getCtaData(
  'widget-cta-product-details'
);
const slug =ref()
const slugEpp = ref()
// const slug2 = await useContentfulSlug({
//   slug: 'widget-cta-product-details',
//   contentTypeId: 'pageWidgetCta',
// });

onMounted(async()=>{
  slug.value = await useContentfulSlug({
    slug: 'widget-loan-summary-card-payday',
    contentTypeId: 'pageWidgetLoanSummaryCard',
  });
  slugEpp.value = await useContentfulSlug({
    slug: 'widget-alert-banner-dashboard-payday-extended-payment-plan',
    contentTypeId: 'pageWidgetAlertBanner',
  });

});

const link = {
  label: 'E-sign now',
  url: '/loan-summary',
};
const { mapCtaRoutes } = useCtaRoute();
const { getLoanTracker } = useComposite();
const { setProduct } = useProductStore();
const { setItem } = useSessionStorage();

const loanTrackerDetails = ref<LoanTrackerResponse>(null);
const balanceForCard = computed(() => props?.product?.balanceAmount);
const isRefinance = ref(false);
const isOnline = computed (() => props?.product?.channelCode === "ONLINE")

onBeforeMount(async () => {
  loanTrackerDetails.value = await getLoanTracker(props.product?.productId);
  isRefinance.value =
    props?.product?.eligibleTransaction?.isEligibleforRefinance;
});

const loanItems = computed(() => {
  const isCustomerEPP =
    props?.product?.qfundCheckStatus === 'PPN' ||
    props?.product?.qfundCheckStatus === 'EPP' ||
    props?.product?.qfundCheckStatus === 'RPP'
      ? true
      : false;
  let itemsArray = [];
  itemsArray.push(
    slug?.value.labels.statusLabel,
    slug?.value.labels.dueAmountLabel,
    slug?.value.labels.dueDateLabel
  );
  itemsArray = isCustomerEPP
    ? itemsArray
    : itemsArray.filter((label) => {
        return label !== 'Minimum due';
      });
  return (
    slug.value &&
    props?.product &&
    itemsArray.map((label) => ({
      title: label,
      value: getLabelValue(label),
    }))
  );
});

const getLabelValue = (label: string): string => {
  const statusLabel = slug?.value.labels.statusLabel;
  const minimumDueLabel = slug?.value.labels.dueAmountLabel;

  const dueDateLabel = slug?.value.labels.dueDateLabel;
  switch (label) {
    case statusLabel:
      return slug?.value.productStatus[props?.product?.productStatus].label || '--';
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
  label: slug?.value.trackerContent?.approvedOnLabel.value,
  date: loanTrackerDetails.value?.applicationApprovalDate,
}));

// NOTE: The scheduledPaymentFlag is not giving the correct flag. In order for scheduled payment notice to display, the user
//       must be able to make a payment and there must be a scheduled payment upcoming.
//       When canUserMakePayment is false, scheduledPaymentFlag still returns "Y" from qfund/backend.
//const showScheduledForBanner = computed(() => props.product?.schedulePayments[0]?.scheduledPaymentFlag === 'Y')
const showScheduledForBanner = computed(
  () => canUserMakePayment.value && props.product?.schedulePayments[0]
);
const scheduledForBannerProps = computed(() => ({
  label: slug?.value.trackerContent?.scheduledForLabel.value,
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

const submitProduct = (product) => {
  TrackGTMEvent('pwa - RC - ILP - Refinance');
  setProduct(product);
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
    data-test-id="loan-payday-re-finance"
    :amount="loanAmount"
    :balance-label="slug?.labels.balanceLabel || ''"
    :balance="balanceForCard"
    :is-loading="false"
    :is-naked-card="isNoFooterCard"
    :loan-id="product?.productId"
    :loan-items="loanItems"
    :loan-label="isOnline ? slug?.productStatus?.isOnlineLoan.value : slug?.productStatus?.isStoreLoan.value"
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
            data-test-id="loan-payday-scheduled-for-notice"
          />
        </BaseSkeletonLoader>
      </div>
      <div
        v-if="canUserMakePayment && !isRefinance"
        class="theme-loan-card-btn theme-loan-card-footer-border"
      >
        <BaseSkeletonLoader :is-loading="false">
          <RouterLink
            :data-test-id="
              getWithDashLowercaseString(`${slug?.cta.makePayment}-card-cta`)
            "
            :to="mapCtaRoutes(slug?.cta.makePayment)"
            class="theme-btn btn d-flex justify-content-center align-items-center btn-primary"
            @click="storeProductInfo"
          >
            {{ slug?.cta.makePayment }}
          </RouterLink>
        </BaseSkeletonLoader>
      </div>
      <!-- section for refinance and payment buttons -->
      <div
        v-if="isRefinance"
        class="theme-re-finance-loan-information-cta-block"
      >
        <div
          style="backgroud: red"
          class="theme-re-finance-loan-information-cta-block-links d-flex justify-content-between"
        >
          <BaseSkeletonLoader
            v-for="(cta, index) in refinanceData?.ctaList?.slice(
              1,
              data?.ctaList?.length
            ) || [1, 2]"
            :key="`${cta?.label || ''}-${index}`"
            :is-loading="false"
          >
            <RouterLink
              :id="`refinance-card-button-${index}`"
              :data-test-id="`${cta?.label}-link-${index}`"
              :to="cta?.url"
              :class="[
                'theme-btn btn d-flex align-items-center justify-content-center mobile active-card-refi-buttons refinance payment-button',
                index ? 'btn-secondary' : 'btn-primary',
              ]"
              @click="submitProduct(props?.product)"
            >
              {{ cta?.label }}
            </RouterLink>
          </BaseSkeletonLoader>
        </div>
      </div>
      <template v-if="showLoanTrackerSection">
        <BaseSkeletonLoader :is-loading="!trackerBannerProps">
          <LoanTrackerBanner
            :date="trackerBannerProps.date"
            :icon-name="IconNames.Approved"
            :label="trackerBannerProps.label"
            data-test-id="loan-payday-type-five-tracker-status-text"
          />
        </BaseSkeletonLoader>
        <BaseSkeletonLoader
          :is-loading="!loanTrackerDetails || !slug?.trackerContent"
        >
          <BaseLoanTracker
            :loan-tracker-details="loanTrackerDetails"
            :tracker-content="slug?.trackerContent"
            data-test-id="loan-payday-type-five-tracker-status"
          />
        </BaseSkeletonLoader>
      </template>

      <BaseBanner
        v-if="isEppinated"
        data-test-id="payday-dashboard-card"
        :is-loading="false"
        :heading="slugEpp?.title"
        :description="slugEpp?.includes.Entry[1].fields.label"
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
