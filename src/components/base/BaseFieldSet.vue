<script setup lang="ts">
interface Props {
  isDisabled?: boolean;
}
withDefaults(defineProps<Props>(), {});
</script>
<!-- The fieldset is used to group form elements and is placed inside of the BaseForm -->
<template>
  <fieldset v-if="isDisabled" disabled>
    <slot></slot>
  </fieldset>
  <fieldset v-else>
    <slot></slot>
  </fieldset>
</template>
