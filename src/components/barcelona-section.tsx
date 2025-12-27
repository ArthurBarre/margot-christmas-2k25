import { motion, AnimatePresence } from "motion/react";
import { useRef, useEffect, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { DateRange } from "react-day-picker";

import barcelonaPic from "../assets/barcelona_pic.jpg";
import music from "../assets/music.mp3";
// import barcelonaVideo from "../assets/barcelona_video.mp4"; // Uncomment when you add the video

interface BarcelonaSectionProps {
  dateRange?: DateRange;
}

export function BarcelonaSection({ dateRange }: BarcelonaSectionProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isImageFullscreen, setIsImageFullscreen] = useState(false);
  const dateStart = dateRange?.from ? format(dateRange.from, "d MMMM", { locale: fr }) : "???";
  const dateEnd = dateRange?.to ? format(dateRange.to, "d MMMM yyyy", { locale: fr }) : "???";

  // Auto-play music when component mounts
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(() => {
        // Autoplay blocked, user needs to interact
      });
    }
  }, []);

  return (
    <motion.div
      className="relative flex flex-col items-center justify-center w-full h-full overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Background music */}
      <audio ref={audioRef} src={music} loop />

      {/* Main content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-4 max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {/* Main photo with elegant frame - clickable */}
        <motion.div
          className="relative mb-4 cursor-pointer"
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsImageFullscreen(true)}
          transition={{ 
            delay: 0.5, 
            duration: 0.8,
            type: "spring",
            stiffness: 100 
          }}
        >
          <div className="relative">
            {/* Photo frame glow */}
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-yellow-200 via-white to-yellow-200 rounded-xl opacity-50 blur-sm"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            
            {/* Photo */}
            <img
              src={barcelonaPic}
              alt="Barcelone"
              className="relative w-48 h-auto md:w-64 rounded-lg shadow-2xl border-2 border-white/80 object-cover"
            />
            
            {/* Tap to enlarge hint */}
            <motion.div
              className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              🔍 Agrandir
            </motion.div>
          </div>
        </motion.div>

        {/* Video placeholder - uncomment and add your video */}
        {/* 
        <motion.div
          className="mb-8 w-full max-w-md"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <video
            src={barcelonaVideo}
            className="w-full rounded-xl shadow-2xl border-4 border-white/80"
            autoPlay
            muted
            loop
            playsInline
          />
        </motion.div>
        */}

        {/* Destination title */}
        <motion.h1
          className="text-2xl md:text-4xl font-black text-white mb-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          style={{
            textShadow: "0 4px 20px rgba(0,0,0,0.3)",
          }}
        >
          Barcelone 🇪🇸
        </motion.h1>

        {/* Dates */}
        <motion.div
          className="bg-white/15 backdrop-blur-md rounded-xl px-5 py-2 mb-3 border border-white/20"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          <p className="text-sm text-white/90">Nous partons du</p>
          <p className="text-lg md:text-xl font-bold text-white">
            {dateStart} au {dateEnd}
          </p>
        </motion.div>

        {/* Christmas message */}
        <motion.p
          className="text-xl md:text-2xl font-semibold text-white mb-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          style={{ textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}
        >
          Joyeux Noël 🎄
        </motion.p>

        {/* Love message */}
        <motion.p
          className="text-2xl md:text-3xl font-bold text-white"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 2.2, type: "spring", stiffness: 200 }}
        >
          Je t'aime ❤️
        </motion.p>

        {/* Signature */}
        <motion.p
          className="mt-3 text-base text-white/70 italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.6 }}
        >
          — Arthur
        </motion.p>
      </motion.div>

      {/* Subtle particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/40 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 3,
            delay: Math.random() * 4,
            repeat: Infinity,
            repeatDelay: Math.random() * 3,
          }}
        />
      ))}

      {/* Fullscreen image modal */}
      <AnimatePresence>
        {isImageFullscreen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsImageFullscreen(false)}
          >
            {/* Close button */}
            <motion.button
              className="absolute top-6 right-6 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white text-2xl backdrop-blur-sm border border-white/30 transition-colors z-10"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 200 }}
              onClick={() => setIsImageFullscreen(false)}
            >
              ✕
            </motion.button>

            {/* Fullscreen image */}
            <motion.img
              src={barcelonaPic}
              alt="Barcelone"
              className="max-w-[95vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
