import { Chart, registerables } from 'chart.js';
import { parseDataSource } from '@/utils/charts/parseDataSource';

Chart.register(...registerables);

export const useChartData = (rawSources, chartType) => {
  const sources = rawSources.map(parseDataSource);
  const selectedSource = ref(sources[0]);

  const chartData = computed(() => ({
    labels: selectedSource.value.labels,
    datasets: [
      {
        data: selectedSource.value.data,
        backgroundColor: selectedSource.value.backgroundColor,
      },
    ],
  }));

  const options = computed(() => ({
    responsive: false,
    plugins: {
      legend: {
        display: chartType === 'doughnut',
        position: 'bottom',
      },
      title: {
        display: true,
        text: selectedSource.value.id,
      },
    },
  }));

  function selectSource(sourceId: string) {
    const selectedSourceData = sources.find((source) => source.id === sourceId);

    if (!selectedSourceData) return;

    selectedSource.value = selectedSourceData;
  }

  return {
    chartData,
    options,
    selectedSource,
    selectSource,
    sources,
  };
};
