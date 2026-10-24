import dayjs from "dayjs";

import { ReservationPeriod } from "../types/reservation/ReservationsSchema";

const DAILY = "Daily";
const UNAVAILABLE = "Check Daily Section";

export function splitReservationPeriods(periods: ReservationPeriod[]) {
  const dailyPeriods = periods.filter((period) => period.typePeriod === DAILY);

  const originalPeriodicPeriods = periods.filter(
    (period) => period.typePeriod !== DAILY
  );

  // ============================================================
  // PERIODIC PERIODS
  // ============================================================

  const periodicPeriods: ReservationPeriod[] = [];

  for (let i = 0; i < originalPeriodicPeriods.length; i++) {
    const current = originalPeriodicPeriods[i];

    periodicPeriods.push(current);

    const next = originalPeriodicPeriods[i + 1];

    if (!next) continue;

    const currentEnd = dayjs(current.endPeriod).startOf("day");
    const nextStart = dayjs(next.startPeriod).startOf("day");

    const dailyPeriodsBetween = dailyPeriods.filter((daily) => {
      const dailyStart = dayjs(daily.startPeriod).startOf("day");
      const dailyEnd = dayjs(daily.endPeriod).startOf("day");

      return (
        dailyStart.isAfter(currentEnd, "day") &&
        dailyEnd.isBefore(nextStart, "day")
      );
    });

    if (!dailyPeriodsBetween.length) continue;

    const firstDaily = dailyPeriodsBetween[0];
    const lastDaily = dailyPeriodsBetween[dailyPeriodsBetween.length - 1];

    periodicPeriods.push({
      ...firstDaily,
      startPeriod: firstDaily.startPeriod,
      endPeriod: lastDaily.endPeriod,
      typePeriod: UNAVAILABLE,
      status: UNAVAILABLE,
    });
  }

  // ============================================================
  // DAILY PERIODS
  // ============================================================

  const normalizedDailyPeriods: ReservationPeriod[] = [];

  for (let i = 0; i < dailyPeriods.length; i++) {
    const currentDaily = dailyPeriods[i];

    normalizedDailyPeriods.push(currentDaily);

    const nextDaily = dailyPeriods[i + 1];

    if (!nextDaily) continue;

    const currentDate = dayjs(currentDaily.startPeriod).startOf("day");
    const nextDate = dayjs(nextDaily.startPeriod).startOf("day");

    // Find periodic periods that exist between these two daily dates
    const periodicPeriodsBetween = originalPeriodicPeriods.filter(
      (periodic) => {
        const periodicStart = dayjs(periodic.startPeriod).startOf("day");
        const periodicEnd = dayjs(periodic.endPeriod).startOf("day");

        return (
          periodicStart.isAfter(currentDate, "day") &&
          periodicEnd.isBefore(nextDate, "day")
        );
      }
    );

    if (!periodicPeriodsBetween.length) continue;

    // Convert every periodic day into an unavailable Daily period
    for (const periodic of periodicPeriodsBetween) {
      let date = dayjs(periodic.startPeriod).startOf("day");
      const end = dayjs(periodic.endPeriod).startOf("day");

      while (date.isBefore(end, "day") || date.isSame(end, "day")) {
        normalizedDailyPeriods.push({
          ...periodic,
          startPeriod: date.format("YYYY-MM-DD"),
          endPeriod: date.format("YYYY-MM-DD"),
          typePeriod: DAILY,
          status: "UNAVAILABLE",
        });

        date = date.add(1, "day");
      }
    }
  }

  // ============================================================
  // SORT DAILY PERIODS BY DATE
  // ============================================================

  normalizedDailyPeriods.sort((a, b) =>
    dayjs(a.startPeriod).diff(dayjs(b.startPeriod))
  );

  return {
    periodicPeriods,
    dailyPeriods: normalizedDailyPeriods,
  };
}
