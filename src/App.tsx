import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import './App.css'
import { LoopingImages } from './components/looping-image'
import { CardsSection } from './components/cards-section'

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

  const goToPrevSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentSlide((prev) => prev - 1)
      setIsTransitioning(false)
    }, 600)
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-red-700 via-red-600 to-rose-500 relative overflow-hidden">
      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-700 via-red-600 to-rose-500" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.15)_0%,_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(0,0,0,0.2)_0%,_transparent_60%)]" />

      {/* Title */}
      <motion.p
        className="absolute text-white text-3xl font-bold left-1/2 top-8 -translate-x-1/2 z-10 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        Joyeux Noël Margot !
      </motion.p>

      {/* Content - Carousel */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 overflow-hidden">
        <AnimatePresence mode="wait">
          {currentSlide === 0 && (
            <LoopingImages
              key="intro"
              onNext={goToNextSlide}
              isTransitioning={isTransitioning}
            />
          )}
          {currentSlide === 1 && (
            <CardsSection
              key="cards"
              onBack={goToPrevSlide}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default App
