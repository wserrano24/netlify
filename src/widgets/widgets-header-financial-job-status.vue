<script setup lang="ts">
import { IconNames, IconSizes } from '@/constants/icons';
import { Colors } from '@/constants/colors';
import { Routes } from '@/constants/pages';
import { useRedirectValidState } from '@/composables/useRedirectValidState';
import GlobalApplicationHeader from '@/components/global/GlobalApplicationHeader.vue';
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import useContentfulSlug from '@/composables/useContentfulSlug';
import BaseIcon from '@/components/base/BaseIcon.vue';

const router = useRouter();


const slug = ref();
onMounted(async () => {
  slug.value = await useContentfulSlug({ slug: 'widget-header-global', contentTypeId: 'page' });
})
const content = {
  backLabel: 'back',
  dataTestId: 'financial-job-status-header',
};

// Gets value for conditional redirecting on job status page
const { getRedirectValidState } = useRedirectValidState();

function redirect() {
  if (getRedirectValidState.value) {
    router.push(Routes.FinancialSummary);
    return;
  }
  router.push(Routes.FinancialBankInformation);
}
</script>

<template>
  <GlobalApplicationHeader>
   <!-- <template #left>
      <router-link
        :aria-label="content.backLabel"
        :data-testid="`${content.dataTestId}-back-cta`"
        @click="redirect"
      >
        <BaseIcon
          :color="Colors.Black"
          :name="IconNames.ArrowLeft"
          :size="IconSizes.Medium"
        />
      </router-link>
    </template>-->
    <template #right>
        <button
          aria-controls="exitModal"
          class="btn btn-link"
          data-bs-target="#exitModal"
          data-bs-toggle="modal"
          :data-testid="`${content.dataTestId}-exit-modal`"
        >
          {{ slug?.cta.ctaLabel }}
        </button>
    </template>
  </GlobalApplicationHeader>
</template>
