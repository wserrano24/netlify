<script setup lang="ts">
import 'vue-advanced-cropper/dist/style.css';
import { MimeType, optimizeImage } from '@/utils/edit-image';
import { Cropper } from 'vue-advanced-cropper';
import { IconNames } from '@/constants/icons';
import { ref, watch } from 'vue';
import BaseFileInput from './BaseFileInput.vue';
import BaseIcon from './BaseIcon.vue';

interface Props {
  dataTestId: string;
  maxSize?: number;
  withControls?: boolean;
  withRetake?: boolean;
  showProgress?: boolean;
  disabled?: boolean;
  counterReset?: number;
  progress?: number;
  typeFiles?: MimeType[];
  labelsPhoto?: {
    desktop: string;
    mobile: string;
  };
  labelRetake?: string;
  headerLabels?: {
    title?: string;
    size?: string;
  };
}

const emit = defineEmits(['handleChange', 'handleError', 'handleSelectFile']);
const props = withDefaults(defineProps<Props>(), {
  maxSize: 25,
  showProgress: false,
  disabled: false,
  progress: 0,
  withControls: true,
  withRetake: true,
  counterReset: 0,
  labelsPhoto: () => ({ desktop: 'Upload a Photo', mobile: 'Take a Photo' }),
  headerLabels: () => ({ title: '', size: '' }),
  typeFiles: () => [
    'image/bmp',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/tif',
  ],
  labelRetake: 'Re-upload',
});

const CONTROLS: {
  icon: string;
  action: string;
}[] = [
  {
    icon: 'Crop',
    action: 'crop',
  },
  {
    icon: 'PlusCircle',
    action: 'zoom-in',
  },
  {
    icon: 'MinusCircle',
    action: 'zoom-out',
  },
  {
    icon: 'Rotate',
    action: 'rotate',
  },
];

enum Actions {
  ROTATE = 'rotate',
  ZOOM_IN = 'zoom-in',
  ZOOM_OUT = 'zoom-out',
  CROP = 'crop',
}

export type TypesActions = `${Actions}`;

const cropper = ref<any>(null);
const selectedFile = ref<any>(null);

const handleRetake = () => {
  selectedFile.value = null;
  emit('handleError', '');
  emit('handleSelectFile', false);
};

const handleControls = async (type: TypesActions) => {
  if (cropper.value) {
    if (type === Actions.ROTATE) {
      cropper.value.rotate(90);
    }

    if (type === Actions.ZOOM_IN || type === Actions.ZOOM_OUT) {
      const factor = type === Actions.ZOOM_IN ? 2 : 0.5;
      cropper.value.zoom(factor);
    }

    if (type === Actions.CROP) {
      const { canvas } = cropper.value.getResult();
      const file = canvas.toDataURL();
      selectedFile.value = file;
    }
  }
};

const handleSubmitFile = async ({
  file,
  error,
}: {
  file: MediaSource;
  error: string;
}) => {
  if (!error) {
    const imageUrl: string = (await optimizeImage({ file })) as string;
    selectedFile.value = imageUrl;
    emit('handleSelectFile', true);
  }

  emit('handleError', error);
};

const handleChange = ({ canvas }: { canvas: HTMLCanvasElement }) => {
  emit('handleChange', canvas);
};

/**
 * Effect that restarts the component, from the parent component
 */
watch(
  () => {
    props.counterReset;
  },
  () => {
    handleRetake();
  },
  { deep: true }
);
</script>
<template>
  <div class="theme-file-input-edit-image">
    <div
      v-if="props.headerLabels"
      class="theme-file-input-edit-image-header d-flex align-items-center justify-content-between"
    >
      <div
        v-if="props.headerLabels?.title"
        class="theme-file-input-edit-image-header-copy"
      >
        {{ props.headerLabels?.title || '' }}
      </div>
      <div
        v-if="props.headerLabels?.size"
        class="theme-file-input-edit-image-header-size"
      >
        {{ props.headerLabels?.size || '' }}
      </div>
    </div>
    <BaseFileInput
      v-if="!selectedFile"
      :id="`${props.dataTestId}-file-input`"
      :size="props.maxSize"
      :type-files="props.typeFiles"
      :data-test-id="`${props.dataTestId}-file-input`"
      @handle-submit-file="handleSubmitFile"
    >
      <div class="theme-file-input-edit-image-container">
        <div class="theme-file-input-edit-image-wrapper">
          <BaseIcon :name="IconNames.Camera" />
        </div>
        <p class="theme-file-input-edit-image-wrapper-desktop">
          {{ props.labelsPhoto.desktop }}
        </p>
        <p class="theme-file-input-edit-image-wrapper-mobile">
          {{ props.labelsPhoto.mobile }}
        </p>
      </div>
    </BaseFileInput>
    <div v-else class="theme-file-input-edit-image-cropper">
      <div
        v-show="props.showProgress || props.disabled"
        class="theme-file-input-edit-image-cropper-loading"
        :class="[{ disabled }]"
      >
        <span v-if="props.showProgress">{{ props.progress }}%</span>
      </div>
      <Cropper
        ref="cropper"
        :src="selectedFile"
        :stencil-props="!props.disabled ? {} : { lines: {}, handlers: {} }"
        :default-size="
          ({ imageSize, visibleArea }) => ({
            width: (visibleArea || imageSize).width,
            height: (visibleArea || imageSize).height,
          })
        "
        @change="handleChange"
      />
    </div>
    <div
      v-if="withControls && selectedFile"
      class="theme-file-input-edit-image-controls"
    >
      <button
        v-for="(control, index) in CONTROLS"
        :key="index"
        :aria-label="control.action"
        :data-testid="`${props.dataTestId}-${control.action}`"
        :disabled="props.showProgress"
        class="btn"
        @click="handleControls(control.action)"
      >
        <BaseIcon :name="IconNames[control.icon]" />
      </button>
    </div>
    <div
      v-if="withRetake && selectedFile"
      class="theme-file-input-edit-image-retake"
    >
      <button
        class="btn btn-link"
        :aria-label="props.labelRetake"
        :data-testid="`${props.dataTestId}-retake`"
        :disabled="props.showProgress"
        @click="handleRetake"
      >
        {{ props.labelRetake }}
      </button>
    </div>
  </div>
</template>
