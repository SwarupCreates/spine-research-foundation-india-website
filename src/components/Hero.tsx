import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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

export const Hero: React.FC<HeroProps> = ({
  onReplayJourney,
  isEnteringFromJourney = false,
  onScrollToCards,
  onReadMore,
  onCollapseMobile,
}) => {
  // Staggered reveal states when entering from journey
  const [showItem1, setShowItem1] = useState(!isEnteringFromJourney)
  const [showItem2, setShowItem2] = useState(!isEnteringFromJourney)
  const [showItem3, setShowItem3] = useState(!isEnteringFromJourney)
  const [showItem4, setShowItem4] = useState(!isEnteringFromJourney)
  const [showItem5, setShowItem5] = useState(!isEnteringFromJourney)
  const [showButton, setShowButton] = useState(!isEnteringFromJourney)

  useEffect(() => {
    if (isEnteringFromJourney) {
      setShowItem1(false)
      setShowItem2(false)
      setShowItem3(false)
      setShowItem4(false)
      setShowItem5(false)
      setShowButton(false)

      const t1 = setTimeout(() => setShowItem1(true), 150)
      const t2 = setTimeout(() => setShowItem2(true), 550)
      const t3 = setTimeout(() => setShowItem3(true), 950)
      const t4 = setTimeout(() => setShowItem4(true), 1350)
      const t5 = setTimeout(() => setShowItem5(true), 1750)
      const tBtn = setTimeout(() => setShowButton(true), 2150)

      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
        clearTimeout(t3)
        clearTimeout(t4)
        clearTimeout(t5)
        clearTimeout(tBtn)
      }
    } else {
      setShowItem1(true)
      setShowItem2(true)
      setShowItem3(true)
      setShowItem4(true)
      setShowItem5(true)
      setShowButton(true)
    }
  }, [isEnteringFromJourney])

  const handleScrollDown = () => {
    if (onScrollToCards) {
      onScrollToCards()
    } else if (onCollapseMobile) {
      onCollapseMobile()
    } else {
      window.scrollTo({ top: window.innerHeight - 80, behavior: 'smooth' })
    }
  }

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
      {/* DESKTOP VIEW (>= md): Matches Figma Design (ca5f66ee.jpg)      */}
      {/* Centered narrative block + Semibold Red Title + Button         */}
      {/* ------------------------------------------------------------- */}
      <div className="hidden md:flex flex-col items-center justify-center text-center max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 pt-32 lg:pt-36 xl:pt-40 pb-16 lg:pb-24 relative z-10">
        <div className="max-w-2xl mx-auto flex flex-col items-center text-center space-y-3.5 lg:space-y-4 select-none">
          {/* Line 1 */}
          <div className="w-full flex items-center justify-center text-center min-h-[36px]">
            {showItem1 ? (
              <BlurText
                text="Two decades of commitment & counting ..."
                effect="blur"
                animateBy="words"
                direction="bottom"
                trigger="load"
                delay={40}
                stepDuration={0.25}
                blur={10}
                distance={12}
                className="text-white font-galano-alt font-semibold text-[clamp(20px,2.2vw,32px)] leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] text-center justify-center"
              />
            ) : (
              <div className="invisible font-galano-alt font-semibold text-[clamp(20px,2.2vw,32px)] leading-tight" aria-hidden="true">
                Two decades of commitment &amp; counting ...
              </div>
            )}
          </div>

          {/* Line 2 */}
          <div className="w-full flex items-center justify-center text-center min-h-[36px]">
            {showItem2 ? (
              <BlurText
                text="A family to work with – A family to work for"
                effect="blur"
                animateBy="words"
                direction="bottom"
                trigger="load"
                delay={40}
                stepDuration={0.25}
                blur={10}
                distance={12}
                className="text-white font-galano-alt font-semibold text-[clamp(20px,2.2vw,32px)] leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] text-center justify-center"
              />
            ) : (
              <div className="invisible font-galano-alt font-semibold text-[clamp(20px,2.2vw,32px)] leading-tight" aria-hidden="true">
                A family to work with – A family to work for
              </div>
            )}
          </div>

          {/* Line 3 */}
          <div className="w-full flex items-center justify-center text-center min-h-[36px]">
            {showItem3 ? (
              <BlurText
                text="A bounty of love, A legacy to uphold"
                effect="blur"
                animateBy="words"
                direction="bottom"
                trigger="load"
                delay={40}
                stepDuration={0.25}
                blur={10}
                distance={12}
                className="text-white font-galano-alt font-semibold text-[clamp(20px,2.2vw,32px)] leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] text-center justify-center"
              />
            ) : (
              <div className="invisible font-galano-alt font-semibold text-[clamp(20px,2.2vw,32px)] leading-tight" aria-hidden="true">
                A bounty of love, A legacy to uphold
              </div>
            )}
          </div>

          {/* Line 4 */}
          <div className="w-full flex items-center justify-center text-center min-h-[36px]">
            {showItem4 ? (
              <BlurText
                text="A promise spoken in silence – fulfilled with glory"
                effect="blur"
                animateBy="words"
                direction="bottom"
                trigger="load"
                delay={40}
                stepDuration={0.25}
                blur={10}
                distance={12}
                className="text-white font-galano-alt font-semibold text-[clamp(20px,2.2vw,32px)] leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] text-center justify-center"
              />
            ) : (
              <div className="invisible font-galano-alt font-semibold text-[clamp(20px,2.2vw,32px)] leading-tight" aria-hidden="true">
                A promise spoken in silence – fulfilled with glory
              </div>
            )}
          </div>

          {/* Line 5: One spine at a time (Semibold Galano Grotesque Alt matching white texts above) */}
          <div className="w-full flex items-center justify-center text-center pt-1 min-h-[40px]">
            {showItem5 ? (
              <BlurText
                text="One spine at a time"
                effect="blur"
                animateBy="words"
                direction="bottom"
                trigger="load"
                delay={50}
                stepDuration={0.28}
                blur={12}
                distance={14}
                color="#ff0000"
                className="font-galano-alt font-semibold text-[#ff0000] text-[clamp(20px,2.2vw,32px)] leading-tight drop-shadow-[0_2px_16px_rgba(255,0,0,0.4)] text-center justify-center"
              />
            ) : (
              <div className="invisible font-galano-alt font-semibold text-[#ff0000] text-[clamp(20px,2.2vw,32px)] leading-tight" aria-hidden="true">
                One spine at a time
              </div>
            )}
          </div>

          {/* Primary CTA Button: [📖 Read About SRF] - Google Sans font and icon sizing matching cards */}
          <div className="pt-3 min-h-[50px] flex items-center justify-center">
            {showButton ? (
              <motion.button
                type="button"
                onClick={onReadMore || (() => window.location.assign('/about'))}
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="group inline-flex items-center gap-2 px-6 py-2.5 sm:px-7 sm:py-3 rounded-full bg-black/40 hover:bg-black/60 border border-white/20 hover:border-white/40 text-white font-sans font-medium text-sm sm:text-base backdrop-blur-md transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 cursor-pointer"
                aria-label="Read About SRF"
              >
                <MaterialIcon name="menu_book" size={18} className="text-white/85 shrink-0" />
                <span className="font-medium whitespace-nowrap">Read About SRF</span>
              </motion.button>
            ) : (
              <div className="invisible h-11 px-7" aria-hidden="true" />
            )}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MOBILE VIEW (< md): Matches Figma Design (20da6066.jpg)        */}
      {/* Slightly enlarged font + tighter spacing between stanzas,      */}
      {/* arrow_cool_down icon + upward-pushed bottom cluster + airy    */}
      {/* bottom gutter space above floating action buttons              */}
      {/* ------------------------------------------------------------- */}
      <div className="md:hidden relative z-10 flex flex-col items-center justify-between text-center px-6 min-h-[calc(100dvh-86px)] pt-3 sm:pt-5 pb-[122px] sm:pb-[138px]">
        {/* Top Spacer: modest breathing space below mobile header */}
        <div className="h-[2vh] min-h-[8px] shrink-0 pointer-events-none" aria-hidden="true" />

        {/* Main Cohesive Narrative & Action Flow */}
        <div className="flex flex-col items-center text-center shrink-0 select-none w-full">
          {/* 4 Narrative Stanzas: slightly increased font size matching Figma */}
          <div className="flex flex-col items-center text-center space-y-4 sm:space-y-4.5 max-w-[310px] sm:max-w-[340px] mx-auto select-none">
            {/* Line 1 */}
            <div className="w-full flex items-center justify-center text-center">
              {showItem1 ? (
                <BlurText
                  text="Two decades of commitment & counting ..."
                  effect="blur"
                  animateBy="words"
                  direction="bottom"
                  trigger="load"
                  delay={40}
                  stepDuration={0.24}
                  blur={8}
                  distance={10}
                  className="font-galano-alt font-semibold text-white text-[clamp(21px,6.2vw,25.5px)] leading-[1.22] text-center drop-shadow-md mx-auto justify-center"
                />
              ) : (
                <div className="invisible font-galano-alt font-semibold text-white text-[clamp(21px,6.2vw,25.5px)] leading-[1.22] text-center mx-auto" aria-hidden="true">
                  Two decades of commitment &amp; counting ...
                </div>
              )}
            </div>

            {/* Line 2 */}
            <div className="w-full flex items-center justify-center text-center">
              {showItem2 ? (
                <BlurText
                  text="A family to work with – A family to work for"
                  effect="blur"
                  animateBy="words"
                  direction="bottom"
                  trigger="load"
                  delay={40}
                  stepDuration={0.24}
                  blur={8}
                  distance={10}
                  className="font-galano-alt font-semibold text-white text-[clamp(21px,6.2vw,25.5px)] leading-[1.22] text-center drop-shadow-md mx-auto justify-center"
                />
              ) : (
                <div className="invisible font-galano-alt font-semibold text-white text-[clamp(21px,6.2vw,25.5px)] leading-[1.22] text-center mx-auto" aria-hidden="true">
                  A family to work with – A family to work for
                </div>
              )}
            </div>

            {/* Line 3 */}
            <div className="w-full flex items-center justify-center text-center">
              {showItem3 ? (
                <BlurText
                  text="A bounty of love, A legacy to uphold"
                  effect="blur"
                  animateBy="words"
                  direction="bottom"
                  trigger="load"
                  delay={40}
                  stepDuration={0.24}
                  blur={8}
                  distance={10}
                  className="font-galano-alt font-semibold text-white text-[clamp(21px,6.2vw,25.5px)] leading-[1.22] text-center drop-shadow-md mx-auto justify-center"
                />
              ) : (
                <div className="invisible font-galano-alt font-semibold text-white text-[clamp(21px,6.2vw,25.5px)] leading-[1.22] text-center mx-auto" aria-hidden="true">
                  A bounty of love, A legacy to uphold
                </div>
              )}
            </div>

            {/* Line 4 */}
            <div className="w-full flex items-center justify-center text-center">
              {showItem4 ? (
                <BlurText
                  text="A promise spoken in silence – fulfilled with glory"
                  effect="blur"
                  animateBy="words"
                  direction="bottom"
                  trigger="load"
                  delay={40}
                  stepDuration={0.24}
                  blur={8}
                  distance={10}
                  className="font-galano-alt font-semibold text-white text-[clamp(21px,6.2vw,25.5px)] leading-[1.22] text-center drop-shadow-md mx-auto justify-center"
                />
              ) : (
                <div className="invisible font-galano-alt font-semibold text-white text-[clamp(21px,6.2vw,25.5px)] leading-[1.22] text-center mx-auto" aria-hidden="true">
                  A promise spoken in silence – fulfilled with glory
                </div>
              )}
            </div>
          </div>

          {/* Google Symbols arrow_cool_down Scroll Indicator */}
          <div className="flex flex-col items-center justify-center pt-3.5 sm:pt-4 pb-2 sm:pb-2.5 shrink-0">
            <motion.button
              type="button"
              onClick={handleScrollDown}
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              className="text-white/60 hover:text-white active:scale-90 transition-all p-1.5 cursor-pointer flex items-center justify-center"
              aria-label="Scroll down to reveal cards"
              title="Scroll down to reveal cards"
            >
              <MaterialIcon name="arrow_cool_down" size={28} className="text-white/65" />
            </motion.button>
          </div>

          {/* Bottom Cluster: "One spine at a time" + Primary CTA button (pushed slightly upward) */}
          <div className="shrink-0 flex flex-col items-center text-center select-none pt-0.5 sm:pt-1">
            {/* Line 5: One spine at a time in Semibold Galano Grotesque Alt */}
            <div className="flex items-center justify-center text-center min-h-[34px]">
              {showItem5 ? (
                <BlurText
                  text="One spine at a time"
                  effect="blur"
                  animateBy="words"
                  direction="bottom"
                  trigger="load"
                  delay={45}
                  stepDuration={0.26}
                  blur={10}
                  distance={12}
                  color="#ff0000"
                  className="font-galano-alt font-semibold text-[#ff0000] text-[clamp(21.5px,6.2vw,26px)] leading-tight text-center drop-shadow-[0_2px_12px_rgba(255,0,0,0.35)] justify-center"
                />
              ) : (
                <div className="invisible font-galano-alt font-semibold text-[#ff0000] text-[clamp(21.5px,6.2vw,26px)] leading-tight text-center justify-center" aria-hidden="true">
                  One spine at a time
                </div>
              )}
            </div>

            {/* CTA Button: [📖 Read About SRF] - Styled with Google Sans & icon sizing matching card buttons */}
            <div className="pt-3 sm:pt-3.5 flex items-center justify-center min-h-[46px]">
              {showButton ? (
                <motion.button
                  type="button"
                  onClick={onReadMore || (() => window.location.assign('/about'))}
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-black/40 active:bg-black/60 border border-white/20 active:border-white/40 text-white font-sans font-medium text-sm backdrop-blur-md transition-all shadow-lg active:scale-95 cursor-pointer"
                  aria-label="Read About SRF"
                >
                  <MaterialIcon name="menu_book" size={18} className="text-white/85 shrink-0" />
                  <span className="font-medium whitespace-nowrap">Read About SRF</span>
                </motion.button>
              ) : (
                <div className="invisible h-10 px-6" aria-hidden="true" />
              )}
            </div>
          </div>
        </div>

        {/* Bottom Spacer */}
        <div className="h-1 shrink-0 pointer-events-none" aria-hidden="true" />
      </div>
    </section>
  )
}

export default Hero
