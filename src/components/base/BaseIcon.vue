<script setup lang="ts">
import { computed } from 'vue';
import { IconNames, IconSet, IconSizes } from '@/constants/icons';
import { Colors } from '@/constants/colors';

interface Props {
  color?: Colors;
  name: IconNames;
  size?: IconSizes | any;
}

const props = withDefaults(defineProps<Props>(), {
  color: Colors.AABlackBlue,
  name: IconNames.AlertCircle,
  size: IconSizes.Small,
});

const classIconName = computed<string>(() => `theme-icon-${props.name}`);
const classSize = computed<string>(() => `theme-icon-${props.size}`);

const cxSvg = computed<string>(() =>
  [classIconName.value, classSize.value].join(' ')
);

const chosenIcon = computed<string>(() =>
  IconSet(props.name, cxSvg.value, props.color)
);
</script>

<template>
  <span>
    <span aria-hidden="true" v-html="chosenIcon"></span>
  </span>
</template>
