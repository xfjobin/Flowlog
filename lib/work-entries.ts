import { calcDuration } from "./time";

export type WorkEntry = {
  date: string;
  amStart: string;
  workStart: string;
  workEnd: string;
  pmEnd: string;
};

const STORAGE_KEY = "workEntries";

export function loadWorkEntries(): WorkEntry[] {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

export function saveWorkEntries(entries: WorkEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function clearWorkEntries(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function calcTotalWorkMinutes(entries: WorkEntry[]): number {
  return entries.reduce(
    (sum, entry) => sum + calcDuration(entry.workStart, entry.workEnd, true),
    0
  );
}

export function calcTotalTravelMinutes(entries: WorkEntry[]): number {
  return entries.reduce(
    (sum, entry) =>
      sum +
      calcDuration(entry.amStart, entry.workStart) +
      calcDuration(entry.workEnd, entry.pmEnd),
    0
  );
}
