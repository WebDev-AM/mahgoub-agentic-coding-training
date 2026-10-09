// hooks/useMessagesReservations.ts
import { useMemo } from "react";
import { ChatMessage } from "./useChat";
import { useReservationsMap } from "../reservation/useReservationsMap";
import { ChaletReservation } from "../../types/reservation/ChaletReservationSchema";
import { HotelReservation } from "../../types/reservation/HotelResevationSchema";

export interface UseMessagesReservationsResult {
  reservationsMap:
    | Record<string, ChaletReservation | HotelReservation>
    | undefined;
  isLoadingReservations: boolean;
  reservationIds: string[];
}

export default function useMessagesReservations(
  messages: ChatMessage[]
): UseMessagesReservationsResult {
  // Extract all order numbers from order messages
  const reservationIds = useMemo(() => {
    const numbers = messages
      .filter((msg) => msg.type === "reservation" && msg.attachment)
      .map((msg) => msg.attachment as string);

    // Remove duplicates
    return Array.from(new Set(numbers));
  }, [messages]);

  // Fetch order data using the custom hook
  const { reservations: reservationsMap, isLoading: isLoadingReservations } =
    useReservationsMap({
      reservationIds,
    });

  return {
    reservationsMap,
    isLoadingReservations,
    reservationIds,
  };
}
