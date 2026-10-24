import { t } from "i18next";
import { useMemo, useState } from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { Chalet } from "../../../../types/ChaletSchema";

import { getBookingDetails } from "../../../../utils/bookingUtils";

import { useChaletReservationPeriods } from "./useChaletReservationPeriods";
import { useChaletCartContext } from "../../../../contexts/ChaletCartContext";

import PeriodsSlider from "./PeriodsSlider";
import PageSpinner from "../../../../ui/PageSpinner";
import DateRangePicker from "./DateRangePicker";
import SectionsSwitcher from "../../../../ui/SectionsSwitcher";
import { splitReservationPeriods } from "../../../../utils/reservationPeriodsUtils";

type ReservationView = "PERIODIC" | "DAILY";

function ChaletReservationPeriods({ chalet }: { chalet: Chalet }) {
  const navigate = useNavigate();
  const { setCartItem } = useChaletCartContext();

  const { periods, isLoading } = useChaletReservationPeriods(chalet.uuid);
  const rawPeriods = periods ?? [];
  const hasDaily = rawPeriods.some((period) => period.typePeriod === "Daily");
  const hasPeriodic = rawPeriods.some(
    (period) => period.typePeriod !== "Daily"
  );
  const showSwitcher = hasDaily && hasPeriodic;

  const [renderSection, setRenderSection] = useState<ReservationView>(
    chalet.reservationType
  );

  const [selected, setSelected] = useState<number[]>([]);
  const normalizedPeriods = useMemo(
    () => splitReservationPeriods(rawPeriods),
    [periods]
  );
  const activeSection: ReservationView = hasDaily
    ? hasPeriodic
      ? renderSection
      : "DAILY"
    : "PERIODIC";
  const currentPeriods =
    activeSection === "DAILY"
      ? normalizedPeriods.dailyPeriods
      : normalizedPeriods.periodicPeriods;

  if (isLoading) {
    return <PageSpinner />;
  }

  if (!periods || (!hasDaily && !hasPeriodic)) {
    return null;
  }

  function handleSectionChange(section: ReservationView) {
    setRenderSection(section);
    setSelected([]);
  }

  function handleClick() {
    if (!selected.length) return;

    const reservationData = getBookingDetails(
      currentPeriods,
      selected[0],
      selected[selected.length - 1],
      activeSection === "PERIODIC" ? selected : undefined
    );

    setCartItem({
      ...reservationData,
      chalet,
    });

    navigate("/booking/chalet/0");
  }

  return (
    <div className="flex flex-col items-center gap-5">
      {showSwitcher && (
        <SectionsSwitcher
          renderSection={renderSection}
          setRenderSection={handleSectionChange}
          sections={[
            {
              labelKey: "Periodic",
              value: "PERIODIC",
            },
            {
              labelKey: "Daily",
              value: "DAILY",
            },
          ]}
        />
      )}

      {activeSection === "PERIODIC" && (
        <PeriodsSlider
          periods={normalizedPeriods.periodicPeriods}
          selected={selected}
          setSelected={setSelected}
        />
      )}

      {activeSection === "DAILY" && (
        <DateRangePicker
          periods={normalizedPeriods.dailyPeriods}
          setSelected={setSelected}
        />
      )}

      {(hasDaily || hasPeriodic) && (
        <Button
          className="brand-button w-70"
          variant="contained"
          disabled={selected.length === 0}
          onClick={handleClick}
          sx={{ textTransform: "none" }}
        >
          {t("Reserve Now")}
        </Button>
      )}
    </div>
  );
}

export default ChaletReservationPeriods;
