<script setup lang="ts">
import BaseCard from '@/components/base/BaseCard.vue';
import useContentfulSlug from '@/composables/useContentfulSlug';
import { Routes } from '@/constants/pages';
import { onMounted, ref } from 'vue';


const slug = ref()
onMounted(async()=>{
  slug.value = await useContentfulSlug({slug: 'widget-dashboard-loan-eligibility-card-non-serviceable-area', contentTypeId: 'page'});
})
</script>
<template>
  <section class="theme-dashboard-card-section">
    <BaseCard
      is-base-card
      data-test-id="loan-non-serviceable-area-info-card"
      class="theme-loan-info-card"
    >
      <h2 class="text-center">{{ slug?.title || '' }}</h2>
      <p class="text-center">{{ slug?.copy.copy || '' }}</p>
      <div class="d-flex justify-content-center">
      <RouterLink
        :to="Routes.UpdateHomeAddress"
        data-test-id="update-home-address-cta"
        class="theme-btn btn btn-md btn-secondary d-flex align-items-center"
      >
        {{ slug?.cta.ctaLabel || '' }}
      </RouterLink>
      </div>
    </BaseCard>
  </section>
</template>
