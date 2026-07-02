"use client";

import { useState, useEffect } from "react";
import { CalendarDays } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { startOfWeek, endOfWeek, format } from "date-fns";
import { padTime, calcDuration, formatMins, to24HourFormat, parseDateSafe } from "@/lib/time";
import {
  WorkEntry,
  loadWorkEntries,
  saveWorkEntries,
  clearWorkEntries,
  calcTotalWorkMinutes,
  calcTotalTravelMinutes,
} from "@/lib/work-entries";
import TimePicker from "../components/TimePicker";

export default function ClientWorkPage() {
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

  useEffect(() => {
    setEntries(loadWorkEntries());
    setMounted(true);
  }, []);

  const totalWorkMinutes = calcTotalWorkMinutes(entries);
  const totalTravelMinutes = calcTotalTravelMinutes(entries);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: WorkEntry = {
      date: workDate,
      amStart: to24HourFormat(amTime, amPeriod),
      workStart: to24HourFormat(workStartTime, workStartPeriod),
      workEnd: to24HourFormat(workEndTime, workEndPeriod),
      pmEnd: to24HourFormat(pmTime, pmPeriod),
    };
    const current = loadWorkEntries();
    const updated = [...current, newEntry];
    saveWorkEntries(updated);
    setEntries(updated);
    alert("Work entry saved!");
  };

  const downloadWeeklyPDF = () => {
    const weekEntries = loadWorkEntries();

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

    const totalWork = calcTotalWorkMinutes(weekEntries);
    const totalTravel = calcTotalTravelMinutes(weekEntries);

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
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const y =
      (doc as any).lastAutoTable && (doc as any).lastAutoTable.finalY
        ? (doc as any).lastAutoTable.finalY + 10
        : 40;
    /* eslint-enable @typescript-eslint/no-explicit-any */

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
            clearWorkEntries();
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
        <TimePicker
          label="AM Travel Start"
          time={amTime}
          period={amPeriod}
          onTimeChange={setAmTime}
          onPeriodChange={setAmPeriod}
        />

        {/* Work Hours */}
        <div className="grid grid-cols-2 gap-4">
          <TimePicker
            label="Work Start"
            time={workStartTime}
            period={workStartPeriod}
            onTimeChange={setWorkStartTime}
            onPeriodChange={setWorkStartPeriod}
          />
          <TimePicker
            label="Work End"
            time={workEndTime}
            period={workEndPeriod}
            onTimeChange={setWorkEndTime}
            onPeriodChange={setWorkEndPeriod}
          />
        </div>

        {/* PM Travel */}
        <TimePicker
          label="PM Travel End"
          time={pmTime}
          period={pmPeriod}
          onTimeChange={setPmTime}
          onPeriodChange={setPmPeriod}
        />

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
