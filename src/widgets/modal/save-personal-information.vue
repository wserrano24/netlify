<script setup lang="ts">
  import { useApplicationProcess } from '@/composables/useApplicationProcess';
  import useContentfulSlug from '@/composables/useContentfulSlug';
  import { usePage } from '@/composables/usePage';
  import { Routes } from '@/constants/pages';
  import { getFormDataValues } from '@/utils/getFormDataValues';
  import { onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import BaseModal from '@/components/base/BaseModal.vue';
  import ApplicationDescription from '@/components/ApplicationDescription.vue';
  import BaseButton from '@/components/base/BaseButton.vue';

  const { updateApplicationProcess } = useApplicationProcess();
  const slug = ref()
  const router = useRouter();
  const isLoading = ref(false);

  onMounted(async ()=> {
    slug.value = await useContentfulSlug({slug: 'widget-modal-application-exit', contentTypeId: 'page'});
  });

  async function handleExitClick() {
    isLoading.value = true;
    const form = document.querySelector('form');
    const formData = form ? getFormDataValues(form) : {};
    const { getPageName } = usePage();
    const currentRoute = router.currentRoute.value.path;
    const page = getPageName(currentRoute);

    await updateApplicationProcess({ page, data: formData, isSaveAndExit: true });

    router.push(Routes.ExitAplication);
  }
</script>

<template>
    <BaseModal
      id="exitModal"
      variation="secondary"
      data-test-id="pi-save-modal"
      @handle-hide="isLoading = false"
    >
      <template #default>
        <ApplicationDescription type="modal">
          <h1>{{ slug?.title }}</h1>
          <p>
            {{ slug?.copy }}
          </p>
        </ApplicationDescription>
        <div>
          <BaseButton
            data-test-id="pi-save-modal-exit"
            label="exit"
            :is-loading="isLoading"
            :is-disabled="isLoading"
            variation="secondary"
            @click="handleExitClick"
          />
        </div>
      </template>
      <template #footer>
        <img
          class="theme-modal-footer-image"
          :alt="slug?.images.altText"
          :src="slug?.images.url"
        />
      </template>
    </BaseModal>
</template>