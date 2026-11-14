import React from 'react'
import { MaterialIcon } from './icons'

interface PromiseCardProps {
  onCheckOutMore?: () => void
}

export const PromiseCard: React.FC<PromiseCardProps> = ({ onCheckOutMore }) => {
  return (
    <div className="relative rounded-3xl sm:rounded-[32px] overflow-hidden glass-panel border border-white/[0.08] px-6 py-9 sm:px-10 sm:py-12 lg:px-14 lg:py-14 text-center sm:text-left shadow-xl transition duration-300 hover:border-white/[0.14]">
      {/* Background Image: Hands Donning Teal Medical Gloves on the right with fade-out at the right edge */}
      <div 
        className="absolute inset-0 pointer-events-none select-none overflow-hidden flex justify-end items-center"
        aria-hidden="true"
      >
        <img
          src={`${import.meta.env.BASE_URL}banners/Hands%20Donning%20Teal%20Medical%20Gloves.png`}
          alt="Hands Donning Teal Medical Gloves"
          className="h-[82%] sm:h-[85%] lg:h-[88%] w-auto max-w-none object-contain object-right filter brightness-[0.88] contrast-[1.05] opacity-85"
          style={{
            maskImage: 'linear-gradient(to right, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 0.55) 78%, rgba(0, 0, 0, 0) 100%)',
            WebkitMaskImage: 'linear-gradient(to right, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 0.55) 78%, rgba(0, 0, 0, 0) 100%)',
          }}
        />

        {/* Ambient subtle teal/emerald radial glow highlighting the medical glove theme on the right */}
        <div 
          className="absolute -right-12 top-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-teal-500/[0.08] rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />
      </div>

      {/* Foreground Content - Centered on mobile, Left Aligned on sm/desktop */}
      <div className="relative z-10 max-w-xl lg:max-w-2xl text-center sm:text-left mx-auto sm:mx-0 space-y-3 sm:space-y-4">
        <div className="flex justify-center sm:justify-start">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-medium backdrop-blur-md">
            <MaterialIcon name="volunteer_activism" size={16} />
            <span>Core Mission &amp; Humanitarian Care</span>
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl lg:text-[var(--font-size-card-title,28px)] font-medium text-white tracking-tight leading-snug">
          Our Promise
        </h2>

        <p className="text-gray-300 text-sm sm:text-base lg:text-[var(--font-size-card-body,16px)] font-medium leading-relaxed max-w-xl mx-auto sm:mx-0">
          We care for people at the lowest points in their lives, and we do it no matter who
          they are, where they&apos;re from, or whether or not they can pay.
        </p>

        <div className="pt-2 sm:pt-3 flex justify-center sm:justify-start">
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
