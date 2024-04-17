<script setup lang="ts">
import { reactive, watchEffect } from 'vue';

interface Props {
  active?: string;
  contentId: string;
  dataTestId: string;
  id: string;
  title: string;
}

const props = defineProps<Props>();

const activeTabClass = reactive({ value: '' });

watchEffect(() => {
  if (props.active === 'true') {
    activeTabClass.value = 'active';
  } else {
    activeTabClass.value = '';
  }
});

const emit = defineEmits(['click']);

function clickHandler() {
  emit('click', props.contentId);
}
</script>

<template>
  <li class="nav-item" role="presentation">
    <button
      :id="props.id"
      :aria-controls="props.id"
      :aria-selected="props.active"
      :class="`nav-link ${activeTabClass.value}`"
      :data-bs-target="`#${props.id}`"
      :data-testid="`${props.dataTestId}-tab-button`"
      data-bs-toggle="pill"
      role="tab"
      type="button"
      @click="clickHandler"
    >
      {{ props.title }}
    </button>
  </li>
</template>
