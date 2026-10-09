import { Box, Modal, Skeleton } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useMe } from "../features/authentication/useMe";
import AuthForms from "../features/authentication/AuthForms";
import PageSpinner from "./PageSpinner";

function ProtectedRoute() {
  const { user, isLoading } = useMe();

  if (isLoading) return <PageSpinner />;
  if (user) return <Outlet />;

  return (
    <>
      <div
        aria-hidden="true"
        className="container-fix container flex min-h-[60vh] flex-col gap-6 py-10"
      >
        <Skeleton variant="text" width="35%" height={44} />
        <Skeleton variant="rounded" height={180} />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton variant="rounded" height={240} />
          <Skeleton variant="rounded" height={240} />
        </div>
      </div>

      <Modal
        open
        disableEscapeKeyDown
        aria-labelledby="authentication-required-title"
        onClose={() => undefined}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "min(96vw, 760px)",
            maxHeight: "90vh",
            overflowY: "auto",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 1,
            p: { xs: 2, sm: 4 },
          }}
        >
          <AuthForms className="w-full !min-w-0" />
        </Box>
      </Modal>
    </>
  );
}

export default ProtectedRoute;
