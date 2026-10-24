import { describe, expect, it } from "vitest";
import { getBookingDetails } from "../utils/bookingUtils";

const periodic = (startPeriod, endPeriod, price) => ({
  price,
  startPeriod,
  endPeriod,
  typePeriod: "Weekend",
  status: "AVAILABLE",
});

const daily = (date, price, status = "AVAILABLE") => ({
  price,
  startPeriod: date,
  endPeriod: date,
  typePeriod: "Daily",
  status,
});

describe("existing booking price behavior", () => {
  // The existing booking contract charges every periodic period, including the final one.
  it("includes the final selected periodic period in the total", () => {
    expect(
      getBookingDetails(
        [
          periodic("2026-06-01", "2026-06-02", 100),
          periodic("2026-06-03", "2026-06-04", 150),
        ],
        0,
        1,
        [0, 1]
      )
    ).toMatchObject({ totalPrice: 250, numberOfNights: 3 });
  });

  // The existing Daily pricing contract excludes the checkout date from both nights and price.
  it("does not charge for the final Daily checkout date", () => {
    expect(
      getBookingDetails(
        [
          daily("2026-06-01", 20),
          daily("2026-06-02", 30),
          daily("2026-06-03", 0, "CONFIRMED"),
        ],
        0,
        2
      )
    ).toMatchObject({
      totalPrice: 50,
      numberOfNights: 2,
      startDate: "2026-06-01",
      endDate: "2026-06-03",
    });
  });
});
