import { motion } from "motion/react";
import { useRef, useEffect, useState, useCallback } from "react";

interface CardsSectionProps {
  onBack: () => void;
}

// Custom Scratch Card Component
function ScratchCard() {
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
    ctx.font = "bold 24px Arial";
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
      // Clear the canvas completely
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [calculateScratchPercent, isRevealed]);

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
      className="relative w-full max-w-sm mx-auto rounded-2xl overflow-hidden shadow-2xl"
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
          <span className="text-6xl mb-4 block">🎉✈️🌴</span>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
            Tu as gagné !
          </h2>
          <p className="text-xl md:text-2xl font-bold text-yellow-200 drop-shadow-lg">
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
        width={350}
        height={200}
        className={`relative z-10 w-full h-48 cursor-pointer touch-none ${isRevealed ? "pointer-events-none" : ""}`}
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

export function CardsSection({ onBack }: CardsSectionProps) {
  return (
    <motion.div
      className="flex flex-col items-center gap-8 w-full max-w-4xl px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 0.8,
        filter: "blur(10px)",
        transition: { duration: 0.5 },
      }}
    >
      {/* Back button */}
      <motion.button
        onClick={onBack}
        className="self-start flex items-center gap-2 text-white/80 hover:text-white transition-colors touch-manipulation"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        whileHover={{ x: -5 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="font-medium">Retour</span>
      </motion.button>

      {/* Scratch Card Section */}
      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <motion.h2
          className="text-2xl font-bold text-white text-center mb-6 drop-shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          🎁 Une surprise t'attend ! 🎁
        </motion.h2>
        <ScratchCard />
      </motion.div>
    </motion.div>
  );
}
