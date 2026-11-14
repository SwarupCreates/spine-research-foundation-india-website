import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ServerErrorArt, MaterialIcon } from '../components/icons'

interface NotFoundPageProps {
  onOpenFeedback?: () => void
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onOpenFeedback }) => {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="relative w-full max-w-3xl mx-auto text-center">
        {/* Soft atmospheric ambient glow centered behind the floating error artwork */}
        <div 
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[480px] h-96 sm:h-[480px] rounded-full pointer-events-none -z-10 blur-3xl opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(27, 154, 247, 0.4) 0%, rgba(239, 68, 68, 0.15) 50%, transparent 75%)',
          }}
          aria-hidden="true"
        />

        {/* Fun Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs sm:text-sm font-medium backdrop-blur-md mb-6">
          <MaterialIcon name="error_outline" size={16} />
          <span className="tracking-wide uppercase text-[11px] sm:text-xs font-semibold">Error 404 · Vertebra Out Of Alignment</span>
        </div>

        {/* Server Error Artwork */}
        <div className="flex justify-center mb-6 relative">
          <div className="w-40 sm:w-48 md:w-56 max-w-full h-auto filter drop-shadow-[0_16px_36px_rgba(0,0,0,0.6)]">
            <ServerErrorArt className="w-full h-auto" />
          </div>
        </div>

        {/* Fun Spine-Themed Error Headline & Message */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-tight mb-2 font-sans">
          404: Spine Not Found!
        </h1>
        <p className="text-blue-400 font-medium text-xs sm:text-sm mb-3 tracking-wide">
          Endpoint <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-gray-200">{location.pathname}</span> seems to have slipped a disc
        </p>
        <p className="text-gray-300 text-sm sm:text-base max-w-lg mx-auto leading-relaxed mb-8">
          Even our expert spine surgeons and radiological MRI scans couldn't locate the page you're searching for.
          Don't worry — no spinal fusion or surgery required! Just realign your posture and head back home.
        </p>

        {/* Navigation Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1b9af7] hover:bg-[#1580cc] text-white font-medium text-xs sm:text-sm transition-all duration-300 shadow-lg shadow-blue-950/50 hover:scale-[1.02] cursor-pointer"
          >
            <MaterialIcon name="family_home" size={18} />
            <span>Realign to Home</span>
          </button>

          {onOpenFeedback && (
            <button
              type="button"
              onClick={onOpenFeedback}
              className="group inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm border border-white/15 transition-all duration-300 backdrop-blur-md hover:scale-[1.02] cursor-pointer"
            >
              <MaterialIcon name="bug_report" size={18} />
              <span>Report Dislocation</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
