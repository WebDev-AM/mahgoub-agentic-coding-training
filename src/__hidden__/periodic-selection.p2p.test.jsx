// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import PeriodsSlider from "../features/units/chalet/reservationsPeriods/PeriodsSlider";

const periods = [
  {
    price: 100,
    startPeriod: "2026-06-01",
    endPeriod: "2026-06-01",
    typePeriod: "Weekend",
    status: "AVAILABLE",
  },
  {
    price: 120,
    startPeriod: "2026-06-02",
    endPeriod: "2026-06-02",
    typePeriod: "Weekday",
    status: "AVAILABLE",
  },
  {
    price: 140,
    startPeriod: "2026-06-03",
    endPeriod: "2026-06-03",
    typePeriod: "Weekend",
    status: "AVAILABLE",
  },
  {
    price: 160,
    startPeriod: "2026-06-04",
    endPeriod: "2026-06-04",
    typePeriod: "Weekday",
    status: "CONFIRMED",
  },
  {
    price: 180,
    startPeriod: "2026-06-05",
    endPeriod: "2026-06-05",
    typePeriod: "Weekend",
    status: "AVAILABLE",
  },
];

function SelectionHarness({ reservations = periods }) {
  const [selected, setSelected] = useState([]);
  return (
    <PeriodsSlider
      periods={reservations}
      selected={selected}
      setSelected={setSelected}
    />
  );
}

describe("Periodic period selection UI", () => {
  // The existing happy path supports selecting adjacent available periods and must remain intact.
  it("keeps a continuous selection when adjacent periods are selected", async () => {
    const user = userEvent.setup();
    render(<SelectionHarness />);

    await user.click(screen.getAllByRole("checkbox")[0]);
    await user.click(screen.getAllByRole("checkbox")[1]);
    await user.click(screen.getAllByRole("checkbox")[2]);

    expect(
      screen
        .getAllByRole("checkbox")
        .slice(0, 3)
        .every((box) => box.checked)
    ).toBe(true);
  });

  // A reserved period blocks selection beyond it instead of allowing a disconnected range.
  it("does not expose periods beyond an unavailable period as selectable", async () => {
    const user = userEvent.setup();
    render(<SelectionHarness />);

    await user.click(screen.getAllByRole("checkbox")[0]);

    expect(screen.getAllByRole("checkbox")).toHaveLength(2);
  });

  // Removing a middle period must not leave the later disconnected periods selected.
  it("truncates the selection when a middle period is unchecked", async () => {
    const user = userEvent.setup();
    render(<SelectionHarness />);

    let checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[0]);
    await user.click(screen.getAllByRole("checkbox")[1]);
    await user.click(screen.getAllByRole("checkbox")[2]);

    checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[1]);

    expect(screen.getAllByRole("checkbox")).toHaveLength(2);
    expect(screen.getAllByRole("checkbox")[0]).toBeChecked();
    expect(screen.getAllByRole("checkbox")[1]).not.toBeChecked();
  });

  // Removing the only selected period must leave no selected booking period.
  it("clears the selection when the only selected period is unchecked", async () => {
    const user = userEvent.setup();
    render(<SelectionHarness />);

    await user.click(screen.getAllByRole("checkbox")[0]);
    await user.click(screen.getAllByRole("checkbox")[0]);

    expect(
      screen.getAllByRole("checkbox").every((checkbox) => !checkbox.checked)
    ).toBe(true);
  });
});
