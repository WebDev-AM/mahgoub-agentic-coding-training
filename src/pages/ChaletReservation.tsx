import orderSuccessPayment from "../assets/images/placeholder.svg";
import { t } from "i18next";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useChaletReservation } from "../features/reservation/chalet/useChaletReservation";
import ModalComponent from "../ui/ModalComponent";
import { Button } from "@mui/material";
import { motion } from "framer-motion";
import CompletePaymentForm from "../features/reservation/CompletePaymentForm";
import { GeneratePdfButton } from "../ui/GeneratePdfButton";
import { useMe } from "../features/authentication/useMe";
import { BiCopy, BiDownload } from "react-icons/bi";
import ChaletReplacedInvoicePdf from "../features/reservation/chalet/ChaletReplacedInvoice";
import ChaletInvoicePdf from "../features/reservation/chalet/ChaletInvoicePdf";
import { getChaletInvoiceApi } from "../services/apiReservation";
import { toast } from "react-toastify";
import { FaTrashCan } from "react-icons/fa6";
import ReservationAction from "../features/reservation/ReservationAction";
import { LuPencilLine } from "react-icons/lu";
import { useCancelChaletReservation } from "../features/booking/chalet/useCancelChaletReservation";
import ChaletBookingSummaryPanel, {
  ChaletBookingSummaryData,
} from "../features/booking/chalet/ChaletBookingSummaryPanel";
import StatusCard from "../ui/StatusCard";
import CreateUpdateRatingForm from "../features/rating/CreateUpdateRatingForm";
import { MdStar } from "react-icons/md";
import PageSpinner from "../ui/PageSpinner";
import EmptyState from "../ui/EmptyState";

