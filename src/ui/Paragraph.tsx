import { motion } from "framer-motion";

interface ParagraphProps {
  children: React.ReactNode;
  className?: string;
}

function Paragraph({ children, className = "" }: ParagraphProps) {
  return (
    <motion.p
      className={`text-center text-sm font-medium md:text-2xl ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.7 }}
    >
      {children}
    </motion.p>
  );
}

export default Paragraph;
