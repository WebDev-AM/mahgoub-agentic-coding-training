import { ThemeProvider } from "@mui/material";
import { CacheProvider } from "@emotion/react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import {
  ContactUs,
  Chalet,
  ChaletBooking,
  ChaletReservation,
  ComingSoon,
  EditChaletReservation,
  FailedReservation,
  Home,
  HotelBooking,
  HotelReservation,
  HotelRooms,
  OrderCart,
  OrderCheckout,
  PageNotFound,
  Product,
  Products,
  Profile,
  Services,
  ServiceTypes,
  Units,
} from "./pages";

import useLanguage from "./hooks/useLanguage";
import AppLayout from "./ui/layout/AppLayout";
import { ChaletCartProvider } from "./contexts/ChaletCartContext";
import { queryClient } from "./services/reactQueryClient";
import ScrollToTop from "./ui/ScrollToTop";
import Hotel from "./pages/Hotel";
import { HotelCartProvider } from "./contexts/HotelCartContext";
import { useTranslation } from "react-i18next";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ProtectedRoute from "./ui/ProtectedRoute.tsx";

function App() {
  const { theme, cache } = useLanguage();
  const { i18n } = useTranslation();
  const adapterLocale = i18n.language === "ar" ? "ar" : "en";

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale={adapterLocale}
    >
      <CacheProvider value={cache}>
        <ThemeProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false} />
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                <Route
                  element={
                    <ChaletCartProvider>
                      <HotelCartProvider>
                        <AppLayout />
                      </HotelCartProvider>
                    </ChaletCartProvider>
                  }
                >
                  <Route index element={<Navigate replace to="/home" />} />
                  <Route path="home" element={<Home />} />
                  <Route path="contact-us" element={<ContactUs />} />
                  <Route path="units" element={<Units />} />
                  <Route path="services" element={<ServiceTypes />} />
                  <Route
                    path="services/:serviceTypeId"
                    element={<Services />}
                  />
                  <Route
                    path="services/:serviceTypeId/:serviceId/products"
                    element={<Products />}
                  />
                  <Route
                    path="services/:serviceTypeId/:serviceId/products/:categoryKey/:productId"
                    element={<Product />}
                  />
                  <Route path="chalet/:id" element={<Chalet />} />

                  <Route element={<ProtectedRoute />}>
                    <Route path="profile" element={<Profile />} />
                    <Route
                      path="reservation/chalet/:id/:status?"
                      element={<ChaletReservation />}
                    />
                    <Route
                      path="reservation/chalet/update/:id"
                      element={<EditChaletReservation />}
                    />
                    <Route
                      path="reservation/hotel/:id/:status?"
                      element={<HotelReservation />}
                    />
                    <Route
                      path="reservation/payment-fail"
                      element={<FailedReservation />}
                    />
                  </Route>

                  <Route path="hotel/:hotelId" element={<Hotel />} />
                  <Route
                    path="hotel/:hotelUuid/rooms"
                    element={<HotelRooms />}
                  />

                  <Route path="order-cart" element={<OrderCart />} />
                  <Route
                    path="order-checkout/:step/:passedValue?"
                    element={<OrderCheckout />}
                  />
                  <Route
                    path="booking/chalet/:step"
                    element={<ChaletBooking />}
                  />
                  <Route
                    path="booking/hotel/:step"
                    element={<HotelBooking />}
                  />
                  <Route path="coming-soon" element={<ComingSoon />} />
                </Route>
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </BrowserRouter>
          </QueryClientProvider>
        </ThemeProvider>
      </CacheProvider>
    </LocalizationProvider>
  );
}

export default App;
