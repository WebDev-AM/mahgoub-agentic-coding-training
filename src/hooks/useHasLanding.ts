import { useMemo } from "react";
import { useLocation } from "react-router-dom";

const passes = ["/home", "/about-us"];

export function useHasLanding() {
  const location = useLocation();

  const hasLanding = useMemo(() => {
    return passes.some((pass) => location.pathname.includes(pass));
  }, [location.pathname]);

  return hasLanding;
}
