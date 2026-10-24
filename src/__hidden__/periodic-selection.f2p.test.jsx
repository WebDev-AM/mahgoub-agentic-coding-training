// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import PeriodsSlider from "../features/units/chalet/reservationsPeriods/PeriodsSlider";

const reservations = [
  {
    price: 100,
    startPeriod: "2026-06-01",
    endPeriod: "2026-06-01",
    typePeriod: "Weekend",
    status: "AVAILABLE",
  },
  {
    price: 120,
    startPeriod: "2026-06-04",
    endPeriod: "2026-06-04",
    typePeriod: "Weekday",
    status: "AVAILABLE",
  },
];

function SelectionHarness() {
  const [selected, setSelected] = useState([]);
  return (
    <PeriodsSlider
      periods={reservations}
      selected={selected}
      setSelected={setSelected}
    />
  );
}

describe("Periodic selection validation", () => {
  // List-adjacent periods with a calendar gap must not be selectable as a continuous booking.
  it("does not allow extending a selection across a calendar date gap", async () => {
    const user = userEvent.setup();
    render(<SelectionHarness />);

    await user.click(screen.getAllByRole("checkbox")[0]);

    expect(screen.getAllByRole("checkbox")).toHaveLength(1);
  });

  // Unchecking the first period must preserve the remaining valid contiguous sequence.
  it("preserves later periods when the first selected period is unchecked", async () => {
    const user = userEvent.setup();
    const adjacentPeriods = [
      reservations[0],
      {
        ...reservations[0],
        startPeriod: "2026-06-02",
        endPeriod: "2026-06-02",
      },
    ];
    function AdjacentSelectionHarness() {
      const [selected, setSelected] = useState([]);
      return (
        <PeriodsSlider
          periods={adjacentPeriods}
          selected={selected}
          setSelected={setSelected}
        />
      );
    }
    render(<AdjacentSelectionHarness />);

    await user.click(screen.getAllByRole("checkbox")[0]);
    await user.click(screen.getAllByRole("checkbox")[1]);
    await user.click(screen.getAllByRole("checkbox")[0]);

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).toBeChecked();
  });
});
