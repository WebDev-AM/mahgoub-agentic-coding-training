import { z } from "zod";
import { UserDetails } from "./AuthSchema";

export interface CartProduct {
  productId: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  price: number;
  logoImage: string;
  categoryNameEn: string;
  categoryNameAr: string;

  service: {
    serviceId: string;
    nameEn: string;
    nameAr: string;
    descriptionEn: string;
    descriptionAr: string;
    textureEn: string;
    textureAr: string;
    openTime: string;
    closeTime: string;
    type: string;
    logoImage: string;
    country: string;
    city: string;
    address: string;
    contact: string;
  };
}
export interface CartItem {
  itemId: string;
  productId: string;
  quantity: number;
  status: string;
  userId: string;
  price: number;
  orderId: string | null;
  cartId: string;
  product: CartProduct;
}
export interface LocalCartItem {
  product: CartProduct;
  quantity: number;
  itemId: string;
  price: number;
}

export type Cart = CartItem[];

export type UnifiedCartItem = CartItem | LocalCartItem;
export type UnifiedCart = UnifiedCartItem[];

export const CreateOrderSchema = z.object({
  deliveryAddress: z
    .string()
    .min(5, "Delivery address must be at least 5 characters long"),
  customerInstructions: z.string().optional(),
  deliveryZone: z
    .string({ required_error: "City is required" })
    .min(1, "Delivery zone is required"),
});

export type CreateOrderSchemaType = z.infer<typeof CreateOrderSchema>;

export const PayOrderSchema = z.object({
  orderNumber: z.string().min(1, "Order number is required"),
  paymentMethod: z.number({
    required_error: "Please select a payment method",
  }),
  language: z.string().min(1, "Language is required"),
});

export type PayOrderSchemaType = z.infer<typeof PayOrderSchema>;

export type DeliveryZone = {
  id: number;
  zoneName: string;
  fee: number;
};

// ==========================
// Order Root
// ==========================
export type Order = {
  currency: "KWD";
  orderNumber: string;
  orderStatus:
    | "CONFIRMED"
    | "PAID"
    | "PREPARING"
    | "IN_DELIVERY"
    | "DELIVERED"
    | "CANCELLED"
    | "PENDING";
  promocodeId: string | null;
  serviceOrderIds: string[];
  taxAmount: number;
  totalAmount: number;
  totalDeliveryFee: number;
  totalDiscount: number;
  zakatAmount: number;
  vatAmount: number;
  totalSubtotal: number;
  userId: string;
};

export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "CANCELLED"
  | "DELIVERED"
  | "PREPARING"
  | "COMPLETED"
  | "IN_PROGRESS"
  | "CONFIRMED"
  | "IN_DELIVERY";

export interface OrderDetails {
  orderNumber: string;
  userId: string;
  serviceOrderIds: string[];
  totalSubtotal: number;
  taxAmount: number;
  zakatAmount: number;
  vatAmount: number;
  totalAmount: number;
  totalDeliveryFee: number;
  totalDiscount: number;
  orderStatus: OrderStatus;
  promocodeId: string | null;
  currency: string;
  createdAt: string;
  serviceOrderDTOS: ServiceOrderDetails[];
}

// ==========================
// Service Order
// ==========================
export interface ServiceOrderDetails {
  serviceOrderId: string;
  serviceId: string;
  service: Service;
  userId: string;
  orderNumber: string;
  items: OrderItem[];
  itemIds: string[];
  userDetails: UserDetails;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  total: number;
  status: OrderStatus;
  deliveryAddress: string;
  customerInstructions: string;
  currency: string;
  trackingId: string;
  promoCodeApplied: string | null;
  gift: boolean;
}

// ==========================
// Order Item
// ==========================
export interface OrderItem {
  itemId: string;
  productId: string;
  quantity: number;
  status: "SUCCESS" | "FAILED";
  userId: string;
  price: number;
  orderId: string | null;
  cartId: string | null;
  product: Product;
}

// ==========================
// Product
// ==========================
export interface Product {
  productId: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  price: number;
  logoImage: string;
  categoryNameEn: string;
  categoryNameAr: string;
}

// ==========================
// Full Service Entity
// ==========================
export interface Service {
  serviceId: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  providerId: string;
  textureEn: string;
  textureAr: string;
  openTime: string;
  closeTime: string;
  typeId: number;
  type: string;
  backgroundImage: string;
  logoImage: string;
  createdAt: string;
  updatedAt: string;
  approvedBy: string;
  approvedAt: string;
  active: boolean;
  commission: number;
  commissionType: "PERCENTAGE" | "FIXED";
  country: string;
  city: string;
  address: string;
  contact: string;
  longitude: string;
  latitude: string;
  isDeleted: boolean;
  deletedAt: string | null;
  deletedBy: string | null;
  provider: unknown;
  deliveryFee: number;
  freeDeliveryAmount: number;
  approved: boolean;
}
