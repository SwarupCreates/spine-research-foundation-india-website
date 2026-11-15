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

  // Frame 2 typing state
  const [typedLine1, setTypedLine1] = useState('')
  const [typedLine2, setTypedLine2] = useState('')
  const [typedLine3, setTypedLine3] = useState('')
  const [isElevated, setIsElevated] = useState(false)

  // Frame 3 dot progression
  const [dotsCount, setDotsCount] = useState(0)
  const [showWitness, setShowWitness] = useState(false)
  const [showBlesses, setShowBlesses] = useState(false)

  // Frame 4 reveal sequence
  const [showCard1, setShowCard1] = useState(false)
  const [showCard2, setShowCard2] = useState(false)
  const [showCard3, setShowCard3] = useState(false)
  const [showCard4, setShowCard4] = useState(false)
  const [showCard5, setShowCard5] = useState(false)
  const [showLogo, setShowLogo] = useState(false)

  // Frame 5 logo travel state
  const [isFlyingToNavbar, setIsFlyingToNavbar] = useState(false)

  // Navigation / Frame Advancement
  const advanceFrame = useCallback((targetFrame?: number) => {
    if (isTransitioning) return
    setIsTransitioning(true)

    setFrame((prev) => {
      const next = targetFrame !== undefined ? targetFrame : prev + 1
      if (next >= 5) {
        // Start transition to navbar
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
      if (now - lastWheelTime < 800) return
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
  // Frame 1 Automation: Meet ... Durga -> wait 1s -> auto advance
  // -------------------------------------------------------------
  useEffect(() => {
    if (frame !== 1) return

    // Allow user 1.2s after text settles (~3.2s total) before auto-advancing
    const timer = setTimeout(() => {
      advanceFrame(2)
    }, 3800)

    return () => clearTimeout(timer)
  }, [frame, advanceFrame])

  // -------------------------------------------------------------
  // Frame 2 Automation: Type 3 lines -> elevate -> wait 1.5s -> auto advance
  // -------------------------------------------------------------
  useEffect(() => {
    if (frame !== 2) return

    const line1Full = 'AS A SON, HE TENDS THE MOTHER,'
    const line2Full = 'AS A FATHER, HE LULLS THE CHILD,'
    const line3Full = 'AS A BROTHER, HE SHARES THE FRET ...'

    let l1Idx = 0
    let l2Idx = 0
    let l3Idx = 0
    let timeoutId: ReturnType<typeof setTimeout>

    const typeLine1 = () => {
      if (l1Idx <= line1Full.length) {
        setTypedLine1(line1Full.slice(0, l1Idx))
        l1Idx++
        timeoutId = setTimeout(typeLine1, 24)
      } else {
        timeoutId = setTimeout(typeLine2, 160)
      }
    }

    const typeLine2 = () => {
      if (l2Idx <= line2Full.length) {
        setTypedLine2(line2Full.slice(0, l2Idx))
        l2Idx++
        timeoutId = setTimeout(typeLine2, 24)
      } else {
        timeoutId = setTimeout(typeLine3, 160)
      }
    }

    const typeLine3 = () => {
      if (l3Idx <= line3Full.length) {
        setTypedLine3(line3Full.slice(0, l3Idx))
        l3Idx++
        timeoutId = setTimeout(typeLine3, 24)
      } else {
        timeoutId = setTimeout(() => {
          setIsElevated(true)
          // Wait 1.8s in elevated state then auto advance to Frame 3
          timeoutId = setTimeout(() => {
            advanceFrame(3)
          }, 1800)
        }, 250)
      }
    }

    timeoutId = setTimeout(typeLine1, 200)

    return () => clearTimeout(timeoutId)
  }, [frame, advanceFrame])

  // -------------------------------------------------------------
  // Frame 3 Automation: BUT... -> AS A WITNESS -> HE BLESSES THE WORLD
  // -------------------------------------------------------------
  useEffect(() => {
    if (frame !== 3) return

    const t1 = setTimeout(() => setDotsCount(1), 500)
    const t2 = setTimeout(() => setDotsCount(2), 1000)
    const t3 = setTimeout(() => setDotsCount(3), 1500)
    const t4 = setTimeout(() => setShowWitness(true), 1800)
    const t5 = setTimeout(() => setShowBlesses(true), 2400)
    const t6 = setTimeout(() => {
      advanceFrame(4)
    }, 4500)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      clearTimeout(t5)
      clearTimeout(t6)
    }
  }, [frame, advanceFrame])

  // -------------------------------------------------------------
  // Frame 4 Automation: 5 Text blocks -> Large Logo -> Frame 5
  // -------------------------------------------------------------
  useEffect(() => {
    if (frame !== 4) return

    const t1 = setTimeout(() => setShowCard1(true), 200)
    const t2 = setTimeout(() => setShowCard2(true), 700)
    const t3 = setTimeout(() => setShowCard3(true), 1200)
    const t4 = setTimeout(() => setShowCard4(true), 1700)
    const t5 = setTimeout(() => setShowCard5(true), 2200)
    const t6 = setTimeout(() => setShowLogo(true), 2800)
    const t7 = setTimeout(() => {
      advanceFrame(5)
    }, 4800)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      clearTimeout(t5)
      clearTimeout(t6)
      clearTimeout(t7)
    }
  }, [frame, advanceFrame])

  return (
    <div className="fixed inset-0 z-[100] w-screen h-screen bg-[#0b0c0e] overflow-hidden select-none font-sans">
      {/* -------------------------------------------------------- */}
      {/* BACKGROUND IMAGE LAYER 1                                 */}
      {/* Frames 1-2: Silent Amidst the Passing Crowd 1           */}
      {/* Frames 3-5: Solitary Boy Amid the Moving Crowd 1         */}
      {/* -------------------------------------------------------- */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <AnimatePresence mode="sync">
          {frame <= 2 ? (
            <motion.div
              key="bg-silent-crowd"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                y: [0, -10, 0],
                transition: {
                  opacity: { duration: 0.8, ease: 'easeOut' },
                  y: { duration: 12, repeat: Infinity, ease: 'easeInOut' },
                },
              }}
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
            {/* "MEET" top-left */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
              className="absolute top-[8%] sm:top-[7%] left-[6%] sm:left-[6%] text-white font-galano text-3xl sm:text-5xl md:text-6xl tracking-wider select-none"
            >
              MEET
            </motion.div>

            {/* Giant "DURGA" bold red text spanning behind boy */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.55, ease: 'easeOut' }}
              className="absolute top-[13%] sm:top-[12%] left-[4%] sm:left-[4.5%] text-[#e61919] font-galano text-[25vw] sm:text-[20vw] leading-none tracking-tight select-none pointer-events-none"
            >
              DURGA
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* -------------------------------------------------------- */}
      {/* BOY CUTOUT LAYER (Frames 1 & 2): Sits over "DURGA" text   */}
      {/* -------------------------------------------------------- */}
      <AnimatePresence>
        {frame <= 2 && (
          <motion.div
            key="boy-cutout-layer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            transition={{ duration: 0.9, delay: 0.1, ease: 'easeOut' }}
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
            className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-end p-6 sm:p-14 pb-24 sm:pb-28"
          >
            <div className="max-w-4xl space-y-3 sm:space-y-4">
              {/* Line 1 */}
              <div className="text-xl sm:text-3xl md:text-4xl font-galano uppercase tracking-wide leading-snug">
                {isElevated ? (
                  <>
                    <span className="text-slate-400 opacity-40 transition-opacity duration-700">
                      AS A SON,{' '}
                    </span>
                    <span className="text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                      HE TENDS THE MOTHER,
                    </span>
                  </>
                ) : (
                  <span className="text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                    {typedLine1}
                  </span>
                )}
              </div>

              {/* Line 2 */}
              <div className="text-xl sm:text-3xl md:text-4xl font-galano uppercase tracking-wide leading-snug">
                {isElevated ? (
                  <>
                    <span className="text-slate-400 opacity-40 transition-opacity duration-700">
                      AS A FATHER,{' '}
                    </span>
                    <span className="text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                      HE LULLS THE CHILD,
                    </span>
                  </>
                ) : (
                  <span className="text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                    {typedLine2}
                  </span>
                )}
              </div>

              {/* Line 3 */}
              <div className="text-xl sm:text-3xl md:text-4xl font-galano uppercase tracking-wide leading-snug">
                {isElevated ? (
                  <>
                    <span className="text-slate-400 opacity-40 transition-opacity duration-700">
                      AS A BROTHER,{' '}
                    </span>
                    <span className="text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                      HE SHARES THE FRET ...
                    </span>
                  </>
                ) : (
                  <span className="text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                    {typedLine3}
                  </span>
                )}
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
            className="absolute inset-0 z-30 pointer-events-none p-6 sm:p-14 flex flex-col justify-between pb-24 sm:pb-28"
          >
            {/* Top-Left: BUT... AS A WITNESS, */}
            <div className="pt-6 sm:pt-4">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-white font-galano text-3xl sm:text-5xl md:text-6xl tracking-wider uppercase leading-none"
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
                  className="text-[#e61919] font-galano text-2xl sm:text-4xl md:text-5xl tracking-wide uppercase mt-2 sm:mt-3"
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
                className="text-white font-galano text-2xl sm:text-4xl md:text-5xl tracking-wide uppercase leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)] max-w-2xl"
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
            className="absolute inset-0 z-30 pointer-events-none p-6 sm:p-12 md:p-16 flex flex-col justify-between pb-24 sm:pb-28"
          >
            {/* Top Row: Two Decades & A Family */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-4 sm:pt-6">
              {showCard1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-md font-galano text-base sm:text-xl md:text-2xl text-white uppercase tracking-wide leading-snug drop-shadow-md"
                >
                  TWO DECADES OF COMMITMENT &amp; COUNTING ...
                </motion.div>
              )}

              {showCard2 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-md font-galano text-base sm:text-xl md:text-2xl text-white uppercase tracking-wide leading-snug text-left sm:text-right drop-shadow-md"
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
                  className="max-w-md font-galano text-base sm:text-xl md:text-2xl text-white uppercase tracking-wide leading-snug drop-shadow-md"
                >
                  A BOUNTY OF LOVE, A LEGACY TO UPHOLD
                </motion.div>
              )}

              {showCard4 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-md font-galano text-base sm:text-xl md:text-2xl text-white uppercase tracking-wide leading-snug text-left sm:text-right drop-shadow-md"
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
                  className="w-16 h-16 sm:w-20 sm:h-20 text-white drop-shadow-[0_4px_20px_rgba(255,255,255,0.3)]"
                >
                  <SrfLogo className="w-full h-full text-white" />
                </motion.div>
              )}

              {showCard5 && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-[#e61919] font-galano text-xl sm:text-2xl md:text-3xl tracking-wide uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
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
      {/* GLOBAL CONTROLS: DOWN ARROW & SKIP BUTTON                */}
      {/* -------------------------------------------------------- */}
      {frame < 5 && (
        <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-12 z-50 flex items-center gap-3">
          {/* Down Indicator Button */}
          <button
            type="button"
            onClick={() => advanceFrame()}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white/90 hover:text-white hover:bg-black/60 active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-lg"
            aria-label="Next frame"
          >
            <MaterialIcon name="south" size={18} />
          </button>

          {/* Skip Button */}
          <button
            type="button"
            onClick={onSkip}
            className="h-10 px-4 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white/90 hover:text-white hover:bg-black/60 active:scale-95 transition-all flex items-center gap-1.5 text-xs sm:text-sm font-semibold tracking-wider cursor-pointer shadow-lg uppercase"
            aria-label="Skip welcome journey"
          >
            <MaterialIcon name="fast_forward" size={16} />
            <span>Skip</span>
          </button>
        </div>
      )}

      {/* Bottom right indicator */}
      {frame < 5 && (
        <div className="absolute bottom-6 sm:bottom-8 right-6 sm:right-12 z-50">
          <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white/60 flex items-center justify-center text-xs font-mono">
            {frame}/4
          </div>
        </div>
      )}
    </div>
  )
}

export default WelcomeJourney
