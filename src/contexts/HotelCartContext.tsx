import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { Hotel, RoomGroup } from "../types/HotelSchema";
import { HotelReservationUnit } from "../types/reservation/HotelResevationSchema";

// ----------------------
// TYPES
// ----------------------
export type HotelCartItem = {
  hotel: Hotel | null;
  selectedRooms: HotelReservationUnit[];

  checkIn?: string;
  checkOut?: string;

  numberOfNights: number;
  numberOfGuests?: number;
};

type HotelCartContextType = {
  cartItem: HotelCartItem | null;

  setHotel: (
    hotel: Hotel,
    data?: {
      checkIn?: string;
      checkOut?: string;
      numberOfGuests?: number;
    }
  ) => void;

  addRoom: (room: RoomGroup) => void;
  increaseRoom: (roomId: number) => void;
  decreaseRoom: (roomId: number) => void;
  removeRoom: (roomId: number) => void;
  clearRooms: () => void;
  clearCart: () => void;
};

// ----------------------
// CONTEXT
// ----------------------
const HotelCartContext = createContext<HotelCartContextType | undefined>(
  undefined
);

// ----------------------
// HELPERS
// ----------------------
const calculateNights = (checkIn?: string, checkOut?: string) => {
  if (!checkIn || !checkOut) return 0;

  const start = new Date(checkIn + "T00:00:00").getTime();
  const end = new Date(checkOut + "T00:00:00").getTime();

  const diff = end - start;
  return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;
};

// 🔥 SINGLE SOURCE OF TRUTH FOR CALCULATIONS
const calculateRoomTotals = (
  room: RoomGroup,
  count: number,
  nights: number
): HotelReservationUnit => {
  const price = room.pricingDetails.dailyPrice;
  const insurance = room.pricingDetails.insurancePrice;

  const totalSubtotal = price * count * nights;
  const totalInsurance = insurance * count;

  const totalCost = totalSubtotal + totalInsurance;

  return {
    unitType: room,
    count,
    totalSubtotal,
    totalInsurance,
    totalCommission: 0,
    totalPromotedCommission: 0,
    totalFee: 0,
    totalCost,
  };
};

// ----------------------
// PROVIDER
// ----------------------
export const HotelCartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItem, setCartItem] = useState<HotelCartItem | null>(null);

  // ----------------------
  // SET HOTEL (recalculates everything)
  // ----------------------
  const setHotel = useCallback(
    (
      hotel: Hotel,
      data?: {
        checkIn?: string;
        checkOut?: string;
        numberOfGuests?: number;
      }
    ) => {
      const numberOfNights = calculateNights(data?.checkIn, data?.checkOut);

      setCartItem((prev) => {
        return {
          hotel,
          selectedRooms: [],
          checkIn: data?.checkIn ?? prev?.checkIn,
          checkOut: data?.checkOut ?? prev?.checkOut,
          numberOfNights,
          numberOfGuests: data?.numberOfGuests ?? prev?.numberOfGuests,
        };
      });
    },
    []
  );

  // ----------------------
  // ADD ROOM
  // ----------------------
  const addRoom = useCallback((room: RoomGroup) => {
    setCartItem((prev) => {
      const nights = prev?.numberOfNights ?? 0;

      if (!prev) {
        return {
          hotel: null,
          selectedRooms: [calculateRoomTotals(room, 1, nights)],
          checkIn: undefined,
          checkOut: undefined,
          numberOfNights: 0,
          numberOfGuests: undefined,
        };
      }

      const existing = prev.selectedRooms.find(
        (r) => r.unitType.id === room.id
      );

      let updated: HotelReservationUnit[];

      if (existing) {
        updated = prev.selectedRooms.map((item) =>
          item.unitType.id === room.id
            ? calculateRoomTotals(room, item.count + 1, prev.numberOfNights)
            : item
        );
      } else {
        updated = [
          ...prev.selectedRooms,
          calculateRoomTotals(room, 1, prev.numberOfNights),
        ];
      }

      return { ...prev, selectedRooms: updated };
    });
  }, []);

  // ----------------------
  // INCREASE ROOM
  // ----------------------
  const increaseRoom = useCallback((roomId: number) => {
    setCartItem((prev) => {
      if (!prev) return prev;

      const updated = prev.selectedRooms.map((item) =>
        item.unitType.id === roomId
          ? calculateRoomTotals(
              item.unitType,
              item.count + 1,
              prev.numberOfNights
            )
          : item
      );

      return { ...prev, selectedRooms: updated };
    });
  }, []);

  // ----------------------
  // DECREASE ROOM
  // ----------------------
  const decreaseRoom = useCallback((roomId: number) => {
    setCartItem((prev) => {
      if (!prev) return prev;

      const updated = prev.selectedRooms
        .map((item) =>
          item.unitType.id === roomId
            ? calculateRoomTotals(
                item.unitType,
                item.count - 1,
                prev.numberOfNights
              )
            : item
        )
        .filter((item) => item.count > 0);

      return { ...prev, selectedRooms: updated };
    });
  }, []);

  // ----------------------
  // REMOVE ROOM
  // ----------------------
  const removeRoom = useCallback((roomId: number) => {
    setCartItem((prev) => {
      if (!prev) return prev;

      const updated = prev.selectedRooms.filter(
        (item) => item.unitType.id !== roomId
      );

      return { ...prev, selectedRooms: updated };
    });
  }, []);

  // ----------------------
  // CLEAR ROOMS
  // ----------------------
  const clearRooms = useCallback(() => {
    setCartItem((prev) => {
      if (!prev) return prev;

      return { ...prev, selectedRooms: [] };
    });
  }, []);

  // ----------------------
  // CLEAR CART
  // ----------------------
  const clearCart = useCallback(() => {
    setCartItem(null);
  }, []);

  // ----------------------
  // MEMO
  // ----------------------
  const value = useMemo(
    () => ({
      cartItem,
      setHotel,
      addRoom,
      increaseRoom,
      decreaseRoom,
      removeRoom,
      clearRooms,
      clearCart,
    }),
    [
      cartItem,
      setHotel,
      addRoom,
      increaseRoom,
      decreaseRoom,
      removeRoom,
      clearRooms,
      clearCart,
    ]
  );

  return (
    <HotelCartContext.Provider value={value}>
      {children}
    </HotelCartContext.Provider>
  );
};

// ----------------------
// HOOK
// ----------------------
// eslint-disable-next-line react-refresh/only-export-components
export const useHotelCartContext = () => {
  const context = useContext(HotelCartContext);

  if (!context) {
    throw new Error(
      "useHotelCartContext must be used within HotelCartProvider"
    );
  }

  return context;
};
