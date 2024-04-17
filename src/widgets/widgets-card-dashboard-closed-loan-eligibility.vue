<script setup lang="ts">
import { Routes } from '@/constants/pages';
import { TrackGTMEvent } from '../composables/useGTMtrackEvent';
import useAvailLoan from '@/composables/useAvailLoan';
import { computed, onMounted, ref } from 'vue';
import useContentfulSlug from '@/composables/useContentfulSlug';
import BaseCard from '@/components/base/BaseCard.vue';

const { getAvailLoan } = useAvailLoan();

const isEligibleInstallmentPlus = computed(() => {
  return getAvailLoan?.value?.data?.isEligibleInstallmentPlus;
});

const slug = ref()

const username = computed(() => getAvailLoan.value?.data?.firstName || '');

const determineDataTestId = (): string => {
  if (isEligibleInstallmentPlus.value) {
    return 're-apply-eligible-closed-loan-card-better-rates-ilp';
  } else {
    return 're-apply-eligible-closed-loan-card';
  }
};

const determineTitleForCard = (): string => {
  if (isEligibleInstallmentPlus.value && slug?.title) {
    let title = slug?.title;
    let newTitle = title.replace(/[$]/gm, username.value);
    return newTitle;
  } else {
    let title = slug?.title;
    return `${title}${username.value}!`;
  }
};

onMounted(async ()=>{
  slug.value = await useContentfulSlug({slug: 
isEligibleInstallmentPlus.value
  ? 'widget-dashboard-loan-eligibility-card-closed-loan-better-rates-ilp'
  : 'widget-dashboard-loan-eligibility-card-closed-loan'
  , contentTypeId: 'pageWidgetLoanEligibilityCard'});
})
</script>
<template>
  <section class="theme-dashboard-card-section">
    <BaseCard
      class="theme-new-loan-card"
      :data-test-id="determineDataTestId()"
      is-base-card
    >
      <div class="theme-new-loan-card-banner">
        <div class="theme-new-loan-card-logo">
          <img
            :alt="slug?.images.altText"
            :src="slug?.images.url"
            :data-test-id="`${determineDataTestId()}-logo`"
          />
        </div>
        <h2 :data-test-id="`${determineDataTestId()}-title`">
          {{ determineTitleForCard() }}
        </h2>
        <p :data-test-id="`${determineDataTestId()}-copy`">
          {{ slug?.copy.copy || '' }}
        </p>
        <RouterLink
          v-GTMTrackEvent="slug?.cta.ctaLabel"
          :to="Routes.LoanOriginationReapplyHowItWorks"
          :data-test-id="`${determineDataTestId()}-apply-now-cta`"
          class="theme-btn btn btn-md btn-secondary d-flex justify-content-center align-items-center"
          @click="TrackGTMEvent('PWA - Restart App')"
        >
          {{ slug?.cta.ctaLabel || '' }}
        </RouterLink>
      </div>
    </BaseCard>
  </section>
</template>
