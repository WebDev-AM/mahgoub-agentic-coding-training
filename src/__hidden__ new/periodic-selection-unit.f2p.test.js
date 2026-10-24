import { describe, it, expect } from "vitest";
import { updatePeriodicSelection } from "../utils/reservationPeriodsUtils";

const periodic = (day, status = "AVAILABLE") => ({
  price: 80,
  startPeriod: `2026-04-${String(day).padStart(2, "0")}`,
  endPeriod: `2026-04-${String(day).padStart(2, "0")}`,
  typePeriod: "Weekend",
  status,
});

const fourConsecutive = () => [
  periodic(1),
  periodic(2),
  periodic(3),
  periodic(4),
];

describe("updatePeriodicSelection unit behavior", () => {
  it("starts a selection with a single index", () => {
    expect(updatePeriodicSelection(fourConsecutive(), [], 2, true)).toEqual([
      2,
    ]);
  });

  it("extends by prepending an adjacent available period", () => {
    expect(
      updatePeriodicSelection(fourConsecutive(), [2, 3], 1, true)
    ).toEqual([1, 2, 3]);
  });

  it("extends by appending an adjacent available period", () => {
    expect(
      updatePeriodicSelection(fourConsecutive(), [1, 2], 3, true)
    ).toEqual([1, 2, 3]);
  });

  it("rejects a non-consecutive addition without changing the selection", () => {
    const periods = [
      periodic(1),
      periodic(2),
      periodic(3),
      periodic(4),
      periodic(5),
    ];

    let selected = updatePeriodicSelection(periods, [], 1, true);
    expect(selected).toEqual([1]);

    selected = updatePeriodicSelection(periods, selected, 2, true);
    expect(selected).toEqual([1, 2]);

    selected = updatePeriodicSelection(periods, selected, 4, true);
    expect(selected).toEqual([1, 2]);
  });

  it("rejects an unavailable adjacent period", () => {
    const periods = [periodic(1), periodic(2, "LOCKED"), periodic(3)];

    let selected = updatePeriodicSelection(periods, [], 0, true);
    expect(selected).toEqual([0]);

    selected = updatePeriodicSelection(periods, selected, 1, true);
    expect(selected).toEqual([0]);
  });

  it("truncates a selection when a middle period is unchecked", () => {
    expect(
      updatePeriodicSelection(fourConsecutive(), [0, 1, 2, 3], 2, false)
    ).toEqual([0, 1]);
  });

  it("removes only the last period when the last is unchecked", () => {
    const periods = [periodic(1), periodic(2), periodic(3)];
    expect(updatePeriodicSelection(periods, [0, 1, 2], 2, false)).toEqual([
      0, 1,
    ]);
  });

  it("removes the only selection when it is unchecked", () => {
    const periods = [periodic(1), periodic(2), periodic(3)];
    expect(updatePeriodicSelection(periods, [1], 1, false)).toEqual([]);
  });
});
