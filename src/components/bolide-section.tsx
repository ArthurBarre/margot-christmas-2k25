import { motion } from "motion/react";
import { useRef, useEffect, useState, useCallback } from "react";
import { PlayButton } from "./play-button";

import bolidImg from "../assets/B0D8812B-86B3-424B-B29E-662F75C0A27B 2.jpg";

interface BolideSectionProps {
  onNext: () => void;
}

// Scratch Card for Bolide
function BolideScratchCard({ onRevealed }: { onRevealed: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Create silver/blue scratch overlay
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#4A90D9");
    gradient.addColorStop(0.3, "#87CEEB");
    gradient.addColorStop(0.5, "#4A90D9");
    gradient.addColorStop(0.7, "#87CEEB");
    gradient.addColorStop(1, "#4A90D9");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add text on top
    ctx.fillStyle = "#1E3A5F";
    ctx.font = "bold 20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🚗 GRATTE POUR DÉCOUVRIR ! 🚗", canvas.width / 2, canvas.height / 2);

    // Add some sparkle effects
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
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
    
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, 35);
    gradient.addColorStop(0, "rgba(0, 0, 0, 1)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, 35, 0, Math.PI * 2);
    ctx.fill();

    const percent = calculateScratchPercent();
    setScratchPercent(percent);

    if (percent > 50 && !isRevealed) {
      setIsRevealed(true);
      onRevealed();
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
      className="relative w-full max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl"
      initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: 0.4,
      }}
    >
      {/* Car image behind */}
      <div className="absolute inset-0">
        <img
          src={bolidImg}
          alt="Notre bolide"
          className="w-full h-full object-cover"
        />
        {/* Overlay with text when revealed */}
        {isRevealed && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col items-center justify-end p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.p
              className="text-2xl font-bold text-white drop-shadow-lg text-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              La Cocci-Dub ! 🚗💨
            </motion.p>
          </motion.div>
        )}
      </div>

      {/* Scratch canvas */}
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        className={`relative z-10 w-full h-64 cursor-pointer touch-none ${isRevealed ? "pointer-events-none" : ""}`}
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

export function BolideSection({ onNext }: BolideSectionProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <motion.div
      className="flex flex-col items-center justify-center w-full max-w-4xl px-4"
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
        transition={{ delay: 0.3 }}
      >
        <motion.h2
          className="text-2xl md:text-3xl font-bold text-white mb-6 drop-shadow-lg text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Découvre notre bolide !
        </motion.h2>

        <BolideScratchCard onRevealed={() => setIsRevealed(true)} />

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
