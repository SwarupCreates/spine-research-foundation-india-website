import React from 'react'
import { MaterialIcon } from './icons'

interface MisconceptionsCardProps {
  onCheckOutMore?: () => void
}

export const MisconceptionsCard: React.FC<MisconceptionsCardProps> = ({ onCheckOutMore }) => {
  return (
    <div className="relative rounded-3xl sm:rounded-[32px] overflow-hidden glass-panel border border-white/[0.08] px-6 py-9 sm:px-10 sm:py-12 lg:px-14 lg:py-14 text-left shadow-xl transition duration-300 hover:border-white/[0.14]">
      {/* Subtle ambient lighting on base background */}
      <div
        className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-emerald-500/[0.05] rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 right-10 w-72 h-72 bg-blue-500/[0.04] rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Background Graphic Accent on the right */}
      <div
        className="absolute right-6 sm:right-12 lg:right-16 top-1/2 -translate-y-1/2 pointer-events-none select-none text-white/[0.03] overflow-hidden hidden sm:block"
        aria-hidden="true"
      >
        <MaterialIcon name="fact_check" size={260} className="text-white/[0.03]" />
      </div>

      {/* Foreground Content - Left Aligned */}
      <div className="relative z-10 max-w-xl lg:max-w-3xl text-left space-y-3 sm:space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-medium backdrop-blur-md">
          <MaterialIcon name="fact_check" size={16} />
          <span>Patient Awareness &amp; Education</span>
        </div>

        <h2 className="text-2xl sm:text-3xl lg:text-[var(--font-size-card-title,28px)] font-medium text-white tracking-tight leading-snug">
          Together, let&apos;s put an end to the misconceptions
        </h2>

        <p className="text-gray-300 text-sm sm:text-base lg:text-[var(--font-size-card-body,16px)] font-medium leading-relaxed max-w-2xl">
          Getting authentic information for your illness is difficult. The SRF team urges you
          to not fall prey to wrong ideas and notions of spine surgery.
        </p>

        <div className="pt-2 sm:pt-3">
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
