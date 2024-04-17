<script setup lang="ts">
type TTimelineData = {
  heading: string;
  isCompleted?: boolean;
  text?: string;
};

interface Props {
  data: TTimelineData[];
  dataTestId: string;
  hasProgressBar?: boolean;
  isLoading?: boolean;
  isProgress?: boolean;
  stepInProgress?: number;
}

const props = withDefaults(defineProps<Props>(), {
  hasProgressBar: true,
  isProgress: true,
  stepInProgress: 0,
});

const progressClass = (index) => {
  if (index === props.stepInProgress - 1) {
    return 'is-done start-next-step';
  }
  if (index < props.stepInProgress) {
    return 'is-done';
  }
  return;
};

const completedClass = (isCompleted) => (isCompleted ? 'is-done' : '');
</script>

<template>
  <section
    class="theme-timeline"
    :class="[{ 'theme-timeline-loading': props.isLoading }]"
    :data-testid="`${props.dataTestId}-timeline-container`"
  >
    <div class="title">
        <slot name="title">default title value</slot>
    </div>
    <ul :class="{ 'hide-timeline-progress-bar': !props.hasProgressBar }">
      <li
        v-for="(item, index) in props.data"
        :key="`${item.heading}-${index}`"
        :class="[
          'theme-timeline-item',
          isProgress ? progressClass(index) : completedClass(item?.isCompleted),
        ]"
        :data-testid="`${props.dataTestId}-timeline-step-${index}`"
      >
          <div
            class="theme-timeline-progress-bar"
            :data-testid="`${props.dataTestId}-timeline-progress-bar`"
          >
            <div class="theme-timeline-active-progress-bar text"></div>
          </div>
        <div
          class="entry"
          :data-testid="`${props.dataTestId}-timeline-entry-${index}`"
        >
            <p
              class="entry-title"
              :data-testid="`${props.dataTestId}-timeline-entry-${index}-title`"
            >
              {{ item.heading }}
            </p>
          <!-- TODO  Needs to handle text rendering dynamic -->
            <p
              v-if="item.text"
              class="entry-text"
              :data-testid="`${props.dataTestId}-timeline-entry-${index}-text`"
            >
              {{ item.text }}
            </p>
        </div>
      </li>
    </ul>
  </section>
</template>

