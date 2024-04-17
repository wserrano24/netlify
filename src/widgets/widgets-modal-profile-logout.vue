<script setup lang="ts">
import ApplicationDescription from '@/components/ApplicationDescription.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import BaseModal from '@/components/base/BaseModal.vue';
import useContentfulSlug from '@/composables/useContentfulSlug';
import { useNotification } from '@/composables/useNotification';
import { useSession } from '@/composables/useSession';
import { ModalIds } from '@/constants/modal-ids';
import { Routes } from '@/constants/pages';
import { ref } from 'vue';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const slugLogout = ref()
const slugLogin = ref()
const notification = useNotification();

async function handleExitClick() {
  const router = useRouter();
  const session = useSession();

  notification.updateMessage(slugLogin?.resources.loggedOut);
  await session.logOut();
  router.push(Routes.Login);
}

onMounted(async ()=>{
  slugLogout.value = await useContentfulSlug({slug: 'widget-modal-logout', contentTypeId: 'page'});
  slugLogin.value = await useContentfulSlug({slug: 'login-messages', contentTypeId: 'resourceSet'});
});
</script>

<template>
  <!-- <ClientOnly> -->
    <BaseModal
      v-if="!!slugLogout?.title"
      :id="ModalIds.LOGOUT_CONFIRMATION_MODAL"
      variation="secondary"
      data-test-id="logout-user"
    >
      <template #default>
        <ApplicationDescription type="modal">
          <h1>{{ slugLogout?.title }}</h1>
          <p>{{ slugLogout?.copy }}</p>
        </ApplicationDescription>
        <BaseButton
          data-test-id="logout-user"
          :label="slugLogout?.labels.exitLabel"
          variation="secondary"
          @click="handleExitClick"
        />
      </template>
      <template #footer>
        <img
          v-if="!!slugLogout?.images.url"
          :src="slugLogout?.images.url"
          class="theme-modal-footer-image"
          :alt="slugLogout?.images.altText"
        />
      </template>
    </BaseModal>
  <!-- </ClientOnly> -->
</template>
