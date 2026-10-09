import { t } from "i18next";
import { useState } from "react";
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

type ReservationView = "PERIODIC" | "DAILY";

function ChaletReservationPeriods({ chalet }: { chalet: Chalet }) {
  const navigate = useNavigate();
  const { setCartItem } = useChaletCartContext();

  const { periods, isLoading } = useChaletReservationPeriods(chalet.uuid);

  const [renderSection, setRenderSection] =
    useState<ReservationView>("PERIODIC");

  const [selected, setSelected] = useState<number[]>([]);

  if (isLoading) {
    return <PageSpinner />;
  }

  if (!periods) {
    return null;
  }

  function handleSectionChange(section: ReservationView) {
    setRenderSection(section);
    setSelected([]);
  }

  function handleClick() {
    if (!selected.length) return;

    const reservationData = getBookingDetails(
      periods!,
      selected[0],
      selected[selected.length - 1]
    );

    setCartItem({
      ...reservationData,
      chalet,
    });

    navigate("/booking/chalet/0");
  }

  return (
    <div className="flex flex-col items-center gap-5">
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

      {renderSection === "PERIODIC" && (
        <PeriodsSlider
          periods={periods}
          selected={selected}
          setSelected={setSelected}
        />
      )}

      {renderSection === "DAILY" && (
        <DateRangePicker periods={periods} setSelected={setSelected} />
      )}

      <Button
        className="brand-button w-70"
        variant="contained"
        disabled={selected.length === 0}
        onClick={handleClick}
        sx={{ textTransform: "none" }}
      >
        {t("Reserve Now")}
      </Button>
    </div>
  );
}

export default ChaletReservationPeriods;
