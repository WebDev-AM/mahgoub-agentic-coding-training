import { describe, expect, it } from "vitest";
import { splitReservationPeriods } from "../utils/reservationPeriodsUtils";

const period = (startPeriod, endPeriod, typePeriod, status = "AVAILABLE") => ({
  price: 10,
  startPeriod,
  endPeriod,
  typePeriod,
  status,
});

describe("reservation period normalization", () => {
  // Periodic dates must not be offered as Daily dates; the current code had no cross-type normalization.
  it("marks dates covered by periodic reservations unavailable in the daily calendar", () => {
    const { dailyPeriods, periodicPeriods } = splitReservationPeriods([
      period("2026-06-01", "2026-06-03", "Weekend"),
    ]);

    expect(dailyPeriods.map((item) => item.status)).toEqual([
      "UNAVAILABLE",
      "UNAVAILABLE",
      "UNAVAILABLE",
    ]);
    expect(periodicPeriods[0].status).toBe("AVAILABLE");
  });

  // Cross-type overlaps must not remain bookable, which the former split-only behavior did not enforce.
  it("marks conflicting daily and periodic reservations unavailable without mutating input", () => {
    const input = [
      period("2026-06-01", "2026-06-01", "Daily"),
      period("2026-06-01", "2026-06-02", "Weekday"),
    ];
    const before = structuredClone(input);
    const { dailyPeriods, periodicPeriods } = splitReservationPeriods(input);

    expect(dailyPeriods[0].status).toBe("UNAVAILABLE");
    expect(periodicPeriods[0].status).toBe("UNAVAILABLE");
    expect(input).toEqual(before);
  });

  // Calendar gaps must be represented as unavailable instead of silently becoming selectable.
  it("inserts unavailable daily dates for gaps between returned periods", () => {
    const { dailyPeriods } = splitReservationPeriods([
      period("2026-06-01", "2026-06-01", "Daily"),
      period("2026-06-03", "2026-06-03", "Daily"),
    ]);

    expect(dailyPeriods.map((item) => [item.startPeriod, item.status])).toEqual(
      [
        ["2026-06-01", "AVAILABLE"],
        ["2026-06-02", "UNAVAILABLE"],
        ["2026-06-03", "AVAILABLE"],
      ]
    );
  });

  // Duplicate daily records represent an ambiguous availability conflict and must not be selectable.
  it("marks duplicate daily date records unavailable", () => {
    const { dailyPeriods } = splitReservationPeriods([
      period("2026-06-01", "2026-06-01", "Daily"),
      period("2026-06-01", "2026-06-01", "Daily"),
    ]);

    expect(dailyPeriods).toHaveLength(1);
    expect(dailyPeriods[0].status).toBe("UNAVAILABLE");
  });

  // Overlapping periodic records must not offer the overlapping stays as independent bookable periods.
  it("marks overlapping periodic reservations unavailable", () => {
    const { periodicPeriods } = splitReservationPeriods([
      period("2026-06-01", "2026-06-03", "Weekday"),
      period("2026-06-03", "2026-06-04", "Weekend"),
    ]);

    expect(periodicPeriods.map((item) => item.status)).toEqual([
      "UNAVAILABLE",
      "UNAVAILABLE",
    ]);
  });

  // The selected mode must preserve its own records while cross-type reservations block Daily dates.
  it("keeps the two period types separate", () => {
    const { dailyPeriods, periodicPeriods } = splitReservationPeriods([
      period("2026-06-01", "2026-06-01", "Daily"),
      period("2026-06-02", "2026-06-02", "Weekend"),
    ]);

    expect(periodicPeriods.map((item) => item.typePeriod)).toEqual(["Weekend"]);
    expect(dailyPeriods.map((item) => item.status)).toEqual([
      "AVAILABLE",
      "UNAVAILABLE",
    ]);
  });
});
