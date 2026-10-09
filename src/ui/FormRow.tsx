import { ReactNode } from "react";

function FormRow({
  children,
  lg = false,
}: {
  children: ReactNode;
  lg?: boolean;
}) {
  return (
    <div
      className={`mb-5 flex flex-col justify-between gap-5 lg:mb-0 ${lg ? "lg:min-h-28" : "lg:min-h-18"} lg:flex-row`}
    >
      {children}
    </div>
  );
}

export default FormRow;
