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
  // When footer starts to enter the viewport from bottom edge on scroll,
  // increase bottom spacing smoothly to: OuterEdgeGutter / 2 + CalculatedFooterHeight.
  // When scrolling back up, smoothly trickle back down to the original gutter position.
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
    <aside 
      id="floating-actions"
      data-testid="floating-actions"
      className={`fixed left-1/2 -translate-x-1/2 sm:left-auto sm:right-10 sm:translate-x-0 lg:right-12 z-50 flex items-center gap-3.5 transition-[bottom] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] ${
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
