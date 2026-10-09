import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { styled } from "@mui/material/styles";
import { t } from "i18next";
import BackArrow from "../../ui/BackArrow";
import { useParams } from "react-router-dom";

const GoldStep = styled(StepLabel)(({ theme }) => ({
  "& .MuiStepIcon-root.Mui-active": {
    color: theme.palette.primary.main,
  },
  "& .MuiStepLabel-label.Mui-active": {
    color: theme.palette.primary.main,
  },
  "& .MuiStepIcon-root.Mui-completed": {
    color: theme.palette.primary.main,
  },
  "& .MuiStepLabel-label.Mui-completed": {
    color: theme.palette.primary.main,
  },
}));

export default function BookingStepper() {
  const steps: string[] = [
    t("Summary"),
    t("Booking Information"),
    t("Payment Confirmation"),
  ];

  const { step } = useParams();
  const renderStep = parseInt(step ?? "0", 10);
  const activeStep = Math.min(renderStep, steps.length - 1);

  return (
    <>
      <BackArrow label={steps[activeStep]} />
      <Box sx={{ width: "100%" }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <GoldStep>{label}</GoldStep>
            </Step>
          ))}
        </Stepper>
      </Box>
    </>
  );
}
