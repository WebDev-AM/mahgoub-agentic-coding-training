import {
  Dispatch,
  SetStateAction,
  memo,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import Flatpickr, { DateTimePickerHandle } from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import dayjs from "dayjs";
import { ReservationPeriod } from "../../../../types/reservation/ReservationsSchema";
import { Arabic } from "flatpickr/dist/l10n/ar";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
import { Button } from "@mui/material";
import { isDailyDateDisabled } from "../../../../utils/reservationPeriodsUtils";

const MemoizedFlatpickr = memo(Flatpickr);

type Props = {
  periods: ReservationPeriod[];
  setSelected: Dispatch<SetStateAction<number[]>>;
};

export default function DateRangePicker({ periods, setSelected }: Props) {
  const { i18n } = useTranslation();
  const fpRef = useRef<DateTimePickerHandle>(null);
  const startDateRef = useRef<Date | undefined>(undefined);
  const [value, setValue] = useState<Date[]>([]);

  const periodDates = periods.flatMap((period) => {
    const start = dayjs(period.startPeriod);
    const end = dayjs(period.endPeriod);
    return start.isValid() && end.isValid() && !end.isBefore(start, "day")
      ? [start.format("YYYY-MM-DD"), end.format("YYYY-MM-DD")]
      : [];
  });
  const minAvailableDate = periodDates.length
    ? periodDates.reduce((min, date) => (date < min ? date : min))
    : undefined;
  const maxAvailableDate = periodDates.length
    ? periodDates.reduce((max, date) => (date > max ? date : max))
    : undefined;

  const disableDate = useCallback(
    (date: Date) =>
      isDailyDateDisabled(
        date,
        periods,
        startDateRef.current ? [startDateRef.current] : []
      ),
    [periods]
  );
  const options = useMemo(
    () => ({
      mode: "range" as const,
      dateFormat: "Y-m-d",
      ...(i18n.language === "ar" ? { locale: Arabic } : {}),
      minDate: minAvailableDate,
      maxDate: maxAvailableDate,
      disable: [disableDate],
      showMonths: 1,
      disableMobile: true,
      inline: true,
    }),
    [disableDate, i18n.language, maxAvailableDate, minAvailableDate]
  );

  const handleChange = useCallback(
    (selectedDates: Date[]) => {
      if (selectedDates.length === 1) {
        startDateRef.current = selectedDates[0];
        setValue([]);
        setSelected([]);
        return;
      }
      if (selectedDates.length !== 2) {
        setValue([]);
        setSelected([]);
        startDateRef.current = undefined;
        return;
      }

      const [start, end] = selectedDates.map((d) => dayjs(d).startOf("day"));

      if (
        end.isSame(start, "day") ||
        isDailyDateDisabled(start.toDate(), periods, []) ||
        isDailyDateDisabled(end.toDate(), periods, [start.toDate()])
      ) {
        setValue([]);
        setSelected([]);
        startDateRef.current = undefined;
        fpRef.current?.flatpickr?.clear(false);
        return;
      }

      const startIndex = periods.findIndex((p) =>
        dayjs(p.startPeriod).isSame(start, "day")
      );

      const endIndex = periods.findIndex((p) =>
        dayjs(p.startPeriod).isSame(end, "day")
      );
      if (startIndex === -1 || endIndex === -1) {
        setValue([]);
        setSelected([]);
        startDateRef.current = undefined;
        fpRef.current?.flatpickr?.clear(false);
        return;
      }

      setValue(selectedDates);
      startDateRef.current = undefined;
      setSelected([startIndex, endIndex]);
    },
    [periods, setSelected]
  );

  const handleClearDates = () => {
    setValue([]);
    startDateRef.current = undefined;
    setSelected([]);
    fpRef.current?.flatpickr?.clear(false);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <h2 className="h2 text-brand-text">{t("Chalet Reservation Days")}</h2>

      <MemoizedFlatpickr
        ref={fpRef}
        options={options}
        onChange={handleChange}
        className="h-0 overflow-hidden"
      />

      <div className="flex w-full items-center justify-between px-2">
        {value.length === 2 && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-800">
              {t("Reserve")} {dayjs(value[1]).diff(dayjs(value[0]), "day")}{" "}
              {t("Nights")}
            </span>
            <span className="text-sm text-gray-500">
              {dayjs(value[0])
                .locale(i18n.language === "ar" ? "ar" : "en")
                .format("MMM DD")}{" "}
              -{" "}
              {dayjs(value[1])
                .locale(i18n.language === "ar" ? "ar" : "en")
                .format("MMM DD")}
            </span>
          </div>
        )}
        <Button
          variant="text"
          type="button"
          className="text-primary! rounded px-2 py-1"
          onClick={handleClearDates}
          sx={{ textTransform: "none" }}
        >
          {t("Clear dates")}
        </Button>
      </div>
    </div>
  );
}
