<script setup lang="ts">
interface Props {
  label: string;
  selected: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  label: "",
  selected: false,
});

</script>

<template>
    <button :class="{'pill-body': true, 'selected': props.selected} ">
        {{props.label}}
    </button>
</template>
<style scoped>
.pill-body {
    height: 48px;
    margin-right: 8px;
    padding: 14px 16px;
    align-items: center;
    justify-content: center;
    min-width: 48px;
    gap: 10px;
    flex-shrink: 0;
    border: none;
    border-radius: 40px;
    background: #DDF5FF;
}

.selected {
    background: #0E406A;
    color: #FFFFFF;
    ;

}
</style>
