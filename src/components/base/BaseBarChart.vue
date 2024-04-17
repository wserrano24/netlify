<script setup lang="ts">
import { BarChart } from 'vue-chart-3';
import { DataSource } from '@/types/charts';
import { useChartData } from '@/composables/charts/useChartData';
import BaseButton from './BaseButton.vue';

interface Props {
  sourcesData: DataSource[];
}

const props = defineProps<Props>();

const { chartData, options, selectedSource, selectSource, sources } = useChartData(props.sourcesData, 'bar');
</script>

<template>
  <div class="d-flex justify-content-between mb-3">
    <BaseButton
      v-for="source in sources"
      :key="source.id"
      :label="source.id"
      :variation="selectedSource.id === source.id ? 'primary' : 'secondary'"
      @click="selectSource(source.id)"
    />
  </div>
  <h4 class="d-flex justify-content-center">{{ selectedSource.id }}</h4>
  <BarChart
    class="d-flex justify-content-center"
    :chart-data="chartData"
    :options="options"
  />
</template>
