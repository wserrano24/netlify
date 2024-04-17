<script setup lang="ts">
import BaseCard from '@/components/base/BaseCard.vue';
import useContentfulSlug from '@/composables/useContentfulSlug';
import { onMounted, ref } from 'vue';

const slug = ref()
onMounted(async ()=>{
  slug.value = await useContentfulSlug({slug: 'widget-dashboard-loan-eligibility-card-not-qualified', contentTypeId: 'page'});
})
</script>
<template>
  <section class="theme-dashboard-card-section">
    <BaseCard
      is-base-card
      data-test-id="loan-not-qualified-card"
      class="theme-loan-info-card"
    >
      <h2 class="text-center">{{ slug?.title || '' }}</h2>
      <p class="text-center">{{ slug?.copy.copy || '' }}</p>
    </BaseCard>
  </section>
</template>
