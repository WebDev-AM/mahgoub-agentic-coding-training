import { describe, expect, it } from "vitest";
import {
  isDailyDateDisabled,
  splitReservationPeriods,
} from "../utils/reservationPeriodsUtils";
import { getBookingDetails } from "../utils/bookingUtils";

const daily = (date, price = 20, status = "AVAILABLE") => ({
  price,
  startPeriod: date,
  endPeriod: date,
  typePeriod: "Daily",
  status,
});

const date = (value) => new Date(`${value}T12:00:00`);

describe("Daily reservation availability and details", () => {
  // Every booked night must be checked, not merely the range endpoints.
  it("disables a checkout range that crosses an unavailable booked night", () => {
    const periods = [
      daily("2026-06-01"),
      daily("2026-06-02", 0, "CONFIRMED"),
      daily("2026-06-03"),
      daily("2026-06-04"),
    ];

    expect(
      isDailyDateDisabled(date("2026-06-04"), periods, [date("2026-06-01")])
    ).toBe(true);
    expect(() => getBookingDetails(periods, 0, 3)).toThrow(
      "Daily booking contains an unavailable or missing night"
    );
  });

  // Unrepresented dates are not valid booked nights even when both endpoints exist.
  it("rejects ranges with a missing date", () => {
    const periods = [
      daily("2026-06-01"),
      daily("2026-06-03"),
      daily("2026-06-04"),
    ];

    expect(
      isDailyDateDisabled(date("2026-06-04"), periods, [date("2026-06-01")])
    ).toBe(true);
    expect(() => getBookingDetails(periods, 0, 2)).toThrow(
      "Daily booking contains an unavailable or missing night"
    );
  });

  // A normalized periodic reservation must disable each covered date in the Daily date model.
  it("disables a Daily date covered by a periodic reservation", () => {
    const { dailyPeriods } = splitReservationPeriods([
      {
        price: 100,
        startPeriod: "2026-06-01",
        endPeriod: "2026-06-03",
        typePeriod: "Weekend",
        status: "AVAILABLE",
      },
    ]);

    expect(isDailyDateDisabled(date("2026-06-02"), dailyPeriods, [])).toBe(
      true
    );
  });
});
