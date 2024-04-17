<script setup lang="ts">
import ApplicationDescription from '@/components/ApplicationDescription.vue';
import BaseModal from '@/components/base/BaseModal.vue';
import useContentfulSlug from '@/composables/useContentfulSlug';
import { onMounted, ref } from 'vue';



const slug = ref();
onMounted(async ()=>{
  slug.value = await useContentfulSlug({slug: 'widget-modal-personal-information-terms-privacy', contentTypeId: 'page'});
})

</script>

<template>
    <BaseModal
      id="termsModal"
      variation="primary"
      data-test-id="pi-modal-terms"
      position="bottom"
    >
      <template #default>
        <ApplicationDescription>
          <h2>{{ slug?.title }}</h2>
          <p v-for="(copy, key) in slug?.copy" :key="key">{{ copy }}</p>
        </ApplicationDescription>
      </template>
    </BaseModal>
</template>
