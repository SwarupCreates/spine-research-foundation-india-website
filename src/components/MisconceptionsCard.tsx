import React from 'react'
import { MaterialIcon } from './icons'

interface MisconceptionsCardProps {
  onCheckOutMore?: () => void
}

export const MisconceptionsCard: React.FC<MisconceptionsCardProps> = ({ onCheckOutMore }) => {
  return (
    <div className="relative rounded-3xl sm:rounded-[32px] overflow-hidden glass-panel border border-white/[0.08] px-6 py-8 sm:px-10 sm:py-12 lg:px-14 lg:py-14 text-center sm:text-left shadow-xl transition duration-300 hover:border-white/[0.14]">
      {/* Mobile Top Forehead Region: Doctor image with fade to bottom edge */}
      <div className="sm:hidden relative w-full h-52 -mt-1 mb-3 overflow-hidden rounded-2xl flex items-center justify-center select-none pointer-events-none" aria-hidden="true">
        <img
          src={`${import.meta.env.BASE_URL}banners/sadDoc.jpg`}
          alt="Healthcare Specialist and Patient Perspective"
          className="w-full h-full object-cover object-[center_20%] filter brightness-[0.92] contrast-[1.05]"
          style={{
            maskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 55%, rgba(0, 0, 0, 0.4) 80%, rgba(0, 0, 0, 0) 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 55%, rgba(0, 0, 0, 0.4) 80%, rgba(0, 0, 0, 0) 100%)',
          }}
        />
      </div>

      {/* Desktop Background Image: sadDoc.jpg positioned on the right with fading to the left of the image */}
      <div 
        className="hidden sm:flex absolute inset-0 pointer-events-none select-none overflow-hidden justify-end"
        aria-hidden="true"
      >
        <img
          src={`${import.meta.env.BASE_URL}banners/sadDoc.jpg`}
          alt="Healthcare Specialist and Patient Perspective"
          className="h-full w-full sm:w-auto max-w-none object-cover sm:object-contain object-right filter brightness-[0.88] contrast-[1.05] transition-transform duration-500"
          style={{
            transform: 'scale(1.28)',
            transformOrigin: 'right center',
            maskImage: 'linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.18) 22%, rgba(0, 0, 0, 0.65) 52%, rgba(0, 0, 0, 0.95) 78%, rgba(0, 0, 0, 1) 100%)',
            WebkitMaskImage: 'linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.18) 22%, rgba(0, 0, 0, 0.65) 52%, rgba(0, 0, 0, 0.95) 78%, rgba(0, 0, 0, 1) 100%)',
          }}
        />

        {/* Ambient darkening gradient on the left side ensuring 100% text contrast */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-[#0b0c0e]/95 via-[#0b0c0e]/60 to-transparent"
          aria-hidden="true" 
        />
      </div>

      {/* Foreground Content - Centered on mobile, Left Aligned on sm/desktop */}
      <div className="relative z-10 max-w-xl lg:max-w-2xl text-center sm:text-left mx-auto sm:mx-0 space-y-3 sm:space-y-4">
        <div className="flex justify-center sm:justify-start">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-medium backdrop-blur-md">
            <MaterialIcon name="fact_check" size={16} />
            <span>Patient Awareness &amp; Education</span>
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl lg:text-[var(--font-size-card-title,28px)] font-medium text-white tracking-tight leading-snug">
          Together, let&apos;s put an end to the misconceptions
        </h2>

        <p className="text-gray-300 text-sm sm:text-base lg:text-[var(--font-size-card-body,16px)] font-medium leading-relaxed max-w-2xl mx-auto sm:mx-0">
          Getting authentic information for your illness is difficult. The SRF team urges you
          to not fall prey to wrong ideas and notions of spine surgery.
        </p>

        <div className="pt-2 sm:pt-3 flex justify-center sm:justify-start">
          <button
            type="button"
            onClick={onCheckOutMore}
            className="group inline-flex items-center gap-2 px-6 py-2.5 sm:px-7 sm:py-3 rounded-full bg-white text-gray-950 font-medium text-sm sm:text-base hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] cursor-pointer"
          >
            <MaterialIcon
              name="verified"
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

export default MisconceptionsCard
