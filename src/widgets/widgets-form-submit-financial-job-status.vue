<script setup lang="ts">
import BaseFormStepSubmit from '@/components/base/BaseFormStepSubmit.vue';
import useContentfulSlug from '@/composables/useContentfulSlug';
import { useFormValidState } from '@/composables/useFormValidState';
import { onMounted, reactive, ref } from 'vue';

const { getFormValidState } = useFormValidState();

const content = reactive({
  data: { cta: '', step: '' },
  id: 'formJobStatus',
  isEnabled: getFormValidState,
  isLoading: false,
  progress: 25,
});
const slug = ref();

onMounted(async () => {
  slug.value = await useContentfulSlug({ slug: 'widget-footer-global', contentTypeId: 'page' });
  content.data.cta = slug?.value.labels.nextLabel;
  content.data.step = slug?.value.labels.stepTwo;
})

</script>

<template>
  <BaseFormStepSubmit v-GTMTrackEvent="'pwa - NC - Step 2 - Job Status'" v-bind="content" />
</template>