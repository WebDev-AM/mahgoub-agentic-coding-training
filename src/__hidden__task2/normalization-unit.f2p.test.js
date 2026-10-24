import { describe, expect, it } from "vitest";
import { splitReservationPeriods } from "../utils/reservationPeriodsUtils";

const daily = (start, end, status = "AVAILABLE") => ({
  price: 25,
  startPeriod: start,
  endPeriod: end,
  typePeriod: "Daily",
  status,
});

const periodic = (start, end, status = "AVAILABLE") => ({
  price: 100,
  startPeriod: start,
  endPeriod: end,
  typePeriod: "Weekend",
  status,
});

describe("reservation period normalization", () => {
  it("returns empty arrays for empty input", () => {
    expect(splitReservationPeriods([])).toEqual({
      dailyPeriods: [],
      periodicPeriods: [],
    });
  });

  it("keeps daily periods in the daily view without adding periodic entries", () => {
    const input = [
      daily("2026-05-01", "2026-05-01"),
      daily("2026-05-02", "2026-05-02"),
    ];
    const { dailyPeriods, periodicPeriods } = splitReservationPeriods(input);

    expect(
      dailyPeriods.map(({ startPeriod, typePeriod, status }) => [
        startPeriod,
        typePeriod,
        status,
      ])
    ).toEqual([
      ["2026-05-01", "Daily", "AVAILABLE"],
      ["2026-05-02", "Daily", "AVAILABLE"],
    ]);
    expect(periodicPeriods).toEqual([]);
  });

  it("expands a periodic span into unavailable daily dates", () => {
    const { dailyPeriods, periodicPeriods } = splitReservationPeriods([
      periodic("2026-05-01", "2026-05-03"),
    ]);

    expect(periodicPeriods).toEqual([
      periodic("2026-05-01", "2026-05-03"),
    ]);
    expect(
      dailyPeriods.map(({ startPeriod, endPeriod, typePeriod, status }) => [
        startPeriod,
        endPeriod,
        typePeriod,
        status,
      ])
    ).toEqual([
      ["2026-05-01", "2026-05-01", "Daily", "UNAVAILABLE"],
      ["2026-05-02", "2026-05-02", "Daily", "UNAVAILABLE"],
      ["2026-05-03", "2026-05-03", "Daily", "UNAVAILABLE"],
    ]);
  });

  it("separates mixed periods and marks conflicts in both views", () => {
    const { dailyPeriods, periodicPeriods } = splitReservationPeriods([
      periodic("2026-05-04", "2026-05-05"),
      daily("2026-05-03", "2026-05-03"),
      periodic("2026-05-01", "2026-05-02"),
    ]);

    expect(
      periodicPeriods.map(({ startPeriod, endPeriod, typePeriod, status }) => [
        startPeriod,
        endPeriod,
        typePeriod,
        status,
      ])
    ).toEqual([
      ["2026-05-01", "2026-05-02", "Weekend", "AVAILABLE"],
      ["2026-05-03", "2026-05-03", "Check Daily Section", "Check Daily Section"],
      ["2026-05-04", "2026-05-05", "Weekend", "AVAILABLE"],
    ]);
    expect(
      dailyPeriods.map(({ startPeriod, typePeriod, status }) => [
        startPeriod,
        typePeriod,
        status,
      ])
    ).toEqual([
      ["2026-05-01", "Daily", "UNAVAILABLE"],
      ["2026-05-02", "Daily", "UNAVAILABLE"],
      ["2026-05-03", "Daily", "AVAILABLE"],
      ["2026-05-04", "Daily", "UNAVAILABLE"],
      ["2026-05-05", "Daily", "UNAVAILABLE"],
    ]);
  });

  it("does not mutate the input array", () => {
    const input = [
      daily("2026-05-01", "2026-05-01"),
      periodic("2026-05-02", "2026-05-03"),
    ];
    const before = JSON.stringify(input);

    splitReservationPeriods(input);

    expect(JSON.stringify(input)).toBe(before);
  });

  it("preserves confirmed daily periods and blocks their dates in the periodic view", () => {
    const { dailyPeriods, periodicPeriods } = splitReservationPeriods([
      periodic("2026-05-01", "2026-05-02"),
      daily("2026-05-03", "2026-05-03", "CONFIRMED"),
      periodic("2026-05-04", "2026-05-05"),
    ]);

    expect(dailyPeriods).toContainEqual(
      daily("2026-05-03", "2026-05-03", "CONFIRMED")
    );
    expect(periodicPeriods).toContainEqual({
      ...daily("2026-05-03", "2026-05-03", "CONFIRMED"),
      typePeriod: "Check Daily Section",
      status: "Check Daily Section",
    });
  });

  it("keeps overlapping periodic entries and expands each distinct daily date once", () => {
    const { dailyPeriods, periodicPeriods } = splitReservationPeriods([
      periodic("2026-05-01", "2026-05-04"),
      periodic("2026-05-02", "2026-05-03"),
    ]);

    expect(periodicPeriods).toHaveLength(2);
    expect(periodicPeriods).toContainEqual(
      periodic("2026-05-01", "2026-05-04", "UNAVAILABLE")
    );
    expect(periodicPeriods).toContainEqual(
      periodic("2026-05-02", "2026-05-03", "UNAVAILABLE")
    );
    expect(
      dailyPeriods.map(({ startPeriod, endPeriod, status }) => [
        startPeriod,
        endPeriod,
        status,
      ])
    ).toEqual([
      ["2026-05-01", "2026-05-01", "UNAVAILABLE"],
      ["2026-05-02", "2026-05-02", "UNAVAILABLE"],
      ["2026-05-03", "2026-05-03", "UNAVAILABLE"],
      ["2026-05-04", "2026-05-04", "UNAVAILABLE"],
    ]);
  });

  it("preserves periodic entries with an intervening daily entry", () => {
    const { dailyPeriods, periodicPeriods } = splitReservationPeriods([
      periodic("2026-05-01", "2026-05-02"),
      daily("2026-05-03", "2026-05-03"),
      periodic("2026-05-04", "2026-05-05"),
    ]);

    expect(periodicPeriods).toContainEqual(
      periodic("2026-05-01", "2026-05-02")
    );
    expect(periodicPeriods).toContainEqual(
      periodic("2026-05-04", "2026-05-05")
    );
    expect(periodicPeriods).toContainEqual({
      ...daily("2026-05-03", "2026-05-03"),
      typePeriod: "Check Daily Section",
      status: "Check Daily Section",
    });
    expect(
      dailyPeriods.map(({ startPeriod, endPeriod, status }) => [
        startPeriod,
        endPeriod,
        status,
      ])
    ).toEqual([
      ["2026-05-01", "2026-05-01", "UNAVAILABLE"],
      ["2026-05-02", "2026-05-02", "UNAVAILABLE"],
      ["2026-05-03", "2026-05-03", "AVAILABLE"],
      ["2026-05-04", "2026-05-04", "UNAVAILABLE"],
      ["2026-05-05", "2026-05-05", "UNAVAILABLE"],
    ]);
  });
});
