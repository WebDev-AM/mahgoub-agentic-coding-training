import { describe, expect, it } from "vitest";
import { getBookingDetails } from "../utils/bookingUtils";

const periodic = (
  startPeriod,
  endPeriod,
  price = 100,
  typePeriod = "Weekend",
  status = "AVAILABLE"
) => ({
  price,
  startPeriod,
  endPeriod,
  typePeriod,
  status,
});

describe("reservation booking details", () => {
  // Periodic selections must be consecutive in both the selection and dates.
  it("rejects a periodic date gap", () => {
    expect(() =>
      getBookingDetails(
        [
          periodic("2026-06-01", "2026-06-02"),
          periodic("2026-06-04", "2026-06-05"),
        ],
        0,
        1,
        [0, 1]
      )
    ).toThrow("Periodic booking periods must be consecutive");
  });

  // Negative, fractional, and out-of-bounds indices must have the same explicit rejection.
  it("rejects negative, fractional, and out-of-bounds indices", () => {
    const periods = [
      periodic("2026-06-01", "2026-06-02"),
      periodic("2026-06-03", "2026-06-04"),
    ];
    for (const [startIndex, endIndex] of [
      [-1, 0],
      [0, 1.5],
      [0, 2],
    ]) {
      expect(() => getBookingDetails(periods, startIndex, endIndex)).toThrow(
        "Invalid start or end index"
      );
    }
  });

  // Caller-supplied selected indices must describe the entire displayed range.
  it("rejects periodic selections that omit a period inside the range", () => {
    expect(() =>
      getBookingDetails(
        [
          periodic("2026-06-01", "2026-06-01"),
          periodic("2026-06-02", "2026-06-02"),
          periodic("2026-06-03", "2026-06-03"),
        ],
        0,
        2,
        [0, 2]
      )
    ).toThrow("Periodic selection must be consecutive");
  });
});
