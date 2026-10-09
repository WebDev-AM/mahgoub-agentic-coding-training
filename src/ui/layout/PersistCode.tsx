import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

function PersistCode() {
  const location = useLocation();

  useLayoutEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("promoter");

    if (code) {
      // Save to sessionStorage
      sessionStorage.setItem("session_promoter", code);

      // // Optionally clean URL
      // params.delete("promoter");
      // navigate(
      //   { pathname: location.pathname, search: params.toString() },
      //   { replace: true }
      // );
    }

    const ownerId = params.get("owner");
    if (ownerId) sessionStorage.setItem("session_owner", ownerId);
  }, [location]);

  return null; // This component does not render anything
}

export default PersistCode;
