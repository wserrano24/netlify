<script setup lang="ts">
import { useApplyNowCtaState } from '@/composables/useApplyNowCtaState';
import useAvailLoan from '@/composables/useAvailLoan';
import useContentfulSlug from '@/composables/useContentfulSlug';
import { EligibleCards } from '@/constants/eligibility-loan-cards';
import { Routes } from '@/constants/pages';
import { computed, onBeforeMount, onMounted, ref } from 'vue';

const slug = ref()
const { getAvailLoan } = useAvailLoan();
const { getApplyNowCtaState } = useApplyNowCtaState();

const isStartApplication = ref(null);

onBeforeMount(async () => {
  const { isStartYourApplication } = await getApplyNowCtaState();
  isStartApplication.value = isStartYourApplication;
});

onMounted(async ()=>{
  slug.value = await useContentfulSlug({slug: 'widgets-cta-apply-now-global-navigation', contentTypeId: 'page'});
});

const showApplyNowCta = computed(() =>
  EligibleCards.includes(getAvailLoan.value?.data?.showCard)
);
</script>

<template>
    <RouterLink
      v-if="showApplyNowCta || isStartApplication"
      :to="
        isStartApplication ? Routes.PersonalInformation : Routes.LoanInformation
      "
      data-test-id="header-apply-now-cta"
      class="theme-btn-desktop theme-btn-desktop-apply-now theme-btn btn btn-md btn-primary"
    >
      {{ slug?.cta.applyLoan || '' }}
    </RouterLink>
</template>
