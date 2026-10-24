// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import PeriodsSlider from "../features/units/chalet/reservationsPeriods/PeriodsSlider";

const periods = [
  {
    price: 90,
    startPeriod: "2026-06-01",
    endPeriod: "2026-06-02",
    typePeriod: "Weekend",
    status: "AVAILABLE",
  },
  {
    price: 80,
    startPeriod: "2026-06-03",
    endPeriod: "2026-06-04",
    typePeriod: "Weekday",
    status: "AVAILABLE",
  },
];

function SelectionHarness() {
  const [selected, setSelected] = useState([]);
  return (
    <PeriodsSlider
      periods={periods}
      selected={selected}
      setSelected={setSelected}
    />
  );
}

describe("Periodic reservation UI regressions", () => {
  // The existing slider must keep showing each period's dates and price.
  it("shows the selected reservation periods and their prices", () => {
    render(<SelectionHarness />);

    expect(screen.getByText("2026-06-01")).toBeInTheDocument();
    expect(screen.getByText("2026-06-04")).toBeInTheDocument();
    expect(screen.getByText(/90/)).toBeInTheDocument();
    expect(screen.getByText(/80/)).toBeInTheDocument();
  });

  // Existing users must still be able to select a single available period.
  it("allows a user to select one available period", async () => {
    const user = userEvent.setup();
    render(<SelectionHarness />);

    await user.click(screen.getAllByRole("checkbox")[0]);

    expect(screen.getAllByRole("checkbox")[0]).toBeChecked();
  });
});
