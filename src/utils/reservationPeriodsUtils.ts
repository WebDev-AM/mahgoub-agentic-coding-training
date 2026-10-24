import dayjs from "dayjs";

import { ReservationPeriod } from "../types/reservation/ReservationsSchema";

const DAILY = "Daily";
const CHECK_DAILY = "Check Daily Section";
const UNAVAILABLE = "UNAVAILABLE";

function periodCoversDate(period: ReservationPeriod, date: dayjs.Dayjs) {
  const start = dayjs(period.startPeriod).startOf("day");
  const end = dayjs(period.endPeriod).startOf("day");

  return (
    start.isValid() &&
    end.isValid() &&
    !date.isBefore(start, "day") &&
    !date.isAfter(end, "day")
  );
}

function validPeriodBounds(period: ReservationPeriod) {
  const start = dayjs(period.startPeriod).startOf("day");
  const end = dayjs(period.endPeriod).startOf("day");
  return start.isValid() && end.isValid() && !end.isBefore(start, "day");
}

function asDailyPeriod(period: ReservationPeriod, date: dayjs.Dayjs) {
  return {
    ...period,
    startPeriod: date.format("YYYY-MM-DD"),
    endPeriod: date.format("YYYY-MM-DD"),
    typePeriod: DAILY,
    status: UNAVAILABLE,
  };
}

export function splitReservationPeriods(periods: ReservationPeriod[]) {
  const byStartDate = (left: ReservationPeriod, right: ReservationPeriod) =>
    dayjs(left.startPeriod).diff(dayjs(right.startPeriod));
  const originalDaily = periods
    .filter(
      (period) => period.typePeriod === DAILY && validPeriodBounds(period)
    )
    .sort(byStartDate);
  const originalPeriodic = periods
    .filter(
      (period) => period.typePeriod !== DAILY && validPeriodBounds(period)
    )
    .sort(byStartDate);

  const periodicPeriods: ReservationPeriod[] = [];

  originalPeriodic.forEach((period, index) => {
    const conflicts = originalDaily.some(
      (daily) =>
        !dayjs(daily.endPeriod).isBefore(dayjs(period.startPeriod), "day") &&
        !dayjs(daily.startPeriod).isAfter(dayjs(period.endPeriod), "day")
    );
    const overlapsPeriodic = originalPeriodic.some(
      (other, otherIndex) =>
        otherIndex !== index &&
        !dayjs(other.endPeriod).isBefore(dayjs(period.startPeriod), "day") &&
        !dayjs(other.startPeriod).isAfter(dayjs(period.endPeriod), "day")
    );

    periodicPeriods.push(
      conflicts || overlapsPeriodic
        ? { ...period, status: UNAVAILABLE }
        : { ...period }
    );

    const next = originalPeriodic[index + 1];
    if (!next) return;

    const currentEnd = dayjs(period.endPeriod).startOf("day");
    const nextStart = dayjs(next.startPeriod).startOf("day");
    if (!nextStart.isAfter(currentEnd, "day")) return;

    const dailyBetween = originalDaily
      .filter((daily) => {
        const start = dayjs(daily.startPeriod).startOf("day");
        const end = dayjs(daily.endPeriod).startOf("day");
        return (
          start.isAfter(currentEnd, "day") && end.isBefore(nextStart, "day")
        );
      })
      .sort((a, b) => dayjs(a.startPeriod).diff(dayjs(b.startPeriod)));

    if (!dailyBetween.length) return;

    const first = dailyBetween[0];
    const last = dailyBetween[dailyBetween.length - 1];
    periodicPeriods.push({
      ...first,
      startPeriod: first.startPeriod,
      endPeriod: last.endPeriod,
      typePeriod: CHECK_DAILY,
      status: CHECK_DAILY,
    });
  });

  const validPeriods = [...originalDaily, ...originalPeriodic];
  if (!validPeriods.length) {
    return { periodicPeriods, dailyPeriods: [] as ReservationPeriod[] };
  }

  const minDate = validPeriods
    .map((period) => dayjs(period.startPeriod).startOf("day"))
    .reduce((min, date) => (date.isBefore(min, "day") ? date : min));
  const maxDate = validPeriods
    .map((period) => dayjs(period.endPeriod).startOf("day"))
    .reduce((max, date) => (date.isAfter(max, "day") ? date : max));

  const dailyPeriods: ReservationPeriod[] = [];
  for (
    let date = minDate.clone();
    !date.isAfter(maxDate, "day");
    date = date.add(1, "day")
  ) {
    const dailyMatches = originalDaily.filter((period) =>
      periodCoversDate(period, date)
    );
    const periodicMatch = originalPeriodic.find((period) =>
      periodCoversDate(period, date)
    );
    const duplicateDaily = dailyMatches.length > 1;
    const crossTypeConflict = Boolean(periodicMatch);

    if (dailyMatches.length) {
      const source = dailyMatches[0];
      const conflicts = duplicateDaily || crossTypeConflict;
      dailyPeriods.push({
        ...source,
        startPeriod: date.format("YYYY-MM-DD"),
        endPeriod: date.format("YYYY-MM-DD"),
        typePeriod: DAILY,
        status: conflicts ? UNAVAILABLE : source.status,
      });
    } else if (periodicMatch) {
      dailyPeriods.push(asDailyPeriod(periodicMatch, date));
    } else {
      const nearest = [...originalDaily, ...originalPeriodic].reduce(
        (closest, period) => {
          const distance = Math.abs(
            dayjs(period.startPeriod).diff(date, "day")
          );
          return distance < closest.distance ? { period, distance } : closest;
        },
        { period: validPeriods[0], distance: Number.POSITIVE_INFINITY }
      ).period;
      dailyPeriods.push({
        ...nearest,
        price: 0,
        startPeriod: date.format("YYYY-MM-DD"),
        endPeriod: date.format("YYYY-MM-DD"),
        typePeriod: DAILY,
        status: UNAVAILABLE,
      });
    }
  }

  return { periodicPeriods, dailyPeriods };
}

