import React from 'react'

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-8 pb-12 sm:pt-14 sm:pb-16 overflow-hidden">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pt-4 sm:pt-8">
          {/* Left Title & Tagline */}
          <div className="max-w-3xl space-y-2">
            <span className="text-gray-300 text-lg sm:text-xl font-medium tracking-wide block">
              Welcome to
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold text-white tracking-tight leading-[1.15]">
              Spine Research Foundation India
            </h1>
            <p className="text-gray-300/90 text-lg sm:text-xl italic font-medium pt-1">
              By your side always...
            </p>
          </div>

          {/* Right Impact Stat / Quote */}
          <div className="lg:text-right max-w-sm self-start lg:self-end">
            <p className="text-white/95 text-base sm:text-lg md:text-xl font-medium leading-relaxed">
              Blessed to serve nearly{' '}
              <span className="font-medium text-emerald-400">300</span>{' '}
              underprivileged patients and counting
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
