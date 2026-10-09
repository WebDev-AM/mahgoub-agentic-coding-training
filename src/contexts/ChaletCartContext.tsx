import { createContext, useContext, useState, ReactNode } from "react";
import { Chalet } from "../types/ChaletSchema";

// --------------------
// Type Definitions
// --------------------

type ChaletInfo = {
  chalet: Chalet;
  startDate: string;
  endDate: string;
  guests?: number;
};

type ChaletCartContextType = {
  cartItem: ChaletInfo | null;
  setCartItem: (item: ChaletInfo) => void;
  clearCart: () => void;
};

// --------------------
// Create Context
// --------------------

const CartContext = createContext<ChaletCartContextType | undefined>(undefined);

// --------------------
// Cart Provider
// --------------------

export const ChaletCartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItem, setCartItemState] = useState<ChaletInfo | null>(null);

  const setCartItem = (item: ChaletInfo) => {
    setCartItemState(item);
  };

  const clearCart = () => {
    setCartItemState(null);
  };

  return (
    <CartContext.Provider value={{ cartItem, setCartItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// --------------------
// useCart Hook
// --------------------

// eslint-disable-next-line react-refresh/only-export-components
export const useChaletCartContext = (): ChaletCartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a ChaletCartProvider");
  }
  return context;
};
