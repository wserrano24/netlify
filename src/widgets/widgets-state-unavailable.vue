<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue';
import BaseModal from '@/components/base/BaseModal.vue';
import useContentfulSlug from '@/composables/useContentfulSlug';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';


const router = useRouter()
interface Props {
  unavailable?: boolean;
}

withDefaults(defineProps<Props>(), {
  unavailable: false,
});

const slug = ref()

const redirect = () => {
  // navigateTo('https://www.advanceamerica.net/', { external: true });
  router.push('https://www.advanceamerica.net/');
};

onMounted(async ()=>{
  slug.value = await useContentfulSlug({slug: 'widgets-modal-change-is-coming', contentTypeId: 'pagePageEarlyExitPage'});
})
</script>

<template>
  <!-- <ClientOnly> -->
    <BaseModal
      id="unavaliable-state-widget-modal"
      data-test-id="widget-state-unavaliable-modal"
      :show-me="unavailable"
      :variation="'secondary'"
      :close-modal="false"
    >
      <img v-if="slug?.images.url !== ''" :src="slug?.images.url" :alt="slug?.images.altText" />
      <h3>{{ slug?.copy.changeIsComingDescription0 }}</h3>
      <p>
        {{ slug?.copy.changeIsComingDescription1 }}
        <a :href="`https://www.advanceamerica.net/`">{{
          slug?.copy.changeIsComingDescription2
        }}</a>
      </p>
      <p>
        <b>{{ slug?.copy.changeIsComingDescription3 }}</b>
      </p>
      <p>
        {{ slug?.copy.changeIsComingDescription4 }}
      </p>

      <BaseButton
        data-test-id="button-widget-state-unavaliable"
        :variation="'secondary'"
        :label="slug?.labels.continueLabel"
        @click="redirect"
      ></BaseButton>
    </BaseModal>
  <!-- </ClientOnly> -->
</template>
<style scoped>
.modal-body {
  text-align: center;
}
</style>
