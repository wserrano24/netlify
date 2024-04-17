<script setup lang="ts">
import { AnyObject } from 'yup/lib/types';
import { Form } from 'vee-validate';
import { computed } from 'vue';
import { useFormValidState } from '@/composables/useFormValidState';
import BaseButton from './BaseButton.vue';

interface Props {
  buttonLabel?: string;
  dataTestId: string;
  hideSubmit?: boolean;
  id?: string;
  isLoading?: boolean;
  initialValues?: AnyObject;
  schema: AnyObject;
  submit: (values: AnyObject) => void;
  submitAlignment?: 'start' | 'center' | 'end';
  variation?: 'primary' | 'secondary' | 'outline-primary' | 'minimal';
  isInternalValidation?: boolean;
  largerBtn?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  buttonLabel: 'Submit',
  hideSubmit: false,
  id: 'base-form',
  isLoading: false,
  initialValues: undefined,
  submitAlignment: 'end',
  variation: 'primary',
  isInternalValidation: true,
  largerBtn: false,
});

const cxFooter = computed(() => [
  'theme-form-footer d-flex',
  { 'justify-content-start': props.submitAlignment === 'start' },
  { 'justify-content-center': props.submitAlignment === 'center' },
  { 'justify-content-end': props.submitAlignment === 'end' },
]);

const { setFormValidState } = useFormValidState();


</script>

<template>
  <Form
    :id="props.id"
    v-slot="{ meta }"
    :data-testid="`${props.dataTestId}-form`"
    :validation-schema="props.schema"
    :initial-values="props.initialValues"
    class="theme-form"
    @submit="submit"
  >
  <template v-if="props.hideSubmit && props.isInternalValidation">
        {{ setFormValidState(meta.valid) }}

      </template>
    <slot></slot>
    <div v-if="!props.hideSubmit" :class="cxFooter">
      <BaseButton
        :class="props.largerBtn ? 'larger-btn' : ''"
        :data-test-id="`${props.dataTestId}-form-submit`"
        :is-disabled="!meta.valid || props.isLoading"
        :label="props.buttonLabel"
        :variation="props.variation"
        :is-loading="props.isLoading"
        type="submit"
      />
    </div>
  </Form>
</template>

<style scoped>
.larger-btn {
  min-width: 200px;
  margin-bottom: 72px;
}

@media (max-width: 992px) {
  .larger-btn {
    min-width: 95%;
    margin-bottom: 8px;
  }
}
</style>
