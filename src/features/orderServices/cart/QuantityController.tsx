type QuantityControllerProps = {
  value: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void; // new handler
  disabled?: boolean;
};

function QuantityController({
  value,
  onIncrease,
  onDecrease,
  onRemove,
  disabled,
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
      </div>

      <button
        className="bg-light-gray flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-lg disabled:text-gray-400"
        onClick={(e) => {
          e.stopPropagation();
          onIncrease();
        }}
        disabled={disabled}
      >
        +
      </button>
    </div>
  );
}

export default QuantityController;
