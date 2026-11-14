import React from 'react'

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-10 sm:pt-48 sm:pb-12 lg:pt-60 lg:pb-14 overflow-hidden">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pt-4 sm:pt-6">
          {/* Left Title & Tagline */}
          <div className="space-y-1.5 sm:space-y-2">
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

            <p className="text-gray-300 text-[18px] sm:text-[20px] lg:text-[var(--font-size-hero-subtext,22px)] font-normal pt-1">
              By your side always...
            </p>
          </div>

          {/* Right Impact Stat */}
          <div className="lg:text-right self-start lg:self-end">
            <p className="text-white/95 text-[18px] sm:text-[20px] lg:text-[var(--font-size-hero-subtext,22px)] font-medium leading-relaxed max-w-md">
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
