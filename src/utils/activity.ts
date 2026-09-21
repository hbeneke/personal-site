import type { ActivityBucket, ActivityPoint, ActivityWindow, Pulse } from "@types";

const DAY_MS = 86_400_000;

/**
 * Computes the window to chart: from the first point until `now`,
 * capped to the last `maxDays` and never shorter than `minDays`.
 *
 * @param points - Dated values the window must cover
 * @param now - End of the window
 * @param maxDays - Longest history to show
 * @param minDays - Shortest window, so brand new histories still draw a line
 * @returns The window start and end
 *
 * @example
 * getActivityWindow([{ date: "2020-01-01", value: 1 }], new Date("2026-09-21"));
 * // { from: 2025-09-21, to: 2026-09-21 }
 */
export function getActivityWindow(
  points: ActivityPoint[],
  now = new Date(),
  maxDays = 365,
  minDays = 30,
): ActivityWindow {
  const end = now.getTime();
  const first = Math.min(end, ...points.map((point) => new Date(point.date).getTime()));
  const start = Math.min(Math.max(first, end - maxDays * DAY_MS), end - minDays * DAY_MS);

  return { from: new Date(start), to: now };
}

/**
 * Spreads dated points over a fixed number of equal time buckets between two dates,
 * so every chart covers the same window and has the same width regardless of how much history it holds.
 * Points outside the window are ignored.
 *
 * @param points - Dated values to aggregate
 * @param from - Start of the window
 * @param to - End of the window
 * @param bars - Number of buckets to return
 * @returns Buckets in chronological order
 *
 * @example
 * bucketActivity(points, new Date("2026-01-01"), new Date("2027-01-01"), 52);
 * // 52 weekly buckets covering 2026
 */
export function bucketActivity(
  points: ActivityPoint[],
  from: Date,
  to: Date,
  bars = 52,
): ActivityBucket[] {
  const start = from.getTime();
  const span = to.getTime() - start;
  if (bars < 1 || span <= 0) return [];

  const bucketMs = span / bars;
  const buckets: ActivityBucket[] = Array.from({ length: bars }, (_, index) => ({
    start: new Date(start + index * bucketMs),
    end: new Date(start + (index + 1) * bucketMs),
    value: 0,
    labels: [],
  }));

  const chronological = points
    .map((point) => ({ ...point, date: new Date(point.date) }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  for (const point of chronological) {
    const offset = point.date.getTime() - start;
    if (offset < 0 || offset > span) continue;

    const bucket = buckets[Math.min(bars - 1, Math.floor(offset / bucketMs))];
    bucket.value += point.value;
    bucket.firstPoint ??= point.date;
    bucket.lastPoint = point.date;
    if (point.label) bucket.labels.push(point.label);
  }

  return buckets;
}

/**
 * Builds an electrocardiogram-like pulse: a flat baseline with one heartbeat per active bucket,
 * whose height is proportional to the bucket value. Each beat also gets its own path and a hover zone
 * spanning halfway to its neighbouring beats, so the whole line is covered.
 *
 * @param buckets - Buckets to draw, in chronological order
 * @param width - Width of the drawing area
 * @param height - Height of the drawing area
 * @returns The full line path and the individual beats
 */
export function buildPulse(buckets: ActivityBucket[], width: number, height: number): Pulse {
  const step = width / buckets.length;
  const baseline = height * 0.65;
  const maxAmplitude = baseline - 1;
  const max = Math.max(0, ...buckets.map((bucket) => bucket.value));

  const toPoint = (x: number, y: number) =>
    `${Math.round(x * 100) / 100} ${Math.round(y * 100) / 100}`;

  const activeBeats = buckets.flatMap(({ value, firstPoint, lastPoint, labels }, index) => {
    if (value === 0 || !firstPoint || !lastPoint) return [];

    const center = (index + 0.5) * step;
    const amplitude = Math.max(0.35, value / max) * maxAmplitude;
    const dip = Math.min(amplitude * 0.5, height - baseline - 1);
    const points = [
      toPoint(center - step * 0.35, baseline),
      toPoint(center - step * 0.1, baseline - amplitude),
      toPoint(center + step * 0.1, baseline + dip),
      toPoint(center + step * 0.35, baseline),
    ];

    return [{ value, firstPoint, lastPoint, labels, center, points }];
  });

  const path = [
    `M${toPoint(0, baseline)}`,
    ...activeBeats.flatMap((beat) => beat.points.map((point) => `L${point}`)),
    `L${toPoint(width, baseline)}`,
  ].join(" ");

  const beats = activeBeats.map(
    ({ value, firstPoint, lastPoint, labels, center, points }, index) => ({
      value,
      firstPoint,
      lastPoint,
      labels,
      center,
      left: index > 0 ? (activeBeats[index - 1].center + center) / 2 : 0,
      right: index < activeBeats.length - 1 ? (center + activeBeats[index + 1].center) / 2 : width,
      path: `M${points.join(" L")}`,
    }),
  );

  return { path, beats };
}
