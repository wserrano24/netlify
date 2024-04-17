export interface DataSource {
  data: DataSourceItem[];
  id: string;
}

export interface DataSourceItem {
  backgroundColor: string;
  label: string;
  value: number;
}

export interface ParsedDataSource {
  backgroundColor: string[];
  data: number[];
  id: string;
  labels: string[];
}
