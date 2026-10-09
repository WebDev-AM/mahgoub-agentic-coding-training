import { useState, cloneElement, ReactElement, MouseEvent } from "react";
import { Popover, Fade } from "@mui/material";

type PopoverProps = {
  children: ReactElement<{ onClosePopover: () => void }>;
  openButton: ReactElement<{
    onClick: (event: MouseEvent<HTMLElement>) => void;
  }>;
  className?: string;
  popoverWidth?: string | number;
};

function PopoverComponent({ children, openButton, className }: PopoverProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    if (anchorEl) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "custom-popover" : undefined;

  return (
    <div className={className}>
      {cloneElement(openButton, { onClick: handleOpen })}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        disableScrollLock
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
        transformOrigin={{ horizontal: "right", vertical: "bottom" }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: "10px",
            },
          },
        }}
      >
        <Fade in={open}>
          <div>{cloneElement(children, { onClosePopover: handleClose })}</div>
        </Fade>
      </Popover>
    </div>
  );
}

export default PopoverComponent;
