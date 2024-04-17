<script setup lang="ts">
const slug = await useContentfulSlug({ slug: 'widget-header-zipcode', contentTypeId: 'page' });
</script>

<template>
  <GlobalApplicationHeader class="theme-header-block">
    <template #center>
      <img
        v-for="(image, key) in [slug?.images.logoMobile, slug?.images.logoDesktop]"
        :key="key"
        :src="image.url"
        alt="Advance America logo mark"
      />
    </template>
  </GlobalApplicationHeader>
</template>
