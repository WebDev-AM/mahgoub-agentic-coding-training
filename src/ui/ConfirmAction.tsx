import { Button } from "@mui/material";
import { t } from "i18next";

type ConfirmActionProps = {
  onConfirm: () => void;
  disabled?: boolean;
  onCloseModal?: () => void;
  header?: string;
  body?: string;
};

export default function ConfirmAction({
  onConfirm,
  disabled,
  onCloseModal,
  header = "Delete Confirmation",
  body = "This action cannot be undone. Do you want to proceed?",
}: ConfirmActionProps) {
  return (
    <div className="flex w-96 flex-col gap-4">
      <h3 className="text-xl font-medium">{t(header)}</h3>
      <p className="text-gray-500">{t(body)}</p>

      <div className="flex justify-end gap-3">
        <Button
          variant="contained"
          className="bg-white! text-gray-500! hover:bg-gray-100!"
          disabled={disabled}
          onClick={onCloseModal}
        >
          {t("Cancel")}
        </Button>
        <Button
          variant="contained"
          className="!bg-red-600 hover:!bg-red-700 disabled:!bg-gray-500 disabled:!text-gray-300"
          disabled={disabled}
          onClick={() => onConfirm()}
        >
          {t("Confirm")}
        </Button>
      </div>
    </div>
  );
}
