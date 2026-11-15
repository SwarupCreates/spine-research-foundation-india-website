import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedContent from './AnimatedContent'
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
          className="md:hidden absolute top-4 right-6 z-20 pointer-events-auto"
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
          <AnimatedContent
            trigger="mount"
            distance={30}
            duration={0.8}
            ease="power3.out"
            stagger={0.1}
            className="space-y-2 sm:space-y-2.5 text-center sm:text-left"
          >
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
          </AnimatedContent>

          {/* Right Impact Stat */}
          <AnimatedContent
            trigger="mount"
            distance={30}
            delay={0.14}
            duration={0.8}
            ease="power3.out"
            className="text-center lg:text-right self-center lg:self-end"
          >
            <p className="text-white/95 text-sm sm:text-[20px] lg:text-[var(--font-size-hero-subtext,22px)] font-normal leading-relaxed max-w-md mx-auto lg:mx-0">
              Blessed to serve nearly{' '}
              <span className="font-medium text-emerald-400">300</span>{' '}
              underprivileged
              <br /> patients and counting
            </p>
          </AnimatedContent>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MOBILE VIEW (< md): Intermediate Extended Frame (100dvh) vs Collapsed Hero */}
      {/* ------------------------------------------------------------- */}
      <motion.div
        layout
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className={`md:hidden relative z-10 flex flex-col items-center text-center px-6 transition-all duration-500 ease-out ${
          isMobileCollapsed
            ? 'pt-4 pb-4'
            : 'h-[calc(100dvh-62px)] min-h-[calc(100dvh-62px)] pt-4 pb-24 justify-between'
        }`}
      >
        {/* Upper Portion: Welcome to Spine Research Foundation India / By your side always... */}
        <div
          className={`flex flex-col items-center text-center transition-all duration-500 ${
            isMobileCollapsed ? 'pt-2 space-y-1' : 'pt-16 sm:pt-20 space-y-1.5'
          }`}
        >
          <span className="text-white/70 text-[clamp(17px,5vw,20px)] font-normal tracking-normal leading-snug">
            Welcome to
          </span>
          <h1 className="text-white text-[clamp(26px,8.2vw,34px)] font-bold tracking-tight leading-[1.18] flex flex-col items-center">
            <span>Spine Research</span>
            <span>
              Foundation{' '}
              <span className="text-white/60 font-normal">India</span>
            </span>
          </h1>
          <p className="text-gray-300 text-[clamp(15px,4.4vw,18px)] font-normal pt-0.5">
            By your side always...
          </p>
        </div>

        {/* Middle Portion (Extended Only): Down arrow button indicating scroll down to reveal */}
        <AnimatePresence>
          {!isMobileCollapsed && (
            <motion.div
              key="hero-mobile-down-arrow"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.25 } }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="my-auto py-2 flex flex-col items-center justify-center"
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
                <MaterialIcon name="arrow_cool_down" size={30} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lower Portion: Blessed to serve nearly 300 underprivileged patients and counting */}
        <motion.div
          layout
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className={`flex flex-col items-center text-center ${
            isMobileCollapsed ? 'pt-3 pb-2' : 'pb-6'
          }`}
        >
          <p className="text-white/95 text-[clamp(15px,4.5vw,19px)] font-normal leading-relaxed max-w-xs mx-auto">
            {isMobileCollapsed ? (
              <>
                Blessed to serve nearly{' '}
                <span className="font-semibold text-emerald-400">300</span>{' '}
                underprivileged
                <br />
                patients and counting
              </>
            ) : (
              <>
                Blessed to serve nearly{' '}
                <span className="font-semibold text-emerald-400">300</span>
                <br />
                underprivileged
                <br />
                patients and counting
              </>
            )}
          </p>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero
