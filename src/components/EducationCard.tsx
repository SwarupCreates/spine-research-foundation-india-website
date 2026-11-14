import React from 'react'
import { MaterialIcon } from './icons'

interface EducationCardProps {
  onCheckOutMore?: () => void
}

export const EducationCard: React.FC<EducationCardProps> = ({ onCheckOutMore }) => {
  return (
    <div className="relative rounded-3xl sm:rounded-[32px] overflow-hidden glass-panel border border-white/[0.08] px-6 py-9 sm:px-10 sm:py-12 lg:px-14 lg:py-14 text-left shadow-xl transition duration-300 hover:border-white/[0.14]">
      {/* Background Image: Group Discussion with gradual left-side transparency fade */}
      <div 
        className="absolute inset-0 pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <img
          src={`${import.meta.env.BASE_URL}banners/groupDiscussion.png`}
          alt="SRF India Education and Mentorship Group Discussion"
          className="w-full h-full object-cover object-[70%_center] filter brightness-[0.72] contrast-[1.05]"
          style={{
            maskImage: 'linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 24%, rgba(0, 0, 0, 0.45) 50%, rgba(0, 0, 0, 0.9) 75%, rgba(0, 0, 0, 1) 100%)',
            WebkitMaskImage: 'linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 24%, rgba(0, 0, 0, 0.45) 50%, rgba(0, 0, 0, 0.9) 75%, rgba(0, 0, 0, 1) 100%)',
          }}
        />

        {/* Ambient darkening gradient on the left side ensuring 100% text contrast */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-[#0b0c0e]/95 via-[#0b0c0e]/60 to-transparent"
          aria-hidden="true" 
        />
      </div>

      {/* Foreground Content - Left Aligned */}
      <div className="relative z-10 max-w-xl lg:max-w-2xl text-left space-y-3 sm:space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-medium backdrop-blur-md">
          <MaterialIcon name="school" size={16} />
          <span>Education &amp; Research Endeavours</span>
        </div>

        <h2 className="text-2xl sm:text-3xl lg:text-[var(--font-size-card-title,28px)] font-medium text-white tracking-tight leading-snug">
          Shaping tomorrow&apos;s health care with our education &amp; research endeavours
        </h2>

        <p className="text-gray-300 text-sm sm:text-base lg:text-[var(--font-size-card-body,16px)] font-medium leading-relaxed max-w-xl">
          We strive everyday to open up new avenues in spine surgery and impact future spine
          surgeons through our mentorship and guidance.
        </p>

        <div className="pt-2 sm:pt-3">
          <button
            type="button"
            onClick={onCheckOutMore}
            className="group inline-flex items-center gap-2 px-6 py-2.5 sm:px-7 sm:py-3 rounded-full bg-white text-gray-950 font-medium text-sm sm:text-base hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] cursor-pointer"
          >
            <MaterialIcon
              name="psychology"
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

export default EducationCard
