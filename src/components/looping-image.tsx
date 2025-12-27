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

export function LoopingImages() {
  const lastIndex = images.length - 1;

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="relative w-[500px] h-[500px]">
        {/* Render all squares except the last one */}
        {Array.from({ length: images.length }).map((_, index) =>
          index === lastIndex ? null : <Square index={index} key={index} />
        )}

        {/* Render the last square with the duplicate first (index 0) square masked inside it */}
        <Square index={lastIndex}>
          <SquareWithOffset index={0} parentIndex={lastIndex} />
        </Square>

        {/* Center button */}
        <motion.button
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-20 h-20 rounded-full bg-white/90 backdrop-blur-sm shadow-2xl shadow-red-900/50 flex items-center justify-center cursor-pointer border-4 border-white/50 touch-manipulation select-none"
          style={{ WebkitTapHighlightColor: "transparent" }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
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
      </div>
    </div>
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

  // For the specific case of the first square (index 0) inside the last square (index 7),
  // we want to position it at the same place as the original first square would be
  // This creates the illusion of continuity in the circle
  const firstSquareOffset = useMotionValue(0);

  useEffect(() => {
    // Create animation that goes from current value to 1
    const controls = animate(firstSquareOffset, 1, {
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: 1,
      ease: [0.42, 0, 0.58, 1],
      duration: 7,
    });
    return () => controls.stop();
  }, [firstSquareOffset]);

  // Transform the offset to x and y coordinates relative to the parent square
  const x = useTransform(firstSquareOffset, (offset: number) => {
    // Calculate the angle for both the first square and the last square
    const firstAngle = ((getPathOffset(index) + offset) % 1) * Math.PI * 2;
    const lastAngle = ((getPathOffset(parentIndex) + offset) % 1) * Math.PI * 2;

    // Calculate the x position difference
    return Math.cos(firstAngle) * 180 - Math.cos(lastAngle) * 180;
  });

  const y = useTransform(firstSquareOffset, (offset: number) => {
    // Calculate the angle for both the first square and the last square
    const firstAngle = ((getPathOffset(index) + offset) % 1) * Math.PI * 2;
    const lastAngle = ((getPathOffset(parentIndex) + offset) % 1) * Math.PI * 2;

    // Calculate the y position difference
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
}: {
  index: number;
  children?: React.ReactNode;
  className?: string;
}) {
  const image = images[index];
  const pathOffset = useMotionValue(getPathOffset(index));

  // Animate the path offset
  useEffect(() => {
    // Create animation that goes from current value to current value + 1
    const controls = animate(pathOffset, pathOffset.get() + 1, {
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: 1,
      ease: [0.42, 0, 0.58, 1],
      duration: 7,
    });
    return () => controls.stop();
  }, [pathOffset]);

  // Transform the offset to x and y coordinates
  const x = useTransform(pathOffset, (offset: number) => {
    const angle = (offset % 1) * Math.PI * 2;
    return Math.cos(angle) * 180;
  });

  const y = useTransform(pathOffset, (offset: number) => {
    const angle = (offset % 1) * Math.PI * 2;
    return Math.sin(angle) * 180;
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
        x,
        y,
      }}
      initial={{
        opacity: 0,
        scale: 0.9,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      transition={{
        opacity: {
          duration: 1,
          delay: index * 0.12 + 0.35,
          ease: "easeOut",
        },
        scale: {
          duration: 1,
          delay: index * 0.12 + 0.35,
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

// Images for the squares
const images = [img1, img2, img3, img4, img5, img6, img7, img8];
