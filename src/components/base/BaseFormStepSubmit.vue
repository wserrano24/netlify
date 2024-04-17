<script setup lang="ts">
import { agentAvailable } from '@/plugins/snapEngage';
import { TrackGTMEvent } from '@/composables/useGTMtrackEvent';
import { useFormValidState } from '@/composables/useFormValidState';
import { ref } from 'vue';
import BaseSkeletonLoader from './BaseSkeletonLoader.vue';
import BaseButton from './BaseButton.vue';
import BlockRow from '../BlockRow.vue';
import BaseProgressBar from './BaseProgressBar.vue';

const { getFormLoadingState, setLoadingState } = useFormValidState();

interface Props {
  data?: {
    cta: string;
    step: string;
  };
  href?: string | null;
  id: string;
  isEnabled?: boolean;
  isLoading?: boolean;
  progress?: number;
  gtmSlug?: string;
}

withDefaults(defineProps<Props>(), {
  data: () => ({
    cta: 'default label',
    step: 'step 0',
  }),
  href: null,
  isEnabled: false,
  isLoading: true,
  progress: 0,
  gtmSlug: "",
});

const snapEngageSpacing: any = ref<boolean>(false);
agentAvailable.then((res) => {
  snapEngageSpacing.value = res;
});

setLoadingState(false);
</script>

<template>
  <div
    class="theme-form-step-submit"
    :class="snapEngageSpacing ? 'theme-snapengage-padding' : ''"
  >
    <BaseProgressBar :progress="progress" />
    <BlockRow>
      <BaseSkeletonLoader :is-loading="isLoading">
        <p>{{ data?.step }}</p>
      </BaseSkeletonLoader>
      <BaseSkeletonLoader :is-loading="isLoading">
        <BaseButton
          v-if="!href || !isEnabled"
          :data-test-id="`${id}-submit`"
          :form="id"
          :is-disabled="!isEnabled || getFormLoadingState"
          :is-loading="getFormLoadingState"
          :label="data?.cta"
          :variation="'primary'"
          type="submit"
          size="sm"
          @click="TrackGTMEvent(gtmSlug)"
        />
        <router-link
          v-else
          :data-test-id="`${id}-cta`"
          :to="href"
          class="theme-btn btn btn-primary"
        >
          {{ data?.cta }}
        </router-link>
      </BaseSkeletonLoader>
    </BlockRow>
  </div>
</template>

