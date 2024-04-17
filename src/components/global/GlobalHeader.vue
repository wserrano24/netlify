<script setup lang="ts">
import useContentfulImage from '@/composables/useContentfulImage';
import { Routes } from '@/constants/pages';
import { onMounted, ref } from 'vue';

let data = {
  homeLinkText: 'Home',
  componentLibText: 'Component Library',
  landingPageText: 'Landing Page',
};

const image = ref();

onMounted( async () => {
  image.value = await useContentfulImage('1aLe1sspHYV0QPcjZoISmw');  
});


</script>

<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/">
          <img
            :src="image.url"
            :alt="image.altText"
          />
        </router-link>
        <div class="navbar-nav">
          <router-link :to="Routes.Landing" class="nav-link">
            {{ data.landingPageText }}
          </router-link>
        </div>
      </div>
    </nav>
  </header>
</template>

<style lang="scss">
.navbar-brand {
  padding: 0;
  margin-top: -12px;
}
</style>
