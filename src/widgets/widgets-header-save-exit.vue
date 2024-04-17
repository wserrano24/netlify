<script setup lang="ts">
import { IconNames, IconSizes } from '@/constants/icons';
import { Colors } from '@/constants/colors';
import { Routes } from '@/constants/pages';
import { onMounted, ref } from 'vue';
import useContentfulSlug from '@/composables/useContentfulSlug';
import GlobalApplicationHeader from '@/components/global/GlobalApplicationHeader.vue';
import BaseIcon from '@/components/base/BaseIcon.vue';


const content = {
  backCta: Routes.Dashboard,
  backLabel: 'back',
  dataTestId: 'personal-information-header',
};

const slug = ref();
onMounted(async ()=>{
  slug.value = await useContentfulSlug({ slug: 'widget-header-save-exit', contentTypeId: 'pageWidgetHeader' });
})
</script>

<template>
  <GlobalApplicationHeader>
    <template #left>
      <router-link
        :aria-label="content.backLabel"
        :to="content.backCta"
        :data-testid="`${content.dataTestId}-back-cta`"
      >
        <BaseIcon
          :color="Colors.Black"
          :name="IconNames.ArrowLeft"
          :size="IconSizes.Medium"
        />
      </router-link>
    </template>
    <template #right>
      <button
        aria-controls="exitModal"
        class="btn btn-link"
        data-bs-target="#exitModal"
        data-bs-toggle="modal"
        :data-testid="`${content.dataTestId}-exit-modal`"
      >
        {{ slug?.cta.ctaLabel }}>
      </button>
    </template>
  </GlobalApplicationHeader>
</template>
