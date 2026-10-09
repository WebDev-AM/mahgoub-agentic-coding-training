import React, { useState } from "react";
import { Button, Popover, Stack, IconButton } from "@mui/material";
import { FaShareAlt } from "react-icons/fa";
import {
  FaFacebookF,
  FaTwitter,
  FaWhatsapp,
  FaTelegramPlane,
} from "react-icons/fa";
import { t } from "i18next";

interface ShareButtonProps {
  url: string;
  title?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({
  url,
  title = "Check this out!",
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "share-popover" : undefined;

  // Social media share URLs
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const platforms = [
    {
      name: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: <FaFacebookF size={20} />,
    },
    {
      name: "Twitter",
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: <FaTwitter size={20} />,
    },
    {
      name: "WhatsApp",
      url: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      icon: <FaWhatsapp size={20} />,
    },
    {
      name: "Telegram",
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      icon: <FaTelegramPlane size={20} />,
    },
  ];

  return (
    <>
      <Button
        aria-describedby={id}
        variant="contained"
        className="!bg-primary hover:!bg-primary-shade"
        startIcon={<FaShareAlt />}
        onClick={handleClick}
      >
        {t("Share")}
      </Button>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Stack direction="row" spacing={2} sx={{ p: 2 }}>
          {platforms.map(({ name, url, icon }) => (
            <IconButton
              key={name}
              aria-label={`Share on ${name}`}
              component="a"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="!text-primary"
            >
              {icon}
            </IconButton>
          ))}
        </Stack>
      </Popover>
    </>
  );
};

export default ShareButton;
