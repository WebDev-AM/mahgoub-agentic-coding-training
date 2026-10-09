import { ReactNode } from "react";

function BookingSectionCard({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-gray-100 bg-white p-5 shadow-sm ${className}`}
    >
      <h3 className="text-base font-semibold text-gray-800">{title}</h3>
      <div className="mt-4 flex flex-col gap-2">{children}</div>
    </div>
  );
}

export default BookingSectionCard;
