<script setup lang="ts">
import ApplicationDescription from '@/components/ApplicationDescription.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import BaseModal from '@/components/base/BaseModal.vue';
import useContentfulSlug from '@/composables/useContentfulSlug';
import { useErrorModal } from '@/composables/useError';
import { ModalIds } from '@/constants/modal-ids';
import { Routes } from '@/constants/pages';
import { onBeforeMount, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const slug = ref()

const { is504ErrorModalVisible, show504ErrorModal } = useErrorModal();
const showModal = ref(false);
const isNotInstanciated = is504ErrorModalVisible?.value && !showModal.value;
const router = useRouter();
interface Props {
  showMe?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showMe: false,
});

if (isNotInstanciated) {
  showModal.value = true;
}

onBeforeMount(() => {
  if (
    router.options.history.state.back === Routes.PersonalSsn ||
    router.options.history.state.back === Routes.PersonalSummary ||
    router.options.history.state.back === Routes.LoanOriginationOffers ||
    router.options.history.state.back === Routes.LoanOriginationReapplyOffers
  ) {
    setTimeout(() => {
      shutModal();
    }, 1);
  }
});

onMounted(async ()=>{
  slug.value = await useContentfulSlug({ slug: '504-error-modal', contentTypeId: 'pagePageEarlyExitPage' });

})

onBeforeUnmount(() => {
  show504ErrorModal(false);
});

const shutModal = () => {
  showModal.value = false;
};
const emit = defineEmits(['close-modal']);

const closeModal = () => {
  showModal.value = false;
  show504ErrorModal(false);
  emit('close-modal');
};
</script>

<template>
  <!-- <ClientOnly> -->
    <BaseModal
      :id="ModalIds.FIVE_ZERO_FOUR_ERROR"
      variation="secondary"
      data-test-id="logout-user"
      :show-me="props.showMe || showModal"
      @handle-hide="closeModal"
    >
      <template #default>
        <ApplicationDescription type="modal">
          <h1>{{ slug?.title }}</h1>
          <p>{{ slug?.copy }}</p>
        </ApplicationDescription>
        <div class="base-button">
          <BaseButton
            data-test-id="logout-user"
            :label="'Try again'"
            variation="secondary"
            data-bs-dismiss="modal"
            @click="closeModal"
          />
        </div>
      </template>
      <template #footer>
        <img
          :src="slug?.images.url"
          class="theme-modal-footer-image"
          :alt="slug?.images.altText"
        />
      </template>
    </BaseModal>
  <!-- </ClientOnly> -->
</template>

<style scoped>
.base-button {
  padding-top: 20px;
}
</style>