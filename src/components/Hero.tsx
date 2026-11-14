import React from 'react'

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-6 pb-6 sm:pt-10 sm:pb-8 lg:pt-12 lg:pb-10 overflow-hidden">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8">
          {/* Left Title & Tagline */}
          <div className="space-y-1 sm:space-y-1.5">
            <span className="text-white text-[24px] sm:text-[30px] md:text-[32px] lg:text-[var(--font-size-hero-title,36px)] font-normal tracking-tight block leading-tight">
              Welcome to
            </span>
            
            <h1 className="text-[24px] sm:text-[30px] md:text-[32px] lg:text-[var(--font-size-hero-title,36px)] leading-tight tracking-tight lg:whitespace-nowrap flex flex-wrap items-baseline gap-x-2.5">
              <span className="font-semibold text-white">
                Spine Research Foundation
              </span>
              <span className="font-semibold text-white/60">
                India
              </span>
            </h1>

            <p className="text-gray-300 text-[15px] sm:text-[16px] lg:text-[var(--font-size-hero-subtext,18px)] font-normal pt-0.5">
              By your side always...
            </p>
          </div>

          {/* Right Impact Stat */}
          <div className="lg:text-right self-start lg:self-end">
            <p className="text-white/95 text-[15px] sm:text-[16px] lg:text-[var(--font-size-hero-subtext,18px)] font-medium leading-relaxed max-w-sm">
              Blessed to serve nearly{' '}
              <span className="font-medium text-emerald-400">300</span>{' '}
              underprivileged
              <br className="hidden sm:inline" /> patients and counting
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
