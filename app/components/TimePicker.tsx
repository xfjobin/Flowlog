"use client";

function generateHourMinuteOptions() {
  const options = [];
  for (let h = 1; h <= 12; h++) {
    for (let m = 0; m < 60; m += 15) {
      const hour = String(h);
      const minute = String(m).padStart(2, "0");
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

type TimePickerProps = {
  label: string;
  time: string;
  period: string;
  onTimeChange: (value: string) => void;
  onPeriodChange: (value: string) => void;
};

export default function TimePicker({
  label,
  time,
  period,
  onTimeChange,
  onPeriodChange,
}: TimePickerProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700 mb-1">
        {label}
      </label>
      <div className="flex gap-2">
        <select
          value={time}
          onChange={(e) => onTimeChange(e.target.value)}
          className="flex-1 rounded-md border border-zinc-300 p-2"
        >
          <option value="">--</option>
          {generateHourMinuteOptions()}
        </select>
        <select
          value={period}
          onChange={(e) => onPeriodChange(e.target.value)}
          className="w-20 rounded-md border border-zinc-300 p-2"
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
    </div>
  );
}
