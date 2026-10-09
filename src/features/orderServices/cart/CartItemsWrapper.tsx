import { UnifiedCart } from "../../../types/OrderSchema";
import CartItem from "./CartItem";

function CartItemsWrapper({ cart }: { cart: UnifiedCart }) {
  return (
    <div className="flex flex-1 flex-col gap-9">
      {cart.map((item) => (
        <CartItem cartItem={item} key={item.itemId} />
      ))}
    </div>
  );
}

export default CartItemsWrapper;
