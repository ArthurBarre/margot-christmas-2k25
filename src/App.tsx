import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import './App.css'
import { LoopingImages } from './components/looping-image'
import { CardsSection } from './components/trip-section'
import { BolideSection } from './components/bolide-section'
import { DateRangeSection } from './components/date-range'

function App() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

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

      {/* Title */}
      <motion.p
        className="absolute text-white text-3xl font-bold left-1/2 top-8 -translate-x-1/2 z-10 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ 
          opacity: currentSlide === 0 ? 1 : 0, 
          y: currentSlide === 0 ? 0 : -50 
        }}
        transition={{ duration: 0.5 }}
      >
        Joyeux Noël Margot !
      </motion.p>

      {/* Content - Carousel */}
      <div className="relative z-10 flex items-center justify-center h-full p-4 overflow-hidden">
        <AnimatePresence mode="wait">
          {currentSlide === 0 && (
            <LoopingImages
              key="intro"
              onNext={goToNextSlide}
              isTransitioning={isTransitioning}
            />
          )}
          {
            currentSlide === 1 && (
              <DateRangeSection
                key="date-range"
                onNext={goToNextSlide}
              />
            )
          }
          {currentSlide === 2 && (
            <CardsSection
              key="cards"
              onNext={goToNextSlide}
            />
          )}
          {currentSlide === 3 && (
            <BolideSection
              key="bolide"
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default App
