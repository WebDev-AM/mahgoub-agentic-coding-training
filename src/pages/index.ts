import { lazy } from "react";

export { default as PageNotFound } from "./PageNotFound";
export { default as Home } from "./Home";

export const Chalet = lazy(() => import("./Chalet"));
export const Hotel = lazy(() => import("./Hotel"));
export const HotelRooms = lazy(() => import("./HotelRooms"));
export const Units = lazy(() => import("./Units"));
export const ServiceTypes = lazy(() => import("./ServiceTypes"));
export const Services = lazy(() => import("./Services"));
export const Products = lazy(() => import("./Products"));
export const Product = lazy(() => import("./Product"));
export const OrderCart = lazy(() => import("./OrderCart"));
export const OrderCheckout = lazy(() => import("./OrderCheckout"));
export const Profile = lazy(() => import("./Profile"));
export const ChaletReservation = lazy(() => import("./ChaletReservation"));
export const HotelReservation = lazy(() => import("./HotelReservation"));
export const FailedReservation = lazy(() => import("./FailedReservation"));
export const EditChaletReservation = lazy(
  () => import("./EditChaletReservation")
);
export const ChaletBooking = lazy(() => import("./ChaletBooking"));
export const HotelBooking = lazy(() => import("./HotelBooking"));
export const ComingSoon = lazy(() => import("./ComingSoon"));
export const ContactUs = lazy(() => import("./ContactUs"));
