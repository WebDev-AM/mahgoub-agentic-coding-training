import { useEffect, useRef } from "react";
import useChat from "./useChat";
import { Timestamp } from "firebase/firestore";
import PageSpinner from "../../ui/PageSpinner";
import { useMe } from "../authentication/useMe";
import TextMessage from "./TextMessage";
import OrderMessage from "./OrderMessage";
import useMessagesOrders from "./useMessagesOrders";
import useMessagesReservations from "./useMessagesReservations";
import ChaletReservationMessage from "./ChaletReservationMessage";
import HotelReservationMessage from "./HotelReservationMessage";
import { HotelReservation } from "../../types/reservation/HotelResevationSchema";
import { ChaletReservation } from "../../types/reservation/ChaletReservationSchema";

const isHotelReservation = (
  reservation: ChaletReservation | HotelReservation
): reservation is HotelReservation =>
  reservation.entityType === "HOTEL" || "hotel" in reservation;

export default function Messages() {
  const { user } = useMe();
  const endRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { isLoading: isLoadingMessages, messages } = useChat(user!.id);

  // Use the new hook to get order data
  const { ordersMap, isLoadingOrders } = useMessagesOrders(messages);
  const { reservationsMap, isLoadingReservations } =
    useMessagesReservations(messages);

  useEffect(() => {
    // Scroll to bottom
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  // Combine loading states for initial message loading
  const isOverallLoading = isLoadingMessages;

  return (
    <div
      ref={containerRef}
      className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 flex flex-col gap-4 overflow-y-auto px-6 py-4"
    >
      {isOverallLoading && <PageSpinner />}

      {!isOverallLoading &&
        messages.map((message) => {
          // Determine if message is an order message
          const isOrderMessage = message.type === "order" && message.attachment;
          const isReservationMessage =
            message.type === "reservation" && message.attachment;

          if (isOrderMessage) {
            return (
              <OrderMessage
                key={
                  message.timestamp?.toString() || Timestamp.now().toString()
                }
                orderData={ordersMap?.[message.attachment as string]}
                own={message.sender === user?.id}
                isLoading={isLoadingOrders}
              />
            );
          }

          if (isReservationMessage) {
            const reservation = reservationsMap?.[message.attachment as string];
            const isHotel = reservation && isHotelReservation(reservation);

            return (
              <div
                key={
                  message.timestamp?.toString() || Timestamp.now().toString()
                }
              >
                {isHotel ? (
                  <HotelReservationMessage
                    reservationData={reservation}
                    own={message.sender === user?.id}
                    isLoading={isLoadingReservations}
                  />
                ) : (
                  <ChaletReservationMessage
                    reservationData={reservation}
                    own={message.sender === user?.id}
                    isLoading={isLoadingReservations}
                  />
                )}
              </div>
            );
          }

          // Otherwise render text message
          return (
            <TextMessage
              key={message.timestamp?.toString() || Timestamp.now().toString()}
              message={message}
              own={message.sender === user?.id}
            />
          );
        })}
      <div ref={endRef}></div>
    </div>
  );
}
