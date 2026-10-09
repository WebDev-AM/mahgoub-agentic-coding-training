type QuantityControllerProps = {
  value: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void; // new handler
  disabled?: boolean;
  label?: string;
  max?: number;
};

function QuantityController({
  value,
  onIncrease,
  onDecrease,
  onRemove,
  disabled,
  label,
  max,
}: QuantityControllerProps) {
  const handleDecrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (value === 1) {
      onRemove(); // remove item when quantity is 1
    } else {
      onDecrease();
    }
  };

  return (
    <div className="mt-2 flex items-center gap-2">
      <button
        className="bg-light-gray flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-lg disabled:text-gray-400"
        onClick={handleDecrease}
        disabled={disabled}
      >
        −
      </button>

      <div className="bg-light-gray flex h-8 w-16 items-center justify-center rounded-md text-gray-900">
        {value}
        {label && (
          <span className="ms-1 text-sm font-bold text-gray-600">{label}</span>
        )}
      </div>

      <button
        className="bg-light-gray flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-lg disabled:text-gray-400"
        onClick={(e) => {
          e.stopPropagation();
          if (!max || value < max) {
            onIncrease();
          }
        }}
        disabled={disabled || (max !== undefined && value >= max)}
      >
        +
      </button>
    </div>
  );
}

export default QuantityController;
