import { useTranslation } from "react-i18next";
import { ChaletReservation } from "../../types/reservation/ChaletReservationSchema";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";
import { Button } from "@mui/material";
import { FaShare } from "react-icons/fa";
import useSendMessage from "../chat/useSendMessage";
import { usePushToPortal } from "../../hooks/usePushToPortal";
import { toast } from "react-toastify";
import { useMe } from "../authentication/useMe";

function ChaletReservationCard({
  reservation,
}: {
  reservation: ChaletReservation;
}) {
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const { user } = useMe();
  const { sendMessage, isPending } = useSendMessage();
  const { pushNotificationToPortal } = usePushToPortal();

  const handleShareWithCustomerService = () => {
    sendMessage(
      {
        text: `Reservation #${reservation.uuid} details shared.`,
        id: user!.id,
        type: "reservation",
        attachment: reservation.uuid,
      },
      {
        onSuccess: () => {
          toast.success(
            t(
              "Reservation details shared with customer service. Check your chat!"
            )
          );
          pushNotificationToPortal({
            title: `${user?.firstName} ${user?.lastName}`,
            message: `Message: Reservation ${reservation.uuid} details shared.`,
            type: "CHAT",
          });
        },
      }
    );
  };

  if (!reservation.unit) return null;

  const ribbonText = getRibbonText(
    reservation.status,
    reservation.invoice?.invoiceStatus
  );

  const chaletName =
    i18n.language === "en"
      ? reservation.unit.localizedData.nameEn
      : reservation.unit.localizedData.nameAr;

  const chaletAddress =
    i18n.language === "en"
      ? reservation.unit.localizedData.addressEn
      : reservation.unit.localizedData.addressAr;

  return (
    <div
      key={reservation.uuid}
      className="text-sub-text relative w-70 cursor-pointer overflow-hidden rounded-xl shadow-2xl"
      onClick={() => navigate(`/reservation/chalet/${reservation.uuid}`)}
    >
      {/* Ribbon */}
      {ribbonText && (
        <div
          className={`bg-primary absolute top-2 left-2 z-10 rounded-md px-3 py-1 text-sm font-bold text-white shadow-lg ${reservation.status === "CANCELLED" || reservation.status === "REPLACED" ? "!bg-red-500" : ""}`}
        >
          {ribbonText}
        </div>
      )}

      <img
        src={`${reservation.unit.media[0]?.url}`}
        alt={reservation.unit.localizedData.nameEn}
        className={`h-60 w-full object-cover transition-transform duration-600 ease-in-out hover:scale-105 ${
          reservation.status === "CANCELLED" ||
          reservation.status === "REPLACED"
            ? "grayscale"
            : ""
        }`}
      />
      <div className="flex flex-col justify-between gap-2 p-3">
        <div>
          <h3 className="truncate text-lg text-black" title={chaletName}>
            {chaletName}
          </h3>
          <h4 className="truncate text-base" title={chaletAddress}>
            {chaletAddress}
          </h4>
        </div>
        <div className="flex items-center justify-between">
          <p>{`${t("From")} ${reservation.begin.split("T")[0]}`}</p>
          <p>{`${t("To")} ${reservation.end.split("T")[0]}`}</p>
        </div>
        <div className="flex items-center justify-end">
          <p className="text-primary text-xl font-semibold">
            {`${reservation.invoice?.totalAmount} ${t("KWD")}`}
          </p>
        </div>
        <div className="flex items-center justify-end">
          <Button
            variant="contained"
            className="primary-button propagation-none flex items-center gap-1"
            sx={{ textTransform: "none" }}
            disabled={isPending}
            onClick={(e) => {
              e.stopPropagation();
              handleShareWithCustomerService();
            }}
          >
            <FaShare size={16} /> {t("Share")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ChaletReservationCard;

function getRibbonText(status: string, invoiceStatus?: string) {
  if (status === "REPLACED") return t("Replaced");
  if (status === "COMPLETED") return t("Completed");
  if (status === "CANCELLED") return t("Cancelled");
  if (invoiceStatus === "PAID") return t("Paid");
  if (invoiceStatus === "OVER_PAID") return t("Over Paid");
  if (invoiceStatus === "PARTIALLY_PAID") return t("Complete Payment");
  return null;
}
