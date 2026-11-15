import React from 'react'
import { motion } from 'framer-motion'
import { MaterialIcon } from './icons'

interface HeroProps {
  onReplayJourney?: () => void
  isEnteringFromJourney?: boolean
  mobileScrollProgress?: number
  isMobileCollapsed?: boolean
  onCollapseMobile?: () => void
}

export const Hero: React.FC<HeroProps> = ({
  onReplayJourney,
  isEnteringFromJourney = false,
  mobileScrollProgress,
  isMobileCollapsed = false,
  onCollapseMobile,
}) => {
  // Effective smooth scroll progress from 0 (full intermediate screen) to 1 (collapsed hero)
  const p =
    mobileScrollProgress !== undefined
      ? mobileScrollProgress
      : isMobileCollapsed
      ? 1
      : 0
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
      {/* MOBILE VIEW (< md): Continuous Scroll-Linked Morphing Hero   */}
      {/* ------------------------------------------------------------- */}
      <div
        className="md:hidden relative z-10 flex flex-col items-center text-center px-6 transition-all duration-75"
        style={{
          minHeight: p >= 1 ? '0px' : `calc(${(1 - p).toFixed(3)} * (100dvh - 86px))`,
          paddingTop: `${Math.round(p * 24)}px`,
          paddingBottom: `${Math.round(p * 12)}px`,
          justifyContent: p > 0.8 ? 'flex-start' : 'space-between',
        }}
      >
        {/* Extended Frame Top Spacer: Smoothly lowers height from 24vh down to 0 */}
        <div
          style={{
            height: `${((1 - p) * 24).toFixed(1)}vh`,
            minHeight: 0,
            opacity: 1 - p,
          }}
          className="pointer-events-none transition-all duration-75 shrink-0"
          aria-hidden="true"
        />

        {/* Center Title Block: Font size and inter-line spacing gradually scale down */}
        <div className="flex flex-col items-center text-center shrink-0">
          <span
            style={{
              fontSize: `${(18 - p * 3.5).toFixed(1)}px`,
              opacity: 1 - p * 0.3,
            }}
            className="text-white/70 font-normal tracking-normal leading-snug"
          >
            Welcome to
          </span>
          <h1
            style={{
              fontSize: `${(32 - p * 9).toFixed(1)}px`,
              lineHeight: 1.18,
            }}
            className="text-white font-bold tracking-tight flex flex-col items-center pt-1"
          >
            <span>Spine Research</span>
            <span>
              Foundation{' '}
              <span className="text-white/60 font-normal">India</span>
            </span>
          </h1>
          <p
            style={{
              fontSize: `${(16.5 - p * 2.5).toFixed(1)}px`,
              paddingTop: `${Math.round(4 * (1 - p))}px`,
            }}
            className="text-gray-300 font-normal"
          >
            By your side always...
          </p>
        </div>

        {/* Down Arrow Scroll Indicator: Smoothly dissolves as user starts scrolling */}
        <div
          style={{
            opacity: Math.max(0, 1 - p * 2.5),
            height: p > 0.4 ? 0 : 'auto',
            pointerEvents: p > 0.3 ? 'none' : 'auto',
          }}
          className="flex flex-col items-center justify-center py-2 transition-opacity duration-150 shrink-0"
        >
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

        {/* Lower Portion: Impact stat seamlessly settles from 3-line format to compact header */}
        <div
          style={{
            paddingBottom: `${Math.round(14 + (1 - p) * 82)}px`,
            paddingTop: `${Math.round(p * 8)}px`,
          }}
          className="shrink-0 transition-all duration-75"
        >
          <p
            style={{
              fontSize: `${(16.5 - p * 2.5).toFixed(1)}px`,
            }}
            className="text-white/95 font-normal leading-relaxed max-w-xs mx-auto"
          >
            Blessed to serve nearly{' '}
            <span className="font-semibold text-emerald-400">300</span>
            {p < 0.6 ? <br /> : ' '}
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
