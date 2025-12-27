import { motion } from "motion/react";

interface PlayButtonProps {
  onClick: () => void;
  delay?: number;
}

export function PlayButton({ onClick, delay = 0 }: PlayButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className="w-20 h-20 rounded-full bg-white/90 backdrop-blur-sm shadow-2xl shadow-red-900/50 flex items-center justify-center cursor-pointer border-4 border-white/50 touch-manipulation select-none"
      style={{ WebkitTapHighlightColor: "transparent" }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay,
      }}
      whileHover={{
        scale: 1.15,
        boxShadow: "0 0 40px rgba(255, 255, 255, 0.5), 0 25px 50px -12px rgba(127, 29, 29, 0.6)",
      }}
      whileTap={{
        scale: 0.85,
        backgroundColor: "rgba(220, 38, 38, 0.15)",
        boxShadow: "0 0 60px rgba(255, 255, 255, 0.7), 0 0 20px rgba(220, 38, 38, 0.5)",
      }}
    >
      <motion.svg
        className="w-8 h-8 text-red-600 ml-1"
        fill="currentColor"
        viewBox="0 0 24 24"
        initial={{ scale: 1 }}
        whileTap={{ scale: 0.75, fill: "#b91c1c" }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <path d="M8 5v14l11-7z" />
      </motion.svg>
    </motion.button>
  );
}

