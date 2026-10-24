import { ReservationPeriod } from "../types/reservation/ReservationsSchema";

import dayjs from "dayjs";

export function getBookingDetails(
  data: ReservationPeriod[],
  startIndex: number,
  endIndex: number,
  selectedIndices?: readonly number[]
): {
  startDate: string;
  endDate: string;
  totalPrice: number;
  numberOfNights: number;
} {
  if (
    !Number.isInteger(startIndex) ||
    !Number.isInteger(endIndex) ||
    startIndex < 0 ||
    endIndex >= data.length ||
    startIndex > endIndex
  ) {
    throw new Error("Invalid start or end index");
  }

  const startPeriod = data[startIndex];
  const endPeriod = data[endIndex];
  if (!startPeriod || !endPeriod) {
    throw new Error("Invalid start or end index");
  }

  const startDate = startPeriod.startPeriod;
  const endDate = endPeriod.endPeriod;
  const startDay = dayjs(startDate).startOf("day");
  const endDay = dayjs(endDate).startOf("day");
  if (
    !startDay.isValid() ||
    !endDay.isValid() ||
    endDay.isBefore(startDay, "day")
  ) {
    throw new Error("Invalid booking dates");
  }

  const isDaily = startPeriod.typePeriod === "Daily";
  const range = data.slice(startIndex, endIndex + 1);

  if (
    range.some(
      (period) =>
        (period.typePeriod === "Daily") !== isDaily ||
        (!isDaily && period.status !== "AVAILABLE") ||
        (!isDaily && (!Number.isFinite(period.price) || period.price < 0))
    )
  ) {
    throw new Error(
      "Booking range contains an unavailable or wrong-type period"
    );
  }

  if (!isDaily && selectedIndices) {
    const expected = Array.from(
      { length: endIndex - startIndex + 1 },
      (_, offset) => startIndex + offset
    );
    if (
      selectedIndices.length !== expected.length ||
      expected.some((index, offset) => selectedIndices[offset] !== index)
    ) {
      throw new Error("Periodic selection must be consecutive");
    }
  }

  if (isDaily) {
    if (endIndex === startIndex) {
      throw new Error("Daily booking requires a checkout date");
    }

    const checkoutDay = dayjs(endPeriod.startPeriod).startOf("day");
    if (!checkoutDay.isValid() || !checkoutDay.isSame(endDay, "day")) {
      throw new Error("Invalid Daily checkout date");
    }

    const numberOfNights = checkoutDay.diff(startDay, "day");
    if (numberOfNights <= 0) {
      throw new Error("Invalid Daily booking range");
    }

    for (let offset = 0; offset < numberOfNights; offset++) {
      const expectedDate = startDay.add(offset, "day");
      const period = data[startIndex + offset];
      const periodStart = dayjs(period?.startPeriod).startOf("day");
      const periodEnd = dayjs(period?.endPeriod).startOf("day");

      if (
        !period ||
        period.typePeriod !== "Daily" ||
        period.status !== "AVAILABLE" ||
        !Number.isFinite(period.price) ||
        period.price < 0 ||
        !periodStart.isValid() ||
        !periodEnd.isValid() ||
        !periodStart.isSame(expectedDate, "day") ||
        !periodEnd.isSame(expectedDate, "day")
      ) {
        throw new Error(
          "Daily booking contains an unavailable or missing night"
        );
      }
    }

    const checkoutPeriod = data[endIndex];
    if (
      !checkoutPeriod ||
      checkoutPeriod.typePeriod !== "Daily" ||
      !dayjs(checkoutPeriod.startPeriod).isSame(checkoutDay, "day")
    ) {
      throw new Error("Invalid Daily checkout date");
    }

    return {
      startDate,
      endDate: endPeriod.startPeriod,
      totalPrice: data
        .slice(startIndex, endIndex)
        .reduce((sum, period) => sum + period.price, 0),
      numberOfNights,
    };
  }

  for (let index = 0; index < range.length; index++) {
    const period = range[index];
    const periodStart = dayjs(period.startPeriod).startOf("day");
    const periodEnd = dayjs(period.endPeriod).startOf("day");
    if (
      !periodStart.isValid() ||
      !periodEnd.isValid() ||
      periodEnd.isBefore(periodStart, "day")
    ) {
      throw new Error("Invalid Periodic booking dates");
    }
    if (index > 0) {
      const previousEnd = dayjs(range[index - 1].endPeriod).startOf("day");
      if (periodStart.diff(previousEnd, "day") !== 1) {
        throw new Error("Periodic booking periods must be consecutive");
      }
    }
  }

  const numberOfNights = endDay.diff(startDay, "day");
  const totalPrice = range.reduce((sum, item) => sum + item.price, 0);

  return { startDate, endDate, totalPrice, numberOfNights };
}
