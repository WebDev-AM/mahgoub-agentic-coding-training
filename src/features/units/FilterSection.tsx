import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { MdExpandMore } from "react-icons/md";

type FilterSectionProps = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: FilterSectionProps) {
  return (
    <Accordion
      defaultExpanded={defaultOpen}
      disableGutters
      elevation={0}
      square
      sx={{
        borderBottom: "1px solid #e5e7eb",

        "&:before": {
          display: "none",
        },

        "& .MuiAccordionSummary-root": {
          minHeight: 48,
          backgroundColor: "#f3f5f7",
          px: 2,
        },

        "& .MuiAccordionSummary-content": {
          my: 0,
        },

        "& .MuiAccordionDetails-root": {
          p: 2,
        },
      }}
    >
      <AccordionSummary expandIcon={<MdExpandMore />}>
        <span className="text-[15px] font-medium text-sky-600">{title}</span>
      </AccordionSummary>

      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
}

export default FilterSection;
