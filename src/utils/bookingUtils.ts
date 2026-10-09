import { ReservationPeriod } from "../types/reservation/ReservationsSchema";

import dayjs from "dayjs";

export function getBookingDetails(
  data: ReservationPeriod[],
  startIndex: number,
  endIndex: number
): {
  startDate: string;
  endDate: string;
  totalPrice: number;
  numberOfNights: number;
} {
  if (startIndex < 0 || endIndex >= data.length || startIndex > endIndex) {
    throw new Error("Invalid start or end index");
  }

  const startDate = data[startIndex].startPeriod;
  const endDate = data[endIndex].endPeriod;

  const isDaily = data[startIndex].typePeriod === "Daily";

  // Pricing logic
  const priceEndIndex = isDaily ? endIndex - 1 : endIndex;

  if (priceEndIndex < startIndex) {
    throw new Error("Invalid booking range for daily pricing");
  }

  const totalPrice = data
    .slice(startIndex, priceEndIndex + 1)
    .reduce((sum, item) => sum + item.price, 0);

  // numberOfNights calculation (date-based, not index-based)
  const numberOfNights = dayjs(endDate).diff(
    dayjs(startDate).startOf("day"),
    "day"
  );

  return { startDate, endDate, totalPrice, numberOfNights };
}
