<script setup lang="ts">
import { Colors } from '@/constants/colors';
import { IconNames } from '@/constants/icons';

import BaseIcon from './BaseIcon.vue';

interface Props {
  isRecommended?: boolean;
  dataTestId: string;
  url?: string;
  showIconButton?: boolean;
  showText?: boolean;
  miniCard?: boolean;
  arrowIcon?: boolean;
  docIcon?: boolean;
  locationIcon?: boolean;
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  isRecommended: false,
  url: '',
  showIconButton: false,
  showText: true,
  miniCard: false,
  arrowIcon: true,
  docIcon: false,
  locationIcon: false,
  disabled: false,
});

const emit = defineEmits(['click']);
</script>

<template>
  <div :class="['theme-arrow-card card', { 'is-recommended': isRecommended }]">
    <div
      v-if="isRecommended"
      class="card-header"
      :data-test-id="`${dataTestId}-card-header`"
    >
      <p><slot name="header">Default header</slot></p>
    </div>
    <div
      :class="'card-body' + (miniCard ? ' mini-card' : ' ') + (disabled ? ' disabled' : ' ')"
      :data-test-id="`${dataTestId}-card-body`"
    >
      <div class="row d-flex align-items-center">
        <div class="col-10">
          <div class="card-title">
            <p class="font-weight-bolder">
              <slot name="title">Default title</slot>
            </p>
          </div>

          <div
            v-if="showText"
            class="card-text"
            :data-test-id="`${dataTestId}-card-content`"
          >
            <p><slot name="text">Default body text</slot></p>
            <slot name="default"></slot>
          </div>
        </div>
        <div class="col-2 theme-arrow-card-icon">
          <div
            :class="
              'd-flex justify-content-end' + (miniCard ? ' end-icon' : ' ')
            "
          >
            <button
              v-if="showIconButton"
              :data-test-id="`${dataTestId}-card-button`"
              class="btn btn-link"
              :disabled = "disabled"
              @click="emit('click')"
            >
              <div v-if="arrowIcon">
                <BaseIcon
                  v-if="isRecommended"
                  :name="IconNames.ArrowRight"
                  :color="Colors.White"
                  size="md"
                />
                <BaseIcon v-else :name="IconNames.ArrowRight" :color="disabled ? Colors.AAGrey : Colors.AABlackBlue" size="md"/>
              </div>
              <BaseIcon v-if="docIcon" :name="IconNames.Document" size="md"/>
            </button>
            <RouterLink
              v-else
              :to="url"
              :data-test-id="`${dataTestId}-card-link`"
            >
            <div v-if="!locationIcon">
              <BaseIcon
                v-if="isRecommended"
                :name="IconNames.ArrowRight"
                :color="Colors.White"
                size="md"
                class="arrow"
              />
              <BaseIcon v-else :name="IconNames.ArrowRight" />
            </div>
              <BaseIcon
                    v-if="locationIcon"
                    :name="IconNames.Location"
                    class="location"
                    size="md"
                  />

            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.location {
  padding-right: 0;
  margin-right: 0;
}
.mini-card {
  padding: 10px 0 0px 16px;
}

.arrow{
  padding-right: 12px;
}
.disabled {
  background-color: #EFEEEF;
  color: #757679;
  border-radius: 0.5rem;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.16);
}
.end-icon {
  padding-bottom: 8px;
}
</style>
