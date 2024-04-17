<script setup lang="ts">
import { useApplyNowCtaState } from '@/composables/useApplyNowCtaState';
import useAvailLoan from '@/composables/useAvailLoan';
import useContentfulSlug from '@/composables/useContentfulSlug';
import useCtaRoute from '@/composables/useCtaRoute';
import { EligibleCards } from '@/constants/eligibility-loan-cards';
import { Routes } from '@/constants/pages';
import { computed, onBeforeMount, onMounted, ref } from 'vue';
const { mapCtaRoutes } = useCtaRoute();

const slug = ref()
const { getAvailLoan } = useAvailLoan();
const { getApplyNowCtaState } = useApplyNowCtaState();

const isStartApplication = ref(null);

onBeforeMount(async () => {
  const { isStartYourApplication } = await getApplyNowCtaState();
  isStartApplication.value = isStartYourApplication;
});

onMounted(async ()=>{
  slug.value = await useContentfulSlug({slug: 'widget-cta-global-navigation-mobile', contentTypeId: 'page'});
});

const showApplyNowCta = computed(() =>
  EligibleCards.includes(getAvailLoan.value?.data?.showCard)
);
</script>

<template>
  <ul role="menubar" class="theme-menubar">
    <li
      v-for="(item, index) in slug?.cta.globalNavigationCtas.ctas || [1, 2, 3, 4, 5, 6, 7]"
      :key="`link-${index}`"
      class="theme-menuitem"
      data-bs-dismiss="offcanvas"
      role="menuitem"
    >

      <!-- TODO: handle active class dynamically when navigation is used in multiple pages  -->
      <RouterLink
        :data-test-id="`global-navigation-mobile-cta-${index}`"
        :GTMTrackEvent="`PWA - NAV - ${item}`"
        :to="
          !showApplyNowCta &&
          isStartApplication &&
          item === 'Apply for a loan'
            ? Routes.PersonalInformation
            : mapCtaRoutes(item)
        "
        :class="['nav-link theme-nav-link', { 'active-link': index === 0 }]"
      >
        {{
          !showApplyNowCta &&
          !isStartApplication &&
          item === 'Apply for a loan'
            ? null
            : item
        }}
      </RouterLink>

    </li>
  </ul>
</template>
