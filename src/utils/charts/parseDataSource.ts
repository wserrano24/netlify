import { DataSource, ParsedDataSource } from '@/types/charts';

export const parseDataSource = (source: DataSource): ParsedDataSource => {
  const { id } = source;
  const labels: string[] = [];
  const data: number[] = [];
  const backgroundColor: string[] = [];

  source.data.forEach((item) => {
    labels.push(item.label);
    data.push(item.value);
    backgroundColor.push(item.backgroundColor);
  });

  return {
    backgroundColor,
    data,
    id,
    labels,
  };
};
