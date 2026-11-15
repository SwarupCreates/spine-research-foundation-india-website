import React from 'react'
import { motion } from 'framer-motion'
import AnimatedContent from './AnimatedContent'
import { MaterialIcon } from './icons'

interface HeroProps {
  onReplayJourney?: () => void
  isEnteringFromJourney?: boolean
}

export const Hero: React.FC<HeroProps> = ({
  onReplayJourney,
  isEnteringFromJourney = false,
}) => {
  return (
    <section className="relative pt-[270px] pb-8 sm:pt-36 sm:pb-10 lg:pt-48 lg:pb-12 overflow-hidden">
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

      <div className="max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-1 sm:gap-6 lg:gap-8 pt-4 sm:pt-6">
          {/* Left Title & Tagline: Center aligned on mobile, left aligned on tablet/desktop */}
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

          {/* Right Impact Stat: Seamlessly continuous with tagline on mobile like same paragraph with line break */}
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
    </section>
  )
}

export default Hero
