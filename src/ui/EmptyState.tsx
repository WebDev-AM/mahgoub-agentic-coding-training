import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type EmptyStateActionDirection = "forward" | "backward";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  buttonText?: string;
  buttonPath?: string;
  buttonDirection?: EmptyStateActionDirection;
  onButtonClick?: () => void;
}

function EmptyState({
  icon,
  title,
  description,
  buttonText,
  buttonPath,
  buttonDirection = "forward",
  onButtonClick,
}: EmptyStateProps) {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
      return;
    }

    if (buttonDirection === "backward") {
      navigate(-1);
      return;
    }

    navigate(buttonPath ?? "/");
  };

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      {icon && (
        <div className="shadow-brand/10 text-primary flex h-25 w-25 items-center justify-center rounded-md bg-white text-4xl shadow-lg">
          {icon}
        </div>
      )}

      <div className="text-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && (
          <div className="max-w-100 text-sm text-gray-500">{description}</div>
        )}
      </div>

      {buttonText && (
        <button
          onClick={handleButtonClick}
          className="bg-primary hover:bg-primary-shade flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-lg font-semibold text-white transition hover:shadow-2xl"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
