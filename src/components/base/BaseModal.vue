<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useSlots, watch } from 'vue';
import { Modal } from 'bootstrap';

interface Props {
  variation?: 'primary' | 'secondary' | 'transparent' | 'default';
  closeModal?: boolean;
  dataTestId: string;
  id: string;
  position?: 'center' | 'bottom';
  showMe?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variation: 'default',
  position: 'center',
  showMe: false,
  closeModal: true,
});

const slots = useSlots();
const modalRef = ref<any>(null);
const isCentered = props.position === 'center';
const modal = ref<any>(null);
const emit = defineEmits(['handleHide']);
const cxFooter = computed(() => [
  'modal-footer',
  { 'justify-content-center': props.variation === 'secondary' },
]);

const hiddenModal = () => {
  if (props.closeModal) {
    emit('handleHide');
  }
};


onMounted(() => {
    console.log('Arrancando')
    if (modalRef.value) {
      modal.value = new Modal(modalRef.value);
      if (props.showMe) {
        modal.value.show(props.id);
      }
      modalRef.value.addEventListener('hidden.bs.modal', hiddenModal);
    }
  });

onUnmounted(() => {
  if (modalRef.value) {
    modalRef.value.removeEventListener('hidden.bs.modal', hiddenModal);
  }
  if (modal?.value?._isShown && props?.id) {
    modal.value.hide(props.id);
  }
});

/**
 * Listen if the showMe prop changes
 */
watch(
  () => props.showMe,
  (showMe) => {
    if (modal?.value) {
      if (showMe) {
        modal.value.show(props.id);
      } else {
        // It was necessary to add this validation because if the modal was in the animation state, it would not close
        modal.value._isTransitioning = false;
        modal.value.hide(props.id);
      }
    }
  }
);
</script>

<template>
  <teleport to="body">
    <div
      v-if="isCentered"
      :id="props.id"
      ref="modalRef"
      :data-bs-backdrop="!props.closeModal ? 'static' : 'true'"
      :data-bs-keyboard="props.closeModal"
      class="modal fade theme-modal"
      tabindex="-1"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div :class="['modal-content', props.variation]">
          <div class="modal-header">
            <!-- TODO: Add the close icon -->
            <button
              v-if="props.variation !== 'transparent' && props.closeModal"
              data-bs-dismiss="modal"
              type="button"
              class="btn-close text-reset close"
              aria-label="Close"
              :data-testid="`${props.dataTestId}-close-modal`"
            />
          </div>

          <div
            v-if="slots.footer"
            :class="[cxFooter, 'mobile']"
            :data-testid="`${props.dataTestId}-modal-footer`"
          >
            <slot name="footer" />
          </div>

          <div class="modal-body" :data-testid="`${props.dataTestId}-modal-content`">
            <slot />
          </div>

          <div
            v-if="slots.footer"
            :class="[cxFooter, 'desktop']"
            :data-testid="`${props.dataTestId}-modal-footer`"
          >
            <slot name="footer" />
          </div>
        </div>
      </div>
    </div>
 
    <div
      v-else
      :id="props.id"
      :class="['offcanvas offcanvas-bottom theme-modal', props.variation]"
      aria-hidden="true"
      tabindex="-1"
    >
      <div class="offcanvas-header">
        <!-- TODO: Add the close icon -->
        <button
          data-bs-dismiss="offcanvas"
          type="button"
          class="btn-close text-reset"
          aria-label="Close"
          :data-testid="`${props.dataTestId}-close-modal`"
        ></button>
      </div>

      <div class="offcanvas-body" :data-testid="`${props.dataTestId}-modal-content`">
        <slot />
      </div>

      <div
        v-if="slots.footer"
        class="offcanvas-footer desktop"
        :data-testid="`${props.dataTestId}-modal-footer`"
      >
        <slot name="footer" />
      </div>
    </div>
  </teleport>
</template>

<style>
.mobile {
  margin: auto;
}
.close {
  color: #072238;
  opacity: 1;
}

@media only screen and (max-width: 768px) {
  .desktop {
    display: none;
  }

  .modal-content {
    margin: 0 .5rem;
  }
}

@media only screen and (min-width: 768px) {
  .mobile {
    display: none;
  }
}

</style>
