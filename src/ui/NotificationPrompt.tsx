// src/components/ui/NotificationPrompt.tsx
import { Snackbar, Alert, AlertTitle, Button, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { requestNotificationPermissionAndToken } from "../firebase";

const PROMPT_KEY = "notificationsEnabled";

function hasPrompted(): boolean {
  return localStorage.getItem(PROMPT_KEY) === "true";
}

function markPrompted(): void {
  localStorage.setItem(PROMPT_KEY, "true");
}

export default function NotificationPrompt() {
  // Controls visibility of the “gentle nudge” banner
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (!hasPrompted()) {
      setShowPrompt(true);
    }
  }, []);

  // Called when the user clicks “Enable”
  async function handleEnable() {
    await requestNotificationPermissionAndToken();
    markPrompted();
    setShowPrompt(false);
  }

  // Called when the user clicks “Dismiss” or closes the banner
  function handleDismiss() {
    setShowPrompt(false);
  }

  return (
    <Snackbar
      open={showPrompt}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      onClose={(_, reason) => {
        if (reason !== "clickaway") handleDismiss();
      }}
    >
      <Alert
        severity="info"
        action={
          <Stack direction="row" spacing={1}>
            <Button color="inherit" size="small" onClick={handleEnable}>
              Enable
            </Button>
            <Button color="inherit" size="small" onClick={handleDismiss}>
              Dismiss
            </Button>
          </Stack>
        }
      >
        <AlertTitle>Stay Updated!</AlertTitle>
        Enable notifications to receive real‑time updates.
      </Alert>
    </Snackbar>
  );
}
