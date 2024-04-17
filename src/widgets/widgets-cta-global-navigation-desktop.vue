<script setup lang="ts">

import useContentfulSlug from '@/composables/useContentfulSlug';
import { computed, onMounted, ref } from 'vue';

const slug = ref()

onMounted(async ()=>{
  slug.value = await useContentfulSlug({slug: 'widget-cta-global-navigation-desktop', contentTypeId: 'page'});
});

const routesUrls = computed(() => ({
  dashboardLabel: "/dashboard",
  findStore: "/store-locator",
  loanHistory: "/loan-history"
}))
</script>

<template>
  <ul role="menubar" class="theme-menubar">
    <li
      v-for="(item, index) in slug?.cta.globalNavigationDesktopCTA.ctas || [1, 2, 3]"
      :key="`link-${index}`"
      :data-test-id="`global-navigation-desktop-cta-${index}`"
      class="theme-menuitem"
      data-bs-dismiss="offcanvas"
      role="menuitem"
    >
      <!-- TODO: handle active class dynamically when navigation is used in multiple pages  -->
      <RouterLink
        :data-test-id="`global-navigation-desktop-cta-${index}`"
        :to="routesUrls[index]"
        :class="['nav-link theme-nav-link', { 'active-link': !index }]"
      >
        {{ item }}
      </RouterLink>
    </li>
  </ul>
</template>
