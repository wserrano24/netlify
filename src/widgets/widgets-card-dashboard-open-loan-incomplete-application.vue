<script setup lang="ts">
import { Colors } from '@/constants/colors';
import { IconNames } from '@/constants/icons';
import { Pages, Routes } from '@/constants/pages';
import { TrackGTMEvent } from '@/composables/useGTMtrackEvent';
import { onMounted, ref } from 'vue';
import useContentfulSlug from '@/composables/useContentfulSlug';
import { useApplicationProcess } from '@/composables/useApplicationProcess';
import { useSessionStorage } from '@/composables/useSessionStorage';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseIcon from '@/components/base/BaseIcon.vue';

const WIDGET_NAME = 'incomplete-application-open-loan';
const link = ref('');
const showWidget = ref(false);

const slug = ref()

const handleGTM = () => {
  const customerVariable =
    link.value === Routes.LoanOriginationReapplyOffers
      ? 'RC'
      : link.value === Routes.LoanOriginationRefinanceOffers
      ? 'REF'
      : link.value === Routes.LoanOriginationInStoreFinalize
      ? 'NC - IS'
      : 'NC';
  TrackGTMEvent(`pwa - ${customerVariable} - Apply Now`);
};

onMounted(async () => {
  slug.value = await useContentfulSlug({
    slug: 'widget-description-open-loan-incomplete-application-youve-got-loans',
    contentTypeId: 'pageWidgetDescription',
  });

  const { getApplicationStatus } = useApplicationProcess();
  const { nextRedirectUrl, isShowOpenLoanCard, isUserPendingEsign } = await getApplicationStatus();
  const { setItem } = useSessionStorage();
  setItem('hasAppPendingEsign', isUserPendingEsign() ?? false);

  link.value = nextRedirectUrl();
  showWidget.value = isShowOpenLoanCard;
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
          :style="{
            backgroundImage: `url(${slug?.images.backgroundLogo.url})`,
          }"
        />
        <div class="theme-complete-application-logo">
          <img
            :alt="slug?.images.aaLogoBlue.altText"
            :src="slug?.images.aaLogoBlue.url"
          />
        </div>
        <h2 class="theme-complete-application-heading">
          {{ slug?.title }} <br />
          {{ slug?.copy.youveGotLoanOffersAlmostThere0 }}
        </h2>
      </div>
      <div class="theme-complete-application-cta">
        <RouterLink
          :to="link"
          :data-testid="`${WIDGET_NAME}-link`"
          class="theme-complete-application-link"
          @click="handleGTM"
        >
          <BaseIcon :name="IconNames.ArrowRight" :color="Colors.White" />
        </RouterLink>
      </div>
      <div class="theme-complete-application-bottom">
        <h3 class="theme-complete-application-bottom-title">
          {{ slug?.copy.youveGotLoanOffersAlmostThere1 }}
        </h3>
        <p>{{ slug?.copy.youveGotLoanOffersAlmostThere2 }}</p>
      </div>
    </BaseCard>
  </section>
</template>
