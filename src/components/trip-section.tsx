import { motion } from "motion/react";
import { useRef, useEffect, useState, useCallback } from "react";
import { PlayButton } from "./play-button";

interface CardsSectionProps {
  onNext: () => void;
}

// Custom Scratch Card Component
function ScratchCard({ onRevealed }: { onRevealed: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Create golden scratch overlay
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#D4AF37");
    gradient.addColorStop(0.3, "#F5E6A3");
    gradient.addColorStop(0.5, "#D4AF37");
    gradient.addColorStop(0.7, "#F5E6A3");
    gradient.addColorStop(1, "#D4AF37");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add text on top
    ctx.fillStyle = "#8B6914";
    ctx.font = "bold 22px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🎄 GRATTE-MOI ! 🎄", canvas.width / 2, canvas.height / 2);

    // Add some sparkle effects
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  const calculateScratchPercent = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return 0;

    const ctx = canvas.getContext("2d");
    if (!ctx) return 0;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) {
        transparentPixels++;
      }
    }

    return (transparentPixels / (pixels.length / 4)) * 100;
  }, []);

  const scratch = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.globalCompositeOperation = "destination-out";
    
    // Create a circular brush
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, 30);
    gradient.addColorStop(0, "rgba(0, 0, 0, 1)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();

    // Calculate scratch percentage
    const percent = calculateScratchPercent();
    setScratchPercent(percent);

    if (percent > 50 && !isRevealed) {
      setIsRevealed(true);
      onRevealed();
      // Clear the canvas completely
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [calculateScratchPercent, isRevealed, onRevealed]);

  const getPosition = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ("touches" in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsScratching(true);
    const pos = getPosition(e);
    scratch(pos.x, pos.y);
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isScratching) return;
    e.preventDefault();
    const pos = getPosition(e);
    scratch(pos.x, pos.y);
  };

  const handleEnd = () => {
    setIsScratching(false);
  };

  return (
    <motion.div
      className="relative w-80 md:w-96 mx-auto rounded-2xl overflow-hidden shadow-2xl"
      initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: 0.4,
      }}
    >
      {/* Reveal content behind */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: isRevealed ? 1 : 0.8 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2 drop-shadow-lg">
            Tu as gagné !
          </h2>
          <p className="text-lg md:text-xl font-bold text-yellow-200 drop-shadow-lg">
            Un voyage avec Arthur !
          </p>
          <motion.div
            className="mt-4 text-4xl"
            animate={{ rotate: [0, 10, -10, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}
          >
            ❤️
          </motion.div>
        </motion.div>
      </div>

      {/* Scratch canvas */}
      <canvas
        ref={canvasRef}
        width={384}
        height={220}
        className={`relative z-10 w-full h-52 cursor-pointer touch-none ${isRevealed ? "pointer-events-none" : ""}`}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        style={{ opacity: isRevealed ? 0 : 1, transition: "opacity 0.5s" }}
      />

      {/* Progress indicator */}
      {!isRevealed && scratchPercent > 0 && (
        <motion.div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm z-20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {Math.round(scratchPercent)}% gratté
        </motion.div>
      )}
    </motion.div>
  );
}

export function CardsSection({ onNext }: CardsSectionProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <motion.div
      className="flex flex-col items-center justify-center w-full h-full max-w-4xl px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 0.8,
        filter: "blur(10px)",
        transition: { duration: 0.5 },
      }}
    >
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <ScratchCard onRevealed={() => setIsRevealed(true)} />
        
        {/* Play button appears after scratch card is revealed */}
        {isRevealed && (
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <PlayButton onClick={onNext} delay={0.2} />
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
