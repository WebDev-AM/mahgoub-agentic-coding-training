import { useState } from "react";
import { Menu, MenuItem, IconButton } from "@mui/material";
import { GrLanguage } from "react-icons/gr";
import { useTranslation } from "react-i18next";

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton aria-haspopup="true" onClick={handleClick}>
        <GrLanguage
          className="text-primary h-6 w-6"
        />
      </IconButton>
      <Menu
        open={open}
        anchorEl={anchorEl}
        id="language-menu"
        onClose={() => setAnchorEl(null)}
        disableScrollLock
      >
        <MenuItem onClick={() => handleChange("ar")}>العربية</MenuItem>
        <MenuItem onClick={() => handleChange("en")}>English</MenuItem>
      </Menu>
    </div>
  );
};

export default LanguageSelector;
