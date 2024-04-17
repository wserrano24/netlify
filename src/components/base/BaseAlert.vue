<script setup lang="ts">
import { IconNames, IconSizes } from '@/constants/icons';
import { Colors } from '@/constants/colors';
import BaseIcon from './BaseIcon.vue';
interface Props {
  alertType?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'info'
    | 'warning'
    | 'light';
  dataTestId: string;
  hasLargePadding?: boolean;
  iconColor?: Colors;
  iconName?: IconNames;
  iconSize?: IconSizes;
  message?: string;
  isClosable?: boolean;
}

withDefaults(defineProps<Props>(), {
  alertType: 'danger',
  iconColor: Colors.Black,
  iconName: IconNames.AlertCircle,
  iconSize: IconSizes.Large,
  message: '',
  isClosable: false,
});

const emit = defineEmits(['closeAlert']);
</script>

<template>
  <div
    :class="[
      {
        'theme-alert-lg': hasLargePadding,
      },
      {
        'alert-dismissible theme-alert-dismissible fade show': isClosable,
      },
      `alert theme-alert alert-${alertType}`,
    ]"
    :data-test-id="dataTestId"
    role="alert"
  >
    <div class="theme-alert-icon">
      <BaseIcon :name="iconName" :color="iconColor" :size="iconSize" />
    </div>
    <p v-if="message">{{ message }}</p>
    <slot name="description" />
    <button
      v-if="isClosable"
      type="button"
      class="btn-close theme-btn-close"
      aria-label="Close"
      data-bs-dismiss="alert"
      @click="emit('closeAlert')"
    >
      <BaseIcon
        :name="IconNames.X"
        :size="IconSizes.Small"
        :color="Colors.AABlackBlue"
      />
    </button>
  </div>
</template>
