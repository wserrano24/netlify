<script setup lang="ts">
import { TYPE_FILES, TypeFilesUnion } from '@/constants/docType';
import { computed, ref } from 'vue';

const emit = defineEmits(['handleSubmitFile']);

interface Props {
  typeFiles?: Array<TypeFilesUnion>;
  size?: number;
  id?: string;
  dataTestId: string;
}

const props = withDefaults(defineProps<Props>(), {
  typeFiles: () => TYPE_FILES,
  size: 10,
  id: 'input-file',
});

// This value is the maximum allowed file size in MB.
// It is multiplied by 1e6 because the
// value accepted by the input file is in bytes
const maxFileSize = ref(props.size * 1e6);
const acceptedFiles = computed(() => props.typeFiles.join(','));

const onFileChanged = ($event: Event) => {
  const target = $event.target as HTMLInputElement;
  if (target.files?.[0]) {
    const { type = '', size = 0 } = target.files[0];
    const error = !props.typeFiles.includes(type)
      ? 'Invalid file type'
      : size > maxFileSize.value
      ? `Invalid file size MAX ${props.size} mb`
      : '';

    emit('handleSubmitFile', { error, file: target.files[0], id: props.id });
  }
};
</script>
<template>
  <div class="theme-input-file">
    <slot />
    <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label -->
    <input
      :id="props.id"
      :data-test-id="props.dataTestId"
      type="file"
      :accept="acceptedFiles"
      :size="maxFileSize"
      @change="onFileChanged($event)"
    />
  </div>
</template>
