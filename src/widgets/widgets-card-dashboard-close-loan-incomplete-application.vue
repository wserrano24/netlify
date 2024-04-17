<script setup lang="ts">
import { Pages, Routes } from '@/constants/pages';
import { TrackGTMEvent } from '@/composables/useGTMtrackEvent';
import useContentfulSlug from '@/composables/useContentfulSlug';
import { onMounted, ref } from 'vue';
import { useApplicationProcess } from '@/composables/useApplicationProcess';
import { useSessionStorage } from '@/composables/useSessionStorage';
import BaseCard from '@/components/base/BaseCard.vue';

const slug = ref()

const link = ref('');
const showWidget = ref(false);

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
  slug: 'widget-description-congratulations-youve-got-loan-offers-closed-loan', 
  contentTypeId: 'pageWidgetDescription'
});
  const { getApplicationStatus } = useApplicationProcess();
  const { nextRedirectUrl, isShowCloseLoanCard, isUserPendingEsign } = await getApplicationStatus();
  const { setItem } = useSessionStorage();
  setItem('hasAppPendingEsign', isUserPendingEsign() ?? false);

  link.value = nextRedirectUrl();
  showWidget.value = isShowCloseLoanCard;
});
</script>

<template>
  <section v-if="showWidget" class="theme-dashboard-card-section">
    <BaseCard
      class="theme-new-loan-card"
      :data-test-id="`${Pages.Dashboard}-incomplete-application-close-loan`"
      is-base-card
    >
      <div class="theme-new-loan-card-banner">
        <div class="theme-new-loan-card-logo">
          <img
            :alt="slug?.images.aaLogoBlue.altText"
            :src="slug?.images.aaLogoBlue.url"
            data-test-id="incomplete-application-close-loan-logo"
          />
        </div>
        <h2 data-test-id="incomplete-application-close-loan-title">
          {{ slug?.title }} <br />
          {{ slug?.copy.yourApplicationHasAlreadyBeenApproved0 }}
        </h2>
        <p data-test-id="incomplete-application-close-loan-copy">
          {{ slug?.copy.yourApplicationHasAlreadyBeenApproved1 || '' }}
        </p>
        <RouterLink
          :to="link"
          data-test-id="incomplete-application-close-loan-cta"
          class="theme-btn btn btn-md btn-secondary d-flex justify-content-center align-items-center"
          @click="handleGTM"
        >
          {{ slug?.cta.letsGo || '' }}
        </RouterLink>
      </div>
    </BaseCard>
  </section>
</template>

<style type="css" scoped>
@media (max-width: 575.98px) {
  .theme-btn,
  .theme-okta #okta-sign-in .o-form .button {
    height: 48px;
    min-width: 8rem;
  }
}
.theme-btn {
  letter-spacing: 0.5px;
}
</style>
