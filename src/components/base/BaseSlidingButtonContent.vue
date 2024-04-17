<script setup lang="ts">
import { reactive, watchEffect } from 'vue';

interface Props {
  activeTab?: string;
  dataTestId: string;
  id: string;
}

const props = defineProps<Props>();

const activeTab = reactive({ value: '' });

watchEffect(() => {
  if (props.activeTab === props.id) {
    activeTab.value = 'show active';
  } else {
    activeTab.value = '';
  }
});
</script>

<template>
  <div
    :id="props.id"
    :aria-labelledby="`${props.id}-tab`"
    :class="`tab-pane fade ${activeTab.value}`"
    :data-testid="`${props.dataTestId}-tab-panel`"
    role="tabpanel"
  >
    <slot></slot>
  </div>
</template>
