const ROADMAP_START = new Date(2026, 5, 29);

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function parseIsoDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatLongDate(value: string): string {
  return parseIsoDate(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getWeekNumberForDate(date: Date, totalWeeks: number): number {
  const dayDifference =
    (startOfDay(date).getTime() - startOfDay(ROADMAP_START).getTime()) /
    (1000 * 60 * 60 * 24);

  if (dayDifference <= 0) {
    return 1;
  }

  return Math.min(totalWeeks, Math.floor(dayDifference / 7) + 1);
}

export function isDateWithinWeek(
  date: Date,
  startDate: string,
  endDate: string,
): boolean {
  const day = startOfDay(date).getTime();
  return (
    day >= startOfDay(parseIsoDate(startDate)).getTime() &&
    day <= startOfDay(parseIsoDate(endDate)).getTime()
  );
}
