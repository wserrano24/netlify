<script setup lang="ts">
import { StyleValue, computed, ref } from 'vue';
import { SwipeDirection } from '@/constants/swipe-direction';

// Minimum distance covered between touch-start and touch-end
const THRESHOLD_PIXEL_TO_MOVE = 100;

interface Props {
  /**
   * Swipe directions which are allowed
   *
   * Default: Horizontal swipe(Left & Right)
   */
  allowedSwipeDirections?: Array<SwipeDirection>;

  dataTestId: string;

  /**
   * If true then user can tap any list-item to bring it on the top
   */
  enableTapping?: boolean;

  /**
   * Length of the list to be iterated over
   */
  listLength: number;

  /**
   * Max number of items to be stacked
   *
   * Default: 3
   */
  maxNumberOfItemsToStack?: number;

  /**
   * Section top(the list items get stacked vertically) offset value in rem unit
   *
   * This determines to what unit the stacked-items content is visible on the UI
   *
   * Default: 5
   */
  stackedItemOffset?: number;
}

const props = withDefaults(defineProps<Props>(), {
  allowedSwipeDirections: () => [SwipeDirection.LEFT, SwipeDirection.RIGHT],
  enableTapping: true,
  maxNumberOfItemsToStack: 3,
  stackedItemOffset: 5,
});

const activeIndex = ref<number>(0); // List item of activeIndex is placed on the top of the stack
const startX = ref<number>();
const startY = ref<number>();

/**
 *
 * @param event
 * Records the touch location on touch-start event
 */
const recordTouchStartValues = (event: TouchEvent) => {
  const touch = event.changedTouches[0];
  startX.value = touch ? touch.pageX : null;
  startY.value = touch ? touch.pageY : null;
};

/**
 *
 * @param event
 * Determines the touch direction on touch-end event
 * and conditionally updates the activeIndex
 */
const detectSwipeDirection = (event: TouchEvent, index: number) => {
  const touch = event.changedTouches[0];
  const distX = touch ? touch.pageX - startX.value : null;
  const distY = touch ? touch.pageY - startY.value : null;
  const absX = Math.abs(distX);
  const absY = Math.abs(distY);

  const isHorizontalSwipe = absX >= THRESHOLD_PIXEL_TO_MOVE && absX > absY;
  const isVerticalSwipe = absY >= THRESHOLD_PIXEL_TO_MOVE && absY > absX;

  let swipeDirection: SwipeDirection;

  if (isHorizontalSwipe && distX < 0) {
    swipeDirection = SwipeDirection.LEFT;
  }

  if (isHorizontalSwipe && distX > 0) {
    swipeDirection = SwipeDirection.RIGHT;
  }

  if (isVerticalSwipe && distY < 0) {
    swipeDirection = SwipeDirection.UP;
  }

  if (isVerticalSwipe && distY > 0) {
    swipeDirection = SwipeDirection.DOWN;
  }

  // If swipeDirection is a valid/allowed direction & swipe happened on active-index(top list-item)
  // then only update the activeIndex based on swipeDirection
  if (
    props.allowedSwipeDirections.includes(swipeDirection) &&
    activeIndex.value === index
  ) {
    updatedActiveIndexBasedOnSwipeDirection(swipeDirection);
  }

  // If swipeDirection is not detected that means it doesn't satisfy the THRESHOLD_PIXEL_TO_MOVE limit
  // and it is just a simple tap
  // so if enableTapping flag is true then place the tapped item on the top of the stack
  if (
    swipeDirection === undefined &&
    props.enableTapping &&
    activeIndex.value !== index
  ) {
    activeIndex.value = index;
  }
};

const updatedActiveIndexBasedOnSwipeDirection = (direction: SwipeDirection) => {
  // If swipe direction is left/down then go to previous item
  if ([SwipeDirection.LEFT, SwipeDirection.DOWN].includes(direction)) {
    activeIndex.value = prevActiveIndex.value;
  }

  // If swipe direction is right/up then go to next item
  if ([SwipeDirection.RIGHT, SwipeDirection.UP].includes(direction)) {
    activeIndex.value = nextActiveIndex.value;
  }
};

// Returns next item index value in circular rotation fashion
const nextActiveIndex = computed(() => {
  if (activeIndex.value === props.listLength - 1) return 0;
  return activeIndex.value + 1;
});

// Returns previous item index value in circular rotation fashion
const prevActiveIndex = computed(() => {
  if (activeIndex.value === 0) return props.listLength - 1;
  return activeIndex.value - 1;
});

/**
 * Determines the stacking window for a given list
 *
 * This helps to display K(maxNumberOfItemsToStack) items out of N(listLength) items with circular rotation fashion
 *
 * So if N = 10 and k = 3, then it returns
 *
 * [0, 1, 2] if activeIndex = 0
 *
 * [1, 2, 3] if activeIndex = 1
 *
 * [9, 0, 1] if activeIndex = 9 and so on
 */
const stackingWindow = computed(() => {
  const stackingWindow: Array<number> = [];
  let counter = 0;
  let currentIndex = activeIndex.value;
  while (counter < numberOfItemsCanBeStacked.value) {
    stackingWindow.push(currentIndex);
    const nextIndex = currentIndex + 1;
    currentIndex =
      nextIndex < props.listLength ? nextIndex : nextIndex % props.listLength;
    counter = counter + 1;
  }
  return stackingWindow;
});

// Since the list items are stacked in upward direction, the offset is required to have enough rooms for the stacked item
const getTopOffset = computed(
  () =>
    `${props.stackedItemOffset * (numberOfItemsCanBeStacked.value - 1) + 2}rem`
);

// The number of items that can be stacked
const numberOfItemsCanBeStacked = computed(() =>
  Math.min(props.maxNumberOfItemsToStack, props.listLength)
);

// Dynamically style the list items based on the activeIndex
const getListItemStyle = (index: number): StyleValue => {
  const isIndexInStackingWindow = stackingWindow.value.includes(index);

  const zIndex =
    isIndexInStackingWindow &&
    (numberOfItemsCanBeStacked.value - stackingWindow.value.indexOf(index)) *
      10;

  const transform = isIndexInStackingWindow
    ? `translate(0, ${
        stackingWindow.value.indexOf(index) * -props.stackedItemOffset
      }rem) scale(${1 - 0.02 * stackingWindow.value.indexOf(index)})`
    : `scale(0)`;

  const opacity = isIndexInStackingWindow ? 1 : 0;

  return { zIndex, transform, opacity };
};
</script>

<template>
  <section :style="{ marginTop: getTopOffset }">
    <ul class="theme-swipeable-container">
      <template v-for="(item, index) in props.listLength" :key="item">
        <li
          :style="getListItemStyle(index)"
          :data-test-id="`${dataTestId}-${index}`"
          class="theme-swipeable-item"
          @touchstart="recordTouchStartValues"
          @touchend="detectSwipeDirection($event, index)"
        >
          <slot :name="`item-${index}`"></slot>
        </li>
      </template>
    </ul>

    <div class="theme-swipeable-pagination">
      <ul
        aria-label="Select a slide to show"
        class="theme-swipeable-pagination-btn-group"
        role="tablist"
      >
        <li v-for="(item, index) in listLength" :key="item" role="presentation">
          <button
            :aria-label="`Go to slide ${index + 1} `"
            :class="[
              'theme-swipeable-pagination-btn',
              index === activeIndex && 'is-active',
            ]"
            :data-test-id="`${props.dataTestId}-${index}`"
            role="tab"
            type="button"
            @click="activeIndex = index"
          ></button>
        </li>
      </ul>
    </div>
  </section>
</template>
