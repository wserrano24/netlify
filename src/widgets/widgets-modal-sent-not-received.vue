<script setup lang="ts">
import ApplicationDescription from '@/components/ApplicationDescription.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import BaseModal from '@/components/base/BaseModal.vue';
import useContentfulSlug from '@/composables/useContentfulSlug';
import { ModalIds } from '@/constants/modal-ids';
import { onMounted, ref } from 'vue';

const slug = ref();
onMounted(async ()=>{
  slug.value = await useContentfulSlug({slug: 'widget-modal-loan-tracker-card-money-sent-and-not-received', contentTypeId: 'page'});
})
</script>

<template>
    <BaseModal
      :id="ModalIds.MONEY_SENT_BUT_NOT_RECEIVED_INFO"
      variation="secondary"
      data-test-id="money-sent-and-not-received"
    >
      <template #default>
        <ApplicationDescription type="modal">
          <h1>{{ slug?.title }}</h1>
          <p>{{ slug?.copy?.loanTrackerMoneySentNotreceivedModalContent0 }}</p>
          <p>{{ slug?.copy?.loanTrackerMoneySentNotreceivedModalContent1 }}</p>
        </ApplicationDescription>
        <BaseButton
          variation="secondary"
          data-bs-dismiss="modal"
          data-test-id="money-sent-and-not-received"
          :label="slug?.labels?.saveButton"
        />
      </template>
      <template #footer>
        <img
          v-if="slug?.images?.url"
          :src="slug?.images?.url"
          :alt="slug?.images?.altText"
        />
      </template>
    </BaseModal>
</template>
