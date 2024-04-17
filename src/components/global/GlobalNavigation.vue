<script setup lang="ts">
import { IconNames, IconSizes } from '@/constants/icons';
import { Colors } from '@/constants/colors';
import useContentfulImage from '@/composables/useContentfulImage';
import { onMounted, ref } from 'vue';
import BaseIcon from '../base/BaseIcon.vue';

interface Item {
  name: string;
  url: string;
}

interface Props {
  closeMenuLabel?: string;
  darkLabel: string;
  hamburgerLabel?: string;
  items: Item[];
  lightLabel: string;
  logOutLabel: string;
  membershipDateText: string;
  menuLabel: string;
  dataTestId: string;
  userName: string;
  hasNotification: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  closeMenuLabel: 'Close Menu',
  hamburgerLabel: 'Open Menu',
});

const image =ref()

onMounted( async () => {
  
  image.value = await useContentfulImage('1aLe1sspHYV0QPcjZoISmw');  
});


</script>
<template>
  <!-- TODO: Change "-xxxl" to "-sm" or "-md" once there are desktop designs -->
  <nav
    class="navbar navbar-expand-xxxl"
    :aria-label="props.menuLabel"
    :data-testid="props.dataTestId"
  >
    <!-- TODO: Remove "container-fluid" class when adding styles -->
    <div class="container-fluid">
      <router-link to="/" :data-testid="`${props.dataTestId}-home-link`">
        <img
          :src="image.url"
          :alt="image.altText"
        />
      </router-link>
      <button
        :class="[
          'navbar-toggler',
          { 'theme-navbar-notification': props.hasNotification },
        ]"
        data-bs-toggle="offcanvas"
        data-bs-target="#navbarMain"
        aria-controls="navbarMain"
        aria-expanded="false"
        :aria-label="props.hamburgerLabel"
        :data-testid="`${props.dataTestId}-open-menu`"
      >
        <BaseIcon
          :color="Colors.Black"
          :name="IconNames.HamburgerMenu"
          :size="IconSizes.Medium"
        />
      </button>
      <div id="navbarMain" class="offcanvas offcanvas-end theme-navbar-content">
        <button
          :data-testid="`${props.dataTestId}-close-menu`"
          :aria-label="props.closeMenuLabel"
          class="navbar-toggler"
          data-bs-dismiss="offcanvas"
        >
          <BaseIcon
            :color="Colors.White"
            :name="IconNames.X"
            :size="IconSizes.Large"
          />
        </button>

        <!-- TODO:
          Add the right data source for the user name and member since,
          this could come from a prop or a global state
        -->
        <span>{{ props.userName }}</span>
        <span>{{ props.membershipDateText }}</span>

        <ul role="menubar">
          <li
            v-for="(item, index) in props.items"
            :key="item.name"
            role="menuitem"
            data-bs-dismiss="offcanvas"
          >
            <router-link
              :data-testid="`${props.dataTestId}-navigation-item-${index}`"
              :to="item.url"
              class="nav-link"
            >
              {{ item.name }}
            </router-link>
          </li>
        </ul>
        <div>
          <!-- TODO: Add the functionality to logout and dark/light theme switch -->
          <router-link to="/" :data-testid="`${props.dataTestId}-log-out`">
            {{ props.logOutLabel }}
          </router-link>
          <BaseButton v-if="props.lightLabel" :label="props.lightLabel" />
          <BaseButton v-if="props.darkLabel" :label="props.darkLabel" />
        </div>
      </div>
    </div>
  </nav>
</template>
