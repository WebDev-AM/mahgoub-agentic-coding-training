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
    endPeriod: "2026-06-02",
    typePeriod: "Weekend",
    status: "AVAILABLE",
  },
  {
    price: 120,
    startPeriod: "2026-06-03",
    endPeriod: "2026-06-04",
    typePeriod: "Weekday",
    status: "AVAILABLE",
  },
  {
    price: 140,
    startPeriod: "2026-06-05",
    endPeriod: "2026-06-06",
    typePeriod: "Weekend",
    status: "CONFIRMED",
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
  // Period date and price information is unrelated to selection updates and must remain visible.
  it("shows each period's dates and price", () => {
    render(<SelectionHarness />);

    expect(screen.getByText("2026-06-01")).toBeInTheDocument();
    expect(screen.getByText("2026-06-06")).toBeInTheDocument();
    expect(screen.getByText(/100/)).toBeInTheDocument();
    expect(screen.getByText(/120/)).toBeInTheDocument();
  });

  // Period-type filtering is independent of selection updates and must still filter visible periods.
  it("filters periods by the selected period type", async () => {
    const user = userEvent.setup();
    render(<SelectionHarness />);

    await user.click(screen.getByRole("radio", { name: "Weekday" }));

    expect(screen.getByText("2026-06-03")).toBeInTheDocument();
    expect(screen.queryByText("2026-06-01")).not.toBeInTheDocument();
  });

  // Unavailable-period status presentation is independent of selection updates.
  it("continues to show unavailable status for a confirmed period", () => {
    render(<SelectionHarness />);

    expect(screen.getByText("Unavailable")).toBeInTheDocument();
    expect(screen.getAllByRole("checkbox").length).toBeGreaterThan(0);
  });
});
