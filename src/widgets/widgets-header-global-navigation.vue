<script setup lang="ts">
import { IconNames, IconSizes } from '@/constants/icons';
import { Colors } from '@/constants/colors';
import { Routes } from '@/constants/pages';
import { onMounted, ref } from 'vue';
import usePersonalInfo from '@/composables/usePersonalInfo';
import WidgetsCtaApplyNowGlobalNavigation from './widgets-cta-apply-now-global-navigation.vue';
import BaseSkeletonLoader from '@/components/base/BaseSkeletonLoader.vue';
import BaseIcon from '@/components/base/BaseIcon.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import { useNotification } from '@/composables/useNotification';
import { useSession } from '@/composables/useSession';
import { useRouter } from 'vue-router';
import useContentfulSlug from '@/composables/useContentfulSlug';

// TODO: labels should be coming from contentful
const dataTestId = 'global-navigation-mobile-header',
  notificationLabel = 'Notifications',
  closeMenuLabel = 'Close menu',
  newNotificationLabel = 'New Notification alerts';

let username = ref(null);
// Used to show the skeleton loading till the api fetched user name
const isUserNamePending = ref(true);
const notification = useNotification();

async function handleExitClick() {
  const router = useRouter();
  const session = useSession();

  notification.updateMessage("Log out");
  await session.logOut();
  router.push(Routes.Login);
}

const slug= ref()

onMounted(async () => {
  const {getPersonalInfo} = usePersonalInfo()
  const { firstName = '', lastName = '' } = (await getPersonalInfo()) || {};
  slug.value = await useContentfulSlug({ slug: 'widget-cta-logout', contentTypeId: 'page' });
  isUserNamePending.value = false;
  username.value = `${firstName} ${lastName}`;
});

// TODO : Backend API integration to get the new notification flag
const hasNotification = ref(false);
</script>

<template>
  <div class="theme-nav-header">
    <WidgetsCtaApplyNowGlobalNavigation />

    <BaseSkeletonLoader
      :is-loading="isUserNamePending"
      :rows="[{ col: 12, size: 'sm' }]"
      class="theme-user-name theme-user-name-mobile"
    >
      <span class="theme-user-name theme-user-name-mobile">{{ username }}</span>
    </BaseSkeletonLoader>

    <BaseSkeletonLoader
      :is-loading="isUserNamePending"
      :rows="[{ col: 12, size: 'lg' }]"
      class="theme-user-icon theme-user-name-desktop"
    >
<!--    <BaseButton
          data-test-id="logout-user"
          :label="slug?.cta.logOut"
          variation="secondary"
          @click="handleExitClick"
        /> -->
        <RouterLink :to="'#'">
        <BaseIcon
          :color="Colors.White"
          :name="IconNames.User"
          :size="IconSizes.Medium"
          class="theme-user-icon theme-user-name-desktop"
          @click="handleExitClick"
        />
      </RouterLink> 
    </BaseSkeletonLoader>

    <div class="theme-button-wrapper">
      <!-- Notification bell icon is not part of MVP -->
      <button
        v-if="hasNotification"
        :data-test-id="`${dataTestId}-notification`"
        :aria-label="notificationLabel"
        class="navbar-toggler theme-notification-btn"
      >
        <BaseIcon
          :color="Colors.White"
          :name="IconNames.NotificationBell"
          :size="IconSizes.Medium"
        />
      </button>
      <button
        :data-test-id="`${dataTestId}-close-menu`"
        :aria-label="closeMenuLabel"
        class="navbar-toggler"
        data-bs-dismiss="offcanvas"
      >
        <BaseIcon
          :color="Colors.White"
          :name="IconNames.X"
          :size="IconSizes.Medium"
        />
      </button>
    </div>
  </div>
</template>
