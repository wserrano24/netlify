<script setup lang="ts">
import ApplicationDescription from '@/components/ApplicationDescription.vue';
import useContentfulSlug from '@/composables/useContentfulSlug';
import { onMounted, ref } from 'vue';
import WidgetsModalInfoFinancialJobStatus from './widgets-modal-info-financial-job-status.vue';

const slug = ref();
onMounted(async () => {
  slug.value = await useContentfulSlug({slug: 'widget-description-financial-job-status', contentTypeId: 'page'});
})
</script>

<template>
  <ApplicationDescription>
    <h1>{{ slug?.title }}</h1>
    <p>{{ slug?.copy }}</p>
      <WidgetsModalInfoFinancialJobStatus />
  </ApplicationDescription>
</template>
