type BulletsProps = {
  totalPages: number;
  currentPage: number; // 0-indexed
};

function Bullets({ totalPages, currentPage }: BulletsProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: totalPages }).map((_, index) => {
        const isActive = index === currentPage;

        return (
          <span
            key={index}
            className={`h-3 w-3 rounded-full transition-all ${
              isActive ? "scale-110 bg-black" : "bg-gray-400"
            }`}
          />
        );
      })}
    </div>
  );
}

export default Bullets;
