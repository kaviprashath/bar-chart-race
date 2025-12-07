export interface DataPoint {
  date: string; // "YYYY" or "YYYY-MM-DD"
  values: Record<string, number>; // { "Apple": 100, "Google": 200 }
}

export interface EntityConfig {
  id: string;
  label: string;
  color: string;
  image?: string;
}

export interface RaceData {
  title: string;
  subtitle: string;
  source: string;
  entities: EntityConfig[];
  timeline: DataPoint[];
}

export interface ChartConfig {
  duration: number; // Duration of the entire race in seconds
  topN: number; // Number of bars to show
  barHeight: number; // Height of each bar in px
  gap: number; // Gap between bars in px
  showIcons: boolean;
  backgroundColor: string;
  textColor: string;
}

export interface InterpolatedEntity {
  id: string;
  label: string;
  value: number;
  color: string;
  image?: string;
  rank: number;
}
