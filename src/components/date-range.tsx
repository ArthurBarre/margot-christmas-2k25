import { motion } from "motion/react";
import { useState } from "react";
import { Calendar } from "./ui/calendar";
import { PlayButton } from "./play-button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { DateRange } from "react-day-picker";

interface CardsSectionProps {
  onNext: () => void;
}

export function DateRangeSection({ onNext }: CardsSectionProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const hasSelectedRange = dateRange?.from && dateRange?.to;

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
        transition={{ delay: 0.4 }}
      >
        <motion.h2
          className="text-2xl md:text-3xl font-bold text-white text-center mb-4 drop-shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          📅 Choisis un weekend où tu es dispo !
        </motion.h2>

        {/* Calendar */}
        <motion.div
          className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-2xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
        >
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={1}
            disabled={{ before: new Date() }}
          />
        </motion.div>

        {/* Play button appears after selecting dates */}
        {hasSelectedRange && (
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
