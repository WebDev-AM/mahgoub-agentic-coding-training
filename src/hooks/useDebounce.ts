import { useRef } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useFunctionDebounce<T extends (...args: any[]) => void>(
  callback: T,
  delay = 1000
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return (...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args); // Execute with passed arguments
    }, delay);
  };
}
