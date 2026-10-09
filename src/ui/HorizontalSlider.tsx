import { ReactNode, useRef } from "react";
import { motion } from "framer-motion";
import { IoChevronBack } from "react-icons/io5";
import { IoChevronForward } from "react-icons/io5";

interface SliderProps {
  items: ReactNode[];
  scrollAmount?: number; // pixels to scroll on button click
  className?: string; // custom wrapper class
  itemClassName?: string; // class for individual items
}

export function HorizontalSlider({
  items,
  scrollAmount = 120,
  className = "",
  itemClassName = "rounded-lg bg-primary px-2 py-1 text-sm font-medium text-white",
}: SliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      {/* Left Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          scrollLeft();
        }}
        className="absolute left-0 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-white shadow-md"
      >
        <IoChevronBack />
      </button>

      {/* Slider */}
      <div
        ref={sliderRef}
        className="no-scrollbar mx-6 flex cursor-auto gap-3 overflow-x-auto overflow-y-hidden py-2 whitespace-nowrap"
        onClick={(e) => e.stopPropagation()}
      >
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.4 }}
            className={itemClassName}
          >
            {item}
          </motion.div>
        ))}
      </div>

      {/* Right Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          scrollRight();
        }}
        className="absolute right-0 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-white shadow-md"
      >
        <IoChevronForward />
      </button>
    </div>
  );
}
