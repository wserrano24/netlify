<script setup lang="ts">
import { IconNames, IconSizes } from '@/constants/icons';
import { Colors } from '@/constants/colors';
import { Routes } from '@/constants/pages';
import { useRoute } from 'vue-router';
import useContentfulSlug from '@/composables/useContentfulSlug';
import { onMounted, ref } from 'vue';
import GlobalApplicationHeader from '@/components/global/GlobalApplicationHeader.vue'
import BaseIcon from '@/components/base/BaseIcon.vue';

const slug = ref()

onMounted( async () => {      
  slug.value = await useContentfulSlug({ slug: 'widget-header-global', contentTypeId: 'page' })
});


const route = useRoute();

interface Props {
  previousRoute?: Routes | null;
  exitRoute?: Routes | null;
  showLogo?: boolean;
  dataTestId?: string;
}

const props = withDefaults(defineProps<Props>(), {
  // will not show feature unless defined
  previousRoute: null,
  exitRoute: null,
  showLogo: false,
  dataTestId: 'undefined-flow-header',
});
</script>

<template>
  <GlobalApplicationHeader>
    <template v-if="props.previousRoute" #left>
      <RouterLink :to="props.previousRoute">
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
          :data-testid="`${props.dataTestId}-exit-cta`"
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
