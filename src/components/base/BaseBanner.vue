<script setup lang="ts">
import { BannerVariations, iconsVariations } from '@/constants/icon-variations';
import { IconNames, IconSizes } from '@/constants/icons';
import { Colors } from '@/constants/colors';
import { computed, useSlots } from 'vue';

type Link = { label: string; url: string; action(): void };

interface Props {
  dataTestId: string;
  description: string;
  heading: string;
  isWithCard?: boolean;
  link?: Link;
  variation?: BannerVariations;
  isLoading?: boolean;
  isPhoneNumber?: boolean;
}

const { icon: isIconSlotPresent } = useSlots();

const props = withDefaults(defineProps<Props>(), {
  variation: 'success',
  iconColor: Colors.Black,
  iconName: IconNames.AlertCircle,
  isWithCard: false,
  isLoading: false,
  link: () => ({
    label: '',
    url: '',
    action: () => {null},
  }),
  isPhoneNumber: false,
});

const themeBannerClass = computed(() => [
  'theme-banner justify-content-between',
  {
    ['theme-banner-with-card']: props.isWithCard, // Will keep border radius at bottom only, for mobile and desktop while using with card.
  },
  `theme-banner-${props.variation}`, // For different variations
]);

// If isIconSlotPresent = true, then iconCenterClass will keep icons center for a mobile view.
const iconCenterClass = computed(() => [
  {
    [`d-flex align-items-center align-items-md-start`]: isIconSlotPresent,
  },
]);
</script>

<template>
  <div
    :class="themeBannerClass"
    role="banner"
    :data-test-id="`${dataTestId}-banner`"
  >
    <div class="d-flex justify-content-between">
      <div class="d-flex">
        <BaseIcon
          :class="iconCenterClass"
          :name="iconsVariations[variation].name"
          :color="iconsVariations[variation].color"
          :size="IconSizes.Large"
        />
        <div class="theme-banner-content">
          <BaseSkeletonLoader :is-loading="isLoading">
            <p>{{ heading }}</p>
          </BaseSkeletonLoader>
          <BaseSkeletonLoader :is-loading="isLoading">
            <p>
              {{ description }}
              <NuxtLink
                v-if="link?.url && link?.label"
                :href="(props.isPhoneNumber ? 'tel:' : '') + (link?.url || '')"
                :data-test-id="`${dataTestId}-banner-link`"
                @click="props.link.action()"
              >
                {{ link.label }}
              </NuxtLink>
            </p>
          </BaseSkeletonLoader>
        </div>
      </div>
      <div
        v-if="isIconSlotPresent"
        :class="iconCenterClass"
        class="theme-banner-action-container d-md-none"
      >
        <slot name="icon"></slot>
      </div>
    </div>
  </div>
</template>
