import { Dispatch, SetStateAction, useRef, useState } from "react";
import Flatpickr, { DateTimePickerHandle } from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import dayjs from "dayjs";
import { ReservationPeriod } from "../../../../types/reservation/ReservationsSchema";
import { Arabic } from "flatpickr/dist/l10n/ar";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
import { Button } from "@mui/material";

type Props = {
  periods: ReservationPeriod[];
  setSelected: Dispatch<SetStateAction<number[]>>;
};

export default function DateRangePicker({ periods, setSelected }: Props) {
  const { i18n } = useTranslation();
  const fpRef = useRef<DateTimePickerHandle>(null);
  const [value, setValue] = useState<Date[]>([]);
  // const [searchParams] = useSearchParams();

  const minAvailableDate = dayjs(periods[0].startPeriod).toDate();
  const maxAvailableDate = dayjs(
    periods[periods.length - 1].startPeriod
  ).toDate();

  // ✅ Initialize from search params
  // useEffect(() => {
  //   if (!periods.length) return;

  //   const checkIn = searchParams.get("checkIn");
  //   const checkOut = searchParams.get("checkOut");

  //   if (!checkIn || !checkOut) return;

  //   const start = dayjs(checkIn).startOf("day");
  //   const end = dayjs(checkOut).startOf("day");

  //   if (!start.isValid() || !end.isValid()) return;
  //   if (end.isSame(start, "day")) return;

  //   const startIndex = periods.findIndex((p) =>
  //     dayjs(p.startPeriod).isSame(start, "day")
  //   );

  //   const endIndex = periods.findIndex((p) =>
  //     dayjs(p.startPeriod).isSame(end, "day")
  //   );

  //   if (startIndex === -1 || endIndex === -1) return;

  //   // Set UI value
  //   setValue([start.toDate(), end.toDate()]);

  //   // Set selected indices
  //   setSelected([startIndex, endIndex]);
  // }, [searchParams, periods, setSelected]);

  const handleChange = (selectedDates: Date[]) => {
    if (selectedDates.length !== 2) return;

    const [start, end] = selectedDates.map((d) => dayjs(d).startOf("day"));

    if (end.isSame(start, "day")) return;

    setValue(selectedDates);

    const startIndex = periods.findIndex((p) =>
      dayjs(p.startPeriod).isSame(start, "day")
    );

    const endIndex = periods.findIndex((p) =>
      dayjs(p.startPeriod).isSame(end, "day")
    );

    if (startIndex === -1 || endIndex === -1) return;

    setSelected([startIndex, endIndex]);
  };

  const handleClearDates = () => {
    setValue([]);
    setSelected([]);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <h2 className="h2 text-brand-text">{t("Chalet Reservation Days")}</h2>

      <Flatpickr
        ref={fpRef}
        value={value}
        options={{
          mode: "range",
          dateFormat: "Y-m-d",
          locale: i18n.language === "ar" ? Arabic : undefined,
          minDate: minAvailableDate,
          maxDate: maxAvailableDate,
          showMonths: 1,
          disableMobile: true,
          inline: true,
        }}
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
