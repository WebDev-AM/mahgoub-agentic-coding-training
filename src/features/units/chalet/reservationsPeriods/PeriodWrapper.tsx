import { Dispatch, SetStateAction } from "react";
import { t } from "i18next";
import FromToIcon from "../../../../assets/icons/FromToIcon";
import { ReservationPeriod } from "../../../../types/reservation/ReservationsSchema";
import { motion } from "framer-motion";
import { updatePeriodicSelection } from "../../../../utils/reservationPeriodsUtils";

type PeriodWrapperProps = {
  id: number;
  packageData: ReservationPeriod;
  periods: ReservationPeriod[];
  setSelected: Dispatch<SetStateAction<number[]>>;
  selected: number[];
};

const PeriodWrapper: React.FC<PeriodWrapperProps> = ({
  id,
  packageData,
  periods,
  setSelected,
  selected,
}) => {
  const isSelected = selected.includes(id);

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelected((previous) =>
      updatePeriodicSelection(periods, previous, id, e.target.checked)
    );
  };

  return (
    <motion.div
      className={`w-full rounded-lg px-4 py-6 shadow ${isSelected && "border-primary border-2"} bg-white`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4 }}
    >
      <div
        className={`font-poppins relative mb-3 flex h-4 items-center gap-2 text-sm font-bold tracking-wide ${isSelected && "text-primary"}`}
      >
        {packageData.status === "AVAILABLE" && (
          <>
            <input
              type="checkbox"
              id={String(id)}
              checked={isSelected}
              onChange={handleCheck}
              aria-label={`${t("Select")} ${t(packageData.typePeriod)} ${packageData.startPeriod}`}
              className="sr-only"
            />
            <label
              htmlFor={String(id)}
              className="z-9999 flex h-3.5 w-3.5 cursor-pointer items-center justify-center rounded-full border-2 border-blue-500 transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500 hover:bg-blue-100"
            >
              {isSelected && (
                <span className="block h-1.5 w-1.5 rounded-full bg-blue-500" />
              )}
            </label>
          </>
        )}
        <div className="absolute top-0 left-0 flex h-full w-full items-center justify-between ps-5">
          <span
            className={`font-bold ${isSelected ? "text-primary" : "text-black"}`}
          >
            {t(packageData.typePeriod)}
          </span>
          {(packageData.status === "CONFIRMED" ||
            packageData.status === "COMPLETED") && (
            <span className="text-red-500">{t("Unavailable")}</span>
          )}
          {packageData.status === "LOCKED" && (
            <div>
              <p className="text-[10px] text-orange-500">
                {t("Temporarily unavailable")}
              </p>
              <p className="text-[10px] text-orange-500">
                {t("May become free soon")}
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex gap-2 leading-3">
          <div className="h-11">
            <FromToIcon />
          </div>
          <div className="flex flex-col justify-between text-[10px]">
            <p className="text-gray-500">{t("From")}</p>
            <p className="text-gray-500">{t("To")}</p>
          </div>
        </div>
        <div className="flex flex-col justify-between">
          <div className="flex justify-between">
            <p className="text-base font-medium tracking-wide">
              {packageData.startPeriod}
            </p>
          </div>
          <div className="flex justify-between text-[10px]">
            <p className="text-base font-medium tracking-wide">
              {packageData.endPeriod}
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-between text-[10px]">
          <p>{t("Total Price")} :</p>
          <p className="text-primary text-lg font-semibold tracking-wide">
            {packageData.price + " "} {t("KWD")}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default PeriodWrapper;
