// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DateRangePicker from "../features/units/chalet/reservationsPeriods/DateRangePicker";

const createDailyPeriod = (date) => ({
  price: 20,
  startPeriod: date,
  endPeriod: date,
  typePeriod: "Daily",
  status: "AVAILABLE",
});

describe("Daily calendar regression", () => {
  // A valid Daily range must continue to report its check-in and checkout indices.
  it("reports the chosen check-in and checkout indices", async () => {
    const user = userEvent.setup();
    const setSelected = vi.fn();
    render(
      <DateRangePicker
        periods={[
          createDailyPeriod("2026-06-01"),
          createDailyPeriod("2026-06-02"),
          createDailyPeriod("2026-06-03"),
        ]}
        setSelected={setSelected}
      />
    );

    await user.click(screen.getByLabelText("June 1, 2026"));
    await user.click(screen.getByLabelText("June 3, 2026"));

    expect(setSelected).toHaveBeenCalledWith([0, 2]);
    expect(screen.getByText(/Reserve 2 Nights/)).toBeInTheDocument();
  });
});
