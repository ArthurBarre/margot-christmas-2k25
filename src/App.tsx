import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import './App.css'
import { WelcomeScreen } from './components/welcome-screen'
import { LoopingImages } from './components/looping-image'
import { CardsSection } from './components/trip-section'
import { BolideSection } from './components/bolide-section'
import { DateRangeSection } from './components/date-range'
import { BarcelonaSection } from './components/barcelona-section'
import type { DateRange } from 'react-day-picker'

function App() {
  const [hasStarted, setHasStarted] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  const goToNextSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentSlide((prev) => prev + 1)
      setIsTransitioning(false)
    }, 600)
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-red-700 via-red-600 to-rose-500 relative overflow-hidden fixed inset-0">
      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-700 via-red-600 to-rose-500" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.15)_0%,_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(0,0,0,0.2)_0%,_transparent_60%)]" />

      {/* Content - Carousel */}
      <div className="relative z-10 flex items-center justify-center h-full p-4 overflow-hidden">
        <AnimatePresence mode="wait">
          {!hasStarted && (
            <WelcomeScreen
              key="welcome"
              onStart={() => setHasStarted(true)}
            />
          )}
          {hasStarted && currentSlide === 0 && (
            <LoopingImages
              key="intro"
              onNext={goToNextSlide}
              isTransitioning={isTransitioning}
            />
          )}
          {hasStarted && currentSlide === 1 && (
            <DateRangeSection
              key="date-range"
              onNext={goToNextSlide}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          )}
          {hasStarted && currentSlide === 2 && (
            <CardsSection
              key="cards"
              onNext={goToNextSlide}
            />
          )}
          {hasStarted && currentSlide === 3 && (
            <BolideSection
              key="bolide"
              onNext={goToNextSlide}
            />
          )}
          {hasStarted && currentSlide === 4 && (
            <BarcelonaSection
              key="barcelona"
              dateRange={dateRange}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default App
