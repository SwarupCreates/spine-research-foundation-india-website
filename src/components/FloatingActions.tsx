import React, { useState, useEffect } from 'react'
import { MaterialIcon } from './icons'

interface FloatingActionsProps {
  onOpenParticipate?: () => void
  onOpenFeedback?: () => void
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({
  onOpenParticipate,
  onOpenFeedback,
}) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const [bottomSpacing, setBottomSpacing] = useState<number | null>(null)

  // Calibrate bottom position dynamically:
  // When footer starts to enter the viewport from bottom edge,
  // increase bottom spacing to: OuterEdgeGutter / 2 + CalculatedFooterHeight
  useEffect(() => {
    const getOuterEdgeGutter = (): number => {
      if (typeof window === 'undefined') return 48
      if (window.innerWidth >= 1024) return 48 // Desktop: 48px
      if (window.innerWidth >= 640) return 40  // Tablet: 40px
      return 32                               // Mobile: 32px
    }

    const updatePosition = () => {
      const footer = document.querySelector('footer')
      const gutter = getOuterEdgeGutter()

      if (!footer) {
        setBottomSpacing(gutter)
        return
      }

      const footerRect = footer.getBoundingClientRect()
      const calculatedFooterHeight = footer.offsetHeight || 96
      const isEntering = footerRect.top < window.innerHeight

      if (isEntering) {
        // OuterEdgeGutter / 2 + CalculatedFooterHeight
        setBottomSpacing(gutter / 2 + calculatedFooterHeight)
      } else {
        setBottomSpacing(gutter)
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
    <aside 
      id="floating-actions"
      data-testid="floating-actions"
      className={`fixed left-1/2 -translate-x-1/2 sm:left-auto sm:right-10 sm:translate-x-0 lg:right-12 z-50 flex items-center gap-3.5 transition-[bottom] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
        bottomSpacing === null ? 'bottom-8 sm:bottom-10 lg:bottom-12' : ''
      }`}
      style={{
        bottom: bottomSpacing !== null ? `${bottomSpacing}px` : undefined,
      }}
      aria-label="Quick Actions"
    >
      {/* Primary "Participate" Pill Floating Button */}
      <button
        type="button"
        onClick={onOpenParticipate}
        className="group relative h-12 px-6 rounded-full bg-[#1da824] hover:bg-[#189b20] active:scale-95 text-white font-medium text-sm sm:text-base shadow-xl shadow-green-950/60 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
        aria-label="Participate in SRF India initiatives"
      >
        <MaterialIcon
          name="volunteer_activism"
          size={20}
          filled
          className="text-white group-hover:scale-110 transition-transform duration-200"
        />
        <span className="tracking-tight whitespace-nowrap font-medium">
          Participate
        </span>
      </button>

      {/* Secondary Perfectly Circular Button with SRF Blue Shade on Hover */}
      <button
        type="button"
        onClick={onOpenFeedback}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="contact-btn-srf group relative h-12 w-12 rounded-full aspect-square bg-[#1c1d22]/85 hover:bg-[#1B9AF7] hover:border-[#1B9AF7] hover:shadow-[0_0_24px_rgba(27,154,247,0.45)] active:scale-95 text-gray-200 hover:text-white border border-white/[0.12] backdrop-blur-xl shadow-xl transition-all duration-200 cursor-pointer flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B9AF7] flex-shrink-0"
        aria-label="Feedback and inquiries"
      >
        <MaterialIcon
          name="chat"
          size={22}
          className="text-gray-200 group-hover:text-white group-hover:scale-110 transition-all duration-200"
        />

        {/* Hover tooltip */}
        {showTooltip && (
          <span className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 sm:left-auto sm:right-0 sm:translate-x-0 px-2.5 py-1 rounded-lg bg-black/85 backdrop-blur-md text-xs text-white whitespace-nowrap border border-white/10 shadow-lg pointer-events-none transition-opacity font-medium">
            Contact &amp; Support
          </span>
        )}
      </button>
    </aside>
  )
}

export default FloatingActions
