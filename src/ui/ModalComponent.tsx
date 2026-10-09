import { useState, cloneElement, ReactElement } from "react";
import { Modal as StyledModal, Backdrop, Box, Fade } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "5px",
  maxHeight: "90%",
  overflowY: "auto",
};

type ModalProps = {
  children: ReactElement<{ onCloseModal: () => void }>; // Explicitly typing the 'children' prop
  openButton: ReactElement<{ onClick: () => void }>; // Explicitly typing the 'openButton' prop
  className?: string;
  fitContent?: boolean;
  defaultOpen?: boolean;
};

function ModalComponent({
  children,
  openButton,
  className,
  fitContent = false,
  defaultOpen = false,
}: ModalProps) {
  const [open, setOpen] = useState(defaultOpen);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className={className}>
      {cloneElement(openButton, { onClick: handleOpen })}
      <StyledModal
        disableScrollLock
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={{ ...style, width: fitContent ? "fit-content" : "90%" }}>
            {cloneElement(children, { onCloseModal: handleClose })}
          </Box>
        </Fade>
      </StyledModal>
    </div>
  );
}

export default ModalComponent;
