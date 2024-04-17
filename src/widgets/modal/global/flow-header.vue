<script setup lang="ts">
import { IconNames, IconSizes } from '@/constants/icons';
import { Colors } from '@/constants/colors';
import { Routes } from '@/constants/pages';
import useContentfulSlug from '@/composables/useContentfulSlug';
import {onMounted, ref } from 'vue';

import GlobalApplicationHeader from '@/components/global/GlobalApplicationHeader.vue';
import BaseIcon from '@/components/base/BaseIcon.vue';


const slug = ref();

interface Props {
  previousRoute?: Routes;
  exitRoute?: Routes;
  showLogo?: boolean;
  dataTestId?: string;
}

const props = withDefaults(defineProps<Props>(), {
  previousRoute: undefined,
  exitRoute: undefined,
  showLogo: false,
  dataTestId: 'undefined-flow-header',
});

onMounted(async () => {

  slug.value = await useContentfulSlug({slug: 'widget-header-global',contentTypeId: 'page',});

});


</script>

<template>
  <GlobalApplicationHeader>
    <template v-if="props.previousRoute" #left>
      <RouterLink
        :to="props.previousRoute"
      >
        <BaseIcon
          aria-label="back"
          :color="Colors.Black"
          :name="IconNames.ArrowLeft"
          :size="IconSizes.Medium"
          style="cursor: pointer"
        />
      </RouterLink>
    </template>
    <template v-if="props.showLogo" #center>
      <span class="theme-loan-origination-header-small-logo-mobile">
        <img
          :src="slug?.images.advanceAmericaLogo.url"
          :alt="slug?.images.advanceAmericaLogo.altText"
        />
      </span>
    </template>
    <template v-if="props.exitRoute || props.showLogo" #right>
      <div v-if="props.exitRoute">
        <button
          aria-controls="applicationExitModal"
          class="btn btn-link theme-loan-application-exit-modal-link"
          data-bs-target="#applicationExitModal"
          data-bs-toggle="modal"
        >
          {{ slug?.labels.exitLabel }}
        </button>
      </div>
      <div v-if="props.showLogo && !props.exitRoute">
        <span class="theme-loan-origination-header-small-logo-desktop">
          <img
            :src="slug?.images.advanceAmericaLogo.url"
            :alt="slug?.images.advanceAmericaLogo.altText"
          />
        </span>
      </div>
    </template>
  </GlobalApplicationHeader>
</template>