function ChaletReservation() {
  const { status } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { reservation, isLoading, error } = useChaletReservation();
  const { cancelReservation, isCanceling } = useCancelChaletReservation();
  const { user } = useMe();

  if (isLoading) return <PageSpinner />;
  if (error || !reservation?.unit) {
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

  const summary: ChaletBookingSummaryData = {
    discount: reservation.invoice.totalDiscount || 0,
    chalet: reservation.unit,
    numberOfNights: reservation.numberOfNights || 0,
    subtotal: reservation.subtotal || 0,
    insurance: reservation.insurance || 0,
    insurancePaidAtArrival: reservation.insurancePaidAtArrival || 0,
    totalPaid: reservation.invoice.totalPaidAmount,
    totalRemaining: reservation.invoice.totalRemainingAmount,
    startDate: reservation.begin,
    endDate: reservation.end,
    status: reservation.status,
  };

  return (
    <div className="py-spacing-y container-fix container space-y-4">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-col items-center gap-4 lg:flex-row">
          <p className="font-bold">
            {t("Reservation Id")}: {reservation.reservationCode}
          </p>
          <button
            className="text-primary flex w-auto cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-100 px-5 py-2 text-sm tracking-wide shadow transition-all duration-200 hover:shadow-md"
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
                  resourceType="CHALET"
                  rating={reservation.rating}
                  resourceId={reservation.unit.uuid}
                  reservationId={reservation.uuid}
                />
              </ModalComponent>
            )}
          {!status &&
            new Date(reservation.begin).getTime() > Date.now() &&
            reservation.status !== "REPLACED" &&
            reservation.status !== "CANCELLED" && (
              <div className="flex gap-3">
                {/* UPDATE RESERVATION BUTTON */}

                <Button
                  variant="outlined"
                  onClick={() => {
                    navigate(`/reservation/chalet/update/${reservation.uuid}`);
                  }}
                  className="flex cursor-pointer items-center gap-1 border border-[#3E9A45]! text-[#3E9A45]! hover:border-[#47834c]! hover:text-[#47834c]!"
                >
                  <LuPencilLine className="text-xl!" />
                  {t("Edit")}
                </Button>

                {/* DELETE RESERVATION MODAL */}

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
                    reservationId={reservation.uuid}
                    type="CANCELLATION"
                    header="Cancel Confirmation"
                    onConfirm={(onSuccess) =>
                      cancelReservation(reservation.uuid, {
                        onSuccess,
                      })
                    }
                    disabled={isCanceling}
                  />
                </ModalComponent>
              </div>
            )}
        </div>
        {reservation.invoice.totalRemainingAmount > 0 &&
        reservation.status !== "CANCELLED" ? (
          <ModalComponent
            fitContent={true}
            openButton={
              <Button
                variant="contained"
                className="!bg-primary hover:!bg-primary-shade h-10 normal-case! disabled:!bg-gray-400"
              >
                {t("Complete Payment", {
                  amount: reservation.invoice?.totalRemainingAmount,
                })}
              </Button>
            }
          >
            <CompletePaymentForm invoice={reservation.invoice} />
          </ModalComponent>
        ) : (
          <StatusCard
            status={
              reservation.status === "CONFIRMED"
                ? reservation.paymentStatus
                : reservation.status
            }
            className="w-fit!"
          />
        )}
      </div>

      <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-start">
        <div className="flex w-full flex-col gap-2">
          {reservation && <ChaletBookingSummaryPanel summary={summary} />}
          {!status && (
            <div className="flex items-center justify-center gap-2">
              {reservation.invoice.totalRemainingAmount > 0 &&
                reservation.status !== "CANCELLED" && (
                  <ModalComponent
                    fitContent={true}
                    defaultOpen={searchParams.get("completePayment") === "true"}
                    openButton={
                      <Button
                        variant="contained"
                        className="!bg-primary hover:!bg-primary-shade h-10 w-full normal-case! disabled:!bg-gray-400"
                      >
                        {t("Complete Payment", {
                          amount: reservation.invoice?.totalRemainingAmount,
                        })}
                      </Button>
                    }
                  >
                    <CompletePaymentForm invoice={reservation.invoice} />
                  </ModalComponent>
                )}
              <GeneratePdfButton
                documentComponent={async () => {
                  const invoiceDetails = reservation.invoice.oldInvoiceNumber
                    ? await getChaletInvoiceApi(
                        reservation.invoice.invoiceNumber
                      )
                    : reservation.invoice;
                  return reservation.invoice.oldInvoiceNumber ? (
                    <ChaletReplacedInvoicePdf
                      chalet={invoiceDetails.reservation.unit}
                      invoice={invoiceDetails}
                      user={user}
                      reservation={invoiceDetails.reservation}
                    />
                  ) : (
                    <ChaletInvoicePdf
                      chalet={reservation.unit}
                      invoice={invoiceDetails}
                      user={user}
                      reservation={reservation}
                    />
                  );
                }}
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

            <div className="mt-5 flex items-center justify-center gap-x-3">
              <div className="mt-6 flex items-center justify-center gap-3">
                <GeneratePdfButton
                  documentComponent={async () => {
                    const invoiceDetails = reservation.invoice.oldInvoiceNumber
                      ? await getChaletInvoiceApi(
                          reservation.invoice.invoiceNumber
                        )
                      : reservation.invoice;
                    return reservation.invoice.oldInvoiceNumber ? (
                      <ChaletReplacedInvoicePdf
                        chalet={invoiceDetails.reservation.unit}
                        invoice={invoiceDetails}
                        user={user}
                        reservation={invoiceDetails.reservation}
                      />
                    ) : (
                      <ChaletInvoicePdf
                        chalet={reservation.unit}
                        invoice={invoiceDetails}
                        user={user}
                        reservation={reservation}
                      />
                    );
                  }}
                  Button={
                    <Button
                      className="rounded-lg px-5 py-2 tracking-wide normal-case! sm:w-auto"
                      variant="outlined"
                    >
                      <BiDownload className="me-1" /> {t("Download Invoice")}
                    </Button>
                  }
                  fileName="invoice.pdf"
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default ChaletReservation;
