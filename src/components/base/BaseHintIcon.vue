<script setup lang="ts">
import { IconNames, IconSizes } from '@/constants/icons';
import { Colors } from '@/constants/colors';
import { ref } from 'vue';
import BaseIcon from './BaseIcon.vue';

interface Props {
  color?: Colors;
  iconName: IconNames;
  size?: IconSizes;
  hint: string;
  open?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  color: Colors.Black,
  name: IconNames.Info,
  size: IconSizes.Small,
  hint: '',
  open: false,
});

const isHintOpen = ref(props.open);

const toggleHintOpen = (): void => {
  isHintOpen.value = !isHintOpen.value;
};
</script>

<template>
  <div class="hint-icon-frame">
    <BaseIcon
      :size="props.size"
      class="check-circle-icon button"
      :name="props.iconName"
      @click="toggleHintOpen()"
    />
    <div v-if="isHintOpen" class="hint-icon-textbox">
      <div class="textbox-angle" />
      <div class="textbox-content">
        <span class="text">{{ props.hint }}</span>
        <BaseIcon
          class="button"
          :size="IconSizes.Small"
          :color="Colors.White"
          :name="IconNames.X"
          @click="toggleHintOpen()"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.hint-icon-frame {
  position: relative;
  padding-left: 0 !important;
  margin-left: 4px !important;
  z-index: 1020;
}
.check-circle-icon {
  margin-bottom: 2px;
}

.hint-icon-textbox {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1030;
}

.textbox-angle {
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 15px solid #0e406a;
}

.textbox-content {
  background-color: #0e406a;
  color: white;
  max-width: 275px;
  padding: 8px 12px;
  border-radius: 8px;
  float: left;
  width: 100%;
  display: flex;
  align-items: center;
  z-index: 1020;
}

.textbox-content > .text {
  width: max-content;
  margin-right: 8px;
}

.button {
  cursor: pointer;
  user-select: none;
}
</style>
