import './App.css'
import { LoopingImages } from './components/looping-image'
function App() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-red-700 via-red-600 to-rose-500 relative overflow-hidden">
      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-700 via-red-600 to-rose-500" />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.15)_0%,_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(0,0,0,0.2)_0%,_transparent_60%)]" />
      <p className="absolute text-white text-3xl font-bold left-1/2 top-8 -translate-x-1/2 z-10 text-center">
        Joyeux Noël Margot !
      </p>
      {/* Content */}
      <div className="relative z-10">
        <LoopingImages />
      </div>
    </div>
  )
}

export default App
