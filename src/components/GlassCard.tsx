import React from 'react'
import { SrfLogo, MaterialIcon } from './icons'

interface GlassCardProps {
  onReadMore?: () => void
}

export const GlassCard: React.FC<GlassCardProps> = ({ onReadMore }) => {
  return (
    <div className="relative rounded-3xl sm:rounded-[32px] overflow-hidden glass-panel border border-white/[0.08] px-6 py-10 sm:px-12 sm:py-14 text-center shadow-xl transition duration-300 hover:border-white/[0.14]">
      {/* Background Watermark Logo with linear top-to-bottom gradient (#ffffff -> #ffffff 0%) */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
        style={{
          maskImage: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.08) 55%, rgba(255, 255, 255, 0) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.08) 55%, rgba(255, 255, 255, 0) 100%)',
        }}
      >
        <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 text-white transform scale-110">
          <SrfLogo className="w-full h-full text-white" />
        </div>
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 max-w-3xl mx-auto space-y-4">
        <h2 className="text-2xl sm:text-3xl md:text-[var(--font-size-card-title,28px)] font-medium text-white tracking-tight leading-snug">
          The best of health care within your reach
        </h2>
        <p className="text-gray-300 text-sm sm:text-base md:text-[var(--font-size-card-body,16px)] font-medium max-w-xl mx-auto leading-relaxed">
          We commit to your problems with all zeal and might
        </p>

        <div className="pt-2">
          <button
            type="button"
            onClick={onReadMore}
            className="group inline-flex items-center gap-2.5 px-6 py-2.5 sm:px-7 sm:py-3 rounded-full bg-white text-gray-950 font-medium text-sm sm:text-base hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] cursor-pointer"
          >
            <MaterialIcon
              name="menu_book"
              size={20}
              className="text-gray-900 group-hover:text-emerald-700 transition-colors"
            />
            <span className="font-medium">Read more about SRF India</span>
            <MaterialIcon
              name="arrow_forward"
              size={18}
              className="text-gray-700 group-hover:translate-x-1 group-hover:text-black transition-all"
            />
          </button>
        </div>
      </div>
    </div>
  )
}

export default GlassCard
