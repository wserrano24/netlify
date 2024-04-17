<script setup lang="ts">
import WidgetsFooterGlobalApplication from '@/widgets/widgets-footer-global-application.vue';

useHead({
  htmlAttrs: { lang: 'en' },
});
</script>

<template>
  <div class="theme-okta">
    <div class="container theme-okta-inner">
      <header class="theme-okta-header">
        <WidgetsHeaderBlock />
      </header>
      <div class="row theme-okta-row">
        <div class="col">
          <slot />
        </div>
      </div>
      <div class="row theme-okta-row">
        <div class="col theme-okta-col">
          <WidgetsFooterGlobalApplication show-full-footer />
        </div>
      </div>
    </div>
  </div>
</template>
