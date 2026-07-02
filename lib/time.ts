import { parseISO } from "date-fns";

export function padTime(time: string): string {
  if (!time || !time.includes(":")) return "--";
  const [h, m] = time.split(":").map((n) => String(n).padStart(2, "0"));
  return `${h}:${m}`;
}

export function calcDuration(start: string, end: string, deductLunch = false): number {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  let minutes = eh * 60 + em - (sh * 60 + sm);
  if (deductLunch && sh <= 12 && eh >= 12) minutes -= 30;
  return Math.max(0, minutes);
}

export function formatMins(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
}

export function to24HourFormat(time: string, period: string): string {
  if (!time) return "";
  const [rawHour, minute] = time.split(":").map(Number);
  let hour = rawHour;
  if (period === "PM" && hour < 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function parseDateSafe(d: string): Date {
  try {
    const iso = parseISO(d);
    if (!isNaN(iso.getTime())) return iso;
    return new Date(d);
  } catch {
    return new Date(d);
  }
}
