interface HeadingTextProps {
  children: React.ReactNode;
  className?: string;
}

import { motion } from "framer-motion";

function HeadingText({ children, className = "" }: HeadingTextProps) {
  return (
    <motion.div
      className={`lg:mb-inside-spacing-y container-fix relative container mb-3 flex items-center justify-center ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.7 }}
    >
      <div className="text-center text-base font-semibold sm:text-lg md:text-2xl lg:text-3xl xl:text-4xl">
        {children}
      </div>
    </motion.div>
  );
}

export default HeadingText;
