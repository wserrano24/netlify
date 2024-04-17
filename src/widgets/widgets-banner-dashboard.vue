<script setup lang="ts">
import { useSessionStorage } from '@/composables/useSessionStorage';
import { ApplicationSummary, ProductSummary } from '../constants/product';
import { Routes } from '@/constants/pages';
import useProductStore from '@/stores/useProductStore';
import useContentfulSlug from '@/composables/useContentfulSlug';
import { onBeforeMount, ref, watchEffect } from 'vue';
import BaseBanner from '@/components/base/BaseBanner.vue';
import WidgetsBannerReFinanceLoanNotification from './widgets-banner-re-finance-loan-notification.vue';
const { setItem, removeItem } = useSessionStorage();

const slugInReview = await useContentfulSlug({slug: 'widget-alert-banner-application-in-review', contentTypeId: 'pageWidgetAlertBanner'});
const slugMissingDocs = await useContentfulSlug({slug: 'widget-alert-banner-missing-documents', contentTypeId: 'pageWidgetAlertBanner'});
const slugPastDue = await useContentfulSlug({slug: 'widget-alert-banner-payment-past-due', contentTypeId: 'pageWidgetAlertBanner'});
const slugAchInFlight = await useContentfulSlug({slug: 'widget-alert-banner-payment-processed', contentTypeId: 'pageWidgetAlertBanner'});
const slugRefinance = await useContentfulSlug({slug: 'widget-alert-banner-refinance', contentTypeId: 'pageWidgetAlertBanner'});
const slugAlmostThere = await useContentfulSlug({slug: 'widget-alert-banner-almost-there', contentTypeId: 'pageWidgetAlertBanner'});

const props = defineProps<{
  product?: ProductSummary;
  application?: ApplicationSummary;
}>();

const isAlmostThere = ref(false);
const isInReview = ref(false);
const isMissingDocuments = ref(false);
const isAchInFlight = ref(false);
const isPastDue = ref(false);
const isRefinance = ref(false);
const isInstallmentPlusEligible = ref(false);
const almostThereLinkDetails = ref({ label: '', url: '' });
const linkDetails = ref({ label: '', url: '' });
const phoneLinkDetails = ref({ label: '', url: '' });
const refinanceInfo = ref({ label: '', url: '' });
const { setProduct } = useProductStore();
const setProductId = () => {
  removeItem('productId');
  setItem('productId', props.product.productId);
};

watchEffect(() => {
  // TODO: need to verify what labels would be available for slugInReview to not just blindly choose index
  // but it does not appear that 'inReview.value.linkLabel' was ever a defined value from contentful,
  // so for now just using first index *slugInReview.labels[0]* to prevent error. 12/6/23 JBIII

  if (slugInReview?.labels) {
    linkDetails.value = {
      ...linkDetails.value,
      label: slugInReview?.labels[0],
      url: Routes.UploadNewDocument,
    };
  }
  if (slugAlmostThere?.labels.completeApplication) {
    almostThereLinkDetails.value = {
      ...almostThereLinkDetails.value,
      label: slugAlmostThere?.labels.completeApplication,
      url: isRefinance.value
        ? Routes.LoanOriginationRefinanceEsign
        : Routes.LoanOriginationEsign, // TODO: Might need to add logic for re-apply flow
    };
  }
  if (slugPastDue?.labels.phoneNumber) {
    phoneLinkDetails.value = {
      ...phoneLinkDetails.value,
      label: slugPastDue?.labels.phoneNumber,
      url: slugPastDue?.labels.phoneNumber,
    };
  }
  if (slugRefinance?.labels.learnMore) {
    refinanceInfo.value = {
      ...refinanceInfo.value,
      label: slugRefinance?.labels.learnMore,
      url: Routes.RefinanceInfo,
    };
  }
});

onBeforeMount(async () => {
  if (props?.product?.applicationStatus === 'UNDER_REVIEW') {
    isInReview.value = true;
    isMissingDocuments.value = false;
  } else if (props?.product?.applicationStatus === 'ACTION_PENDING') {
    isMissingDocuments.value = true;
    isInReview.value = false;
  } else {
    isMissingDocuments.value = false;
    isInReview.value = false;
  }

  if (
    props?.application?.state === 'PENDING_ESIGN' &&
    props?.application?.subStatus === 'esignOnlyRequired'
  ) {
    isAlmostThere.value = true;
  } else {
    isAlmostThere.value = false;
  }

  if (
    props?.product?.achInFlight &&
    !props?.product?.pastDue &&
    !props?.product?.balanceAmount
  ) {
    isAchInFlight.value = true;
    isPastDue.value = false;
  } else if (
    props?.product?.achInFlight &&
    props?.product?.pastDue &&
    !props?.product?.balanceAmount
  ) {
    isAchInFlight.value = true;
    isPastDue.value = false;
  } else if (props?.product?.pastDue && !props?.product?.achInFlight) {
    isPastDue.value = true;
    isAchInFlight.value = false;
  } else {
    isAchInFlight.value = false;
    isPastDue.value = false;
  }

  if (
    props?.application?.isRefinanceApp ||
    props?.product?.eligibleTransaction?.isEligibleforRefinance
  ) {
    isRefinance.value = true;
    isInstallmentPlusEligible.value =
      props?.product.eligibleTransaction?.isInstallmentPlusEligible;
  }

  if (props?.product) {
    setProduct(props?.product);
  }
});
</script>
<template>
  <div>
    <BaseBanner
      v-if="isInReview"
      data-test-id="in-review-banner"
      variation="error"
      :heading="slugInReview?.title"
      :description="slugInReview?.copy.copy"
      :link="linkDetails"
      :is-with-card="true"
      :is-loading="false"
    />
    <BaseBanner
      v-if="isMissingDocuments"
      data-test-id="missing-docs-banner"
      variation="warning"
      :heading="slugMissingDocs?.title"
      :description="slugMissingDocs?.copy.copy"
      :is-with-card="true"
      :is-loading="false"
    />
    <BaseBanner
      v-if="isPastDue"
      data-test-id="banner-past-due"
      variation="error"
      :heading="slugPastDue?.title"
      :description="slugPastDue?.copy.copy"
      :link="phoneLinkDetails"
      :is-with-card="true"
      :is-loading="false"
      :is-phone-number="true"
    />
    <BaseBanner
      v-if="isAchInFlight"
      data-test-id="payment-processed"
      variation="warning"
      :heading="slugAchInFlight?.title"
      :description="slugAchInFlight?.copy.copy"
      :is-with-card="true"
      :is-loading="false"
    />
    <!-- TODO: Change link route -->
    <BaseBanner
      v-if="isAlmostThere"
      data-test-id="almost-done-esign-needed"
      variation="warning"
      :link="almostThereLinkDetails"
      :heading="slugAlmostThere?.title"
      :description="slugAlmostThere?.copy.copy"
      :is-with-card="true"
      :is-loading="false"
    />
    <WidgetsBannerReFinanceLoanNotification
      v-if="isRefinance && !isAlmostThere"
      :is-installment-plus-eligible="!!isInstallmentPlusEligible"
      :application="props.application"
      :product="props.product"
      @click="setProductId"
    />
  </div>
</template>
