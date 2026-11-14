import React from 'react'
import { SrfLogo, MaterialIcon } from './icons'

interface GlassCardProps {
  onReadMore?: () => void
}

export const GlassCard: React.FC<GlassCardProps> = ({ onReadMore }) => {
  return (
    <div className="relative rounded-3xl sm:rounded-[32px] overflow-hidden glass-panel border border-white/[0.08] px-6 py-8 sm:px-10 sm:py-12 lg:px-14 lg:py-14 text-center sm:text-left shadow-xl transition duration-300 hover:border-white/[0.14]">
      {/* Mobile Top Forehead Region: Larger center-aligned watermark with top-to-bottom white gradient */}
      <div 
        className="sm:hidden flex justify-center pt-1 pb-4 select-none pointer-events-none overflow-hidden" 
        aria-hidden="true"
        style={{
          maskImage: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.12) 55%, rgba(255, 255, 255, 0) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.12) 55%, rgba(255, 255, 255, 0) 100%)',
        }}
      >
        <div className="w-36 h-36 text-white shrink-0 drop-shadow-[0_0_24px_rgba(255,255,255,0.12)]">
          <SrfLogo className="w-full h-full text-white" />
        </div>
      </div>

      {/* Desktop Background Watermark Logo shifted to the right, shortened so top is not clipped, fading out at bottom */}
      <div 
        className="hidden sm:flex absolute right-4 sm:right-8 lg:right-16 top-4 sm:top-6 bottom-0 items-start pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
        style={{
          maskImage: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.08) 55%, rgba(255, 255, 255, 0) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.08) 55%, rgba(255, 255, 255, 0) 100%)',
        }}
      >
        <div className="w-48 h-48 sm:w-60 sm:h-60 lg:w-72 lg:h-72 text-white shrink-0">
          <SrfLogo className="w-full h-full text-white" />
        </div>
      </div>

      {/* Foreground Content - Centered on mobile, Left Aligned on sm/desktop */}
      <div className="relative z-10 max-w-xl lg:max-w-2xl text-center sm:text-left mx-auto sm:mx-0 space-y-3 sm:space-y-4">
        <h2 className="text-2xl sm:text-3xl lg:text-[var(--font-size-card-title,28px)] font-medium text-white tracking-tight leading-snug">
          The best of health care within your reach
        </h2>
        
        <p className="text-gray-300 text-sm sm:text-base lg:text-[var(--font-size-card-body,16px)] font-medium leading-relaxed max-w-lg mx-auto sm:mx-0">
          We commit to your problems with all zeal and might
        </p>

        <div className="pt-2 sm:pt-3 flex justify-center sm:justify-start">
          <button
            type="button"
            onClick={onReadMore}
            className="group inline-flex items-center gap-2 px-6 py-2.5 sm:px-7 sm:py-3 rounded-full bg-white text-gray-950 font-medium text-sm sm:text-base hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] cursor-pointer"
          >
            <MaterialIcon
              name="menu_book"
              size={20}
              className="text-gray-900 group-hover:text-emerald-700 transition-colors shrink-0"
            />
            <span className="font-medium whitespace-nowrap">Read more about SRF India</span>

            {/* Bouncy expanding arrow on hover */}
            <span className="max-w-0 opacity-0 -translate-x-3 group-hover:max-w-[28px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] overflow-hidden inline-flex items-center">
              <MaterialIcon
                name="arrow_forward"
                size={18}
                className="text-gray-900 shrink-0 ml-1"
              />
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default GlassCard
