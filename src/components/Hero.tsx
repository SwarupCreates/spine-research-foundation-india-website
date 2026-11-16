import React from 'react'
import { motion } from 'framer-motion'
import { MaterialIcon } from './icons'

interface HeroProps {
  onReplayJourney?: () => void
  isEnteringFromJourney?: boolean
  onScrollToCards?: () => void
  /** @deprecated Kept for backward compatibility */
  mobileScrollProgress?: number
  /** @deprecated Kept for backward compatibility */
  isMobileCollapsed?: boolean
  /** @deprecated Kept for backward compatibility */
  onCollapseMobile?: () => void
}

export const Hero: React.FC<HeroProps> = ({
  onReplayJourney,
  isEnteringFromJourney = false,
  onScrollToCards,
  onCollapseMobile,
}) => {
  return (
    <section className="relative md:pt-36 md:pb-10 lg:pt-48 lg:pb-12 overflow-hidden">
      {/* Mobile-only Silent Journey Replay Button: Pinned to top-right of the hero banner image, scrolls away naturally with page scroll */}
      {onReplayJourney && (
        <motion.div
          id="mobile-hero-replay-action"
          data-testid="mobile-hero-replay-action"
          initial={isEnteringFromJourney ? { opacity: 0, scale: 0.75 } : false}
          animate={{ opacity: 1, scale: 1 }}
          transition={
            isEnteringFromJourney
              ? { duration: 0.45, ease: 'easeOut', delay: 0.45 }
              : undefined
          }
          className="md:hidden absolute top-0.5 right-5 sm:right-6 z-20 pointer-events-auto"
        >
          <button
            type="button"
            onClick={onReplayJourney}
            aria-label="Replay welcome journey"
            title="Replay welcome journey"
            className="group relative p-1.5 -m-1.5 flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40 rounded-full"
          >
            <span className="w-8 h-8 rounded-full aspect-square bg-black/40 border border-white/[0.12] backdrop-blur-md shadow-[0_2px_8px_rgba(0,0,0,0.25)] flex items-center justify-center text-white/60 active:text-white active:bg-black/65 active:border-white/30 transition-all duration-200 active:scale-95">
              <MaterialIcon
                name="replay"
                size={16}
                className="group-active:rotate-[-180deg] transition-transform duration-300 ease-out"
              />
            </span>
          </button>
        </motion.div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* DESKTOP VIEW (>= md): Horizontal Layout preserved identically */}
      {/* ------------------------------------------------------------- */}
      <div className="hidden md:block max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-1 sm:gap-6 lg:gap-8 pt-4 sm:pt-6">
          {/* Left Title & Tagline */}
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

          {/* Right Impact Stat */}
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

      {/* ------------------------------------------------------------- */}
      {/* MOBILE VIEW (< md): Intermediate Extended Welcome Hero View  */}
      {/* Stretches to occupy full screen height; scrolls past cleanly */}
      {/* ------------------------------------------------------------- */}
      <div
        className="md:hidden relative z-10 flex flex-col items-center text-center px-6 min-h-[calc(100dvh-86px)] justify-between"
      >
        {/* Extended Frame Top Spacer: gives breathing space below header/navbar */}
        <div className="h-[14vh] min-h-[30px] shrink-0 pointer-events-none" aria-hidden="true" />

        {/* Center Title Block: matches user's image 1 (media_1794847699250_5340a870.jpg) */}
        <div className="flex flex-col items-center text-center shrink-0">
          <span className="text-white/70 font-normal tracking-normal leading-snug text-[18px]">
            Welcome to
          </span>
          <h1 className="text-white font-bold tracking-tight flex flex-col items-center pt-1 text-[32px] sm:text-[34px] leading-[1.18]">
            <span>Spine Research</span>
            <span>
              Foundation{' '}
              <span className="text-white/60 font-normal">India</span>
            </span>
          </h1>
          <p className="text-gray-300 font-normal text-[16.5px] pt-1">
            By your side always...
          </p>
        </div>

        {/* Down Arrow Scroll Indicator: clicks to scroll smoothly down past hero to reveal cards */}
        <div className="flex flex-col items-center justify-center py-2 shrink-0">
          <motion.button
            type="button"
            onClick={onScrollToCards || onCollapseMobile || (() => window.scrollTo({ top: window.innerHeight - 80, behavior: 'smooth' }))}
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            className="text-white/60 hover:text-white active:scale-90 transition-all p-3 cursor-pointer"
            aria-label="Scroll down to reveal cards"
            title="Scroll down to reveal cards"
          >
            <MaterialIcon name="arrow_cool_down" size={28} />
          </motion.button>
        </div>

        {/* Lower Portion: Impact stat with ample gutter above bottom floating action buttons */}
        <div className="shrink-0 pb-[96px] sm:pb-[104px]">
          <p className="text-white/95 font-normal leading-relaxed max-w-xs mx-auto text-[16.5px]">
            Blessed to serve nearly{' '}
            <span className="font-semibold text-emerald-400">300</span>
            <br />
            underprivileged
            <br />
            patients and counting
          </p>
        </div>
      </div>
    </section>
  )
}

export default Hero
