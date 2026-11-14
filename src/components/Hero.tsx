import React from 'react'

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-[270px] pb-8 sm:pt-36 sm:pb-10 lg:pt-48 lg:pb-12 overflow-hidden">
      <div className="max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-1 sm:gap-6 lg:gap-8 pt-4 sm:pt-6">
          {/* Left Title & Tagline: Center aligned on mobile, left aligned on tablet/desktop */}
          <div className="space-y-2 sm:space-y-2.5 text-center sm:text-left">
            <h1 className="text-[24px] sm:text-[30px] md:text-[32px] lg:text-[var(--font-size-hero-title,36px)] tracking-tight leading-[1.2] sm:leading-[1.2]">
              <span className="font-normal text-white/60 block">
                Welcome to
              </span>
              <span className="font-semibold text-white flex flex-wrap items-baseline justify-center sm:justify-start gap-x-1.5 sm:gap-x-2 lg:whitespace-nowrap">
                <span>Spine Research Foundation</span>
                <span className="text-white/60 font-normal">India</span>
              </span>
            </h1>

            <p className="text-gray-300 text-[18px] sm:text-[20px] lg:text-[var(--font-size-hero-subtext,22px)] font-normal leading-relaxed pt-0.5 sm:pt-1">
              By your side always...
            </p>
          </div>

          {/* Right Impact Stat: Seamlessly continuous with tagline on mobile like same paragraph with line break */}
          <div className="text-center lg:text-right self-center lg:self-end">
            <p className="text-white/95 text-sm sm:text-[20px] lg:text-[var(--font-size-hero-subtext,22px)] font-normal leading-relaxed max-w-md mx-auto lg:mx-0">
              Blessed to serve nearly{' '}
              <span className="font-medium text-emerald-400">300</span>{' '}
              underprivileged
              <br /> patients and counting
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
