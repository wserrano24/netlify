<script setup lang="ts">
import LoanApplicationInfoModal from '@/components/LoanApplicationInfoModal.vue';
import useContentfulSlug from '@/composables/useContentfulSlug';
import { onMounted, ref } from 'vue';


const slug = ref();
onMounted(async () => {
  slug.value = await useContentfulSlug({ slug: 'widget-modal-financial-job-status', contentTypeId: 'page' });
})
</script>

<template>
  <LoanApplicationInfoModal :slug="slug" />
</template>
