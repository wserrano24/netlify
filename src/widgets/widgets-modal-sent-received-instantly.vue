<script setup lang="ts">
import ApplicationDescription from '@/components/ApplicationDescription.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import BaseModal from '@/components/base/BaseModal.vue';
import useContentfulSlug from '@/composables/useContentfulSlug';
import { ModalIds } from '@/constants/modal-ids';
import { onMounted, ref } from 'vue';

const slug = ref();
onMounted(async ()=>{
  slug.value = await useContentfulSlug({slug: 'widget-modal-loan-tracker-card-money-sent-and-received', contentTypeId: 'page'});
})
const testId = 'money-sent-and-received-instantly';
</script>

<template>
    <BaseModal
      :id="ModalIds.MONEY_SENT_AND_RECEIVED_INSTANTLY_INFO"
      variation="secondary"
      :data-test-id="testId"
    >
      <template #default>
        <ApplicationDescription type="modal">
          <h1>{{ slug?.title }}</h1>
          <p>{{ slug?.copy }}</p>
        </ApplicationDescription>
        <BaseButton
          variation="secondary"
          data-bs-dismiss="modal"
          :data-test-id="testId"
          :label="slug?.labels?.saveButton"
        />
      </template>
      <template #footer>
        <img
          v-if="slug?.images?.url"
          :alt="slug?.images?.altText"
          :src="slug?.images?.url"
        />
      </template>
    </BaseModal>
</template>
