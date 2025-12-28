import { motion } from "motion/react";

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const words = [
    "Nous",
    "allons",
    "commencer",
    "une",
    "aventure",
    "qui",
    "te",
    "permettra",
    "de",
    "découvrir",
    "ton",
    "cadeau",
    "de",
    "Noël",
    "!",
  ];

  return (
    <motion.div
      className="flex flex-col items-center justify-center w-full h-full px-6 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
    >
      {/* Decorative snowflakes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-white/30 text-2xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-20px`,
            }}
            animate={{
              y: ["0vh", "110vh"],
              rotate: [0, 360],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear",
            }}
          >
            ❄
          </motion.div>
        ))}
      </div>

      <motion.div
        className="flex flex-col items-center max-w-lg relative z-10"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
      >
        {/* Christmas tree icon */}
        <motion.div
          className="text-7xl mb-8"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 200,
            damping: 15,
          }}
        >
          🎄
        </motion.div>

        {/* Animated text */}
        <motion.p className="text-2xl md:text-4xl text-white leading-relaxed tracking-wide flex flex-wrap justify-center gap-x-3 gap-y-1">
          {words.map((word, index) => (
            <motion.span
              key={index}
              className="inline-block"
              initial={{ opacity: 0, y: 30, rotateX: -90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                delay: 0.8 + index * 0.12,
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              style={{
                textShadow: "0 2px 10px rgba(0,0,0,0.3)",
              }}
            >
              {word}
            </motion.span>
          ))}
        </motion.p>

        {/* Decorative stars */}
        <motion.div
          className="flex gap-4 mt-8 text-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
        >
          {["✨", "⭐", "✨"].map((star, i) => (
            <motion.span
              key={i}
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            >
              {star}
            </motion.span>
          ))}
        </motion.div>

        {/* Start button */}
        <motion.button
          onClick={onStart}
          className="mt-12 px-10 py-4 bg-white text-red-600 font-bold text-xl rounded-full shadow-2xl relative overflow-hidden group"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.5, duration: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.span
            className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity"
          />
          <span className="relative z-10 flex items-center gap-2">
            Commencer
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              →
            </motion.span>
          </span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

