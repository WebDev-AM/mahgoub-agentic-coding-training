// hooks/useMessagesOrders.ts
import { useMemo } from "react";
import { useOrdersMap } from "../orderServices/orderHistory/useOrdersMap";
import { ChatMessage } from "./useChat";
import { OrderDetails } from "../../types/OrderSchema";

export interface UseMessagesOrdersResult {
  ordersMap: Record<string, OrderDetails> | undefined;
  isLoadingOrders: boolean;
  orderNumbers: string[];
}

export default function useMessagesOrders(
  messages: ChatMessage[]
): UseMessagesOrdersResult {
  // Extract all order numbers from order messages
  const orderNumbers = useMemo(() => {
    const numbers = messages
      .filter((msg) => msg.type === "order" && msg.attachment)
      .map((msg) => msg.attachment as string);

    // Remove duplicates
    return Array.from(new Set(numbers));
  }, [messages]);

  // Fetch order data using the custom hook
  const { orders: ordersMap, isLoading: isLoadingOrders } = useOrdersMap({
    orderNumbers,
  });

  return {
    ordersMap,
    isLoadingOrders,
    orderNumbers,
  };
}
