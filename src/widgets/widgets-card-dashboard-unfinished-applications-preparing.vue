<script setup lang="ts">
import { Colors } from '@/constants/colors';
import { IconNames } from '@/constants/icons';
import { Pages } from '@/constants/pages';
import { TrackGTMEvent } from '../composables/useGTMtrackEvent';
import { onMounted, ref } from 'vue';
import useContentfulSlug from '@/composables/useContentfulSlug';
import { useApplicationProcess } from '@/composables/useApplicationProcess';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseIcon from '@/components/base/BaseIcon.vue';
const WIDGET_NAME = 'theme-complete-application';
const link = ref('');
const showWidget = ref(false);

const slug = ref()

onMounted(async () => {
  slug.value = await useContentfulSlug({ slug: 'widget-description-open-loan-incomplete-application-preparing', contentTypeId: 'page' });
  const { getApplicationStatus } = useApplicationProcess();
  const { nextRedirectUrl, isShowUnfinishedApplicationCard } =
    await getApplicationStatus();
  link.value = nextRedirectUrl();
  showWidget.value = isShowUnfinishedApplicationCard;
  // showWidget.value = true;
});
</script>

<template>
  <section
    v-if="showWidget"
    class="theme-complete-application theme-dashboard-card-section"
  >
    <BaseCard :data-test-id="`${Pages.Dashboard}-${WIDGET_NAME}`" is-base-card>
      <div class="theme-complete-application-top">
        <div
          class="theme-complete-application-icon"
          :style="{ backgroundImage: `url(${slug?.images.backgroundLogo.url})` }"
        />
        <div class="theme-complete-application-logo">
          <img :alt="slug?.images.aaLogoBlue.altText" :src="slug?.images.aaLogoBlue.url" />
        </div>
        <h2 class="theme-complete-application-heading">
          {{ slug?.title }}
        </h2>
      </div>
      <div class="theme-complete-application-cta">
        <RouterLink
          :to="link"
          :data-testid="`${WIDGET_NAME}-link`"
          class="theme-complete-application-link"
          @click="TrackGTMEvent('pwa - Restart App')"
        >
          <BaseIcon :name="IconNames.ArrowRight" :color="Colors.White" />
        </RouterLink>
      </div>
      <div class="theme-complete-application-bottom">
        <h3 class="theme-complete-application-bottom-title">
          {{ slug?.copy.letsWrapThingsUp0 }}
        </h3>
        <p>{{ slug?.copy.letsWrapThingsUp1 }}</p>
      </div>
    </BaseCard>
  </section>
</template>
