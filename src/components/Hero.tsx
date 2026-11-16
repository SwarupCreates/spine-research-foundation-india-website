import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MaterialIcon } from './icons'
import { BlurText } from './BlurText'

interface HeroProps {
  onReplayJourney?: () => void
  isEnteringFromJourney?: boolean
  onScrollToCards?: () => void
  onReadMore?: () => void
  /** @deprecated Kept for backward compatibility */
  mobileScrollProgress?: number
  /** @deprecated Kept for backward compatibility */
  isMobileCollapsed?: boolean
  /** @deprecated Kept for backward compatibility */
  onCollapseMobile?: () => void
}

/* ------------------------------------------------------------------ */
/* Slideshow Pane Wrapper – handles blur fade-in / fade-out per pane  */
/* ------------------------------------------------------------------ */
const paneFadeVariants = {
  initial: { opacity: 0, filter: 'blur(12px)' },
  animate: { opacity: 1, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
  exit: { opacity: 0, filter: 'blur(12px)', transition: { duration: 0.55, ease: [0.55, 0, 0.9, 0.45] as const } },
}

const SLIDE_INTERVAL = 4000 // ms between slides
const ENTRANCE_SETTLE_TIME = 2800 // ms to wait for entrance animation before starting rotation

export const Hero: React.FC<HeroProps> = ({
  onReplayJourney,
  isEnteringFromJourney = false,
  onScrollToCards,
  onReadMore,
  onCollapseMobile,
}) => {
  /* ---- Slideshow state ---- */
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slideshowReady, setSlideshowReady] = useState(!isEnteringFromJourney)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Staggered reveal states when entering from journey (only for pane 0 initial entrance)
  const [showItem1, setShowItem1] = useState(!isEnteringFromJourney)
  const [showItem2, setShowItem2] = useState(!isEnteringFromJourney)
  const [showItem3, setShowItem3] = useState(!isEnteringFromJourney)
  const [showItem4, setShowItem4] = useState(!isEnteringFromJourney)
  const [showItem5, setShowItem5] = useState(!isEnteringFromJourney)
  const [showButton, setShowButton] = useState(!isEnteringFromJourney)

  // Entrance stagger logic (only for initial pane 0 reveal)
  useEffect(() => {
    if (isEnteringFromJourney) {
      setShowItem1(false)
      setShowItem2(false)
      setShowItem3(false)
      setShowItem4(false)
      setShowItem5(false)
      setShowButton(false)
      setSlideshowReady(false)
      setCurrentSlide(0)

      const t1 = setTimeout(() => setShowItem1(true), 150)
      const t2 = setTimeout(() => setShowItem2(true), 550)
      const t3 = setTimeout(() => setShowItem3(true), 950)
      const t4 = setTimeout(() => setShowItem4(true), 1350)
      const t5 = setTimeout(() => setShowItem5(true), 1750)
      const tBtn = setTimeout(() => setShowButton(true), 2150)
      const tReady = setTimeout(() => setSlideshowReady(true), ENTRANCE_SETTLE_TIME)

      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
        clearTimeout(t3)
        clearTimeout(t4)
        clearTimeout(t5)
        clearTimeout(tBtn)
        clearTimeout(tReady)
      }
    } else {
      setShowItem1(true)
      setShowItem2(true)
      setShowItem3(true)
      setShowItem4(true)
      setShowItem5(true)
      setShowButton(true)
      setSlideshowReady(true)
    }
  }, [isEnteringFromJourney])

  // Auto-rotate slides once ready
  useEffect(() => {
    if (!slideshowReady) return
    intervalRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev === 0 ? 1 : 0))
    }, SLIDE_INTERVAL)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [slideshowReady])

  const handleScrollDown = useCallback(() => {
    if (onScrollToCards) {
      onScrollToCards()
    } else if (onCollapseMobile) {
      onCollapseMobile()
    } else {
      window.scrollTo({ top: window.innerHeight - 80, behavior: 'smooth' })
    }
  }, [onScrollToCards, onCollapseMobile])

  const handleReadMore = onReadMore || (() => window.location.assign('/about'))

  /* ================================================================ */
  /*  SHARED SUB-COMPONENTS                                           */
  /* ================================================================ */

  /* ---- Scroll arrow (shared by both panes) ---- */
  const ScrollArrow = ({ className = '' }: { className?: string }) => (
    <motion.button
      type="button"
      onClick={handleScrollDown}
      animate={{ y: [0, 5, 0] }}
      transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
      className={`text-white/60 hover:text-white active:scale-90 transition-all p-1.5 cursor-pointer flex items-center justify-center ${className}`}
      aria-label="Scroll down to reveal cards"
      title="Scroll down to reveal cards"
    >
      <MaterialIcon name="arrow_cool_down" size={28} className="text-white/65" />
    </motion.button>
  )

  /* ---- CTA Button (shared by both panes) ---- */
  const CTAButton = ({ animate: shouldAnimate = false, mobile = false }: { animate?: boolean; mobile?: boolean }) => (
    <motion.button
      type="button"
      onClick={handleReadMore}
      initial={shouldAnimate ? { opacity: 0, y: 12, scale: 0.95 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={shouldAnimate ? { duration: 0.45, ease: [0.16, 1, 0.3, 1] } : undefined}
      className={`group inline-flex items-center gap-2 ${mobile ? 'px-6 py-2.5' : 'px-6 py-2.5 sm:px-7 sm:py-3'} rounded-full bg-black/40 ${mobile ? 'active:bg-black/60' : 'hover:bg-black/60'} border border-white/20 ${mobile ? 'active:border-white/40' : 'hover:border-white/40'} text-white font-sans font-medium ${mobile ? 'text-sm' : 'text-sm sm:text-base'} backdrop-blur-md transition-all shadow-lg ${mobile ? 'active:scale-95' : 'hover:shadow-xl hover:scale-[1.02] active:scale-95'} cursor-pointer`}
      aria-label="Read About SRF"
    >
      <MaterialIcon name="menu_book" size={18} className="text-white/85 shrink-0" />
      <span className="font-medium whitespace-nowrap">Read About SRF</span>
    </motion.button>
  )

  /* ================================================================ */
  /*  PANE 0: Narrative Content (existing)                            */
  /* ================================================================ */
  const blurCommonDesktop = "text-white font-galano-alt font-semibold text-[clamp(20px,2.2vw,32px)] leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] text-center justify-center"
  const blurCommonMobile = "font-galano-alt font-semibold text-white text-[clamp(21px,6.2vw,25.5px)] leading-[1.22] text-center drop-shadow-md mx-auto justify-center"

  const narrativeLines = [
    { text: "Two decades of commitment & counting", show: showItem1 },
    { text: "A family to work with – A family to work for", show: showItem2 },
    { text: "A bounty of love, A legacy to uphold", show: showItem3 },
    { text: "A promise spoken in silence – fulfilled with glory", show: showItem4 },
  ]

  /* ---- Desktop Pane 0 ---- */
  const DesktopPane0 = () => (
    <div className="max-w-2xl mx-auto flex flex-col items-center text-center space-y-3.5 lg:space-y-4 select-none">
      {narrativeLines.map((line, i) => (
        <div key={i} className="w-full flex items-center justify-center text-center min-h-[36px]">
          {line.show ? (
            <BlurText
              text={line.text}
              effect="blur" animateBy="words" direction="bottom" trigger="load"
              delay={40} stepDuration={0.25} blur={10} distance={12}
              className={blurCommonDesktop}
            />
          ) : (
            <div className="invisible font-galano-alt font-semibold text-[clamp(20px,2.2vw,32px)] leading-tight" aria-hidden="true">
              {line.text}
            </div>
          )}
        </div>
      ))}

      {/* "One spine at a time" */}
      <div className="w-full flex items-center justify-center text-center pt-1 min-h-[40px]">
        {showItem5 ? (
          <BlurText
            text="One spine at a time"
            effect="blur" animateBy="words" direction="bottom" trigger="load"
            delay={50} stepDuration={0.28} blur={12} distance={14} color="#ff0000"
            className="font-galano-alt font-semibold text-[#ff0000] text-[clamp(20px,2.2vw,32px)] leading-tight drop-shadow-[0_2px_16px_rgba(255,0,0,0.4)] text-center justify-center"
          />
        ) : (
          <div className="invisible font-galano-alt font-semibold text-[#ff0000] text-[clamp(20px,2.2vw,32px)] leading-tight" aria-hidden="true">
            One spine at a time
          </div>
        )}
      </div>

      {/* CTA Button */}
      <div className="pt-3 min-h-[50px] flex items-center justify-center">
        {showButton ? <CTAButton animate /> : <div className="invisible h-11 px-7" aria-hidden="true" />}
      </div>
    </div>
  )

  /* ---- Mobile Pane 0 ---- */
  const MobilePane0 = () => (
    <div className="flex flex-col items-center text-center shrink-0 select-none w-full">
      {/* 4 Narrative Stanzas */}
      <div className="flex flex-col items-center text-center space-y-4 sm:space-y-4.5 max-w-[310px] sm:max-w-[340px] mx-auto select-none">
        {narrativeLines.map((line, i) => (
          <div key={i} className="w-full flex items-center justify-center text-center">
            {line.show ? (
              <BlurText
                text={line.text}
                effect="blur" animateBy="words" direction="bottom" trigger="load"
                delay={40} stepDuration={0.24} blur={8} distance={10}
                className={blurCommonMobile}
              />
            ) : (
              <div className="invisible font-galano-alt font-semibold text-white text-[clamp(21px,6.2vw,25.5px)] leading-[1.22] text-center mx-auto" aria-hidden="true">
                {line.text}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Scroll Arrow */}
      <div className="flex flex-col items-center justify-center pt-3.5 sm:pt-4 pb-2 sm:pb-2.5 shrink-0">
        <ScrollArrow />
      </div>

      {/* Bottom Cluster: "One spine at a time" + CTA */}
      <div className="shrink-0 flex flex-col items-center text-center select-none pt-0.5 sm:pt-1">
        <div className="flex items-center justify-center text-center min-h-[34px]">
          {showItem5 ? (
            <BlurText
              text="One spine at a time"
              effect="blur" animateBy="words" direction="bottom" trigger="load"
              delay={45} stepDuration={0.26} blur={10} distance={12} color="#ff0000"
              className="font-galano-alt font-semibold text-[#ff0000] text-[clamp(21.5px,6.2vw,26px)] leading-tight text-center drop-shadow-[0_2px_12px_rgba(255,0,0,0.35)] justify-center"
            />
          ) : (
            <div className="invisible font-galano-alt font-semibold text-[#ff0000] text-[clamp(21.5px,6.2vw,26px)] leading-tight text-center justify-center" aria-hidden="true">
              One spine at a time
            </div>
          )}
        </div>

        <div className="pt-3 sm:pt-3.5 flex items-center justify-center min-h-[46px]">
          {showButton ? <CTAButton animate mobile /> : <div className="invisible h-10 px-6" aria-hidden="true" />}
        </div>
      </div>
    </div>
  )

  /* ================================================================ */
  /*  PANE 1: Journey Content (Meet Durga / Poetic Stanzas)           */
  /* ================================================================ */

  const poeticLines = [
    { prefix: 'As a son,', suffix: 'he tends the mother,' },
    { prefix: 'As a father,', suffix: 'he lulls the child,' },
    { prefix: 'As a brother,', suffix: 'he shares the fret ...' },
  ]

  /* ---- Desktop Pane 1 ---- */
  const DesktopPane1 = () => (
    <div className="max-w-2xl mx-auto flex flex-col items-center text-center space-y-3.5 lg:space-y-4 select-none">
      {/* "Meet Durga" title */}
      <div className="w-full flex items-center justify-center text-center min-h-[40px]">
        <BlurText
          text="Meet Durga"
          effect="blur" animateBy="words" direction="bottom" trigger="load"
          delay={60} stepDuration={0.3} blur={12} distance={14}
          className="text-white font-galano-alt font-semibold text-[clamp(22px,2.4vw,36px)] leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] text-center justify-center"
        />
      </div>

      {/* Poetic stanzas with prefix/suffix color split */}
      {poeticLines.map((line, i) => (
        <div key={i} className="w-full flex flex-wrap items-center justify-center text-center min-h-[36px] gap-x-2">
          <BlurText
            text={line.prefix}
            effect="blur" animateBy="words" direction="bottom" trigger="load"
            delay={40} stepDuration={0.25} blur={10} distance={12}
            className="text-white/55 font-galano-alt font-semibold text-[clamp(20px,2.2vw,32px)] leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] text-center justify-center italic"
          />
          <BlurText
            text={line.suffix}
            effect="blur" animateBy="words" direction="bottom" trigger="load"
            delay={40 + (i + 1) * 80} stepDuration={0.25} blur={10} distance={12}
            className="text-white font-galano-alt font-semibold text-[clamp(20px,2.2vw,32px)] leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] text-center justify-center"
          />
        </div>
      ))}

      {/* "But... as a witness," + "he blesses the world!" */}
      <div className="w-full flex flex-col items-center justify-center text-center pt-2 min-h-[72px] space-y-0.5">
        <div className="flex flex-wrap items-center justify-center gap-x-2">
          <BlurText
            text="But..."
            effect="blur" animateBy="words" direction="bottom" trigger="load"
            delay={60} stepDuration={0.28} blur={12} distance={14}
            className="text-white font-galano font-black text-[clamp(20px,2.2vw,32px)] leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] text-center justify-center"
          />
          <BlurText
            text="as a witness,"
            effect="blur" animateBy="words" direction="bottom" trigger="load"
            delay={120} stepDuration={0.28} blur={12} distance={14}
            className="text-[#ff0000] font-galano font-black text-[clamp(20px,2.2vw,32px)] leading-tight drop-shadow-[0_2px_16px_rgba(255,0,0,0.4)] text-center justify-center"
          />
        </div>
        <BlurText
          text="he blesses the world!"
          effect="blur" animateBy="words" direction="bottom" trigger="load"
          delay={200} stepDuration={0.28} blur={12} distance={14}
          className="text-white font-galano-alt font-semibold text-[clamp(20px,2.2vw,32px)] leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] text-center justify-center"
        />
      </div>

      {/* CTA Button */}
      <div className="pt-3 min-h-[50px] flex items-center justify-center">
        <CTAButton />
      </div>
    </div>
  )

  /* ---- Mobile Pane 1 ---- */
  const MobilePane1 = () => (
    <div className="flex flex-col items-center text-center shrink-0 select-none w-full">
      {/* "Meet Durga" + Poetic lines */}
      <div className="flex flex-col items-center text-center space-y-3.5 sm:space-y-4 max-w-[310px] sm:max-w-[340px] mx-auto select-none">
        {/* Meet Durga title */}
        <div className="w-full flex items-center justify-center text-center">
          <BlurText
            text="Meet Durga"
            effect="blur" animateBy="words" direction="bottom" trigger="load"
            delay={50} stepDuration={0.28} blur={10} distance={12}
            className="font-galano-alt font-semibold text-white text-[clamp(23px,6.5vw,28px)] leading-[1.18] text-center drop-shadow-md mx-auto justify-center"
          />
        </div>

        {/* Poetic stanzas with prefix/suffix color split */}
        {poeticLines.map((line, i) => (
          <div key={i} className="w-full flex flex-col items-center justify-center text-center">
            <BlurText
              text={line.prefix}
              effect="blur" animateBy="words" direction="bottom" trigger="load"
              delay={40} stepDuration={0.24} blur={8} distance={10}
              className="font-galano-alt font-semibold text-white/55 text-[clamp(20px,5.8vw,24px)] leading-[1.22] text-center drop-shadow-md mx-auto justify-center italic"
            />
            <BlurText
              text={line.suffix}
              effect="blur" animateBy="words" direction="bottom" trigger="load"
              delay={40 + (i + 1) * 60} stepDuration={0.24} blur={8} distance={10}
              className="font-galano-alt font-semibold text-white text-[clamp(21px,6.2vw,25.5px)] leading-[1.22] text-center drop-shadow-md mx-auto justify-center"
            />
          </div>
        ))}
      </div>

      {/* Scroll Arrow */}
      <div className="flex flex-col items-center justify-center pt-3.5 sm:pt-4 pb-2 sm:pb-2.5 shrink-0">
        <ScrollArrow />
      </div>

      {/* Bottom Cluster: "But... as a witness, he blesses the world!" + CTA */}
      <div className="shrink-0 flex flex-col items-center text-center select-none pt-0.5 sm:pt-1">
        <div className="flex flex-col items-center justify-center text-center min-h-[52px] space-y-0">
          <div className="flex flex-wrap items-center justify-center gap-x-1.5">
            <BlurText
              text="But..."
              effect="blur" animateBy="words" direction="bottom" trigger="load"
              delay={50} stepDuration={0.26} blur={10} distance={12}
              className="font-galano font-black text-white text-[clamp(21px,6.2vw,25.5px)] leading-tight text-center drop-shadow-md justify-center"
            />
            <BlurText
              text="as a witness,"
              effect="blur" animateBy="words" direction="bottom" trigger="load"
              delay={100} stepDuration={0.26} blur={10} distance={12}
              className="font-galano font-black text-[#ff0000] text-[clamp(21px,6.2vw,25.5px)] leading-tight text-center drop-shadow-[0_2px_12px_rgba(255,0,0,0.35)] justify-center"
            />
          </div>
          <BlurText
            text="he blesses the world!"
            effect="blur" animateBy="words" direction="bottom" trigger="load"
            delay={160} stepDuration={0.26} blur={10} distance={12}
            className="font-galano-alt font-semibold text-white text-[clamp(21px,6.2vw,25.5px)] leading-tight text-center drop-shadow-md justify-center"
          />
        </div>

        <div className="pt-3 sm:pt-3.5 flex items-center justify-center min-h-[46px]">
          <CTAButton mobile />
        </div>
      </div>
    </div>
  )

  /* ================================================================ */
  /*  RENDER                                                          */
  /* ================================================================ */

  return (
    <section className="relative overflow-hidden font-galano-alt">
      {/* Mobile-only Silent Journey Replay Button */}
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
          className="md:hidden absolute top-2 right-5 sm:right-6 z-20 pointer-events-auto"
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
      {/* DESKTOP VIEW (>= md): Slideshow between Pane 0 and Pane 1    */}
      {/* ------------------------------------------------------------- */}
      <div className="hidden md:flex flex-col items-center justify-center text-center max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 pt-32 lg:pt-36 xl:pt-40 pb-16 lg:pb-24 relative z-10">
        <AnimatePresence mode="wait">
          {currentSlide === 0 ? (
            <motion.div key="desktop-pane-0" variants={paneFadeVariants} initial={isEnteringFromJourney ? false : "initial"} animate="animate" exit="exit">
              <DesktopPane0 />
            </motion.div>
          ) : (
            <motion.div key="desktop-pane-1" variants={paneFadeVariants} initial="initial" animate="animate" exit="exit">
              <DesktopPane1 />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MOBILE VIEW (< md): Slideshow between Pane 0 and Pane 1      */}
      {/* ------------------------------------------------------------- */}
      <div className="md:hidden relative z-10 flex flex-col items-center justify-between text-center px-6 min-h-[calc(100dvh-86px)] pt-3 sm:pt-5 pb-[122px] sm:pb-[138px]">
        {/* Top Spacer */}
        <div className="h-[2vh] min-h-[8px] shrink-0 pointer-events-none" aria-hidden="true" />

        <AnimatePresence mode="wait">
          {currentSlide === 0 ? (
            <motion.div key="mobile-pane-0" variants={paneFadeVariants} initial={isEnteringFromJourney ? false : "initial"} animate="animate" exit="exit" className="w-full">
              <MobilePane0 />
            </motion.div>
          ) : (
            <motion.div key="mobile-pane-1" variants={paneFadeVariants} initial="initial" animate="animate" exit="exit" className="w-full">
              <MobilePane1 />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Spacer */}
        <div className="h-1 shrink-0 pointer-events-none" aria-hidden="true" />
      </div>
    </section>
  )
}

export default Hero
