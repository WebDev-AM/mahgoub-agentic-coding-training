// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import PeriodsSlider from "../features/units/chalet/reservationsPeriods/PeriodsSlider";

const periodic = (start, end, status = "AVAILABLE", price = 100) => ({
  price,
  startPeriod: start,
  endPeriod: end,
  typePeriod: "Weekend",
  status,
});

function renderSlider(periods) {
  return render(
    <PeriodsSlider periods={periods} selected={[]} setSelected={() => {}} />
  );
}

describe("periodic reservation UI", () => {
  it("renders period dates and prices", () => {
    renderSlider([periodic("2026-05-01", "2026-05-02")]);

    expect(screen.getByText("2026-05-01")).toBeInTheDocument();
    expect(screen.getByText("2026-05-02")).toBeInTheDocument();
    expect(screen.getByText(/100/)).toBeInTheDocument();
  });

  it("renders the period-type filter controls", () => {
    renderSlider([periodic("2026-05-01", "2026-05-02")]);

    expect(screen.getByRole("radio", { name: "All" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Weekend" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Weekday" })).toBeInTheDocument();
  });

  it("shows confirmed periods as unavailable", () => {
    renderSlider([periodic("2026-05-01", "2026-05-02", "CONFIRMED")]);

    expect(screen.getByText("Unavailable")).toBeInTheDocument();
  });
});
