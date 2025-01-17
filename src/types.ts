export interface TableRow {
  id: string;
  label: string;
  value: number;
  children?: TableRow[];
  originalValue?: number;
  variance?: number;
  level?: number;
}

export interface TableData {
  rows: TableRow[];
}
