const LS_KEY = "local_cart";

export function loadLocalCart(): { productId: string; quantity: number }[] {
  return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
}

export function saveLocalCart(cart: { productId: string; quantity: number }[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(cart));
}
