// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DateRangePicker from "../features/units/chalet/reservationsPeriods/DateRangePicker";

const createDailyPeriod = (date, status = "AVAILABLE") => ({
  price: 20,
  startPeriod: date,
  endPeriod: date,
  typePeriod: "Daily",
  status,
});

describe("Daily reservation calendar", () => {
  // The calendar must present unavailable dates as disabled, not just reject them after submission.
  it("marks a reserved date as disabled in the date picker", async () => {
    const user = userEvent.setup();
    const setSelected = vi.fn();
    render(
      <DateRangePicker
        periods={[
          createDailyPeriod("2026-06-01"),
          createDailyPeriod("2026-06-02", "CONFIRMED"),
          createDailyPeriod("2026-06-03"),
        ]}
        setSelected={setSelected}
      />
    );

    await user.click(screen.getByLabelText("June 1, 2026"));
    await user.click(screen.getByLabelText("June 2, 2026"));

    expect(setSelected).not.toHaveBeenCalledWith([0, 1]);
    expect(screen.queryByText(/Reserve \d+ Nights/)).not.toBeInTheDocument();
  });
});
