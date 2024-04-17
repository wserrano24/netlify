<script setup lang="ts">
import { IconNames } from '@/constants/icons';
import { ContentfulSlug } from '../composables/useContentfulSlug';
import BaseButton from './base/BaseButton.vue';
import BaseModal from './base/BaseModal.vue';
import ApplicationDescription from './ApplicationDescription.vue';

interface Props {
  showInBold?: boolean;
  underline?: boolean;
  slug: ContentfulSlug;
}

const props = withDefaults(defineProps<Props>(), {
  showInBold: true,
  underline: false,
});


</script>

<template>
  <div class="theme-loan-application-info-modal">
    <BaseButton
      :icon="IconNames.Info"
      :label="props?.slug?.labels?.ctaLabel"
      :class="underline ? 'underline' : ''"
      aria-controls="infoModal"
      data-bs-target="#infoModal"
      data-bs-toggle="modal"
      data-test-id="info-modal-open"
      variation="minimal"
    />
      <BaseModal id="infoModal" variation="secondary" data-test-id="info-modal">
        <template #default>
          <ApplicationDescription type="modal" class="mobile-left">
            <h1>{{ props?.slug?.title }}</h1>
            <p>{{ props?.slug?.copy?.modalCopy0 || props?.slug?.copy }}</p>
            <p
              v-if="props?.slug?.copy?.modalCopy1"
              :class="{ 'theme-application-description-bold': showInBold }"
            >
              {{ props?.slug?.copy?.modalCopy1 || '' }}
            </p>
          </ApplicationDescription>
          <BaseButton
            :label="props?.slug?.labels?.saveButton"
            data-bs-dismiss="modal"
            data-test-id="info-modal-dismiss"
            variation="secondary"
            class="button-info-modal"
          />
          <div class="footer">
          <img :alt="props.slug?.images?.altText" :src="props?.slug?.images?.url" />
        </div>
        </template>
      </BaseModal>
  </div>
</template>
<style scoped>

.footer{
  margin-left: 21%;
  margin-top: 65px;
}
.underline {
  text-decoration: underline;
}

.button-info-modal {
  min-width: 12rem;
}

@media (max-width: 992px) {
  .mobile-left {
    text-align: left !important;
    margin-bottom: 16px;
  }
}
</style>
