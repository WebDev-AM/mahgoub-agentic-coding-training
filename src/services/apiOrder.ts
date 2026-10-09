import {
  CreateOrderSchemaType,
  DeliveryZone,
  Order,
  OrderDetails,
  PayOrderSchemaType,
} from "../types/OrderSchema";
import customFetch from "./customFetch";

const API_END_POINT_URL = "/api/products";

// create order
export async function CreateOrderApi(order: CreateOrderSchemaType) {
  const { data } = await customFetch.post(
    `${API_END_POINT_URL}/carts/order`,
    order
  );

  return data as Order;
}

export async function PayOrderApi(order: PayOrderSchemaType) {
  const {
    data: { url },
  } = await customFetch.post(`${API_END_POINT_URL}/payment/pay`, order);

  window.location.href = url; //  Automatically open the payment URL
}

// Get Order by order number
export async function getOrderByOrderNumberApi(orderNumber: string) {
  const { data } = await customFetch.get(`/api/payments/orders/${orderNumber}`);
  return data as Order;
}

// Get Single Order
export async function getOrderDetailsApi(orderNumber: string) {
  const { data } = await customFetch.get(
    `${API_END_POINT_URL}/orders/${orderNumber}`
  );
  return data as OrderDetails;
}

export async function getMyOrders(queryObject: {
  [key: string]: string | number | boolean | undefined;
}) {
  const { data } = await customFetch.get(
    `${API_END_POINT_URL}/orders/my-orders`,
    {
      params: queryObject,
    }
  );
  return data as {
    content: OrderDetails[];
    totalPages: number;
    totalElements: number;
    pageable: { pageNumber: number };
  };
}

export async function getOrdersMap(orderNumbers: string[]) {
  const { data } = await customFetch.post(
    `${API_END_POINT_URL}/orders/details-map`,
    {
      orderNumbers,
    }
  );
  return data as Record<string, OrderDetails>;
}

export async function getMyOngoingOrders(queryObject: {
  [key: string]: string | number | boolean | undefined;
}) {
  const { data } = await customFetch.get(
    `${API_END_POINT_URL}/orders/ongoing`,
    {
      params: queryObject,
    }
  );
  return data as {
    content: OrderDetails[];
    totalPages: number;
    totalElements: number;
    pageable: { pageNumber: number };
  };
}

// Get All Delivery Zones
export async function getAllDeliveryZonesApi() {
  const { data } = await customFetch.get(`${API_END_POINT_URL}/delivery-zones`);
  return data as DeliveryZone[];
}
