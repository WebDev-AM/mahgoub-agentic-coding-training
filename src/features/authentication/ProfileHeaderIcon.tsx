import { useState } from "react";
import {
  Avatar,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";
import useLogout from "./useLogout";
import { useMe } from "./useMe";
import ModalComponent from "../../ui/ModalComponent";
import AuthForms from "./AuthForms";
import { useHasLanding } from "../../hooks/useHasLanding";

const ProfileHeaderIcon = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, isLoading } = useMe();
  const navigate = useNavigate();
  const { logout, isLoggingOut } = useLogout();
  const hasLanding = useHasLanding();

  if (isLoading) return <CircularProgress size={20} />;

  if (!user) {
    return (
      <ModalComponent
        fitContent={true}
        openButton={
          <button className="text-primary cursor-pointer">
            {t("Login")}
          </button>
        }
      >
        <AuthForms />
      </ModalComponent>
    );
  }

  return (
    <div>
      <IconButton
        aria-haspopup="true"
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        <Avatar
          src={user.profileImage || undefined}
          alt={`${user.firstName} ${user.lastName}`}
          className={`${
            !hasLanding ? "!bg-primary !text-white" : "!text-primary !bg-white"
          } !h-10 !w-10 !text-xs`}
        >
          {`${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()}
        </Avatar>
      </IconButton>
      {/* <span className="hidden text-sm font-medium md:inline">
          {`${user.firstName} ${user.lastName}`}
        </span> */}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        disableScrollLock
      >
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            navigate("/profile");
          }}
        >
          {t("Profile")}
        </MenuItem>
        <MenuItem
          onClick={() =>
            logout(undefined, { onSuccess: () => setAnchorEl(null) })
          }
          className="!text-red-500"
        >
          {isLoggingOut ? (
            <CircularProgress className="mx-auto" size={15} color="error" />
          ) : (
            t("Logout")
          )}
        </MenuItem>
      </Menu>
    </div>
  );
};

export default ProfileHeaderIcon;
