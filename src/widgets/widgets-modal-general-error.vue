<script setup lang="ts">
import ApplicationDescription from '@/components/ApplicationDescription.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import BaseModal from '@/components/base/BaseModal.vue';
import useContentfulSlug from '@/composables/useContentfulSlug';
import { useErrorModal } from '@/composables/useError';
import { onBeforeUnmount, onMounted, ref, watchEffect } from 'vue';

const slug = ref()
const { isGeneralErrorModalVisible, showGeneralErrorModal } = useErrorModal();
const showModal = ref(false);
const isNotInstanciated = isGeneralErrorModalVisible.value && !showModal.value;

interface Props {
  showMe?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showMe: false,
});

if (isNotInstanciated) {
  showModal.value = true;
}

onBeforeUnmount(() => {
  showGeneralErrorModal(false);
});

onMounted(async ()=>{
  slug.value = await useContentfulSlug({slug: 'widget-modal-404', contentTypeId: 'page'});
})

const closeModal = () => {
  showModal.value = false;
  showGeneralErrorModal(false);
};

watchEffect(() => {
  showModal.value = props.showMe;
})
</script>

<template>
  <!-- <ClientOnly> -->
    <BaseModal
      id="general-error"
      variation="secondary"
      data-test-id="modal-general-error"
      :show-me="showModal"
      @handle-hide="closeModal"
    >
      <template #default>
        <ApplicationDescription type="modal">
          <h1 class="text-center">{{ slug?.title }}</h1>
          <p class="text-center">{{ slug?.copy }}</p>
        </ApplicationDescription>
        <BaseButton
          variation="secondary"
          data-test-id="modal-general-error"
          :label="slug?.labels.saveButton"
          data-bs-dismiss="modal"
          @mousedown="closeModal"
          @click="closeModal"
        />
      </template>
      <template #footer>
        <img
          v-if="slug?.images.url"
          :alt="slug?.images.altText"
          :src="slug?.images.url"
        />
      </template>
    </BaseModal>
  <!-- </ClientOnly> -->
</template>
