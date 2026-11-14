import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ServerErrorArt, MaterialIcon } from '../components/icons'

interface NotFoundPageProps {
  onOpenParticipate?: () => void
  onOpenFeedback?: () => void
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  onOpenParticipate,
  onOpenFeedback,
}) => {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="relative w-full max-w-3xl mx-auto text-center">
        {/* Soft atmospheric ambient glow centered behind the floating error artwork */}
        <div 
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[480px] h-96 sm:h-[480px] rounded-full pointer-events-none -z-10 blur-3xl opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.3) 0%, rgba(27, 154, 247, 0.15) 50%, transparent 75%)',
          }}
          aria-hidden="true"
        />

        {/* Status Badge with pulsing dot matching WIP design */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs sm:text-sm font-medium backdrop-blur-md mb-6">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="tracking-wide uppercase text-[11px] sm:text-xs font-semibold">Error 404 · Instrument Misplaced</span>
        </div>

        {/* Server Error Artwork: Enhanced size on mobile and desktop */}
        <div className="flex justify-center mb-6 relative">
          <div className="h-44 sm:h-52 md:h-56 max-w-full flex items-center justify-center filter drop-shadow-[0_16px_32px_rgba(0,0,0,0.6)]">
            <ServerErrorArt className="h-full w-auto max-h-full" />
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-tight mb-2 font-sans">
          Forceps Not Found!
        </h1>
        <p className="text-amber-400 font-medium text-xs sm:text-sm mb-4 tracking-wider uppercase">
          Surgical Instrument Misplaced · Theatre 404
        </p>
        <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-8">
          Even our chief spine surgeons and sterile processing scrub nurses couldn't locate the forceps on this surgical tray. The page or instrument you requested at <span className="font-mono text-gray-200 bg-white/[0.08] px-2 py-0.5 rounded text-xs sm:text-sm">{location.pathname}</span> seems to have slipped off the sterilized table. Don't worry — no surgical delay here! Just realign your posture and return to our homepage.
        </p>

        {/* Navigation Action Buttons matching WIP page trio */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs sm:text-sm transition-all duration-300 shadow-lg shadow-emerald-950/50 hover:scale-[1.02] cursor-pointer"
          >
            <MaterialIcon name="family_home" size={18} />
            <span>Return to Home</span>
          </button>

          {onOpenParticipate && (
            <button
              type="button"
              onClick={onOpenParticipate}
              className="group inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm border border-white/15 transition-all duration-300 backdrop-blur-md hover:scale-[1.02] cursor-pointer"
            >
              <MaterialIcon name="volunteer_activism" size={18} />
              <span>Get Involved</span>
            </button>
          )}

          {onOpenFeedback && (
            <button
              type="button"
              onClick={onOpenFeedback}
              className="group inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-gray-300 hover:text-white font-medium text-xs sm:text-sm border border-white/[0.08] transition-all duration-300 backdrop-blur-md cursor-pointer"
            >
              <MaterialIcon name="rate_review" size={18} />
              <span>Report Issue</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
