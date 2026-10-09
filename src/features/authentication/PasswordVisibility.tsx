import { Dispatch, SetStateAction } from "react";

import { InputAdornment, IconButton } from "@mui/material";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";

type PasswordVisibilityProps = {
  showPassword: boolean;
  setShowPassword: Dispatch<SetStateAction<boolean>>;
};

function PasswordVisibility({
  showPassword,
  setShowPassword,
}: PasswordVisibilityProps) {
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  return (
    <InputAdornment position="end" sx={{ marginLeft: 0 }}>
      <IconButton
        aria-label="toggle password visibility"
        onClick={handleClickShowPassword}
        onMouseDown={handleMouseDownPassword}
        edge="end"
        sx={{
          right: "20px",
          position: "absolute",
        }}
      >
        {showPassword ? <MdOutlineVisibilityOff /> : <MdOutlineVisibility />}
      </IconButton>
    </InputAdornment>
  );
}

export default PasswordVisibility;
