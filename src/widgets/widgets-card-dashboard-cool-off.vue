<script setup lang="ts">
import BaseCard from '@/components/base/BaseCard.vue';
import useContentfulSlug from '@/composables/useContentfulSlug';
import { onMounted, ref } from 'vue';
import WidgetsBannerDashboardCoolOff from './widgets-banner-dashboard-cool-off.vue';

const showWidget = ref(true);
const slug = ref()

onMounted(async ()=>{
  slug.value = await useContentfulSlug({ slug: 'widget-description-application-cool-off', contentTypeId: 'pageWidgetDescription' });
});
</script>

<template>
  <section v-if="showWidget" class="theme-complete-application">
    <BaseCard :data-test-id="'banner-cool-off'" is-base-card>
      <div class="theme-complete-application-top">
        <div
          class="theme-complete-application-icon"
          :style="{ backgroundImage: `url(${slug?.images?.backgroundLogo?.url})` }"
        />
        <div class="theme-complete-application-logo">
          <img :alt="slug?.images?.aaLogoBlue?.altText" :src="slug?.images?.aaLogoBlue?.url" />
        </div>
          <h2 class="theme-complete-application-heading">
            {{ slug?.title }}
          </h2>
      </div>
      <div class="theme-complete-application-cta"></div>
      <div class="theme-complete-application-bottom">
        <h3 class="theme-complete-application-bottom-title">
          {{ slug?.copy?.titleCopy0 }}
        </h3>
          <p class="bottom-tile-description">{{ slug?.copy.titleCopy1 }}</p>
        <WidgetsBannerDashboardCoolOff />
      </div>
    </BaseCard>
  </section>
</template>

<style scoped>
.theme-complete-application-bottom-title {
  margin-top: 65px;
  font-size: 16px;
}
.theme-complete-application-heading {
  font-size: 36px;
}
.bottom-tile-description {
  margin-bottom: 35px;
  font-size: 16px;
}
</style>
