import { CircularProgress } from "@mui/material";

export default function PageSpinner({ className }: { className?: string }) {
  return (
    <div className={`grid h-full place-content-center ${className}`}>
      <CircularProgress size={40} />
    </div>
  );
}
