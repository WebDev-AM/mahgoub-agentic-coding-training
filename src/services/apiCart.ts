import {
  Cart,
  CartItem,
  CartProduct,
  LocalCartItem,
} from "../types/OrderSchema";
import { loadLocalCart, saveLocalCart } from "../utils/localStorage";
import customFetch from "./customFetch";

const API_END_POINT_URL = "/api/products";
const isLoggedIn = () => Boolean(localStorage.getItem("accessToken"));

export async function getUserCartApi() {
  if (isLoggedIn()) {
    const { data } = await customFetch.get(
      `${API_END_POINT_URL}/cart-items/user`
    );
    const cartArray = data as Cart;

    const cartByProductId = cartArray.reduce<Record<string, CartItem>>(
      (acc, item) => {
        acc[item.productId] = item;
        return acc;
      },
      {}
    );

    return cartByProductId;
  } else {
    // ---- Local Storage Mode ----
    const localCart = loadLocalCart();

    if (localCart.length === 0) return {};
    const itemIds = localCart.map((i) => i.productId);
    const products = await getProductsByIdsApi(itemIds);

    // Merge product info + quantity
    const cartByProductId = products.reduce<Record<string, LocalCartItem>>(
      (acc, product) => {
        const matched = localCart.find(
          (i) => i.productId === product.productId
        );
        acc[product.productId] = {
          product: product,
          itemId: product.productId,
          price: product.price,
          quantity: matched?.quantity ?? 0,
        };
        return acc;
      },
      {}
    );

    return cartByProductId;
  }
}

export async function updateCartItemApi(itemId: string, quantity: number) {
  if (isLoggedIn()) {
    await customFetch.patch(
      `${API_END_POINT_URL}/cart-items/${itemId}/quantity`,
      { quantity }
    );
    return;
  }

  // Local Storage Mode
  const cart = loadLocalCart();
  const updated = cart.map((item) =>
    item.productId === itemId ? { ...item, quantity } : item
  );

  saveLocalCart(updated);
}

export async function deleteCartItemApi({
  itemId,
  userId,
}: {
  itemId: string;
  userId?: string;
}) {
  if (isLoggedIn() && userId) {
    await customFetch.delete(
      `${API_END_POINT_URL}/carts/user/${userId}/items`,
      {
        data: [itemId],
      }
    );
    return;
  }

  const cart = loadLocalCart();
  const updated = cart.filter((item) => item.productId !== itemId);
  saveLocalCart(updated);
}

export async function addItemsToCartApi(
  items: { productId: string; quantity: number }[]
) {
  if (isLoggedIn()) {
    await customFetch.post(`${API_END_POINT_URL}/carts/user/items`, items);
    return;
  }

  const cart = loadLocalCart();
  const newCart = [...cart];

  items.forEach((incoming) => {
    const existing = newCart.find((i) => i.productId === incoming.productId);
    if (existing) {
      existing.quantity += incoming.quantity;
    } else {
      newCart.push(incoming);
    }
  });

  saveLocalCart(newCart);
}

// Get products by ids
async function getProductsByIdsApi(ids: string[]) {
  const { data } = await customFetch.post(`${API_END_POINT_URL}/batch`, ids);
  return data as CartProduct[];
}
