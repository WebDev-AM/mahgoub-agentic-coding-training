// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
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
];

function SelectionHarness({ initialSelected = [] }) {
  const [selected, setSelected] = useState(initialSelected);
  return (
    <PeriodsSlider
      periods={periods}
      selected={selected}
      setSelected={setSelected}
    />
  );
}

async function clickPeriodCheckbox(user, checkbox) {
  const label =
    (checkbox.id
      ? document.querySelector(`label[for="${checkbox.id}"]`)
      : null) ||
    checkbox.closest("label");
  if (label) {
    await user.click(label);
  } else {
    fireEvent.click(checkbox);
  }
}

describe("Periodic selection behavior", () => {
  // A chosen available period must become visibly checked; the prepared no-op leaves it unchecked.
  it("selects one available period", async () => {
    const user = userEvent.setup();
    render(<SelectionHarness />);

    const checkbox = screen.getAllByRole("checkbox")[0];
    await clickPeriodCheckbox(user, checkbox);

    expect(checkbox).toBeChecked();
  });

  // Adjacent selections must both remain checked; the prepared no-op never adds the first period.
  it("extends the selection across consecutive available periods", async () => {
    const user = userEvent.setup();
    render(<SelectionHarness />);

    await clickPeriodCheckbox(user, screen.getAllByRole("checkbox")[0]);
    await clickPeriodCheckbox(user, screen.getAllByRole("checkbox")[1]);

    expect(screen.getAllByRole("checkbox")[0]).toBeChecked();
    expect(screen.getAllByRole("checkbox")[1]).toBeChecked();
  });

  // Unchecking a selected period must remove it; the prepared no-op preserves the old indices.
  it("removes an unchecked period from the selection", async () => {
    const user = userEvent.setup();
    render(<SelectionHarness initialSelected={[0, 1]} />);

    const checkboxes = screen.getAllByRole("checkbox");
    await clickPeriodCheckbox(user, checkboxes[1]);

    expect(checkboxes[1]).not.toBeChecked();
  });

  // Removing a middle period must also clear every later selected period to avoid a disconnected booking.
  it("removes the middle period and all selected periods after it", async () => {
    const user = userEvent.setup();
    render(<SelectionHarness initialSelected={[0, 1, 2]} />);

    const checkboxes = screen.getAllByRole("checkbox");
    await clickPeriodCheckbox(user, checkboxes[1]);

    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
    expect(checkboxes[2]).not.toBeChecked();
  });
});
