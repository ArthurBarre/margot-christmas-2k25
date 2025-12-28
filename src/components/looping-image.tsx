import { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { PlayButton } from "./play-button";

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
      className="flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.5,
        filter: "blur(20px)",
        transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
      }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Title */}
      <motion.h2
        className="text-white text-3xl md:text-4xl font-semibold mb-6 drop-shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Les participants :
      </motion.h2>

      <motion.div
        className="relative w-[380px] h-[380px] md:w-[500px] md:h-[500px]"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
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
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <PlayButton onClick={onNext} delay={1.2} />
      </div>
      </motion.div>
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
    return Math.cos(firstAngle) * 135 - Math.cos(lastAngle) * 135;
  });

  const y = useTransform(firstSquareOffset, (offset: number) => {
    const firstAngle = ((getPathOffset(index) + offset) % 1) * Math.PI * 2;
    const lastAngle = ((getPathOffset(parentIndex) + offset) % 1) * Math.PI * 2;
    return Math.sin(firstAngle) * 135 - Math.sin(lastAngle) * 135;
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
    return Math.cos(angle) * 135;
  });

  const y = useTransform(pathOffset, (offset: number) => {
    const angle = (offset % 1) * Math.PI * 2;
    return Math.sin(angle) * 135;
  });

  // Calculate explosion direction based on current position
  const explosionX = useTransform(pathOffset, (offset: number) => {
    const angle = (offset % 1) * Math.PI * 2;
    return Math.cos(angle) * 500;
  });

  const explosionY = useTransform(pathOffset, (offset: number) => {
    const angle = (offset % 1) * Math.PI * 2;
    return Math.sin(angle) * 500;
  });

  return (
    <motion.div
      key={index}
      className={`absolute rounded-xl overflow-clip ${className}`}
      style={{
        width: 110,
        height: 110,
        left: "calc(50% - 55px)",
        top: "calc(50% - 55px)",
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
