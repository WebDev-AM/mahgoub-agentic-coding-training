import { t } from "i18next";
import { statusMap } from "../utils/statusUtils";

type StatusCardProps = { status: string; className?: string };
function StatusCard({ status, className = "" }: StatusCardProps) {
  const { value = "unknown", color = "#6b7280" } = statusMap[status] ?? {};
  const backgroundColor = color + "20";

  return (
    <div
      style={{ backgroundColor, color }}
      className={`${className} grid h-10 w-full min-w-fit place-content-center rounded-xl px-5 text-[16px]`}
    >
      {t(value)}
    </div>
  );
}

export default StatusCard;
