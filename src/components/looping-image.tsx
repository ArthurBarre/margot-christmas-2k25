import { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "motion/react";

import img1 from "../assets/IMG_1597 2.jpg";
import img2 from "../assets/IMG_1621 2.jpeg";
import img3 from "../assets/IMG_1669 2.jpeg";
import img4 from "../assets/IMG_1672 2.jpeg";
import img5 from "../assets/IMG_1734 2.jpeg";
import img6 from "../assets/IMG_1881 2.jpeg";
import img7 from "../assets/IMG_1888 2.jpeg";
import img8 from "../assets/IMG_2007 2.jpeg";

// Images for the squares
const images = [img1, img2, img3, img4, img5, img6, img7, img8];

interface LoopingImagesProps {
  onNext: () => void;
  isTransitioning?: boolean;
}

export function LoopingImages({ onNext, isTransitioning = false }: LoopingImagesProps) {
  const lastIndex = images.length - 1;

  return (
    <motion.div
      className="relative w-[500px] h-[500px]"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{
        opacity: 0,
        scale: 1.5,
        filter: "blur(20px)",
        transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
      }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Render all squares except the last one */}
      {Array.from({ length: images.length }).map((_, index) =>
        index === lastIndex ? null : (
          <Square index={index} key={index} isTransitioning={isTransitioning} />
        )
      )}

      {/* Render the last square with the duplicate first (index 0) square masked inside it */}
      <Square index={lastIndex} isTransitioning={isTransitioning}>
        <SquareWithOffset index={0} parentIndex={lastIndex} />
      </Square>

      {/* Center button */}
      <motion.button
        onClick={onNext}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-20 h-20 rounded-full bg-white/90 backdrop-blur-sm shadow-2xl shadow-red-900/50 flex items-center justify-center cursor-pointer border-4 border-white/50 touch-manipulation select-none"
        style={{ WebkitTapHighlightColor: "transparent" }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 1.2,
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
    </motion.div>
  );
}

function SquareWithOffset({
  index,
  parentIndex,
}: {
  index: number;
  parentIndex: number;
}) {
  const image = images[index];
  const firstSquareOffset = useMotionValue(0);

  useEffect(() => {
    const controls = animate(firstSquareOffset, 1, {
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: 1,
      ease: [0.42, 0, 0.58, 1],
      duration: 7,
    });
    return () => controls.stop();
  }, [firstSquareOffset]);

  const x = useTransform(firstSquareOffset, (offset: number) => {
    const firstAngle = ((getPathOffset(index) + offset) % 1) * Math.PI * 2;
    const lastAngle = ((getPathOffset(parentIndex) + offset) % 1) * Math.PI * 2;
    return Math.cos(firstAngle) * 180 - Math.cos(lastAngle) * 180;
  });

  const y = useTransform(firstSquareOffset, (offset: number) => {
    const firstAngle = ((getPathOffset(index) + offset) % 1) * Math.PI * 2;
    const lastAngle = ((getPathOffset(parentIndex) + offset) % 1) * Math.PI * 2;
    return Math.sin(firstAngle) * 180 - Math.sin(lastAngle) * 180;
  });

  return (
    <motion.div
      className="absolute inset-0 rounded-lg overflow-clip"
      style={{ x, y }}
    >
      <img
        src={image}
        alt={`Square ${index}`}
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />
    </motion.div>
  );
}

function Square({
  index,
  children,
  className,
  isTransitioning,
}: {
  index: number;
  children?: React.ReactNode;
  className?: string;
  isTransitioning?: boolean;
}) {
  const image = images[index];
  const pathOffset = useMotionValue(getPathOffset(index));

  useEffect(() => {
    const controls = animate(pathOffset, pathOffset.get() + 1, {
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: 1,
      ease: [0.42, 0, 0.58, 1],
      duration: 7,
    });
    return () => controls.stop();
  }, [pathOffset]);

  const x = useTransform(pathOffset, (offset: number) => {
    const angle = (offset % 1) * Math.PI * 2;
    return Math.cos(angle) * 180;
  });

  const y = useTransform(pathOffset, (offset: number) => {
    const angle = (offset % 1) * Math.PI * 2;
    return Math.sin(angle) * 180;
  });

  // Calculate explosion direction based on current position
  const explosionX = useTransform(pathOffset, (offset: number) => {
    const angle = (offset % 1) * Math.PI * 2;
    return Math.cos(angle) * 600;
  });

  const explosionY = useTransform(pathOffset, (offset: number) => {
    const angle = (offset % 1) * Math.PI * 2;
    return Math.sin(angle) * 600;
  });

  return (
    <motion.div
      key={index}
      className={`absolute rounded-lg overflow-clip w-[150px] h-[150px] ${className}`}
      style={{
        width: 150,
        height: 150,
        left: "calc(50% - 75px)",
        top: "calc(50% - 75px)",
        x: isTransitioning ? explosionX : x,
        y: isTransitioning ? explosionY : y,
      }}
      initial={{
        opacity: 0,
        scale: 0.9,
      }}
      animate={{
        opacity: isTransitioning ? 0 : 1,
        scale: isTransitioning ? 0.5 : 1,
        rotate: isTransitioning ? index * 45 : 0,
      }}
      transition={{
        opacity: {
          duration: isTransitioning ? 0.4 : 1,
          delay: isTransitioning ? 0 : index * 0.12 + 0.35,
          ease: "easeOut",
        },
        scale: {
          duration: isTransitioning ? 0.4 : 1,
          delay: isTransitioning ? 0 : index * 0.12 + 0.35,
          ease: "easeOut",
        },
        rotate: {
          duration: 0.5,
          ease: "easeOut",
        },
      }}
    >
      <img
        src={image}
        alt={`Square ${index}`}
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />
      <motion.div
        className="absolute inset-0 rounded-lg overflow-clip"
        initial={{
          scale: 1.1,
        }}
        animate={{
          scale: 1,
        }}
        transition={{
          duration: 1,
          delay: index * 0.12 + 0.35,
          ease: "easeOut",
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

// Helper function to get the path offset for a specific index
function getPathOffset(index: number) {
  return index / 8;
}
