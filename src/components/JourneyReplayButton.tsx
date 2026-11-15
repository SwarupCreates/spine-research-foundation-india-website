import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MaterialIcon } from './icons'

interface JourneyReplayButtonProps {
  onReplay: () => void
  isEnteringFromJourney?: boolean
}

export const JourneyReplayButton: React.FC<JourneyReplayButtonProps> = ({
  onReplay,
  isEnteringFromJourney = false,
}) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const [bottomSpacing, setBottomSpacing] = useState<number | null>(null)

  useEffect(() => {
    const getOuterEdgeGutter = (): number => {
      if (typeof window === 'undefined') return 28
      if (window.innerWidth >= 1024) return 28
      if (window.innerWidth >= 640) return 24
      return 24
    }

    const updatePosition = () => {
      const footer = document.querySelector('footer')
      const gutter = getOuterEdgeGutter()

      if (!footer) {
        setBottomSpacing(gutter)
        return
      }

      const docHeight = document.documentElement.scrollHeight
      const windowHeight = window.innerHeight
      const maxScroll = Math.max(0, docHeight - windowHeight)
      const scrollY = Math.max(0, window.scrollY || window.pageYOffset || 0)
      const calculatedFooterHeight = footer.offsetHeight || 96
      const targetBottom = Math.round(gutter / 2 + calculatedFooterHeight)

      if (maxScroll <= 24 || scrollY <= 0) {
        setBottomSpacing(gutter)
        return
      }

      const scrollFromBottom = Math.max(0, maxScroll - scrollY)

      if (scrollFromBottom >= calculatedFooterHeight) {
        setBottomSpacing(gutter)
      } else {
        const progress = Math.min(
          1,
          Math.max(0, (calculatedFooterHeight - scrollFromBottom) / calculatedFooterHeight)
        )
        const interpolated = gutter + progress * (targetBottom - gutter)
        setBottomSpacing(Math.round(interpolated))
      }
    }

    window.addEventListener('scroll', updatePosition, { passive: true })
    window.addEventListener('resize', updatePosition, { passive: true })
    updatePosition()

    return () => {
      window.removeEventListener('scroll', updatePosition)
      window.removeEventListener('resize', updatePosition)
    }
  }, [])

  return (
    <motion.aside
      id="journey-replay-action"
      data-testid="journey-replay-action"
      initial={isEnteringFromJourney ? { opacity: 0, scale: 0.3 } : false}
      animate={{ opacity: 1, scale: 1 }}
      transition={
        isEnteringFromJourney
          ? { type: 'spring', stiffness: 260, damping: 18, delay: 0.4 }
          : undefined
      }
      className={`hidden md:block fixed left-4 sm:left-6 lg:left-7 z-[70] transition-[bottom] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        bottomSpacing === null ? 'bottom-6 sm:bottom-6 lg:bottom-7' : ''
      }`}
      style={{
        bottom: bottomSpacing !== null ? `${bottomSpacing}px` : undefined,
      }}
      aria-label="Replay Welcome Journey"
    >
      <button
        type="button"
        onClick={onReplay}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="group relative h-12 w-12 rounded-full aspect-square bg-[#1c1d22]/85 hover:bg-[#189b20] hover:border-emerald-400/40 text-gray-200 hover:text-white border border-white/[0.12] backdrop-blur-xl shadow-xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
        aria-label="Replay welcome journey"
      >
        <MaterialIcon
          name="replay"
          size={22}
          className="text-white group-hover:rotate-[-180deg] transition-transform duration-500 ease-out"
        />

        {/* Hover tooltip */}
        {showTooltip && (
          <span className="absolute bottom-full mb-2.5 left-0 px-2.5 py-1 rounded-lg bg-black/85 backdrop-blur-md text-xs text-white whitespace-nowrap border border-white/10 shadow-lg pointer-events-none transition-opacity font-medium">
            Replay Story
          </span>
        )}
      </button>
    </motion.aside>
  )
}

export default JourneyReplayButton
