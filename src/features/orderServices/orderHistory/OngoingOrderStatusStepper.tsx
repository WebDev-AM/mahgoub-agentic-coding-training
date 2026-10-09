import { Step, StepLabel, Stepper } from "@mui/material";
import { t } from "i18next";

/* ---------------------------------------------
 * Order Status → Step Index Mapping
 * -------------------------------------------- */

const ORDER_STATUS_TO_STEP: Record<string, number> = {
  CONFIRMED: 0,
  PREPARING: 1,
  IN_DELIVERY: 2,
};

/* ---------------------------------------------
 * Step Labels
 * -------------------------------------------- */

const STEPS = [t("Confirmed"), t("Preparing"), t("In Delivery")];

/* ---------------------------------------------
 * Props
 * -------------------------------------------- */

interface OngoingOrderStatusStepperProps {
  orderStatus: string;
}

/* ---------------------------------------------
 * Component
 * -------------------------------------------- */

export default function OngoingOrderStatusStepper({
  orderStatus,
}: OngoingOrderStatusStepperProps) {
  const activeStep = ORDER_STATUS_TO_STEP[orderStatus] ?? 0;

  return (
    <div className="max-w-full lg:-ms-15 lg:w-150">
      <Stepper activeStep={activeStep} alternativeLabel>
        {STEPS.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </div>
  );
}
