<script setup lang="ts">
import useContentfulSlug from '@/composables/useContentfulSlug';
import { ModalIds } from '@/constants/modal-ids';
import { onMounted, ref } from 'vue';
import { agentAvailable } from '@/plugins/snapEngage';
import { useRouter } from 'vue-router';
import { useSession } from '@/composables/useSession';
import { useNotification } from '@/composables/useNotification';
import { Routes } from '@/constants/pages';
import BaseButton from '@/components/base/BaseButton.vue';

const slug = ref()

// const { $bsOffcanvas, $bsModal } = useNuxtApp();

const openLogoutConfirmationModal = () => {
  // Hide the side nav menu bar
  const sideNavBarElement = document.getElementById(ModalIds.SIDE_NAV_MENU_BAR);
  // sideNavBarElement && $bsOffcanvas.getInstance(sideNavBarElement)?.hide();

  // Show the logout confirmation modal
  const modalElement = document.getElementById(
    ModalIds.LOGOUT_CONFIRMATION_MODAL
  );
  // $bsModal.getInstance(modalElement)?.show();
};

const notification = useNotification();

async function handleExitClick() {
  const router = useRouter();
  const session = useSession();

  notification.updateMessage("Log out");
  await session.logOut();
  router.push(Routes.Login);
}


onMounted(async ()=>{
  slug.value = await useContentfulSlug({ slug: 'widget-cta-logout', contentTypeId: 'page' });

});

const snapEngageSpacing = ref<boolean>(false);
agentAvailable.then((res:any) => {
  snapEngageSpacing.value = res;
});
</script>

<template>
  <div
    class="theme-profile-menu-logout"
    :class="snapEngageSpacing ? 'theme-snapengage-padding' : ''"
  >
  <BaseButton
          data-test-id="logout-user"
          :label="slug?.cta.logOut"
          variation="secondary"
          @click="handleExitClick"
        />
  
  <!--
    <button
      data-test-id="logout-modal-exit"
      @click="handleExitClick"
    >
      {{ slug?.cta.logOut }}
    </button>-->
  </div>
</template>
