<script setup lang="ts">
import LoanApplicationInfoModal from '@/components/LoanApplicationInfoModal.vue';
import useContentfulSlug from '@/composables/useContentfulSlug';
import { onMounted, ref } from 'vue';

let slug =ref();

onMounted(async () => {

  slug.value = await useContentfulSlug({ slug: 'widget-modal-financial-payment-frequency', contentTypeId: 'page' });

});

</script>

<template>
  <LoanApplicationInfoModal :slug="slug" />
</template>
