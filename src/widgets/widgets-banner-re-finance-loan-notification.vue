<script setup lang="ts">
import { Routes } from '@/constants/pages';
import { ApplicationSummary, ProductSummary } from '../constants/product';
import useProductStore from '../stores/useProductStore';
import { TrackGTMEvent } from '../composables/useGTMtrackEvent';
import useContentfulSlug from '@/composables/useContentfulSlug';
import BaseBanner from '@/components/base/BaseBanner.vue';
import { onMounted, ref } from 'vue';

const { setProduct } = useProductStore();

const slug = ref();

interface Props {
  application: ApplicationSummary;
  isInstallmentPlusEligible: boolean;
  product: ProductSummary;
}

const props = withDefaults(defineProps<Props>(), {
  application: null,
  isInstallmentPlusEligible: false,
  product: null,
});

if (props.isInstallmentPlusEligible) {
  TrackGTMEvent("pwa - REF - FLEX");
}
onMounted(async ()=>{
  slug.value = await useContentfulSlug({slug: 'loan-card-refinance-banners', contentTypeId: 'resourceSet'});
})
</script>

<template>
  <div class="theme-product-details-alert-banner row">
    <div class="col-12">
      <BaseBanner
        v-if="application?.state === 'PENDING_ESIGN'"
        data-test-id="product-any-refi-banner-continue-refinance"
        :description="slug?.resources.loanCardContinue.refiBannerContent ?? ''"
        :heading="slug?.resources.loanCardContinue.refiBannerContentLabel ?? 'test'"
        :link="{
          label: slug?.resources.loanCardContinue.continueRefinance,
          url: Routes.LoanOriginationRefinanceOffers,
        }"
        :is-loading="false"
        variation="dark"
        :is-with-card="true"
      />
      <BaseBanner
        v-else-if="
          application?.state === 'UNDER_REVIEW' || application?.state === 'HOLD'
        "
        data-test-id="product-any-refi-banner-re-review"
        :description="slug?.resources.refiBannerInReview ?? ''"
        :heading="slug?.resources.refiBannerInReviewLabel ?? ''"
        :is-loading="false"
        variation="warning"
        :is-with-card="true"
      />
      <BaseBanner
        v-else-if="application?.state === 'ACTION_PENDING'"
        data-test-id="product-any-refi-banner-re-review"
        :description="
          slug?.resources.loanCardMissingDocs.refiBannerContent ?? ''
        "
        :heading="slug?.resources.refiBannerInReviewLabel ?? ''"
        :is-loading="false"
        :link="{
          label: slug?.resources.loanCardMissingDocs.uploadNow,
          url: Routes.UploadNewDocument + '?flow=dashboard',
        }"
        variation="error"
        :is-with-card="true"
      />
      <BaseBanner
        v-else-if="application?.state === 'OUT_FOR_DELIVERY'"
        data-test-id="product-any-refi-banner-congratulations"
        :description="
          slug?.resources.loanCardCongratulations.refiBannerContent ?? ''
        "
        :heading="slug?.resources.loanCardCongratulations.refiBannerContentLabel ?? ''"
        :is-loading="false"
        :link="{
          label: slug?.resources.loanCardCongratulations.refinanceSummary,
          url: Routes.Landing,
        }"
        variation="scheduled"
        :is-with-card="true"
      />
      <BaseBanner
        v-else-if="props.isInstallmentPlusEligible"
        data-test-id="product-installment-refi-banner-ilp-plus"
        :description="slug?.resources.loanCardStartNew.newRefiInstallmentPlus ?? ''"
        :heading="slug?.resources.loanCardStartNew.newRefiBannerTitlePlus ?? ''"
        :link="{
          label: slug?.resources.loanCardStartNew.learnMore,
          url: Routes.RefinanceInfoPlus,
          action: () => setProduct(props.product),
        }"
        :is-loading="false"
        variation="dark"
        @click="setProduct(props.product)"
        :is-with-card="true"
      />
      <BaseBanner
        v-else
        data-test-id="product-payday-refi-banner-need-more-time"
        :description="slug?.resources.loanCardStartNew.newRefiPayday ?? ''"
        :heading="slug?.resources.loanCardStartNew.newRefiBannerTitle ?? ''"
        :link="{
          label: slug?.resources.loanCardStartNew.learnMore,
          url: Routes.RefinanceInfo,
          action: () => setProduct(props.product),
        }"
        :is-loading="false"
        variation="dark"
        :is-with-card="true"
      />
    </div>
  </div>
</template>
