import { Breakpoint, useMediaQuery, useTheme } from "@mui/material";

export function useMobileScreen(size: number | Breakpoint = 1024) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(size));
  return isMobile;
}
