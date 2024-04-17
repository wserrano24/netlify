<script setup lang="ts">
import { Colors } from '@/constants/colors';
import { IconNames } from '@/constants/icons';
import BaseIcon from './base/BaseIcon.vue';

interface Props {
  dataTestId: string;
  date?: string;
  iconName: IconNames;
  label: string;
  paymentDue?: string;
}

defineProps<Props>();
</script>

<template>
  <div class="theme-loan-tracker-banner" :data-test-id="dataTestId">
    <BaseIcon :color="Colors.AABlackBlue" :name="iconName" /> {{ paymentDue }} {{ label }} {{ date }}
  </div>
</template>