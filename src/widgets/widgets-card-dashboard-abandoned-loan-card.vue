<script setup lang="ts">
import { ApplicationSummary, ProductType } from '@/constants/product';
import { currencyFormatting } from '@/constants/masks';
import { onMounted, reactive, ref, watch } from 'vue';
import useContentfulSlug from '@/composables/useContentfulSlug';
import AbandonedLoanCard from '@/components/AbandonedLoanCard.vue';
import WidgetsBannerDashboard from './widgets-banner-dashboard.vue';

const state = reactive({
  activeApplication: null,
} as { activeApplication?: ApplicationSummary });

const slug = ref()

const showWidget = ref(false);
const props = defineProps<{
  hasEsignPending: boolean;
  applications: Array<ApplicationSummary>;
}>();

const testPendEsignRef = ref(props.hasEsignPending);
const testAppsRef = ref(props.applications);

watch([() => testPendEsignRef.value, () => testAppsRef.value], ([testPendEsignRefNew, testAppsRefNew]) => {
  testAppsRef.value = testAppsRefNew;
  testPendEsignRef.value = testPendEsignRefNew;
});

onMounted(async ()=>{
  slug.value = await useContentfulSlug({slug: 'widget-loan-summary-card-payday', contentTypeId: 'pageWidgetLoanSummaryCard'});
})
onMounted(() => {
  state.activeApplication = testAppsRef.value === undefined ? null : testAppsRef.value[0];
  const appState = state?.activeApplication?.state;
  const appSubStatus = state?.activeApplication?.subStatus;

  if (appState === 'ACTION_PENDING') {
    showWidget.value = false;
  } else if (appState === 'UNDER_REVIEW') {
    showWidget.value = false;
  } else if (appState === 'PREPARING') {
    showWidget.value = false;
  } else if (
    appState === 'PENDING_ESIGN' &&
    appSubStatus === 'confirmOfferRequired'
  ) {
    showWidget.value = false;
  } else if (state?.activeApplication?.isRefinanceApp) {
    showWidget.value = false;
  } else if (appState === 'READY_FOR_PICKUP') {
    showWidget.value = false;
  } else {
    showWidget.value = true;
  }
});
</script>

<template>
  <div
    v-if="showWidget && !testPendEsignRef && state?.activeApplication"
    class="theme-dashboard-card-section"
  >
    <AbandonedLoanCard
      data-test-id="abandoned-loan-card"
      :amount="
        currencyFormatting(+state?.activeApplication?.requestedLoanAmount)
      "
      :balance-label="slug?.labels.balanceLabel || ''"
      :is-loading="false"
      :loan-id="state.activeApplication.qfundApplicationId"
      :loan-label="slug?.labels.subHeading"
      :loan-title="ProductType[state.activeApplication.productType]"
      :loan-type="state.activeApplication.productType"
      badge-type="pending"
    >
      <template #footerContent>
        <WidgetsBannerDashboard :application="state.activeApplication" />
      </template>
    </AbandonedLoanCard>
  </div>
</template>
