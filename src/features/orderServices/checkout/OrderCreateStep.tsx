import { useForm } from "react-hook-form";
import useCreateOrder from "./useCreateOrder";
import { useMe } from "../../authentication/useMe";
import {
  CreateOrderSchema,
  CreateOrderSchemaType,
} from "../../../types/OrderSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import PageSpinner from "../../../ui/PageSpinner";
import { Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import FormRow from "../../../ui/FormRow";
import { TextField } from "@mui/material";
import { t } from "i18next";
import OrderSummary from "../cart/OrderSummary";
import SelectCity from "../../address/SelectCity";

function OrderCreateStep() {
  const { createOrder, isCreating } = useCreateOrder();
  const { user, isLoading } = useMe();
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateOrderSchemaType>({
    resolver: zodResolver(CreateOrderSchema),
    mode: "onChange",
  });
  const onSubmit = (data: CreateOrderSchemaType) => {
    createOrder(data, {
      onSuccess: (data) => navigate(`/order-checkout/2/${data.orderNumber}`),
    });
  };

  if (isLoading) return <PageSpinner />;
  if (!user) return <Navigate to={"/order-checkout/0"} />;
  return (
    <form
      className="flex flex-1 flex-col items-center justify-center gap-20 md:flex-row md:items-start"
      onSubmit={handleSubmit(onSubmit)}
    >
      <motion.div
        className="flex-1 p-2 text-center md:text-start"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
      >
        <FormRow>
          <TextField
            size="small"
            label={t("Address")}
            placeholder={t("Address")}
            {...register("deliveryAddress")}
            error={!!errors.deliveryAddress}
            helperText={t(errors.deliveryAddress?.message || "")}
            fullWidth
            slotProps={{ input: { className: "bg-white" } }}
          />
          <SelectCity
            variant="outlined"
            onSelect={(id) =>
              setValue("deliveryZone", id, { shouldValidate: true })
            }
            value={watch("deliveryZone") || undefined}
            error={!!errors.deliveryZone}
            helperText={t(errors.deliveryZone?.message || "")}
          />
        </FormRow>
        <FormRow>
          <TextField
            size="small"
            label={t("Note")}
            placeholder={t("Note")}
            {...register("customerInstructions")}
            error={!!errors.customerInstructions}
            helperText={t(errors.customerInstructions?.message || "")}
            className="flex-1"
            slotProps={{ input: { className: "bg-white" } }}
          />
        </FormRow>
      </motion.div>

      <OrderSummary>
        <button
          type="submit"
          disabled={isCreating}
          className="bg-primary hover:bg-primary-shade flex h-12 w-full cursor-pointer items-center justify-center text-lg font-semibold text-white transition hover:shadow-2xl"
        >
          {t("Next")}
        </button>
      </OrderSummary>
    </form>
  );
}

export default OrderCreateStep;
