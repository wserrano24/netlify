<script setup lang="ts">
import { computed } from 'vue';

interface AccordionItem {
  heading: string;
  id: string;
  isOpen?: boolean;
}

interface Props {
  dataTestId: string;
  id: string;
  items: AccordionItem[];
  isProdDocAccordion: boolean;
}

const cxButton = computed(() => (isOpen) => [
  'accordion-button',
  !isOpen && 'collapsed',
]);

const cxBody = computed(() => (isOpen) => [
  'accordion-collapse collapse',
  isOpen && 'show',
]);

const props = withDefaults(defineProps<Props>(), {
  isProdDocAccordion: false,
});

const emit = defineEmits(['accordion-header-click']);

const handleAccordionClick = () => {
  emit('accordion-header-click');
};
</script>
<!-- TODO: Style accordion open / closed chevron and remove focus underline -->
<template>
  <div
    :id="props.id"
    class="accordion"
    :data-testid="`${props.dataTestId}-accordion`"
  >
    <div
      v-for="item in props.items"
      :key="item.id"
      :class="props.isProdDocAccordion ? 'prod-accordion-item' : 'accordion-item'"
    >
      <p :id="`heading-${item.id}`" class="accordion-header">
        <button
          :class="cxButton(item.isOpen)"
          :data-bs-target="`#body-${item.id}`"
          :aria-expanded="item.isOpen ? 'true' : 'false'"
          :aria-controls="`body-${item.id}`"
          :data-testid="`${props.dataTestId}-${item.id}-accordion-collapse-button`"
          data-bs-toggle="collapse"
          @click="handleAccordionClick"
        >
          <span :class="props.isProdDocAccordion ? 'prod-accordion-header' : ''">{{
            item.heading
          }}</span>
        </button>
      </p>
      <div
        :id="`body-${item.id}`"
        :class="cxBody(item.isOpen)"
        :aria-labelledby="`heading-${item.id}`"
        :data-bs-parent="props.id && `#${props.id}`"
      >
        <div
          class="accordion-body"
          :data-testid="`${props.dataTestId}-${item.id}-accordion-content`"
        >
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.prod-accordion-header {
  font-weight: 14px;
  font-weight: bold;
  z-index: 1;
}
.prod-accordion-item {
  border-bottom: 1px solid #efeeef;
}
</style>
