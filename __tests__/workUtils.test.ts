import {
  padTime,
  calcDuration,
  formatMins,
  to24HourFormat,
  parseDateSafe,
} from "@/lib/workUtils";

describe("padTime", () => {
  it("pads single-digit hours and minutes", () => {
    expect(padTime("9:5")).toBe("09:05");
  });

  it("returns already-padded time unchanged", () => {
    expect(padTime("14:30")).toBe("14:30");
  });

  it('returns "--" for empty string', () => {
    expect(padTime("")).toBe("--");
  });

  it('returns "--" for string without colon', () => {
    expect(padTime("1200")).toBe("--");
  });
});

describe("calcDuration", () => {
  it("calculates simple duration in minutes", () => {
    expect(calcDuration("09:00", "17:00")).toBe(480);
  });

  it("returns 0 when start is empty", () => {
    expect(calcDuration("", "17:00")).toBe(0);
  });

  it("returns 0 when end is empty", () => {
    expect(calcDuration("09:00", "")).toBe(0);
  });

  it("deducts 30-minute lunch when crossing noon", () => {
    expect(calcDuration("09:00", "17:00", true)).toBe(450);
  });

  it("does not deduct lunch when work is entirely in the morning", () => {
    expect(calcDuration("07:00", "11:00", true)).toBe(240);
  });

  it("does not deduct lunch when work starts after noon", () => {
    expect(calcDuration("13:00", "17:00", true)).toBe(240);
  });

  it("returns 0 when end is before start (negative duration)", () => {
    expect(calcDuration("17:00", "09:00")).toBe(0);
  });

  it("returns 0 for same start and end", () => {
    expect(calcDuration("12:00", "12:00")).toBe(0);
  });

  it("handles minute-level precision", () => {
    expect(calcDuration("09:15", "10:45")).toBe(90);
  });
});

describe("formatMins", () => {
  it("formats 0 minutes", () => {
    expect(formatMins(0)).toBe("0h 0m");
  });

  it("formats minutes less than an hour", () => {
    expect(formatMins(45)).toBe("0h 45m");
  });

  it("formats exact hours", () => {
    expect(formatMins(120)).toBe("2h 0m");
  });

  it("formats hours and minutes", () => {
    expect(formatMins(150)).toBe("2h 30m");
  });

  it("formats large values", () => {
    expect(formatMins(480)).toBe("8h 0m");
  });
});

describe("to24HourFormat", () => {
  it("converts AM time correctly", () => {
    expect(to24HourFormat("09:00", "AM")).toBe("09:00");
  });

  it("converts PM time correctly (adds 12)", () => {
    expect(to24HourFormat("01:30", "PM")).toBe("13:30");
  });

  it("handles 12:00 PM (noon stays 12)", () => {
    expect(to24HourFormat("12:00", "PM")).toBe("12:00");
  });

  it("handles 12:00 AM (midnight becomes 00)", () => {
    expect(to24HourFormat("12:00", "AM")).toBe("00:00");
  });

  it("returns empty string for empty time", () => {
    expect(to24HourFormat("", "AM")).toBe("");
  });

  it("converts 11:59 PM correctly", () => {
    expect(to24HourFormat("11:59", "PM")).toBe("23:59");
  });

  it("converts 1:00 AM correctly", () => {
    expect(to24HourFormat("01:00", "AM")).toBe("01:00");
  });
});

describe("parseDateSafe", () => {
  it("parses a valid ISO date string", () => {
    const result = parseDateSafe("2025-01-15");
    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(0); // January = 0
    expect(result.getDate()).toBe(15);
  });

  it("parses a full ISO datetime string", () => {
    const result = parseDateSafe("2025-06-20T10:30:00Z");
    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(5); // June = 5
  });

  it("falls back to Date constructor for non-ISO formats", () => {
    const result = parseDateSafe("June 15, 2025");
    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(5);
  });

  it("returns a Date object even for invalid strings", () => {
    const result = parseDateSafe("not-a-date");
    expect(result).toBeInstanceOf(Date);
  });
});
