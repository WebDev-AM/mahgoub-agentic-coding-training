import { useState } from "react";
import CartReview from "../features/orderServices/cart/CartReview";
import BackArrow from "../ui/BackArrow";
import SectionsSwitcher, { SectionOption } from "../ui/SectionsSwitcher";
import OngoingOrders from "../features/orderServices/orderHistory/OngoingOrders";
import CompletedOrders from "../features/orderServices/orderHistory/CompletedOrders";
import { useMe } from "../features/authentication/useMe";
import PageSpinner from "../ui/PageSpinner";

const sections: SectionOption<number>[] = [
  {
    labelKey: "Cart",
    value: 0,
  },
  {
    labelKey: "Ongoing",
    value: 1,
  },
  {
    labelKey: "History",
    value: 2,
  },
];

function OrderCart() {
  const [renderSection, setRenderSection] = useState(0);
  const { user, isLoading } = useMe();
  if (isLoading) return <PageSpinner />;
  return (
    <div className="container-fix container flex flex-col gap-10 py-10">
      {user && (
        <div className="items-center justify-center space-y-5 lg:grid lg:grid-cols-[1fr_auto_1fr]">
          <BackArrow label="Your Cart" />
          <SectionsSwitcher
            renderSection={renderSection}
            setRenderSection={setRenderSection}
            sections={sections}
            key={"cart-switcher"}
          />
        </div>
      )}
      {renderSection === 0 && <CartReview />}
      {renderSection === 1 && <OngoingOrders />}
      {renderSection === 2 && <CompletedOrders />}
    </div>
  );
}

export default OrderCart;