export function isDailyDateDisabled(
  candidate: Date,
  periods: readonly ReservationPeriod[],
  selectedDates: readonly Date[]
): boolean {
  const candidateDate = dayjs(candidate).startOf("day");
  if (!candidateDate.isValid() || !periods.length) return true;

  const validPeriods = periods.filter(validPeriodBounds);
  if (!validPeriods.length) return true;

  const minDate = validPeriods
    .map((period) => dayjs(period.startPeriod).startOf("day"))
    .reduce((min, date) => (date.isBefore(min, "day") ? date : min));
  const maxDate = validPeriods
    .map((period) => dayjs(period.endPeriod).startOf("day"))
    .reduce((max, date) => (date.isAfter(max, "day") ? date : max));
  if (
    candidateDate.isBefore(minDate, "day") ||
    candidateDate.isAfter(maxDate, "day")
  ) {
    return true;
  }

  const candidatePeriods = validPeriods.filter((period) =>
    periodCoversDate(period, candidateDate)
  );
  if (candidatePeriods.length !== 1) return true;

  if (selectedDates.length !== 1) {
    return candidatePeriods[0].status !== "AVAILABLE";
  }

  const startDate = dayjs(selectedDates[0]).startOf("day");
  if (!startDate.isValid() || !candidateDate.isAfter(startDate, "day")) {
    return true;
  }

  const startPeriods = validPeriods.filter((period) =>
    periodCoversDate(period, startDate)
  );
  if (startPeriods.length !== 1 || startPeriods[0].status !== "AVAILABLE") {
    return true;
  }

  for (
    let night = startDate.clone();
    night.isBefore(candidateDate, "day");
    night = night.add(1, "day")
  ) {
    const nightPeriods = validPeriods.filter((period) =>
      periodCoversDate(period, night)
    );
    if (nightPeriods.length !== 1 || nightPeriods[0].status !== "AVAILABLE") {
      return true;
    }
  }

  return false;
}

export function updatePeriodicSelection(
  periods: readonly ReservationPeriod[],
  current: readonly number[],
  index: number,
  checked: boolean
): number[] {
  // TODO: this is incomplete. Fix it so the periodic selection flow works.
  void periods;
  void index;
  void checked;
  return [...current];
}
