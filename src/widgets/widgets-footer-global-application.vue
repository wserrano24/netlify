<script setup lang="ts">
import { IconNames, IconSizes } from '@/constants/icons';
import { Colors } from '@/constants/colors';
import { computed, onMounted, ref } from 'vue';
import useContentfulSlug from '@/composables/useContentfulSlug';
import BaseIcon from '@/components/base/BaseIcon.vue';
import WidgetsModalTermsAndConditions from './widgets-modal-terms-and-conditions.vue';


const slug = ref();
onMounted(async ()=>{
  slug.value = await useContentfulSlug({slug: 'widget-footer-global', contentTypeId: 'page'});
})
interface Props {
  class?: string;
  showFullFooter?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showFullFooter: false,
  class: '',
});

const footerClass = computed(() => [
  `theme-global-application-footer d-flex align-items-center ${props.class}`,
  props.showFullFooter ? 'justify-content-between' : 'justify-content-center',
]);
</script>

<template>
  <footer>
    <div :class="footerClass">
      <div class="d-flex">
        <div class="theme-footer-lock-icon">
          <BaseIcon
            :color="Colors.Black"
            :name="IconNames.Lock"
            :size="IconSizes.Small"
          />
        </div>
        <p class="pf-footer-text" data-testid="global-footer-secure-text">
          {{ slug?.labels.secureArea || '' }}
        </p>
      </div>
      <template v-if="showFullFooter">
        <button
          aria-controls="termsModal"
          class="btn theme-btn-modal-link"
          data-bs-target="#termsModal"
          data-bs-toggle="offcanvas"
          data-testid="terms-and-privacy-footer-cta"
          type="button"
        >
          {{ slug?.labels.termsAndPrivacy || '' }}
        </button>
      </template>
    </div>
    <template v-if="showFullFooter">
      <WidgetsModalTermsAndConditions />
    </template>
  </footer>
</template>
