import React from 'react'
import { motion } from 'framer-motion'
import { MaterialIcon } from './icons'

interface HeroProps {
  onReplayJourney?: () => void
  isEnteringFromJourney?: boolean
  isMobileCollapsed?: boolean
  onCollapseMobile?: () => void
}

export const Hero: React.FC<HeroProps> = ({
  onReplayJourney,
  isEnteringFromJourney = false,
  isMobileCollapsed = false,
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
      {/* MOBILE VIEW (< md): Intermediate Extended Frame (100dvh) vs Collapsed Hero */}
      {/* ------------------------------------------------------------- */}
      <div
        className={`md:hidden relative z-10 flex flex-col items-center text-center px-6 transition-[min-height,height,padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isMobileCollapsed
            ? 'min-h-0 pt-7 pb-3 sm:pt-9 sm:pb-4'
            : 'h-[calc(100dvh-86px)] min-h-[calc(100dvh-86px)] justify-between pt-0 pb-0'
        }`}
      >
        {/* Extended Frame Top Spacer: Centers the upper hero text block slightly lower on the screen */}
        {!isMobileCollapsed && (
          <div className="flex-[1.3] min-h-[22vh] max-h-[32vh] pointer-events-none" aria-hidden="true" />
        )}

        {/* Upper Portion: Welcome to Spine Research Foundation India / By your side always... */}
        <div
          className={`flex flex-col items-center text-center transition-all duration-500 shrink-0 ${
            isMobileCollapsed ? 'space-y-1' : 'space-y-1.5'
          }`}
        >
          <span className="text-white/70 text-[clamp(16px,4.8vw,19px)] font-normal tracking-normal leading-snug">
            Welcome to
          </span>
          <h1 className="text-white text-[clamp(26px,8.2vw,34px)] font-bold tracking-tight leading-[1.18] flex flex-col items-center">
            <span>Spine Research</span>
            <span>
              Foundation{' '}
              <span className="text-white/60 font-normal">India</span>
            </span>
          </h1>
          <p className="text-gray-300 text-[clamp(14.5px,4.2vw,17px)] font-normal pt-1">
            By your side always...
          </p>
        </div>

        {/* Lower Portion & Scroll Indicator */}
        {!isMobileCollapsed ? (
          <div className="flex-1 w-full flex flex-col items-center justify-between pointer-events-auto">
            {/* Down arrow indicator positioned at a lower position between first part and 2nd part */}
            <div className="flex-1 flex flex-col items-center justify-center py-2">
              <motion.button
                type="button"
                onClick={onCollapseMobile}
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                className="text-white/60 hover:text-white active:scale-90 transition-all p-3 cursor-pointer"
                aria-label="Scroll down to reveal cards"
                title="Scroll down to reveal"
              >
                <MaterialIcon name="arrow_cool_down" size={28} />
              </motion.button>
            </div>

            {/* 2nd part of hero text (Extended: 3 lines) cleared above bottom floating action buttons */}
            <div className="pb-24 sm:pb-28 shrink-0">
              <p className="text-white/95 text-[clamp(15px,4.5vw,18px)] font-normal leading-relaxed max-w-xs mx-auto">
                Blessed to serve nearly{' '}
                <span className="font-semibold text-emerald-400">300</span>
                <br />
                underprivileged
                <br />
                patients and counting
              </p>
            </div>
          </div>
        ) : (
          /* Collapsed state: 2nd part of hero text rearranged into 2 lines with shorter font */
          <div className="pt-2.5 pb-1">
            <p className="text-white/80 text-[13.5px] sm:text-[14px] font-normal leading-snug max-w-xs mx-auto">
              Blessed to serve nearly{' '}
              <span className="font-medium text-emerald-400">300</span>{' '}
              underprivileged
              <br />
              patients and counting
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default Hero
