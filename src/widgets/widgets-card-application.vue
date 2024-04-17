<script setup lang="ts">
import {
  ApplicationSummary,
  ProductSummary,
  ProductType,
} from '@/constants/product';
import { currency, currencyFormatting } from '@/constants/masks';
import { Routes } from '@/constants/pages';
import { formatDate } from '@/composables/schemas/useDate';
import { computed, onBeforeMount, onMounted, ref, watchEffect } from 'vue';
import useContentfulSlug from '@/composables/useContentfulSlug';
import LoanCard from '@/components/LoanCard.vue';
import BaseBanner from '@/components/base/BaseBanner.vue';

interface AppsAndProductsArray {
  products: Array<ProductSummary>;
  applications: Array<ApplicationSummary>;
}
const linkDetails = ref({ label: '', url: '' });
const storeFront = ref(false);
const onlineActionPending = ref(false);
const onlineChannel = ref(false);
const underReview = ref(false);

const props = defineProps<{
  application: ApplicationSummary;
}>();
const loanAmount = computed(() =>
  currencyFormatting(+props.application.requestedLoanAmount)
);

const instoreLinkDetails = ref({ label: '', url: '' });
const slugLoanCardData = ref()
const slugPickupInstore = ref()
const slugMissingDocs = ref()
const slugInReview = ref()


const loanItems = (loan: any) => {
  return [
    {
      title: slugLoanCardData?.value?.labels?.statusLabel || '{Status}',
      value: 'Pending',
    },
    {
      title: slugLoanCardData?.value?.labels?.dueAmountLabel || '{Minimum Due}',
      value: loan?.paymentAmtDue,
    },
    {
      title: slugLoanCardData?.value?.labels?.dueDateLabel || '{Due Date}',
      value: formatDate(loan?.dueDate) || 'NULL Due Date',
    },
  ];
};

watchEffect(() => {
  if (slugPickupInstore?.value?.labels?.whatYouNeed) {
    instoreLinkDetails.value = {
      ...instoreLinkDetails.value,
      label: slugPickupInstore?.value?.labels?.whatYouNeed,
      url: Routes.LoanOriginationInStoreFinalize,
    };
  }
  if (slugMissingDocs?.value?.labels?.uploadNow) {
    linkDetails.value = {
      ...linkDetails.value,
      label: slugMissingDocs?.value?.labels?.uploadNow,
      url: Routes.UploadNewDocument + `?flow=dashboard`,
    };
  }
});

onBeforeMount(async () => {
  const { channelCode, state } = props.application;

  if (channelCode === 'STOREFRONT') {
    storeFront.value = true;
  }

  if (channelCode === 'ONLINE' && state === 'ACTION_PENDING') {
    onlineActionPending.value = true;
  }

  if (channelCode === 'ONLINE') {
    onlineChannel.value = true;
  }

  if (state === 'UNDER_REVIEW') {
    underReview.value = true;
  }
});

onMounted(async ()=>{
  slugLoanCardData.value = await useContentfulSlug({slug: 'widget-loan-summary-card-payday', contentTypeId: 'pageWidgetLoanSummaryCard'});
  slugPickupInstore.value = await useContentfulSlug({slug: 'widget-alert-banner-pickup-instore', contentTypeId: 'pageWidgetAlertBanner'});
  slugMissingDocs.value = await useContentfulSlug({slug: 'widget-alert-banner-missing-documents', contentTypeId: 'pageWidgetAlertBanner'});
  slugInReview.value = await useContentfulSlug({slug: 'widget-alert-banner-application-in-review', contentTypeId: 'pageWidgetAlertBanner'});
  console.log('application-application-application')
  console.log({props})
});
</script>

<template>
  <div class="instore-card">
    <LoanCard
      v-if="storeFront || onlineActionPending"
      :is-application-card="true"
      data-test-id="instore-pickup-card"
      :amount="loanAmount"
      :balance-label="slugLoanCardData?.labels.balanceLabel || ''"
      :balance="balanceAmount"
      :is-loading="false"
      :loan-id="props.application.qfundApplicationId"
      :loan-items="loanItems(null)"
      :loan-label="slugLoanCardData?.labels.subHeading || ''"
      :loan-title="ProductType[props.application?.productType]"
      badge-type="pending"
    >
      <template #footerContent>
        <section v-if="storeFront">
          <BaseBanner
            v-GTMTrackEvent="'pwa - IS - Pickup - Requirements'"
            data-test-id="pickup-instore"
            variation="error"
            :heading="slugPickupInstore?.title"
            :description="slugPickupInstore?.copy.copy"
            :link="instoreLinkDetails"
            :is-with-card="true"
            :is-loading="false"
          />
        </section>
        <section v-if="onlineChannel">
          <BaseBanner
            data-test-id="missing-docs-banner"
            variation="error"
            :heading="slugMissingDocs?.title"
            :description="slugMissingDocs?.copy.copy"
            :is-with-card="true"
            :is-loading="false"
            :link="linkDetails"
          />
        </section>
      </template>
    </LoanCard>
    <section v-if="underReview">
      <LoanCard
        :is-application-card="true"
        data-test-id="instore-pickup-card"
        :amount="loanAmount"
        :balance-label="slugLoanCardData?.labels.balanceLabel || ''"
        :balance="balanceAmount"
        :is-loading="false"
        :loan-id="props.application.qfundApplicationId"
        :loan-items="loanItems(null)"
        :loan-label="slugLoanCardData?.labels.subHeading || ''"
        :loan-title="ProductType[props.application?.productType]"
        badge-type="processing"
      >
        >
        <template #footerContent>
          <section>
            <BaseBanner
              data-test-id="application-in-review"
              variation="warning"
              :heading="slugInReview?.title"
              :description="slugInReview?.copy.copy"
              :is-with-card="true"
              :is-loading="false"
            />
          </section>
        </template>
      </LoanCard>
    </section>
  </div>
</template>

<style scoped>
@media only screen
and (max-device-width: 600px)
 {
  .instore-card {
    padding-bottom: 26px;
  }
 }
</style>
