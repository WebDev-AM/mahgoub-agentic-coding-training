import { OrderDetails } from "../../../types/OrderSchema";
import OrderCard from "./OrderCard";
import { Divider } from "@mui/material";

function OrdersWrapper({
  orders,
  completedOrder = false,
}: {
  orders: OrderDetails[];
  completedOrder?: boolean;
}) {
  return (
    <div className="flex flex-col gap-6">
      {orders.map((order, i) => (
        <div key={order.orderNumber}>
          <OrderCard order={order} completedOrder={completedOrder} />
          {i < orders.length - 1 && <Divider />}
        </div>
      ))}
    </div>
  );
}

export default OrdersWrapper;
