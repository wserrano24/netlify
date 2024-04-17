<script setup lang="ts">
import { Colors } from '@/constants/colors';
import { IconNames } from '@/constants/icons';
import { formatDate } from '@/composables/schemas/useDate';
import BaseIcon from './base/BaseIcon.vue';

interface Props {
  dataTestId: string;
  date?: string;
  iconName: IconNames;
  label: string;
}

defineProps<Props>();
</script>

<template>
  <div class="theme-loan-tracker-banner" :data-test-id="dataTestId">
    <BaseIcon :color="Colors.AABlackBlue" :name="iconName" />
    {{ label }} {{ formatDate(date) }}.
  </div>
</template>
