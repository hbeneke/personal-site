export interface ActivityPoint {
  date: string | Date;
  value: number;
  label?: string;
}

export interface ActivityWindow {
  from: Date;
  to: Date;
}

export interface ActivityBucket {
  start: Date;
  end: Date;
  value: number;
  firstPoint?: Date;
  lastPoint?: Date;
  labels: string[];
}

export interface PulseBeat {
  value: number;
  firstPoint: Date;
  lastPoint: Date;
  labels: string[];
  center: number;
  left: number;
  right: number;
  path: string;
}

export interface Pulse {
  path: string;
  beats: PulseBeat[];
}
