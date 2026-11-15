import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SrfLogo, MaterialIcon } from './icons'

interface WelcomeJourneyProps {
  onComplete: () => void
  onSkip: () => void
}

export const WelcomeJourney: React.FC<WelcomeJourneyProps> = ({ onComplete, onSkip }) => {
  // Current journey frame: 1 through 4, then 5 for landing transition
  const [frame, setFrame] = useState<number>(1)
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false)

  // Auto-play state: true = auto-advances; false = manual scrolling only
  const [isPlaying, setIsPlaying] = useState<boolean>(true)

  // Frame 1 slow sequential reveal states
  const [showBoy, setShowBoy] = useState<boolean>(false)
  const [showMeet, setShowMeet] = useState<boolean>(false)
  const [showDurga, setShowDurga] = useState<boolean>(false)
  const [showControls, setShowControls] = useState<boolean>(false)

  // Frame 2 progressive character typing
  const [charCount1, setCharCount1] = useState<number>(0)
  const [charCount2, setCharCount2] = useState<number>(0)
  const [charCount3, setCharCount3] = useState<number>(0)
  const [isElevated, setIsElevated] = useState<boolean>(false)

  // Frame 3 dot and text progression
  const [dotsCount, setDotsCount] = useState<number>(0)
  const [showWitness, setShowWitness] = useState<boolean>(false)
  const [showBlesses, setShowBlesses] = useState<boolean>(false)

  // Frame 4 sequenced reveals
  const [showCard1, setShowCard1] = useState<boolean>(false)
  const [showCard2, setShowCard2] = useState<boolean>(false)
  const [showCard3, setShowCard3] = useState<boolean>(false)
  const [showCard4, setShowCard4] = useState<boolean>(false)
  const [showCard5, setShowCard5] = useState<boolean>(false)
  const [showLogo, setShowLogo] = useState<boolean>(false)

  // Frame 5 flight to navbar
  const [isFlyingToNavbar, setIsFlyingToNavbar] = useState<boolean>(false)

  // Full texts for Frame 2
  const line1Prefix = 'AS A SON, '
  const line1Suffix = 'HE TENDS THE MOTHER,'
  const line1Total = line1Prefix.length + line1Suffix.length

  const line2Prefix = 'AS A FATHER, '
  const line2Suffix = 'HE LULLS THE CHILD,'
  const line2Total = line2Prefix.length + line2Suffix.length

  const line3Prefix = 'AS A BROTHER, '
  const line3Suffix = 'HE SHARES THE FRET ...'
  const line3Total = line3Prefix.length + line3Suffix.length

  // Restart Journey handler
  const handleRestart = useCallback(() => {
    setIsTransitioning(false)
    setFrame(1)
    setShowBoy(false)
    setShowMeet(false)
    setShowDurga(false)
    setShowControls(false)
    setCharCount1(0)
    setCharCount2(0)
    setCharCount3(0)
    setIsElevated(false)
    setDotsCount(0)
    setShowWitness(false)
    setShowBlesses(false)
    setShowCard1(false)
    setShowCard2(false)
    setShowCard3(false)
    setShowCard4(false)
    setShowCard5(false)
    setShowLogo(false)
    setIsFlyingToNavbar(false)
  }, [])

  // Advance Frame with magnetic transition
  const advanceFrame = useCallback((targetFrame?: number) => {
    if (isTransitioning) return
    setIsTransitioning(true)

    setFrame((prev) => {
      const next = targetFrame !== undefined ? targetFrame : prev + 1
      if (next >= 5) {
        setIsFlyingToNavbar(true)
        setTimeout(() => {
          onComplete()
        }, 900)
        return 5
      }
      return next
    })

    setTimeout(() => {
      setIsTransitioning(false)
    }, 600)
  }, [isTransitioning, onComplete])

  // Mouse wheel and touch swipe magnetic snap assist
  useEffect(() => {
    let lastWheelTime = 0
    let touchStartY = 0

    const handleWheel = (e: WheelEvent) => {
      const now = Date.now()
      if (now - lastWheelTime < 750) return
      if (Math.abs(e.deltaY) > 25) {
        lastWheelTime = now
        if (e.deltaY > 0) {
          advanceFrame()
        }
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartY = e.touches[0].clientY
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.changedTouches.length > 0) {
        const delta = touchStartY - e.changedTouches[0].clientY
        if (delta > 40) {
          advanceFrame()
        }
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: true })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [advanceFrame])

  // -------------------------------------------------------------
  // Frame 1 Automation: Sequential slow reveals:
  // Base image + Gradient -> Boy (+100ms) -> Controls (+400ms) -> MEET (+700ms) -> DURGA (+1300ms)
  // -------------------------------------------------------------
  useEffect(() => {
    if (frame !== 1) {
      setShowBoy(true)
      setShowControls(true)
      return
    }

    const t1 = setTimeout(() => setShowBoy(true), 100)
    const t2 = setTimeout(() => setShowControls(true), 400)
    const t3 = setTimeout(() => setShowMeet(true), 700)
    const t4 = setTimeout(() => setShowDurga(true), 1300)
    let t5: ReturnType<typeof setTimeout> | undefined

    if (isPlaying) {
      t5 = setTimeout(() => {
        advanceFrame(2)
      }, 4800)
    }

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      if (t5) clearTimeout(t5)
    }
  }, [frame, isPlaying, advanceFrame])

  // -------------------------------------------------------------
  // Frame 2 Automation: Type 3 lines smoothly -> elevate -> advance
  // -------------------------------------------------------------
  useEffect(() => {
    if (frame !== 2) {
      setCharCount1(0)
      setCharCount2(0)
      setCharCount3(0)
      setIsElevated(false)
      return
    }

    let c1 = 0
    let c2 = 0
    let c3 = 0
    let timer: ReturnType<typeof setTimeout>

    const typeLine1 = () => {
      if (c1 <= line1Total) {
        setCharCount1(c1)
        c1++
        timer = setTimeout(typeLine1, 26)
      } else {
        timer = setTimeout(typeLine2, 140)
      }
    }

    const typeLine2 = () => {
      if (c2 <= line2Total) {
        setCharCount2(c2)
        c2++
        timer = setTimeout(typeLine2, 26)
      } else {
        timer = setTimeout(typeLine3, 140)
      }
    }

    const typeLine3 = () => {
      if (c3 <= line3Total) {
        setCharCount3(c3)
        c3++
        timer = setTimeout(typeLine3, 26)
      } else {
        timer = setTimeout(() => {
          setIsElevated(true)
          if (isPlaying) {
            timer = setTimeout(() => {
              advanceFrame(3)
            }, 1800)
          }
        }, 250)
      }
    }

    timer = setTimeout(typeLine1, 220)

    return () => clearTimeout(timer)
  }, [frame, isPlaying, advanceFrame, line1Total, line2Total, line3Total])

  // -------------------------------------------------------------
  // Frame 3 Automation: BUT... -> AS A WITNESS -> HE BLESSES THE WORLD
  // -------------------------------------------------------------
  useEffect(() => {
    if (frame !== 3) {
      setDotsCount(0)
      setShowWitness(false)
      setShowBlesses(false)
      return
    }

    const t1 = setTimeout(() => setDotsCount(1), 500)
    const t2 = setTimeout(() => setDotsCount(2), 1000)
    const t3 = setTimeout(() => setDotsCount(3), 1500)
    const t4 = setTimeout(() => setShowWitness(true), 1800)
    const t5 = setTimeout(() => setShowBlesses(true), 2400)
    let t6: ReturnType<typeof setTimeout> | undefined

    if (isPlaying) {
      t6 = setTimeout(() => {
        advanceFrame(4)
      }, 4500)
    }

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      clearTimeout(t5)
      if (t6) clearTimeout(t6)
    }
  }, [frame, isPlaying, advanceFrame])

  // -------------------------------------------------------------
  // Frame 4 Automation: 5 Text blocks -> Large Logo -> Frame 5
  // -------------------------------------------------------------
  useEffect(() => {
    if (frame !== 4) {
      setShowCard1(false)
      setShowCard2(false)
      setShowCard3(false)
      setShowCard4(false)
      setShowCard5(false)
      setShowLogo(false)
      return
    }

    const t1 = setTimeout(() => setShowCard1(true), 200)
    const t2 = setTimeout(() => setShowCard2(true), 700)
    const t3 = setTimeout(() => setShowCard3(true), 1200)
    const t4 = setTimeout(() => setShowCard4(true), 1700)
    const t5 = setTimeout(() => setShowCard5(true), 2200)
    const t6 = setTimeout(() => setShowLogo(true), 2800)
    let t7: ReturnType<typeof setTimeout> | undefined

    if (isPlaying) {
      t7 = setTimeout(() => {
        advanceFrame(5)
      }, 4800)
    }

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      clearTimeout(t5)
      clearTimeout(t6)
      if (t7) clearTimeout(t7)
    }
  }, [frame, isPlaying, advanceFrame])

  return (
    <div className="fixed inset-0 z-[100] w-screen h-screen bg-[#0b0c0e] overflow-hidden select-none font-galano">
      {/* -------------------------------------------------------- */}
      {/* BACKGROUND IMAGE LAYER 1 & BOTTOM GRADIENT               */}
      {/* Frames 1-2: Silent Amidst the Passing Crowd 1           */}
      {/* Frames 3-5: Solitary Boy Amid the Moving Crowd 1         */}
      {/* -------------------------------------------------------- */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <AnimatePresence mode="sync">
          {frame <= 2 ? (
            <motion.div
              key="bg-silent-crowd"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              exit={{
                opacity: 0,
                filter: 'blur(10px)',
                transition: { duration: 1.2, ease: 'easeInOut' },
              }}
              className="absolute inset-0 w-full h-full"
            >
              <picture className="w-full h-full block">
                <source
                  media="(max-width: 639px)"
                  srcSet={`${import.meta.env.BASE_URL}banners/Silent%20Amidst%20the%20Passing%20Crowd%201%20-%20phone.png`}
                />
                <img
                  src={`${import.meta.env.BASE_URL}banners/Silent%20Amidst%20the%20Passing%20Crowd%201.png`}
                  alt="Silent Amidst the Passing Crowd"
                  className="w-full h-full object-cover object-[50%_40%] sm:object-center select-none"
                />
              </picture>
            </motion.div>
          ) : (
            <motion.div
              key="bg-solitary-boy"
              initial={{ opacity: 0, filter: 'blur(8px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, transition: { duration: 0.8 } }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              className="absolute inset-0 w-full h-full"
            >
              <picture className="w-full h-full block">
                <source
                  media="(max-width: 639px)"
                  srcSet={`${import.meta.env.BASE_URL}banners/Solitary%20Boy%20Amid%20the%20Moving%20Crowd%201%20-%20phone.png`}
                />
                <img
                  src={`${import.meta.env.BASE_URL}banners/Solitary%20Boy%20Amid%20the%20Moving%20Crowd%201.jpg`}
                  alt="Solitary Boy Amid the Moving Crowd"
                  className="w-full h-full object-cover object-[50%_25%] sm:object-[50%_28%] select-none"
                />
              </picture>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom-to-top linear gradient overlay: 100% #000000 at bottom to 0% #000000 at 50vh max */}
        <div
          className="absolute bottom-0 inset-x-0 h-1/2 max-h-[50vh] pointer-events-none z-[5]"
          style={{
            background: 'linear-gradient(to top, #000000 0%, rgba(0, 0, 0, 0.82) 30%, rgba(0, 0, 0, 0) 100%)',
          }}
        />
      </div>

      {/* -------------------------------------------------------- */}
      {/* FRAME 1: 3D DEPTH LAYER (Text Behind Boy)                */}
      {/* -------------------------------------------------------- */}
      <AnimatePresence>
        {frame === 1 && (
          <motion.div
            key="frame-1-depth-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.6 } }}
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
          >
            {/* "MEET" top-left: exactly aligned with left of D, y: 7.8% */}
            {showMeet && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: 'easeOut' }}
                className="absolute top-[7.8%] left-[4.6%] text-white font-galano font-black text-3xl sm:text-4xl md:text-[42px] tracking-wide select-none leading-none"
              >
                MEET
              </motion.div>
            )}

            {/* Giant "DURGA" bold red text spanning behind boy: top 15.8%, left 4.6%, width 91.4% */}
            {showDurga && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.85, ease: 'easeOut' }}
                className="absolute top-[15.8%] left-[4.6%] w-[91.4%] text-[#ff0000] font-galano font-black leading-[0.8] select-none pointer-events-none tracking-[-0.035em] whitespace-nowrap"
                style={{ fontSize: 'min(21.8vw, 27vh)' }}
              >
                DURGA
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* -------------------------------------------------------- */}
      {/* BOY CUTOUT LAYER (Frames 1 & 2): Sits over "DURGA" text   */}
      {/* Renders after 100ms in Frame 1                            */}
      {/* -------------------------------------------------------- */}
      <AnimatePresence>
        {frame <= 2 && showBoy && (
          <motion.div
            key="boy-cutout-layer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute inset-0 w-full h-full pointer-events-none z-20"
          >
            <picture className="w-full h-full block">
              <source
                media="(max-width: 639px)"
                srcSet={`${import.meta.env.BASE_URL}banners/boy-phone.png`}
              />
              <img
                src={`${import.meta.env.BASE_URL}banners/boy.png`}
                alt="Boy with spinal deformity"
                className="w-full h-full object-cover object-[50%_40%] sm:object-center select-none"
              />
            </picture>
          </motion.div>
        )}
      </AnimatePresence>

      {/* -------------------------------------------------------- */}
      {/* FRAME 2: 3 TYPED LINES & ELEVATION CONTRAST               */}
      {/* -------------------------------------------------------- */}
      <AnimatePresence>
        {frame === 2 && (
          <motion.div
            key="frame-2-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-end p-7 sm:p-14 md:p-20 pb-28 sm:pb-32 md:pb-36"
          >
            <div className="max-w-4xl space-y-3 sm:space-y-4">
              {/* Line 1 */}
              <div className="text-2xl sm:text-4xl md:text-[44px] font-galano uppercase tracking-wide leading-tight">
                <span
                  className={`transition-opacity duration-700 ${
                    isElevated ? 'opacity-40 text-white/40' : 'opacity-100 text-white'
                  }`}
                >
                  {line1Prefix.slice(0, Math.min(charCount1, line1Prefix.length))}
                </span>
                <span className="text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                  {charCount1 > line1Prefix.length
                    ? line1Suffix.slice(0, charCount1 - line1Prefix.length)
                    : ''}
                </span>
              </div>

              {/* Line 2 */}
              <div className="text-2xl sm:text-4xl md:text-[44px] font-galano uppercase tracking-wide leading-tight">
                <span
                  className={`transition-opacity duration-700 ${
                    isElevated ? 'opacity-40 text-white/40' : 'opacity-100 text-white'
                  }`}
                >
                  {line2Prefix.slice(0, Math.min(charCount2, line2Prefix.length))}
                </span>
                <span className="text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                  {charCount2 > line2Prefix.length
                    ? line2Suffix.slice(0, charCount2 - line2Prefix.length)
                    : ''}
                </span>
              </div>

              {/* Line 3 */}
              <div className="text-2xl sm:text-4xl md:text-[44px] font-galano uppercase tracking-wide leading-tight">
                <span
                  className={`transition-opacity duration-700 ${
                    isElevated ? 'opacity-40 text-white/40' : 'opacity-100 text-white'
                  }`}
                >
                  {line3Prefix.slice(0, Math.min(charCount3, line3Prefix.length))}
                </span>
                <span className="text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                  {charCount3 > line3Prefix.length
                    ? line3Suffix.slice(0, charCount3 - line3Prefix.length)
                    : ''}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* -------------------------------------------------------- */}
      {/* FRAME 3: BUT... AS A WITNESS -> HE BLESSES THE WORLD!     */}
      {/* -------------------------------------------------------- */}
      <AnimatePresence>
        {frame === 3 && (
          <motion.div
            key="frame-3-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            className="absolute inset-0 z-30 pointer-events-none p-7 sm:p-14 md:p-20 flex flex-col justify-between pb-28 sm:pb-32 md:pb-36"
          >
            {/* Top-Left: BUT... AS A WITNESS, */}
            <div className="pt-8 sm:pt-10 md:pt-14">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-white font-galano text-4xl sm:text-6xl md:text-[68px] tracking-wide uppercase leading-none"
              >
                BUT
                <span>{dotsCount >= 1 ? '.' : ''}</span>
                <span>{dotsCount >= 2 ? '.' : ''}</span>
                <span>{dotsCount >= 3 ? '.' : ''}</span>
              </motion.div>

              {showWitness && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="text-[#ff0000] font-galano text-3xl sm:text-5xl md:text-[54px] tracking-wide uppercase mt-2 sm:mt-3 leading-tight"
                >
                  AS A WITNESS,
                </motion.div>
              )}
            </div>

            {/* Bottom-Left: HE BLESSES THE WORLD! */}
            {showBlesses && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="text-white font-galano text-3xl sm:text-5xl md:text-[54px] tracking-wide uppercase leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] max-w-3xl"
              >
                HE BLESSES THE WORLD!
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* -------------------------------------------------------- */}
      {/* FRAME 4: 5 NARRATIVE BLOCKS & LARGE SRF LOGO              */}
      {/* -------------------------------------------------------- */}
      <AnimatePresence>
        {frame === 4 && (
          <motion.div
            key="frame-4-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
            className="absolute inset-0 z-30 pointer-events-none p-7 sm:p-14 md:p-20 flex flex-col justify-between pb-28 sm:pb-32 md:pb-36"
          >
            {/* Top Row: Two Decades & A Family */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-6 sm:pt-8 md:pt-10">
              {showCard1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-sm font-galano text-base sm:text-xl md:text-2xl text-white uppercase tracking-wide leading-snug drop-shadow-md"
                >
                  TWO DECADES OF COMMITMENT &amp; COUNTING ...
                </motion.div>
              )}

              {showCard2 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-sm font-galano text-base sm:text-xl md:text-2xl text-white uppercase tracking-wide leading-snug text-left sm:text-right drop-shadow-md"
                >
                  A FAMILY TO WORK WITH – A FAMILY TO WORK FOR
                </motion.div>
              )}
            </div>

            {/* Mid Row: A Bounty of Love & A Promise Spoken */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 my-auto">
              {showCard3 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-sm font-galano text-base sm:text-xl md:text-2xl text-white uppercase tracking-wide leading-snug drop-shadow-md"
                >
                  A BOUNTY OF LOVE, A LEGACY TO UPHOLD
                </motion.div>
              )}

              {showCard4 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-sm font-galano text-base sm:text-xl md:text-2xl text-white uppercase tracking-wide leading-snug text-left sm:text-right drop-shadow-md"
                >
                  A PROMISE SPOKEN IN SILENCE – FULFILLED WITH GLORY
                </motion.div>
              )}
            </div>

            {/* Bottom-Left: Large SRF Logo & ONE SPINE AT A TIME */}
            <div className="flex flex-col items-start gap-3">
              {showLogo && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="w-18 h-18 sm:w-22 sm:h-22 text-white drop-shadow-[0_4px_24px_rgba(255,255,255,0.35)]"
                >
                  <SrfLogo className="w-full h-full text-white" />
                </motion.div>
              )}

              {showCard5 && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-[#ff0000] font-galano text-xl sm:text-3xl md:text-[34px] tracking-wide uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
                >
                  ONE SPINE AT A TIME
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* -------------------------------------------------------- */}
      {/* FRAME 5: LOGO FLIGHT TO NAVBAR                           */}
      {/* -------------------------------------------------------- */}
      {isFlyingToNavbar && (
        <motion.div
          initial={{
            position: 'fixed',
            left: 64,
            bottom: 120,
            width: 80,
            height: 80,
            opacity: 1,
            zIndex: 110,
          }}
          animate={{
            left: 64,
            top: 24,
            bottom: 'auto',
            width: 44,
            height: 44,
            opacity: 1,
          }}
          transition={{
            type: 'spring',
            stiffness: 85,
            damping: 16,
            mass: 1,
          }}
          className="pointer-events-none text-white drop-shadow-xl"
        >
          <SrfLogo className="w-full h-full text-white" />
        </motion.div>
      )}

      {/* -------------------------------------------------------- */}
      {/* BOTTOM CONTROLS: RESTART & SKIP (LEFT) + PLAY/PAUSE (RIGHT) */}
      {/* Smooth entrance from outward (left & right)              */}
      {/* -------------------------------------------------------- */}
      <AnimatePresence>
        {frame < 5 && showControls && (
          <>
            {/* Left Controls: Restart Button + Skip Pill Button */}
            <motion.div
              key="left-journey-controls"
              initial={{ opacity: 0, x: -90 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{
                opacity: 0,
                scale: 0.3,
                transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
              }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-6 sm:bottom-7 left-6 sm:left-7 z-50 flex items-center gap-3.5 pointer-events-auto"
            >
              {/* Restart / Replay Button */}
              <button
                type="button"
                onClick={handleRestart}
                className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-white/90 hover:text-white hover:bg-black/70 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-xl"
                aria-label="Restart animation from beginning"
                title="Restart from beginning"
              >
                <MaterialIcon name="refresh" size={22} />
              </button>

              {/* Skip Pill Button: In usual Google Sans font (font-sans) */}
              <button
                type="button"
                onClick={onSkip}
                className="h-12 px-6 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-white/90 hover:text-white hover:bg-black/70 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 font-sans text-sm font-semibold tracking-wider cursor-pointer shadow-xl uppercase"
                aria-label="Skip welcome journey"
              >
                <MaterialIcon name="fast_forward" size={18} />
                <span>Skip</span>
              </button>
            </motion.div>

            {/* Right Controls: Play / Pause Button */}
            <motion.div
              key="right-journey-controls"
              initial={{ opacity: 0, x: 90 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{
                opacity: 0,
                scale: 0.3,
                transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
              }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-6 sm:bottom-7 right-6 sm:right-7 z-50 flex items-center gap-3 pointer-events-auto"
            >
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                className={`w-12 h-12 rounded-full backdrop-blur-md border transition-all flex items-center justify-center cursor-pointer shadow-xl hover:scale-105 active:scale-95 ${
                  isPlaying
                    ? 'bg-black/50 border-white/15 text-white hover:bg-black/70'
                    : 'bg-emerald-600/80 border-emerald-400/40 text-white hover:bg-emerald-600'
                }`}
                aria-label={isPlaying ? 'Pause auto-play' : 'Resume auto-play'}
                title={isPlaying ? 'Pause auto-play (switch to manual scroll)' : 'Resume auto-play'}
              >
                <MaterialIcon name={isPlaying ? 'pause' : 'play_arrow'} size={22} />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default WelcomeJourney
