<script setup lang="ts">
import { Routes } from '@/constants/pages';
import { TrackGTMEvent } from "../composables/useGTMtrackEvent";
import useContentfulSlug from '@/composables/useContentfulSlug';
import useAvailLoan from '@/composables/useAvailLoan';
import { computed, onMounted, ref } from 'vue';
import BaseCard from '@/components/base/BaseCard.vue';

const slug = ref()

const { getAvailLoan } = useAvailLoan();

let dataTestId = 're-apply-eligible-loan-card';

const username = computed(() => getAvailLoan.value?.data?.firstName || '');

onMounted(async  ()=>{
  slug.value = await useContentfulSlug({slug: 'widget-dashboard-loan-eligibility-card', contentTypeId: 'page'});
})
</script>
<template>
  <section class="theme-dashboard-card-section">
    <BaseCard
      is-base-card
      :data-test-id="dataTestId"
      class="theme-loan-eligibility-card"
    >
      <div
        class="theme-loan-eligibility-card-background"
        :style="{ backgroundImage: `url(${slug?.images.url})` }"
      ></div>
      <div class="theme-loan-eligibility-card-content">
        <h2>
          {{ `${slug?.title}${username}!` || '' }}
        </h2>
        <p>{{ slug?.copy.copy || '' }}</p>
      </div>
      <div class="d-flex">
        <RouterLink
          :to="Routes.LoanOriginationReapplyHowItWorks"
          :data-test-id="`${dataTestId}-apply-now-cta`"
          class="theme-btn btn btn-md btn-secondary d-flex justify-content-center align-items-center"
          @click="TrackGTMEvent('pwa - Restart App')"
        >
          {{ slug?.cta.ctaLabel || '' }}
        </RouterLink>
      </div>
    </BaseCard>
  </section>
</template>
