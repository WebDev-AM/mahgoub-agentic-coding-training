import "./index.css";
import "./i18n";
import "react-toastify/dist/ReactToastify.css";

import React from "react";
import ReactDOM from "react-dom/client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";
import { StyledEngineProvider } from "@mui/material";

import App from "./App.tsx";
import WhatsAppWidget from "./ui/WhatsAppWidget.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    </StyledEngineProvider>
    <ToastContainer position="top-center" />
    <WhatsAppWidget />
  </React.StrictMode>
);
