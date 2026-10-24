import { describe, it, expect } from "vitest";
import { updatePeriodicSelection } from "../utils/reservationPeriodsUtils";
const periodic = (status = "AVAILABLE") => ({
  price: 80,
  startPeriod: "2026-04-01",
  endPeriod: "2026-04-02",
  typePeriod: "Weekend",
  status,
});

describe("updatePeriodicSelection unit behavior", () => {
  it("starts a selection with a single index", () => {
    expect(
      updatePeriodicSelection([periodic(), periodic(), periodic()], [], 2, true)
    ).toEqual([2]);
  });

  it("extends by prepending an adjacent available period", () => {
    expect(
      updatePeriodicSelection(
        [periodic(), periodic(), periodic(), periodic()],
        [2, 3],
        1,
        true
      )
    ).toEqual([1, 2, 3]);
  });

  it("extends by appending an adjacent available period", () => {
    expect(
      updatePeriodicSelection(
        [periodic(), periodic(), periodic(), periodic()],
        [1, 2],
        3,
        true
      )
    ).toEqual([1, 2, 3]);
  });

  it("rejects a non-consecutive addition without changing the selection", () => {
    const periods = [
      periodic(),
      periodic(),
      periodic(),
      periodic(),
      periodic(),
    ];

    // Build [1, 2] first — the function must accept valid adjacent adds
    let selected = updatePeriodicSelection(periods, [], 1, true);
    expect(selected).toEqual([1]); // ← broken code fails here

    selected = updatePeriodicSelection(periods, selected, 2, true);
    expect(selected).toEqual([1, 2]); // ← broken code fails here too

    // Now try to add the non-consecutive index 4 — must be rejected
    selected = updatePeriodicSelection(periods, selected, 4, true);
    expect(selected).toEqual([1, 2]);
  });

  it("rejects an unavailable adjacent period", () => {
    const periods = [periodic(), periodic("LOCKED"), periodic()];

    // Build [0] first — must succeed
    let selected = updatePeriodicSelection(periods, [], 0, true);
    expect(selected).toEqual([0]); // ← broken code fails here

    // Now try to add the LOCKED period — must be rejected
    selected = updatePeriodicSelection(periods, selected, 1, true);
    expect(selected).toEqual([0]);
  });

  it("truncates a selection when a middle period is unchecked", () => {
    expect(
      updatePeriodicSelection(
        [periodic(), periodic(), periodic(), periodic()],
        [0, 1, 2, 3],
        2,
        false
      )
    ).toEqual([0, 1]);
  });

  it("removes only the last period when the last is unchecked", () => {
    expect(
      updatePeriodicSelection(
        [periodic(), periodic(), periodic()],
        [0, 1, 2],
        2,
        false
      )
    ).toEqual([0, 1]);
  });

  it("removes the only selection when it is unchecked", () => {
    expect(
      updatePeriodicSelection(
        [periodic(), periodic(), periodic()],
        [1],
        1,
        false
      )
    ).toEqual([]);
  });
});
