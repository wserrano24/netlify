<script setup lang="ts">
import { IconNames, IconSizes } from '@/constants/icons';
import { Colors } from '@/constants/colors';
import { ModalIds } from '@/constants/modal-ids';
import { Routes } from '@/constants/pages';
import { throttleFunc } from '@/utils/throttle-debounce';
import { onMounted, onUnmounted, ref } from 'vue';
import useContentfulSlug from '@/composables/useContentfulSlug';
import BaseIcon from '@/components/base/BaseIcon.vue';
import WidgetsCtaGlobalNavigationMobile from './widgets-cta-global-navigation-mobile.vue';
import WidgetsCtaGlobalNavigationDesktop from './widgets-cta-global-navigation-desktop.vue';
import WidgetsCtaProfileLogout from './widgets-cta-profile-logout.vue';
import WidgetsModalProfileLogout from './widgets-modal-profile-logout.vue';
import WidgetsHeaderGlobalNavigation from './widgets-header-global-navigation.vue';


const slug = ref()

const notificationAlertsLabel = 'New notification alerts',
  dataTestId = 'global-navigation',
  hamburgerLabel = 'Open Menu',
  hasNotification = true,
  menuLabel = 'menu';

const scrollInterval = 25;
const minScrollPos = 80;

let prevScrollPosition = ref(0),
  isShowNavbar = ref(true);

const onScrollHandler = () => {
  // Get the current scroll position
  const currentScrollPosition =
    window.pageYOffset || document.documentElement.scrollTop;
  // Because of momentum scrolling on mobiles, we shouldn't continue if it is less than zero
  if (currentScrollPosition < 0) {
    return;
  }
  // Here we determine whether we need to show or hide the navbar
  isShowNavbar.value =
    currentScrollPosition < prevScrollPosition.value
      ? true
      : currentScrollPosition < minScrollPos;

  // Set the current scroll position as the last scroll position
  prevScrollPosition.value = currentScrollPosition;
};

const optimizedOnScrollHandler = throttleFunc(onScrollHandler, scrollInterval);

onMounted(() => {
  window.addEventListener('scroll', optimizedOnScrollHandler);
});

onMounted(async ()=>{
  slug.value = await useContentfulSlug({ slug: 'widget-logo-global-navigation', contentTypeId: 'page' });
})

onUnmounted(() => {
  window.removeEventListener('scroll', optimizedOnScrollHandler);
});
</script>

<template>
  <nav
    :class="[
      'navbar navbar-expand-lg theme-navbar',
      { 'theme-navbar--hide': !isShowNavbar },
    ]"
    :aria-label="menuLabel"
    :data-test-id="dataTestId"
  >
    <div class="container">
      <RouterLink
        :to="Routes.Dashboard"
        :data-test-id="`${dataTestId}-home-link`"
      >
          <img
            class="theme-brand-logo-mobile"
            :src="slug?.images.logoMobile.url"
            :alt="slug?.images.logoMobile.altText"
          />
          <img
            class="theme-brand-logo-desktop"
            :src="slug?.images.aaLogoDesktop.url"
            :alt="slug?.images.aaLogoDesktop.altText"
          />
      </RouterLink>
      <button
        :class="[
          'navbar-toggler',
          { 'theme-navbar-notification': hasNotification },
        ]"
        :aria-controls="ModalIds.SIDE_NAV_MENU_BAR"
        :aria-label="hamburgerLabel"
        :data-bs-target="`#${ModalIds.SIDE_NAV_MENU_BAR}`"
        :data-test-id="`${dataTestId}-open-menu`"
        aria-expanded="false"
        data-bs-toggle="offcanvas"
      >
        <BaseIcon
          :color="Colors.Black"
          :name="IconNames.HamburgerMenu"
          :size="IconSizes.Medium"
        />
      </button>
      <div
        :id="ModalIds.SIDE_NAV_MENU_BAR"
        class="offcanvas offcanvas-end theme-navbar-content"
      >
        <WidgetsHeaderGlobalNavigation />
        <div class="theme-menu-links-mobile">
          <WidgetsCtaGlobalNavigationMobile />
        </div>
        <div class="theme-menu-links-desktop">
          <!-- <WidgetsCtaGlobalNavigationDesktop /> -->
        </div>
        <div class="theme-nav-footer">
          <WidgetsCtaProfileLogout />
          <WidgetsModalProfileLogout />
        </div>
      </div>
    </div>
  </nav>
</template>
