<script setup lang="ts">
import GlobalHeader from '@/components/global/GlobalHeader.vue';
import WidgetsFooterGlobalApplication from '@/widgets/widgets-footer-global-application.vue';

useHead({
  htmlAttrs: { lang: 'en' },
});
</script>

<template>
  <main>
    <GlobalHeader />
    <div class="container pf-home">
      <div class="row">
        <div class="col">
          <main>
            <slot />
          </main>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <!-- TODO: Confirm which variation of footer will come here -->
          <WidgetsFooterGlobalApplication />
        </div>
      </div>
    </div>
  </main>
</template>
