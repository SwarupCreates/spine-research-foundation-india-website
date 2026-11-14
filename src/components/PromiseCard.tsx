import React from 'react'
import { SrfLogo, MaterialIcon } from './icons'

interface PromiseCardProps {
  onCheckOutMore?: () => void
}

export const PromiseCard: React.FC<PromiseCardProps> = ({ onCheckOutMore }) => {
  return (
    <div className="relative rounded-3xl sm:rounded-[32px] overflow-hidden glass-panel border border-white/[0.08] px-6 py-9 sm:px-10 sm:py-12 lg:px-14 lg:py-14 text-left shadow-xl transition duration-300 hover:border-white/[0.14]">
      {/* Background Watermark Graphic on the right side, softly fading out at the bottom */}
      <div 
        className="absolute right-4 sm:right-8 lg:right-16 top-4 sm:top-6 bottom-0 flex items-start pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
        style={{
          maskImage: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.20) 0%, rgba(255, 255, 255, 0.06) 55%, rgba(255, 255, 255, 0) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.20) 0%, rgba(255, 255, 255, 0.06) 55%, rgba(255, 255, 255, 0) 100%)',
        }}
      >
        <div className="w-48 h-48 sm:w-60 sm:h-60 lg:w-72 lg:h-72 text-white shrink-0">
          <SrfLogo className="w-full h-full text-white" />
        </div>
      </div>

      {/* Foreground Content - Left Aligned */}
      <div className="relative z-10 max-w-xl lg:max-w-2xl text-left space-y-3 sm:space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-medium backdrop-blur-md">
          <MaterialIcon name="volunteer_activism" size={16} />
          <span>Core Mission &amp; Humanitarian Care</span>
        </div>

        <h2 className="text-2xl sm:text-3xl lg:text-[var(--font-size-card-title,28px)] font-medium text-white tracking-tight leading-snug">
          Our Promise
        </h2>

        <p className="text-gray-300 text-sm sm:text-base lg:text-[var(--font-size-card-body,16px)] font-medium leading-relaxed max-w-xl">
          We care for people at the lowest points in their lives, and we do it no matter who
          they are, where they&apos;re from, or whether or not they can pay.
        </p>

        <div className="pt-2 sm:pt-3">
          <button
            type="button"
            onClick={onCheckOutMore}
            className="group inline-flex items-center gap-2 px-6 py-2.5 sm:px-7 sm:py-3 rounded-full bg-white text-gray-950 font-medium text-sm sm:text-base hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] cursor-pointer"
          >
            <MaterialIcon
              name="diversity_1"
              size={20}
              className="text-gray-900 group-hover:text-emerald-700 transition-colors shrink-0"
            />
            <span className="font-medium whitespace-nowrap">Check out more</span>

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

export default PromiseCard
