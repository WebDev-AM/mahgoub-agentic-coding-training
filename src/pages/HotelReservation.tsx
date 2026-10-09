import orderSuccessPayment from "../assets/images/orderSuccessPayment.png";
import { t } from "i18next";
import { Link, useParams } from "react-router-dom";
import { Button } from "@mui/material";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { BiCopy, BiDownload } from "react-icons/bi";
import { FaTrashCan } from "react-icons/fa6";
import dayjs from "dayjs";

import HotelBookingSummaryPanel, {
  HotelBookingSummaryData,
} from "../features/booking/hotel/HotelBookingSummaryPanel";
import HotelInvoicePdf from "../features/reservation/hotel/HotelInvoicePdf";
import { useHotelReservation } from "../features/reservation/hotel/useHotelReservation";
import StatusCard from "../ui/StatusCard";
import ModalComponent from "../ui/ModalComponent";
import ReservationAction from "../features/reservation/ReservationAction";
import { useCancelHotelReservation } from "../features/booking/hotel/useCancelHotelReservation";
import { GeneratePdfButton } from "../ui/GeneratePdfButton";
import { useMe } from "../features/authentication/useMe";
import CreateUpdateRatingForm from "../features/rating/CreateUpdateRatingForm";
import { MdStar } from "react-icons/md";
import PageSpinner from "../ui/PageSpinner";
import EmptyState from "../ui/EmptyState";

function HotelReservation() {
  const { status } = useParams();
  const { reservation, isLoading, error } = useHotelReservation();
  const { cancelReservation, isCanceling } = useCancelHotelReservation();
  const { user } = useMe();

  if (isLoading) return <PageSpinner />;
  if (error || !reservation?.hotel) {
    return (
      <EmptyState
        title={t("Reservation not found")}
        description={t(
          "This reservation may not exist or may belong to another account."
        )}
        buttonText={t("Take Me Home")}
      />
    );
  }

  const numberOfNights = Math.max(
    0,
    dayjs(reservation.end).diff(dayjs(reservation.begin), "day")
  );

  const summary: HotelBookingSummaryData = {
    discount: reservation.groupInvoice.totalDiscount || 0,
    hotel: reservation.hotel,
    rooms: reservation.groupUnitTypes,
    numberOfNights,
    subtotal: reservation.totalSubtotal || 0,
    insurance: reservation.totalInsurance || 0,
    startDate: reservation.begin,
    endDate: reservation.end,
    status: reservation.status,
  };

  return (
    <div className="py-spacing-y container-fix container space-y-4">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-col items-center gap-4 lg:flex-row">
          <p className="font-bold">
            {t("Reservation Id")}: {reservation.groupCode}
          </p>
          <button
            className="text-primary flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-100 px-5 py-2 text-sm shadow transition-all duration-200 hover:shadow-md"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success(t("Link copied successfully"));
            }}
          >
            <BiCopy /> {t("Copy Reservation Link")}
          </button>
          {/* Rating Form - Show only if reservation date has passed */}
          {reservation &&
            new Date(reservation.begin).getTime() < Date.now() && (
              <ModalComponent
                openButton={
                  <Button
                    variant="outlined"
                    className="flex cursor-pointer items-center gap-1 border border-green-700! text-green-600! hover:text-green-700!"
                  >
                    <MdStar className="cursor-pointer" /> {t("Rate")}
                  </Button>
                }
                fitContent
              >
                <CreateUpdateRatingForm
                  resourceType="HOTEL"
                  rating={reservation.rating}
                  resourceId={reservation.hotel.uuid}
                  reservationId={reservation.groupInvoice.groupReservationId}
                />
              </ModalComponent>
            )}
          {!status &&
            new Date(reservation.begin).getTime() > Date.now() &&
            reservation.status !== "REPLACED" &&
            reservation.status !== "CANCELLED" && (
              <ModalComponent
                className="w-fit"
                openButton={
                  <Button
                    variant="outlined"
                    className="flex cursor-pointer items-center gap-1 border border-red-700! text-red-600! hover:text-red-700!"
                  >
                    <FaTrashCan className="cursor-pointer" /> {t("Cancel")}
                  </Button>
                }
                fitContent
              >
                <ReservationAction
                  reservationId={reservation.groupInvoice.groupReservationId}
                  type="CANCELLATION"
                  header="Cancel Confirmation"
                  onConfirm={(onSuccess) =>
                    cancelReservation(
                      reservation.groupInvoice.groupReservationId,
                      {
                        onSuccess,
                      }
                    )
                  }
                  disabled={isCanceling}
                />
              </ModalComponent>
            )}
        </div>
        <StatusCard
          status={
            reservation.status === "CONFIRMED"
              ? reservation.paymentStatus
              : reservation.status
          }
          className="w-fit!"
        />
      </div>

      <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-start">
        <div className="flex w-full flex-col gap-2">
          {<HotelBookingSummaryPanel summary={summary} />}
          {!status && (
            <div className="flex items-center justify-center gap-2">
              <GeneratePdfButton
                documentComponent={async () => (
                  <HotelInvoicePdf
                    hotel={reservation.hotel}
                    invoice={reservation.groupInvoice}
                    user={user || reservation.user}
                    reservation={reservation}
                  />
                )}
                Button={
                  <Button
                    className="w-1/2 rounded-lg px-5 py-2 tracking-wide normal-case! sm:w-auto"
                    variant="outlined"
                  >
                    <BiDownload className="me-1" /> {t("Download Invoice")}
                  </Button>
                }
                fileName="invoice.pdf"
              />
            </div>
          )}
        </div>
        {status === "success" && (
          <motion.div
            className="sticky top-5 mx-4 flex flex-col items-center md:mx-0"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <img src={orderSuccessPayment} alt="success" />
            <h3 className="text-xl font-bold text-green-500">
              {t("Successful Payment!")}
            </h3>
            <p className="mt-5 text-center font-bold">
              {t(
                "Thank you for your payment. Your booking has been confirmed."
              )}
            </p>

            <div className="mt-5 flex w-full items-center gap-x-3 sm:w-auto">
              <div className="mt-6 flex w-full items-center justify-center gap-3">
                <GeneratePdfButton
                  documentComponent={async () => (
                    <HotelInvoicePdf
                      hotel={reservation.hotel}
                      invoice={reservation.groupInvoice}
                      user={user || reservation.user}
                      reservation={reservation}
                    />
                  )}
                  Button={
                    <Button
                      className="w-1/2 rounded-lg px-5 py-2 tracking-wide normal-case! sm:w-auto"
                      variant="outlined"
                    >
                      <BiDownload className="me-1" /> {t("Download Invoice")}
                    </Button>
                  }
                  fileName="invoice.pdf"
                />
                <Button
                  component={Link}
                  to="/"
                  className="rounded-lg bg-gray-400! px-5 py-2 tracking-wide normal-case! transition-colors duration-200 hover:bg-gray-500!"
                  variant="contained"
                >
                  {t("Take Me Home")}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default HotelReservation;
