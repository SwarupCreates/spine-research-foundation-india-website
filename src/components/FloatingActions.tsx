import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MaterialIcon } from './icons'

interface FloatingActionsProps {
  onOpenParticipate?: () => void
  onOpenFeedback?: () => void
  isParticipateOpen?: boolean
  isFeedbackOpen?: boolean
  onCloseParticipate?: () => void
  onCloseFeedback?: () => void
  isEnteringFromJourney?: boolean
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({
  onOpenParticipate,
  onOpenFeedback,
  isParticipateOpen = false,
  isFeedbackOpen = false,
  onCloseParticipate,
  onCloseFeedback,
  isEnteringFromJourney = false,
}) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const [bottomSpacing, setBottomSpacing] = useState<number | null>(null)

  // Calibrate bottom position dynamically:
  // When footer starts to enter the viewport from bottom edge on scroll,
  // increase bottom spacing smoothly to: OuterEdgeGutter / 2 + CalculatedFooterHeight.
  // When scrolling back up, smoothly trickle back down to the original gutter position.
  useEffect(() => {
    const getOuterEdgeGutter = (): number => {
      if (typeof window === 'undefined') return 28
      if (window.innerWidth >= 1024) return 28 // Desktop: 28px (harmonized with top navbar logo mark spacing of 28px)
      if (window.innerWidth >= 640) return 24  // Tablet: 24px
      return 24                               // Mobile: 24px
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

      // When at top of page (scrollY <= 0) or on short pages with minimal scroll range,
      // floating buttons must always stay at their original lower center/gutter position
      if (maxScroll <= 24 || scrollY <= 0) {
        setBottomSpacing(gutter)
        return
      }

      // Distance from bottom of viewport to bottom of page
      const scrollFromBottom = Math.max(0, maxScroll - scrollY)

      if (scrollFromBottom >= calculatedFooterHeight) {
        // Footer has not yet entered the bottom area to interfere with the buttons
        setBottomSpacing(gutter)
      } else {
        // Footer is actively entering/scrolling into view from bottom edge:
        // Smoothly interpolate from gutter to targetBottom (OuterEdgeGutter / 2 + CalculatedFooterHeight)
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
      id="floating-actions"
      data-testid="floating-actions"
      initial={isEnteringFromJourney ? { opacity: 0, y: 24, scale: 0.88 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={
        isEnteringFromJourney
          ? { duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.35 }
          : undefined
      }
      className={`fixed left-1/2 -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0 lg:right-7 z-[70] flex items-center gap-3.5 transition-[bottom] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        bottomSpacing === null ? 'bottom-6 sm:bottom-6 lg:bottom-7' : ''
      }`}
      style={{
        bottom: bottomSpacing !== null ? `${bottomSpacing}px` : undefined,
      }}
      aria-label="Quick Actions"
    >
      {/* Primary "Participate" Button (Converts to Cancel variant when participate modal is open) */}
      <button
        type="button"
        onClick={isParticipateOpen ? onCloseParticipate : onOpenParticipate}
        className={`group relative h-12 px-6 rounded-full font-medium text-sm sm:text-base transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 active:scale-95 ${
          isParticipateOpen
            ? 'bg-[#c92a2a] hover:bg-[#b02222] text-white shadow-xl shadow-red-950/60 border border-red-400/30 focus-visible:ring-red-400'
            : 'bg-[#1da824] hover:bg-[#189b20] text-white shadow-xl shadow-green-950/60 border-0 focus-visible:ring-emerald-300'
        }`}
        aria-label={isParticipateOpen ? 'Cancel and close participation modal' : 'Participate in SRF India initiatives'}
      >
        <MaterialIcon
          name={isParticipateOpen ? 'close' : 'volunteer_activism'}
          size={20}
          filled={!isParticipateOpen}
          className="text-white group-hover:scale-110 transition-transform duration-200"
        />
        <span className="tracking-tight whitespace-nowrap font-medium">
          {isParticipateOpen ? 'Cancel' : 'Participate'}
        </span>
      </button>

      {/* Secondary Circular Button (Converts to Cancel variant when connect modal is open) */}
      <button
        type="button"
        onClick={isFeedbackOpen ? onCloseFeedback : onOpenFeedback}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`group relative h-12 w-12 rounded-full aspect-square transition-all duration-300 cursor-pointer flex items-center justify-center focus:outline-none focus-visible:ring-2 flex-shrink-0 active:scale-95 ${
          isFeedbackOpen
            ? 'contact-btn-open bg-[#c92a2a] hover:bg-[#b02222] text-white border border-red-400/30 shadow-xl shadow-red-950/60 focus-visible:ring-red-400'
            : 'contact-btn-srf bg-[#1B9AF7] border-[#1B9AF7] shadow-[0_0_24px_rgba(27,154,247,0.45)] text-white active:bg-[#1582d1] md:bg-[#1c1d22]/85 md:text-gray-200 md:border-white/[0.12] md:backdrop-blur-xl md:shadow-xl md:hover:bg-[#1B9AF7] md:hover:border-[#1B9AF7] md:hover:shadow-[0_0_24px_rgba(27,154,247,0.45)] md:hover:text-white focus-visible:ring-[#1B9AF7]'
        }`}
        aria-label={isFeedbackOpen ? 'Close contact dialog' : 'Feedback and inquiries'}
      >
        <MaterialIcon
          name={isFeedbackOpen ? 'close' : 'chat'}
          size={isFeedbackOpen ? 20 : 22}
          className="text-white group-hover:scale-110 transition-all duration-200"
        />

        {/* Hover tooltip */}
        {showTooltip && (
          <span className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 sm:left-auto sm:right-0 sm:translate-x-0 px-2.5 py-1 rounded-lg bg-black/85 backdrop-blur-md text-xs text-white whitespace-nowrap border border-white/10 shadow-lg pointer-events-none transition-opacity font-medium">
            {isFeedbackOpen ? 'Close' : 'Contact & Support'}
          </span>
        )}
      </button>
    </motion.aside>
  )
}

export default FloatingActions
