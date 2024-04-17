<script setup lang="ts">
import MoneyCardSlider from '@/components/MoneyCardSlider.vue';
import useContentful from '@/composables/useContentful';
import { onMounted, ref } from 'vue';

const { getMoneyCardSliderData } = useContentful();
const data = ref();
const pending = ref();
// const { data, pending } = getMoneyCardSliderData(
//   'widget-dashboard-money-card-slider'
// );

onMounted(async ()=>{

  const resp = await getMoneyCardSliderData(
    'widget-dashboard-money-card-slider'
  );
  data.value= await resp.data.value()
  pending.value = await resp.pending.value
})


</script>

<template>
  <section class="theme-dashboard-card-section">
    <MoneyCardSlider
      :data="data?.cards ?? []"
      :is-loading="pending"
      :section-title="data?.sectionTitle || ''"
      data-test-id="money-card-slider"
    />
  </section>
</template>
