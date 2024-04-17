<script setup lang="ts">

interface Props {
  isBaseCard?: boolean;
  noHeader?: boolean;
  dataTestId: string;
  noFooter: boolean;
  backgroundColor?: string;
}

withDefaults(defineProps<Props>(), {
  isBaseCard: false,
  noHeader: false,
  noFooter: false,
  backgroundColor: '',
});
</script>

<template>
  <div class="card">
    <div
      v-if="!isBaseCard"
      :class="`${backgroundColor}-card-header-color card-header`"
      :data-testid="`${dataTestId}-card-header`"
    >
      <slot name="header"></slot>
    </div>
    <div class="card-body" :data-testid="`${dataTestId}-card-body`">
      <div v-if="!isBaseCard" class="card-title">
        <slot name="title"> </slot>
      </div>

      <div
        v-if="!isBaseCard"
        class="card-text"
        :data-testid="`${dataTestId}-card-content`"
      >
        <slot name="text"></slot>
      </div>

      <slot name="default">
      </slot>
    </div>
    <div
      v-if="!isBaseCard && !noFooter"
      class="card-footer"
      :data-testid="`${dataTestId}-card-footer`"
    >
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<style scoped>
.no-header {
  padding: 0;
  display: none;
}

.card-footer {
  background-color: #fff;
}

.white-card-header-color {
  background-color: #fff;
}
.clear-card-header-color {
  background-color: none;
}
</style>
