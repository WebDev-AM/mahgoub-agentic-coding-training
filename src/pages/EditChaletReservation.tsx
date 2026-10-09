import { useMemo, useState } from "react";
import { useChaletPeriodsForUpdate } from "../features/booking/chalet/useChaletPeriodsForUpdate";
import BackArrow from "../ui/BackArrow";
import { useChaletReservation } from "../features/reservation/chalet/useChaletReservation";
import PageSpinner from "../ui/PageSpinner";
import { getBookingDetails } from "../utils/bookingUtils";
import { ReservationPeriod } from "../types/reservation/ReservationsSchema";
import { motion } from "framer-motion";
import { t } from "i18next";
import { Button, Divider } from "@mui/material";
import { useAppliedFees } from "../features/reservation/useAppliedFees";
import ModalComponent from "../ui/ModalComponent";
import { useUpdateChaletReservation } from "../features/booking/chalet/useUpdateChaletReservation";
import ReservationAction from "../features/reservation/ReservationAction";
import { useNavigate } from "react-router-dom";
import PeriodsSlider from "../features/units/chalet/reservationsPeriods/PeriodsSlider";
import DateRangePicker from "../features/units/chalet/reservationsPeriods/DateRangePicker";

function EditChaletReservation() {
  const [selected, setSelected] = useState<number[]>([]);
  const { reservation, isLoading, error } = useChaletReservation();
  const navigate = useNavigate();
  const { updateReservation, isUpdating } = useUpdateChaletReservation();
  const { fees } = useAppliedFees({
    reservationId: reservation?.uuid,
    type: "UPDATE",
  });

  const { periods, isLoading: loadingPeriods } = useChaletPeriodsForUpdate(
    reservation?.unit?.uuid,
    reservation?.uuid
  );

  const newReservation = useMemo(() => {
    if (!periods || !selected.length) return;
    return getBookingDetails(
      periods as ReservationPeriod[],
      selected[0],
      selected[selected.length - 1]
    );
  }, [periods, selected]);

  if (error || (!isLoading && !reservation)) {
    return <p className="py-10 text-center">{t("Reservation not found")}</p>;
  }

  if (isLoading || loadingPeriods)
    return (
      <div className="h-screen">
        <PageSpinner />
      </div>
    );

  if (!reservation) {
    return <p className="py-10 text-center">{t("Reservation not found")}</p>;
  }

  const oldReservationChaletPrice = reservation.subtotal;
  const newInsurance = reservation?.unit?.pricingDetails.insurancePrice;

  const newReservationTotalPrice = newReservation
    ? reservation!.invoice.totalAmount -
      oldReservationChaletPrice -
      reservation!.invoice.insuranceAmount +
      newReservation?.totalPrice +
      newInsurance! +
      (fees || 0)
    : null;

  const newRemaining = newReservationTotalPrice
    ? newReservationTotalPrice - reservation!.invoice.totalPaidAmount
    : null;

  if (!periods) return <p>{t("No available periods for update")}</p>;
  return (
    <div className="space-y-spacing-y py-spacing-y container-fix container">
      <BackArrow label="Edit Chalet Reservations Period" />
      <div className="mx-auto flex max-w-200 flex-col items-center justify-center gap-2">
        <h3 className="h3">{t("Select New Date")}</h3>
        {reservation?.unit?.reservationType === "PERIODIC" && (
          <PeriodsSlider
            periods={periods}
            selected={selected}
            setSelected={setSelected}
          />
        )}
        {reservation?.unit?.reservationType === "DAILY" && (
          <DateRangePicker setSelected={setSelected} periods={periods} />
        )}
      </div>
      <div className="flex flex-col items-center justify-center gap-5 md:flex-row md:items-stretch">
        <div className="h-40 w-100 overflow-hidden rounded-2xl md:h-80">
          <img
            src={`${reservation?.unit?.media[0]?.url}`}
            alt={reservation?.unit?.localizedData.nameEn}
            className="h-full w-full object-cover transition-transform duration-600 ease-in-out hover:scale-105"
          />
        </div>
        <motion.div
          className="w-100 space-y-3 rounded-2xl bg-white p-8"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <p className="text-xl font-semibold">
            {t("Total Price of the selections")}
          </p>
          <div className="flex items-center justify-between">
            <p className="md:text-md text-sm font-medium">{t("The Price")}</p>
            <p className="text-primary font-semibold">
              <span
                className={
                  newReservation &&
                  "mx-1 font-medium text-gray-400 line-through"
                }
              >
                {oldReservationChaletPrice}
              </span>
              {`${newReservation?.totalPrice || ""} ${t("KWD")}`}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="md:text-md text-sm font-medium">
              {t("Refundable Deposit")}
            </p>
            <p className="text-primary font-semibold">
              {newInsurance !== reservation?.invoice.insuranceAmount && (
                <span className={"mx-1 font-medium text-gray-400 line-through"}>
                  {reservation?.invoice.insuranceAmount}
                </span>
              )}
              {`${newInsurance} ${t("KWD")}`}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="md:text-md text-sm font-medium">{t("Old fees")}</p>
            <p className="text-primary font-semibold">{`${reservation?.invoice.updatedFee} ${t("KWD")}`}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="md:text-md text-sm font-medium">
              {t("Modification fees")}
            </p>
            <p className="text-primary font-semibold">{`${fees} ${t("KWD")}`}</p>
          </div>
          <Divider className="!mb-3" />
          <div className="flex items-center justify-between">
            <p className="md:text-md text-sm font-medium">{t("Total price")}</p>
            <p className="text-primary font-semibold">
              <span
                className={
                  newReservation &&
                  "mx-1 font-medium text-gray-400 line-through"
                }
              >
                {reservation?.invoice.totalAmount}
              </span>
              {`${newReservationTotalPrice || ""} ${t("KWD")}`}
            </p>{" "}
          </div>
          <div className="flex items-center justify-between">
            <p className="md:text-md text-sm font-medium">
              {t("Previously paid")}
            </p>
            <p className="text-primary font-semibold">{`${reservation?.invoice?.totalPaidAmount} ${t("KWD")}`}</p>
          </div>
          {!newReservation && reservation?.invoice.totalRemainingAmount ? (
            <div className="flex items-center justify-between">
              <p className="md:text-md text-sm font-medium">
                {t("Remaining amount")}
              </p>
              <p className="text-primary font-semibold">{`${reservation!.invoice.totalRemainingAmount} ${t("KWD")}`}</p>
            </div>
          ) : !newReservation && reservation?.invoice.totalRemainingAmount ? (
            <div className="flex items-center justify-between">
              <p className="md:text-md text-sm font-medium">
                {t("Refund amount")}
              </p>
              <p className="text-primary font-semibold">{`${reservation!.invoice.overpaymentAmount} ${t("KWD")}`}</p>
            </div>
          ) : newReservation && newRemaining && newRemaining < 0 ? (
            <div className="flex items-center justify-between">
              <p className="md:text-md text-sm font-medium">
                {t("Refund amount")}
              </p>
              <p className="text-primary font-semibold">{`${Math.abs(newRemaining)} ${t("KWD")}`}</p>
            </div>
          ) : newReservation && newRemaining && newRemaining > 0 ? (
            <div className="flex items-center justify-between">
              <p className="md:text-md text-sm font-medium">
                {t("Remaining amount")}
              </p>
              <p className="text-primary font-semibold">{`${newRemaining} ${t("KWD")}`}</p>
            </div>
          ) : (
            ""
          )}

          <ModalComponent
            className="flex-1"
            openButton={
              <Button
                className="!bg-primary hover:!bg-primary-shade h-10 w-full disabled:!cursor-not-allowed disabled:!bg-gray-500 disabled:!text-gray-300"
                variant="contained"
                type="button"
                disabled={
                  isUpdating ||
                  !newReservation ||
                  (reservation?.begin.split("T")[0] ===
                    newReservation.startDate &&
                    reservation.end.split("T")[0] === newReservation.endDate)
                }
              >
                {t("update")}
              </Button>
            }
            fitContent
          >
            <ReservationAction
              reservationId={reservation!.uuid}
              type="UPDATE"
              header="Update Confirmation"
              onConfirm={() => {
                updateReservation(
                  {
                    updatedReservation: {
                      reservationId: reservation!.uuid,
                      begin: newReservation!.startDate + "T12:03:00",
                      end: newReservation!.endDate + "T01:57:00",
                      note: "",
                    },
                    chaletId: reservation!.unit!.uuid,
                  },
                  {
                    onSuccess: (data) =>
                      navigate(`/reservation/chalet/${data.uuid}`),
                  }
                );
              }}
              disabled={isUpdating}
            />
          </ModalComponent>
        </motion.div>
      </div>
    </div>
  );
}

export default EditChaletReservation;
