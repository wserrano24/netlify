<script setup lang="ts">
import useContentfulImage from '@/composables/useContentfulImage';
import useContentfulSlug from '@/composables/useContentfulSlug';
import { Colors } from '@/constants/colors';
import { IconNames } from '@/constants/icons';
import { MoneyCardRoutes } from '@/constants/pages';
import BaseCard from './base/BaseCard.vue';
import BaseIcon from './base/BaseIcon.vue';
import { onMounted, ref } from 'vue';


const contentfulSlug = ref()
const contentfulImage = ref()
interface Props {
  dataTestId: string;
}
withDefaults(defineProps<Props>(), {
  dataTestId: '',
});
/**
 * Based upon card type which is coming from CMS, selecting different icon colors.
 */
const moneyCardType = {
  visa: {
    redirectUri: MoneyCardRoutes.VisaCard,
    color: Colors.White,
  },
  'Western Union': {
    redirectUri: MoneyCardRoutes.WesternUnion,
    color: Colors.Black,
  },
};

onMounted(async ()=>{
  contentfulSlug.value = await useContentfulSlug({
    slug: 'widget-western-union',
    contentTypeId: 'pageWidgetDescription',
  });
  contentfulImage.value = await useContentfulImage('6Nq1Nn237hCstx80uqKQk4');
});
</script>

<template>
  <BaseCard
    is-base-card
    :class="`theme-money-card theme-money-card-${contentfulSlug?.title}`"
    :data-test-id="`${dataTestId}-money-card`"
  >
    <div class="theme-money-card-logo">
      <img :src="contentfulImage?.url" :alt="contentfulImage?.altText" />
    </div>
    <div>
      <p class="theme-money-card-title">{{ contentfulSlug?.title || '' }}</p>

      <div class="d-flex justify-content-between">
        <p class="theme-money-card-description">
          {{ contentfulSlug?.copy || '' }}
        </p>
        <RouterLink
          :to="
            moneyCardType?.[contentfulSlug?.title]?.redirectUri ||
            '/dashboard'
          "
          class="theme-money-card-link"
          :data-test-id="`${dataTestId}-link`"
          target="_blank"
        >
          <BaseIcon :name="IconNames.ArrowRight" :color="'#efeeef'" />
        </RouterLink>
      </div>
    </div>
  </BaseCard>
</template>
<style scoped>
* {
  background-color: #0c0006;
  color: #ffffff !important;
}
img {
  max-width: 237px;
  max-height: 28.51px;
}
</style>
