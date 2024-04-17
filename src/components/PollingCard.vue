<script setup lang="ts">
import useContentfulImage from '@/composables/useContentfulImage';
import useContentfulSlug from '@/composables/useContentfulSlug';
import useProductStore from '@/stores/useProductStore';
import { onMounted, reactive, ref } from 'vue';
import BaseCard from './base/BaseCard.vue';
import BaseKeyValueText from './base/BaseKeyValueText.vue';
import BaseProgressBar from './base/BaseProgressBar.vue';

const { getEsignPendingDetails } = useProductStore();
const slug = ref()
const image= ref()
const cardDetails = reactive({
  productLabel: '',
  loanLabel: '',
  productId: '',
});
interface Props {
  progress: number;
}
const props = withDefaults(defineProps<Props>(), {
  progress: 10,
});

const pending = ref(true)

onMounted(async ()=>{
  slug.value = await useContentfulSlug({slug: 'polling-card', contentTypeId: 'resourceSet'});
  image.value = await useContentfulImage('1yffvagpom52SjPUBYEdce');
})

onMounted(async () => {
  const slug = await useContentfulSlug({slug: 'polling-card', contentTypeId: 'resourceSet'});
  if (getEsignPendingDetails.hasBeenEsigned) {
    cardDetails.productId = getEsignPendingDetails.applicationId;
    cardDetails.productLabel =
      getEsignPendingDetails.productType === 'PDL'
        ? slug?.value?.resources?.paydayLoanPollingCard
        : getEsignPendingDetails.productType === 'ILP'
        ? slug?.value?.resources?.installmentLoanPollingCard
        : getEsignPendingDetails.productType === 'LOC'
        ? slug?.value?.resources?.lineOfCreditPollingCard
        : '';
  }
  pending.value = false
});

</script>

<template>
  <BaseCard class="theme-loan-card size" data-test-id="`${dataTestId}-1`">
    <template #header>
      <div class="theme-loan-card-header theme-loan-card-with-border-bottom d-flex justify-content-between">
        <div class="d-flex align-items-center">
          <div class="theme-loan-card-header-logo">
            <img
              :src="image.url"
              :alt="image.altText"
              class="theme-loan-card-header-logo-icon"
            />
          </div>
          <div class="theme-loan-card-header-title">
            <p>{{ cardDetails?.productLabel }}</p>
            <p>{{ slug?.resources.loanLabel }} #{{ cardDetails?.productId }}</p>
          </div>
        </div>
        <div class="theme-loan-card-header-amount d-flex">
          <p>--</p>
        </div>
      </div>
    </template>
    <template #title>
      <div class="theme-loan-card-details-header">
        <BaseKeyValueText
          :data-test-id="`card-balance`"
          text-direction="column"
          :label="slug?.resources.confirmEsign"
          :is-loading="false"
        />
        <BaseProgressBar :progress="props.progress"/>
        <p class="padding">
          {{ slug?.resources.reloadMessage }}
        </p>
      </div>
    </template>
  </BaseCard>
</template>

<style scoped>
p {
  font-family: 'Inter' !important;
}
.padding {
  padding-top: 8px;
}

.theme-loan-card {
  margin-bottom: 24px;
}
</style>
