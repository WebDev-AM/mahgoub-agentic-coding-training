import { useState, useMemo } from "react";
import { Dispatch, SetStateAction } from "react";
import dayjs from "dayjs";

import { ReservationPeriod } from "../../../../types/reservation/ReservationsSchema";
import PeriodWrapper from "./PeriodWrapper";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

type PeriodTypeFilter = "all" | "Weekend" | "Weekday";

type PeriodsSliderProps = {
  setSelected: Dispatch<SetStateAction<number[]>>;
  selected: number[];
  periods: ReservationPeriod[];
};

const TYPE_OPTIONS: {
  value: PeriodTypeFilter;
  label: string;
}[] = [
  { value: "all", label: "All" },
  { value: "Weekend", label: "Weekend" },
  { value: "Weekday", label: "Weekday" },
];

function PeriodsSlider({ selected, setSelected, periods }: PeriodsSliderProps) {
  // Filters state
  const [typeFilter, setTypeFilter] = useState<PeriodTypeFilter>("all");
  const [monthFilter, setMonthFilter] = useState<string | null>(null);

  const { i18n } = useTranslation();

  // Get unique months from periods
  const months = useMemo(() => {
    const uniqueMonths = new Set<string>();

    periods.forEach((period) => {
      const month = dayjs(period.startPeriod)
        .locale(i18n.language)
        .format("MMM YYYY");
      uniqueMonths.add(month);
    });

    return Array.from(uniqueMonths);
  }, [periods, i18n.language]);

  // Apply filters
  const filteredPeriods = useMemo(() => {
    return periods.filter((period) => {
      // Type filter
      if (typeFilter !== "all" && period.typePeriod !== typeFilter) {
        return false;
      }

      // Month filter
      if (monthFilter) {
        const month = dayjs(period.startPeriod)
          .locale(i18n.language)
          .format("MMM YYYY");

        if (month !== monthFilter) return false;
      }

      return true;
    });
  }, [periods, typeFilter, monthFilter, i18n.language]);

  return (
    <div className="flex w-full flex-col gap-4 p-2">
      <h2 className="h2 text-brand-text">{t("Chalet Reservation Periods")}</h2>

      {/* Period type filter */}
      <div>
        <h5 className="mb-2 font-semibold">{t("How long will you stay")}</h5>

        <div className="flex gap-5">
          {TYPE_OPTIONS.map(({ value, label }) => (
            <label
              key={value}
              className="flex cursor-pointer items-center gap-1"
            >
              <input
                type="radio"
                checked={typeFilter === value}
                onChange={() => {
                  setTypeFilter(value);
                  setSelected([]);
                }}
                className="h-4 w-4"
              />
              <span>{t(label)}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Month filter */}
      <div>
        <h5 className="mb-2 font-semibold">{t("When do you want to go")}</h5>

        <div className="flex flex-wrap gap-2">
          {months.map((month) => (
            <button
              key={month}
              className={`rounded px-3 py-1 ${
                monthFilter === month
                  ? "bg-primary text-white"
                  : "bg-white text-gray-400"
              }`}
              onClick={() => {
                setMonthFilter(monthFilter === month ? null : month);
                setSelected([]);
              }}
            >
              {month}
            </button>
          ))}
        </div>
      </div>

      {/* Periods list */}
      <div className="flex max-h-[340px] flex-col gap-3 overflow-y-auto py-2">
        {filteredPeriods.length === 0 ? (
          <p className="text-gray-500">{t("No periods available")}</p>
        ) : (
          filteredPeriods.map((period) => {
            const periodIndex = periods.findIndex(
              (p) => p.startPeriod === period.startPeriod
            );

            return (
              <PeriodWrapper
                key={periodIndex}
                id={periodIndex}
                packageData={period}
                selected={selected}
                setSelected={setSelected}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

export default PeriodsSlider;
