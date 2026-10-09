import { Button } from "@mui/material";
import { t } from "i18next";
import { useAppliedFees } from "./useAppliedFees";
import { Trans } from "react-i18next";
import PageSpinner from "../../ui/PageSpinner";
import { useNavigate } from "react-router-dom";

type ReservationActionProps = {
  reservationId: string;
  type: "CANCELLATION" | "UPDATE";
  onConfirm: (onSuccess?: () => void) => void;
  onCloseModal?: () => void;
  header: string;
  disabled?: boolean;
};
function ReservationAction({
  reservationId,
  type,
  onCloseModal,
  onConfirm,
  disabled,
  header,
}: ReservationActionProps) {
  const navigate = useNavigate();
  const { fees, isLoading } = useAppliedFees({ reservationId, type });
  const message =
    type === "CANCELLATION"
      ? fees
        ? "Are you sure you want to cancel this reservation? Please note that <bold>cancellation fees ({{fees}} KWD)</bold> apply."
        : "Are you sure you want to cancel this reservation?"
      : fees
        ? "Are you sure you want to update this reservation? Please note that <bold>update fees ({{fees}} KWD)</bold> apply."
        : "Are you sure you want to update this reservation?";

  return (
    <div className="flex w-96 flex-col gap-4">
      <h3 className="text-xl font-medium">{t(header)}</h3>
      {isLoading && <PageSpinner />}
      {
        <p className="text-gray-500">
          {
            <Trans values={{ fees }} components={{ bold: <strong /> }}>
              {message}
            </Trans>
          }
        </p>
      }

      <div className="flex justify-end gap-3">
        <Button
          variant="contained"
          className="!bg-white !text-gray-500 hover:!bg-gray-100"
          onClick={onCloseModal}
          disabled={disabled}
        >
          {t("Cancel")}
        </Button>
        <Button
          variant="contained"
          className="!bg-red-600 hover:!bg-red-700 disabled:!bg-gray-500 disabled:!text-gray-300"
          onClick={() => onConfirm(() => navigate("/profile"))}
          disabled={disabled}
        >
          {t("Confirm")}
        </Button>
      </div>
    </div>
  );
}

export default ReservationAction;
