"use client";

import { useState, useEffect } from "react";
import { CalendarDays } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { startOfWeek, endOfWeek, format, parseISO } from "date-fns";

// --- Types & Helpers ---
type WorkEntry = {
  date: string;
  amStart: string;
  workStart: string;
  workEnd: string;
  pmEnd: string;
};

function padTime(time: string) {
  if (!time || !time.includes(":")) return "--";
  const [h, m] = time.split(":").map((n) => String(n).padStart(2, "0"));
  return `${h}:${m}`;
}

function calcDuration(start: string, end: string, deductLunch = false): number {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  let minutes = eh * 60 + em - (sh * 60 + sm);
  if (deductLunch && sh <= 12 && eh >= 12) minutes -= 30;
  return Math.max(0, minutes);
}

function formatMins(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
}

function to24HourFormat(time: string, period: string) {
  if (!time) return "";
  let [hour, minute] = time.split(":").map(Number);
  if (period === "PM" && hour < 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function generateHourMinuteOptions() {
  const options = [];
  for (let h = 1; h <= 12; h++) {
    for (let m = 0; m < 60; m += 15) {
      const hour = String(h);
      const minute = String(m).padStart(2, "0"); // use const here
      const label = `${hour}:${minute}`;
      const value = `${String(h).padStart(2, "0")}:${minute}`;
      options.push(
        <option key={value} value={value}>
          {label}
        </option>
      );
    }
  }
  return options;
}

function parseDateSafe(d: string): Date {
  try {
    const iso = parseISO(d);
    if (!isNaN(iso.getTime())) return iso;
    return new Date(d);
  } catch {
    return new Date(d);
  }
}

// --- Component ---
export default function ClientWorkPage() {
  // --- State ---
  const [workDate, setWorkDate] = useState("");
  const [entries, setEntries] = useState<WorkEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  const [amTime, setAmTime] = useState("");
  const [amPeriod, setAmPeriod] = useState("AM");
  const [workStartTime, setWorkStartTime] = useState("");
  const [workStartPeriod, setWorkStartPeriod] = useState("AM");
  const [workEndTime, setWorkEndTime] = useState("");
  const [workEndPeriod, setWorkEndPeriod] = useState("PM");
  const [pmTime, setPmTime] = useState("");
  const [pmPeriod, setPmPeriod] = useState("PM");

  // --- Effect: Load Entries ---
  useEffect(() => {
    const saved = localStorage.getItem("workEntries");
    if (saved) {
      setEntries(JSON.parse(saved));
    }
    setMounted(true);
  }, []);

  // --- Calculated stats ---
  const totalWorkMinutes = entries.reduce(
    (sum, entry) => sum + calcDuration(entry.workStart, entry.workEnd, true),
    0
  );
  const totalTravelMinutes = entries.reduce(
    (sum, entry) =>
      sum +
      calcDuration(entry.amStart, entry.workStart) +
      calcDuration(entry.workEnd, entry.pmEnd),
    0
  );

  const workDuration = (() => {
    const start = to24HourFormat(workStartTime, workStartPeriod);
    const end = to24HourFormat(workEndTime, workEndPeriod);
    if (!start || !end) return null;
    const mins = calcDuration(start, end, true);
    return (
      formatMins(mins) +
      (mins !== 0
        ? start <= "12:00" && end >= "12:00"
          ? " (-30m lunch deducted)"
          : ""
        : "")
    );
  })();

  // --- Form Submit Handler ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: WorkEntry = {
      date: workDate,
      amStart: to24HourFormat(amTime, amPeriod),
      workStart: to24HourFormat(workStartTime, workStartPeriod),
      workEnd: to24HourFormat(workEndTime, workEndPeriod),
      pmEnd: to24HourFormat(pmTime, pmPeriod),
    };
    const saved = localStorage.getItem("workEntries");
    const current: WorkEntry[] = saved ? JSON.parse(saved) : [];
    const updated = [...current, newEntry];
    localStorage.setItem("workEntries", JSON.stringify(updated));
    setEntries(updated);
    alert("Work entry saved!");
  };

  // --- PDF Download Handler ---
  const downloadWeeklyPDF = () => {
    const saved = localStorage.getItem("workEntries");
    const latestEntries: WorkEntry[] = saved ? JSON.parse(saved) : [];

    // Show all entries (or filter by week if you like)
    const weekEntries = latestEntries;

    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });

    const doc = new jsPDF();
    const title = `Timesheet – ${format(weekStart, "MMMM d")} to ${format(
      weekEnd,
      "MMMM d, yyyy"
    )}`;
    doc.setFontSize(14);
    doc.text(title, 14, 18);

    const rows = weekEntries.map((e) => {
      const workMin = calcDuration(e.workStart, e.workEnd, true);
      const travelMin =
        calcDuration(e.amStart, e.workStart) + calcDuration(e.workEnd, e.pmEnd);

      return [
        format(parseDateSafe(e.date), "EEE, MMM d"),
        `${padTime(e.amStart)}–${padTime(e.workStart)}`,
        `${padTime(e.workStart)}–${padTime(e.workEnd)}`,
        `${padTime(e.workEnd)}–${padTime(e.pmEnd)}`,
        formatMins(workMin),
        formatMins(travelMin),
      ];
    });

    const totalWork = weekEntries.reduce(
      (sum, e) => sum + calcDuration(e.workStart, e.workEnd, true),
      0
    );

    const totalTravel = weekEntries.reduce(
      (sum, e) =>
        sum +
        calcDuration(e.amStart, e.workStart) +
        calcDuration(e.workEnd, e.pmEnd),
      0
    );

    autoTable(doc, {
      startY: 26,
      head: [
        ["Date", "AM Travel", "Work", "PM Travel", "Work Time", "Travel Time"],
      ],
      body: rows,
      theme: "striped",
      styles: {
        fontSize: 10,
        cellPadding: 2,
        halign: "center",
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
      },
    });

    doc.setFontSize(12);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const y =
      (doc as any).lastAutoTable && (doc as any).lastAutoTable.finalY
        ? (doc as any).lastAutoTable.finalY + 10
        : 40;

    doc.text(
      `Total Work: ${formatMins(totalWork)}    |    Total Travel: ${formatMins(
        totalTravel
      )}`,
      14,
      y
    );

    const fileName = `Timesheet_${format(weekStart, "MMMdd")}-${format(
      weekEnd,
      "MMMdd_yyyy"
    )}.pdf`;
    doc.save(fileName);
  };

  // --- Render ---
  return (
    <main className="min-h-screen bg-white text-zinc-900 p-8">
      <h1 className="text-3xl font-semibold mb-6">Work Tracker</h1>

      {mounted && entries.length > 0 && (
        <div className="text-sm text-zinc-700 mb-6 space-y-1">
          <div>
            <strong>Total Work Hours:</strong> {formatMins(totalWorkMinutes)}
          </div>
          <div>
            <strong>Total Travel Time:</strong> {formatMins(totalTravelMinutes)}
          </div>
        </div>
      )}

      {mounted && entries.length > 0 && (
        <button
          onClick={() => {
            localStorage.removeItem("workEntries");
            setEntries([]);
          }}
          className="mt-4 text-sm text-red-600 hover:underline"
        >
          🗑 Clear All Entries
        </button>
      )}

      {mounted && entries.length > 0 && (
        <button
          onClick={downloadWeeklyPDF}
          className="mt-4 text-sm text-blue-600 hover:underline"
        >
          📄 Download Weekly PDF
        </button>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
        {/* Date Picker */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            Date
          </label>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={workDate}
              onChange={(e) => setWorkDate(e.target.value)}
              className="w-full rounded-md border border-zinc-300 p-2"
            />
            <button
              type="button"
              title="Use Today"
              onClick={() => {
                const today = new Date();
                const yyyy = today.getFullYear();
                const mm = String(today.getMonth() + 1).padStart(2, "0");
                const dd = String(today.getDate()).padStart(2, "0");
                setWorkDate(`${yyyy}-${mm}-${dd}`);
              }}
              className="p-2 rounded-md border border-zinc-300 hover:bg-zinc-100"
            >
              <CalendarDays className="w-5 h-5 text-zinc-600" />
            </button>
          </div>
        </div>

        {/* AM Travel */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            AM Travel Start
          </label>
          <div className="flex gap-2">
            <select
              value={amTime}
              onChange={(e) => setAmTime(e.target.value)}
              className="flex-1 rounded-md border border-zinc-300 p-2"
            >
              <option value="">--</option>
              {generateHourMinuteOptions()}
            </select>
            <select
              value={amPeriod}
              onChange={(e) => setAmPeriod(e.target.value)}
              className="w-20 rounded-md border border-zinc-300 p-2"
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
        </div>

        {/* Work Hours */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Work Start
            </label>
            <div className="flex gap-2">
              <select
                value={workStartTime}
                onChange={(e) => setWorkStartTime(e.target.value)}
                className="flex-1 rounded-md border border-zinc-300 p-2"
              >
                <option value="">--</option>
                {generateHourMinuteOptions()}
              </select>
              <select
                value={workStartPeriod}
                onChange={(e) => setWorkStartPeriod(e.target.value)}
                className="w-20 rounded-md border border-zinc-300 p-2"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Work End
            </label>
            <div className="flex gap-2">
              <select
                value={workEndTime}
                onChange={(e) => setWorkEndTime(e.target.value)}
                className="flex-1 rounded-md border border-zinc-300 p-2"
              >
                <option value="">--</option>
                {generateHourMinuteOptions()}
              </select>
              <select
                value={workEndPeriod}
                onChange={(e) => setWorkEndPeriod(e.target.value)}
                className="w-20 rounded-md border border-zinc-300 p-2"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>
        </div>

        {/* PM Travel */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            PM Travel End
          </label>
          <div className="flex gap-2">
            <select
              value={pmTime}
              onChange={(e) => setPmTime(e.target.value)}
              className="flex-1 rounded-md border border-zinc-300 p-2"
            >
              <option value="">--</option>
              {generateHourMinuteOptions()}
            </select>
            <select
              value={pmPeriod}
              onChange={(e) => setPmPeriod(e.target.value)}
              className="w-20 rounded-md border border-zinc-300 p-2"
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
        </div>

        {/* Save */}
        <button
          type="submit"
          className="w-full bg-zinc-800 text-white py-2 px-4 rounded-md hover:bg-zinc-700 transition"
        >
          Save Work Entry
        </button>
      </form>

      {/* Duration */}
      {workDuration && (
        <div className="mt-6 text-sm text-zinc-700">
          <strong>Calculated Work Duration:</strong> {workDuration}
        </div>
      )}

      {/* Saved Entries */}
      {mounted && entries.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold mb-2">Saved Entries</h2>
          <ul className="space-y-2 text-sm text-zinc-800">
            {entries.map((entry, index) => (
              <li
                key={index}
                className="border border-zinc-300 p-3 rounded-md bg-zinc-50"
              >
                <strong>{entry.date}</strong>
                <br />
                AM Travel: {entry.amStart}
                <br />
                Work: {entry.workStart} – {entry.workEnd}
                <br />
                PM Travel: {entry.pmEnd}
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
