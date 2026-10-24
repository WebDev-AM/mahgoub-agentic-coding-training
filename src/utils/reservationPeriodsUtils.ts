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

function periodicPeriodsAreAdjacent(
  left: ReservationPeriod,
  right: ReservationPeriod
) {
  const leftEnd = dayjs(left.endPeriod).startOf("day");
  const rightStart = dayjs(right.startPeriod).startOf("day");
  return (
    leftEnd.isValid() &&
    rightStart.isValid() &&
    rightStart.diff(leftEnd, "day") === 1
  );
}

export function updatePeriodicSelection(
  periods: readonly ReservationPeriod[],
  selectedIndices: readonly number[],
  index: number,
  checked: boolean
): number[] {
  const current = [...new Set(selectedIndices)]
    .filter(
      (selectedIndex) =>
        Number.isInteger(selectedIndex) &&
        selectedIndex >= 0 &&
        selectedIndex < periods.length
    )
    .sort((a, b) => a - b);

  if (!Number.isInteger(index) || index < 0 || index >= periods.length) {
    return current;
  }

  if (!checked) {
    if (!current.includes(index)) return current;
    return index === current[0]
      ? current.filter((selectedIndex) => selectedIndex > index)
      : current.filter((selectedIndex) => selectedIndex < index);
  }

  if (
    periods[index].status !== "AVAILABLE" ||
    current.includes(index) ||
    !current.every(
      (selectedIndex) => periods[selectedIndex].status === "AVAILABLE"
    )
  ) {
    return current;
  }

  if (!current.length) return [index];

  const first = current[0];
  const last = current[current.length - 1];
  if (
    index === first - 1 &&
    periodicPeriodsAreAdjacent(periods[index], periods[first])
  ) {
    return [index, ...current];
  }
  if (
    index === last + 1 &&
    periodicPeriodsAreAdjacent(periods[last], periods[index])
  ) {
    return [...current, index];
  }
  return current;
}

export function getSelectablePeriodicIndices(
  periods: readonly ReservationPeriod[],
  selectedIndices: readonly number[]
): number[] {
  const selected = [...new Set(selectedIndices)]
    .filter(
      (index) => Number.isInteger(index) && index >= 0 && index < periods.length
    )
    .sort((a, b) => a - b);
  const selectable = new Set(
    selected.filter((index) => periods[index].status === "AVAILABLE")
  );

  if (!selected.length) {
    periods.forEach((period, index) => {
      if (period.status === "AVAILABLE") selectable.add(index);
    });
    return [...selectable];
  }

  const first = selected[0];
  const last = selected[selected.length - 1];
  if (
    periods[first]?.status === "AVAILABLE" &&
    periods[first - 1]?.status === "AVAILABLE" &&
    periodicPeriodsAreAdjacent(periods[first - 1], periods[first])
  ) {
    selectable.add(first - 1);
  }
  if (
    periods[last]?.status === "AVAILABLE" &&
    periods[last + 1]?.status === "AVAILABLE" &&
    periodicPeriodsAreAdjacent(periods[last], periods[last + 1])
  ) {
    selectable.add(last + 1);
  }
  return [...selectable].sort((a, b) => a - b);
}
