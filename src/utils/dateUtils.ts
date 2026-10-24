import dayjs, { Dayjs } from "dayjs";
import i18n from "../i18n";

export function formatDate(date: string | Date | Dayjs | null) {
  return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
}

export function fromUTCToLocal(
  dateInput: string | number | Date | null | undefined
): string {
  if (!dateInput) return "";

  if (dateInput instanceof Date) {
    return dateInput.toString();
  }

  let normalized = String(dateInput);

  normalized = normalized.replace(/\.\d+/, "");

  // Ensure UTC suffix exists
  if (!normalized.endsWith("Z")) {
    normalized += "Z";
  }
  const date = new Date(normalized);

  if (isNaN(date.getTime())) {
    throw new Error(`Invalid UTC input: ${dateInput}`);
  }

  return date.toString();
}

export function daysFormatDate(
  date: string | Date | Dayjs,
  locale: "ar" | "en" = (i18n.language as "ar" | "en") || "en"
): string {
  // Formats the given date as: Wed, Nov 06, 2025
  return dayjs(date).locale(locale).format("ddd, MMM DD, YYYY");
}

export function subtractOneDay(date: string) {
  if (!date) return "";
  const d = new Date(date);
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

export function addOneDay(date: string) {
  if (!date) return "";
  const d = new Date(date);
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}
