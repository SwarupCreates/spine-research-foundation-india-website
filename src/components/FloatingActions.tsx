import React, { useState } from 'react'
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

  return (
    <aside 
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3"
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

      {/* Secondary Perfectly Circular Glass Button with identical height and width */}
      <button
        type="button"
        onClick={onOpenFeedback}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="group relative h-12 w-12 rounded-full aspect-square bg-[#1c1d22]/85 hover:bg-[#25272e]/90 active:scale-95 text-gray-200 hover:text-white border border-white/[0.12] backdrop-blur-xl shadow-xl transition-all duration-200 cursor-pointer flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 flex-shrink-0"
        aria-label="Feedback and inquiries"
      >
        <MaterialIcon
          name="chat"
          size={22}
          className="text-gray-200 group-hover:text-white transition-colors"
        />

        {/* Hover tooltip */}
        {showTooltip && (
          <span className="absolute bottom-full mb-2.5 right-0 px-2.5 py-1 rounded-lg bg-black/85 backdrop-blur-md text-xs text-white whitespace-nowrap border border-white/10 shadow-lg pointer-events-none transition-opacity font-medium">
            Contact &amp; Support
          </span>
        )}
      </button>
    </aside>
  )
}

export default FloatingActions
