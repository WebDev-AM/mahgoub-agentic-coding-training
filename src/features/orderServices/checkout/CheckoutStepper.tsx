import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { styled } from "@mui/material/styles";
import { t } from "i18next";
import { useParams } from "react-router-dom";

const GoldStep = styled(StepLabel)({
  "& .MuiStepIcon-root.Mui-active": {
    color: "black",
  },
  "& .MuiStepLabel-label.Mui-active": {
    color: "black",
  },
  "& .MuiStepIcon-root.Mui-completed": {
    color: "black",
  },
  "& .MuiStepLabel-label.Mui-completed": {
    color: "black",
  },
});

const steps: string[] = [
  "Personal Info",
  "Delivery Information",
  "Payment Confirmation",
  "Complete Order",
];

export default function CheckoutStepper() {
  const { step } = useParams();
  const renderStep = parseInt(step ?? "0", 10);

  return (
    <>
      <Box sx={{ width: "100%", maxWidth: "1200px", marginInline: "auto" }}>
        <Stepper className="max-xs:flex-wrap!" activeStep={renderStep}>
          {steps.map((label) => (
            <Step className="max-xs:!w-[50%]" key={label}>
              <GoldStep>{t(label)}</GoldStep>
            </Step>
          ))}
        </Stepper>
      </Box>
    </>
  );
}
