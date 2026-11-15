import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SrfLogo, MaterialIcon } from './icons'

interface WelcomeJourneyProps {
  onComplete: () => void
  onSkip: () => void
  onLandedAtNavbar?: () => void
}

export const WelcomeJourney: React.FC<WelcomeJourneyProps> = ({
  onComplete,
  onSkip,
  onLandedAtNavbar,
}) => {
  // Current journey frame: 1 through 4, then 5 for landing transition
  const [frame, setFrame] = useState<number>(1)
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false)

  // Auto-play state: false = manual scrolling by default; true = auto-advances
  const [isPlaying, setIsPlaying] = useState<boolean>(false)

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

  // Frame 5 flight to navbar & seamless dissolve
  const [isFlyingToNavbar, setIsFlyingToNavbar] = useState<boolean>(false)
  const [isDissolvingFlyingLogo, setIsDissolvingFlyingLogo] = useState<boolean>(false)

  // Precalculated & dynamically synchronized navbar logo target coordinates
  const [navbarTarget, setNavbarTarget] = useState<{
    left: number
    top: number
    width: number
    height: number
  }>(() => {
    if (typeof window === 'undefined') return { left: 64, top: 24, width: 44, height: 44 }
    const w = window.innerWidth
    const isMobile = w < 640
    const isSm = w >= 640 && w < 1024
    const isLg = w >= 1024 && w < 1280
    const padding = isMobile ? 24 : isSm ? 40 : isLg ? 56 : 64
    const gutter = Math.max(0, (w - 1536) / 2)
    const left = gutter + padding + 6
    const top = (isMobile ? 6 : 10) + 18 + 6
    const size = isMobile ? 40 : 44
    return { left, top, width: size, height: size }
  })

  // Start coordinates for Frame 4 logo flight
  const [logoStartCoords, setLogoStartCoords] = useState<{
    left: number
    top: number
    width: number
    height: number
  }>({ left: 60, top: 700, width: 112, height: 112 })

  // Synchronize target coordinates dynamically from the navbar element in the DOM
  useEffect(() => {
    const updateTarget = () => {
      const el = document.getElementById('navbar-srf-logo-container')
      if (el) {
        const r = el.getBoundingClientRect()
        if (r.width > 0 && r.height > 0) {
          setNavbarTarget({
            left: r.left,
            top: r.top,
            width: r.width,
            height: r.height,
          })
          return
        }
      }
      const w = window.innerWidth
      const isMobile = w < 640
      const isSm = w >= 640 && w < 1024
      const isLg = w >= 1024 && w < 1280
      const padding = isMobile ? 24 : isSm ? 40 : isLg ? 56 : 64
      const gutter = Math.max(0, (w - 1536) / 2)
      const left = gutter + padding + 6
      const top = (isMobile ? 6 : 10) + 18 + 6
      const size = isMobile ? 40 : 44
      setNavbarTarget({ left, top, width: size, height: size })
    }

    updateTarget()
    const timer = setTimeout(updateTarget, 100)
    window.addEventListener('resize', updateTarget)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', updateTarget)
    }
  }, [])

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

  const isTransitioningRef = React.useRef(false)
  isTransitioningRef.current = isTransitioning

  const isPlayingRef = React.useRef(isPlaying)
  isPlayingRef.current = isPlaying

  const onCompleteRef = React.useRef(onComplete)
  onCompleteRef.current = onComplete

  const onLandedAtNavbarRef = React.useRef(onLandedAtNavbar)
  onLandedAtNavbarRef.current = onLandedAtNavbar

  // Advance Frame with magnetic transition (completely stable callback that never re-creates)
  const advanceFrame = useCallback((targetFrame?: number) => {
    if (isTransitioningRef.current) return
    setIsTransitioning(true)
    isTransitioningRef.current = true

    setFrame((prev) => {
      const next = targetFrame !== undefined ? targetFrame : prev + 1
      if (next >= 5) {
        // Measure starting coordinates of Frame 4 logo
        const frame4Logo = document.getElementById('journey-frame4-logo')
        if (frame4Logo) {
          const r = frame4Logo.getBoundingClientRect()
          setLogoStartCoords({
            left: r.left,
            top: r.top,
            width: r.width,
            height: r.height,
          })
        }

        // Re-measure navbar target
        const navLogo = document.getElementById('navbar-srf-logo-container')
        if (navLogo) {
          const r = navLogo.getBoundingClientRect()
          if (r.width > 0 && r.height > 0) {
            setNavbarTarget({
              left: r.left,
              top: r.top,
              width: r.width,
              height: r.height,
            })
          }
        }

        setIsFlyingToNavbar(true)

        // 1. Flight reaches the top navbar in 850ms
        setTimeout(() => {
          onLandedAtNavbarRef.current?.()
        }, 850)

        // 2. Navbar entry animation queue takes ~1250ms to finish all items
        setTimeout(() => {
          setIsDissolvingFlyingLogo(true)
        }, 2100)

        // 3. Complete journey and unmount
        setTimeout(() => {
          onCompleteRef.current()
        }, 2600)

        return 5
      }
      return next
    })

    setTimeout(() => {
      setIsTransitioning(false)
      isTransitioningRef.current = false
    }, 600)
  }, [])

  const advanceFrameRef = React.useRef(advanceFrame)
  advanceFrameRef.current = advanceFrame

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

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowDown', 'PageDown', 'Space'].includes(e.code)) {
        e.preventDefault()
        advanceFrame()
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: true })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [advanceFrame])

  // -------------------------------------------------------------
  // Frame 1 Visual Reveal: Sequential slow reveals
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

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [frame])

  // Frame 1 Auto-advance timer (active only when user clicks play)
  useEffect(() => {
    if (frame === 1 && isPlaying) {
      const t5 = setTimeout(() => {
        advanceFrame(2)
      }, 4800)
      return () => clearTimeout(t5)
    }
  }, [frame, isPlaying, advanceFrame])

  // -------------------------------------------------------------
  // Frame 2 Automation: Type 3 lines smoothly in-place -> elevate -> advance
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
          if (isPlayingRef.current) {
            timer = setTimeout(() => {
              advanceFrameRef.current(3)
            }, 1800)
          }
        }, 250)
      }
    }

    timer = setTimeout(typeLine1, 220)

    return () => clearTimeout(timer)
  }, [frame, line1Total, line2Total, line3Total])

  // Resume auto-advance if user toggles play while already elevated on Frame 2
  useEffect(() => {
    if (frame === 2 && isElevated && isPlaying) {
      const t = setTimeout(() => {
        advanceFrameRef.current(3)
      }, 1200)
      return () => clearTimeout(t)
    }
  }, [frame, isElevated, isPlaying])

  // -------------------------------------------------------------
  // Frame 3 Visual Reveal: BUT... -> AS A WITNESS -> HE BLESSES THE WORLD
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

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      clearTimeout(t5)
    }
  }, [frame])

  // Frame 3 Auto-advance timer (active only when user clicks play)
  useEffect(() => {
    if (frame === 3 && isPlaying) {
      const t6 = setTimeout(() => {
        advanceFrame(4)
      }, 4500)
      return () => clearTimeout(t6)
    }
  }, [frame, isPlaying, advanceFrame])

  // -------------------------------------------------------------
  // Frame 4 Visual Reveal: 5 Text blocks -> Large Logo
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

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      clearTimeout(t5)
      clearTimeout(t6)
    }
  }, [frame])

  // Frame 4 Auto-advance timer (active only when user clicks play)
  useEffect(() => {
    if (frame === 4 && isPlaying) {
      const t7 = setTimeout(() => {
        advanceFrame(5)
      }, 4800)
      return () => clearTimeout(t7)
    }
  }, [frame, isPlaying, advanceFrame])

  // Shared font size class for all text across the first 3 frames (except DURGA)
  const sharedTextClass =
    'text-3xl sm:text-4xl md:text-5xl lg:text-[56px] xl:text-[60px] 2xl:text-[66px] font-galano font-black uppercase leading-tight whitespace-normal sm:whitespace-nowrap'

  // Frame 4 narrative card font class (scaled to >= 66% of the headline scale for bold, punchy presence)
  const frame4TextClass =
    'font-galano font-black text-xl sm:text-2xl md:text-[32px] lg:text-[38px] xl:text-[42px] 2xl:text-[46px] uppercase leading-tight sm:leading-snug drop-shadow-md'

  const frame4RedTitleClass =
    'text-[#ff0000] font-galano font-black text-2xl sm:text-3xl md:text-[34px] lg:text-[42px] xl:text-[48px] 2xl:text-[52px] uppercase leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]'

  return (
    <div className="fixed inset-0 z-[100] w-full h-full pointer-events-none overflow-hidden select-none font-galano">
      {/* Background dark backdrop & story frames (smoothly dissolves to 0 on landing flight) */}
      <div
        className={`absolute inset-0 w-full h-full bg-[#0b0c0e] transition-opacity duration-700 ${
          frame === 5 ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
        }`}
      >
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
                  media="(max-width: 768px)"
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
                  media="(max-width: 768px)"
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
            {/* Unified Central Story Container: 92% width centered (bigger than 90%, centered) */}
            <div className="w-[92%] mx-auto h-full relative">
              {/* "MEET" top-left: Left-aligned to DURGA */}
              {showMeet && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, ease: 'easeOut' }}
                  className={`absolute top-[7.5%] left-0 text-white select-none ${sharedTextClass}`}
                >
                  MEET
                </motion.div>
              )}

              {/* Giant "DURGA" bold red text: Spans 92% viewport width, perfectly centered with natural spacing */}
              {showDurga && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.85, ease: 'easeOut' }}
                  className="absolute top-[16%] left-0 w-full select-none pointer-events-none"
                >
                  <svg
                    viewBox="0 0 720 152"
                    className="w-full h-auto overflow-hidden select-none pointer-events-none"
                    aria-label="DURGA"
                  >
                    <text
                      x="360"
                      y="146"
                      textAnchor="middle"
                      fill="#ff0000"
                      fontFamily="'Galano Grotesque Black', 'Galano Grotesque', sans-serif"
                      fontWeight="900"
                      fontSize="200"
                    >
                      DURGA
                    </text>
                  </svg>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* -------------------------------------------------------- */}
      {/* BOY CUTOUT LAYER (Frames 1 & 2): Sits over "DURGA" text   */}
      {/* Only rendered on desktop (>= md) for 3D depth effect      */}
      {/* On mobile, depth is omitted so background displays 1:1    */}
      {/* with zero ghosting or superimposition glitch             */}
      {/* -------------------------------------------------------- */}
      <AnimatePresence>
        {frame <= 2 && showBoy && (
          <motion.div
            key="boy-cutout-layer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute inset-0 w-full h-full pointer-events-none z-20 hidden md:block"
          >
            <img
              src={`${import.meta.env.BASE_URL}banners/boy.png`}
              alt="Boy with spinal deformity"
              className="w-full h-full object-cover object-center select-none"
            />
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
            className="absolute inset-0 z-30 pointer-events-none"
          >
            {/* Same Unified Container: 92% width matching Frame 1 */}
            <div className="w-[92%] mx-auto h-full relative">
              {/* Top-anchored container: zero upward layout shift when typing successive lines */}
              <div className="absolute top-[56%] sm:top-[57%] md:top-[58%] left-0 right-0 space-y-1.5 sm:space-y-2 md:space-y-2.5">
                {/* Line 1 */}
                <div className={`${sharedTextClass} min-h-[1.25em]`}>
                  <span
                    className={`transition-opacity duration-700 ${
                      isElevated ? 'opacity-65 text-white/65' : 'opacity-100 text-white'
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
                <div className={`${sharedTextClass} min-h-[1.25em]`}>
                  <span
                    className={`transition-opacity duration-700 ${
                      isElevated ? 'opacity-65 text-white/65' : 'opacity-100 text-white'
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
                <div className={`${sharedTextClass} min-h-[1.25em]`}>
                  <span
                    className={`transition-opacity duration-700 ${
                      isElevated ? 'opacity-65 text-white/65' : 'opacity-100 text-white'
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
            className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between pb-28 sm:pb-32 md:pb-36"
          >
            {/* Same Unified Container: 92% width */}
            <div className="w-[92%] mx-auto h-full flex flex-col justify-between">
              {/* Top-Left: BUT... AS A WITNESS, (Practically a single continuous statement) */}
              <div className="pt-10 sm:pt-14 md:pt-16">
                <div className="space-y-0.5 sm:space-y-1 md:space-y-1.5">
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-white leading-[1.08] ${sharedTextClass}`}
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
                      className={`text-[#ff0000] leading-[1.08] ${sharedTextClass}`}
                    >
                      AS A WITNESS,
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Bottom-Left: HE BLESSES THE WORLD! */}
              {showBlesses && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className={`text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] max-w-4xl ${sharedTextClass}`}
                >
                  HE BLESSES THE WORLD!
                </motion.div>
              )}
            </div>
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
            className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between pb-28 sm:pb-32 md:pb-36"
          >
            {/* Same Unified Container: 92% width */}
            <div className="w-[92%] mx-auto h-full flex flex-col justify-between">
              {/* Top Row: Two Decades & A Family */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-8 sm:pt-10 md:pt-14">
                {showCard1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`max-w-md sm:max-w-lg lg:max-w-xl text-white ${frame4TextClass}`}
                  >
                    TWO DECADES OF COMMITMENT &amp; COUNTING ...
                  </motion.div>
                )}

                {showCard2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`max-w-md sm:max-w-lg lg:max-w-xl text-white text-left sm:text-right ${frame4TextClass}`}
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
                    className={`max-w-md sm:max-w-lg lg:max-w-xl text-white ${frame4TextClass}`}
                  >
                    A BOUNTY OF LOVE, A LEGACY TO UPHOLD
                  </motion.div>
                )}

                {showCard4 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`max-w-md sm:max-w-lg lg:max-w-xl text-white text-left sm:text-right ${frame4TextClass}`}
                  >
                    A PROMISE SPOKEN IN SILENCE – FULFILLED WITH GLORY
                  </motion.div>
                )}
              </div>

              {/* Bottom-Left: Large SRF Logo & ONE SPINE AT A TIME */}
              <div className="flex flex-col items-start gap-3 sm:gap-4">
                {showLogo && (
                  <motion.div
                    id="journey-frame4-logo"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 text-white drop-shadow-[0_4px_24px_rgba(255,255,255,0.35)]"
                  >
                    <SrfLogo className="w-full h-full text-white" />
                  </motion.div>
                )}

                {showCard5 && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={frame4RedTitleClass}
                  >
                    ONE SPINE AT A TIME
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* -------------------------------------------------------- */}
      {/* BOTTOM INTRO CONTROLS: DOWN ARROW & SKIP (LEFT) + PLAY/PAUSE (RIGHT) */}
      {/* -------------------------------------------------------- */}
      <AnimatePresence>
        {frame < 5 && showControls && (
          <>
            {/* Left Controls: Next Frame Down Arrow + Skip Pill Button */}
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
              {/* Next Frame Down Button with arrow_cool_down icon */}
              <button
                type="button"
                onClick={() => advanceFrame()}
                className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-white/90 hover:text-white hover:bg-black/70 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-xl"
                aria-label="Next frame"
                title="Next frame"
              >
                <MaterialIcon name="arrow_cool_down" size={24} />
              </button>

              {/* Skip Pill Button: In usual Google Sans font (font-sans) */}
              <button
                type="button"
                onClick={onSkip}
                className="h-12 px-6 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-white/90 hover:text-white hover:bg-black/70 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 font-sans text-sm font-semibold tracking-normal cursor-pointer shadow-xl uppercase"
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
                aria-label={isPlaying ? 'Pause auto-play' : 'Start auto-play'}
                title={isPlaying ? 'Pause auto-play (switch to manual scroll)' : 'Start auto-play'}
              >
                <MaterialIcon name={isPlaying ? 'pause' : 'play_arrow'} size={22} />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      </div>

      {/* -------------------------------------------------------- */}
      {/* FRAME 5: LOGO FLIGHT TO NAVBAR & SEAMLESS DISSOLVE       */}
      {/* -------------------------------------------------------- */}
      {isFlyingToNavbar && (
        <motion.div
          initial={{
            position: 'fixed',
            left: logoStartCoords.left,
            top: logoStartCoords.top,
            width: logoStartCoords.width,
            height: logoStartCoords.height,
            opacity: 1,
            zIndex: 110,
          }}
          animate={{
            left: navbarTarget.left,
            top: navbarTarget.top,
            width: navbarTarget.width,
            height: navbarTarget.height,
            opacity: isDissolvingFlyingLogo ? 0 : 1,
          }}
          transition={
            isDissolvingFlyingLogo
              ? { duration: 0.45, ease: 'easeOut' }
              : { duration: 0.85, ease: [0.16, 1, 0.3, 1] }
          }
          className="pointer-events-none text-white drop-shadow-[0_4px_24px_rgba(255,255,255,0.35)]"
        >
          <SrfLogo className="w-full h-full text-white" />
        </motion.div>
      )}
    </div>
  )
}

export default WelcomeJourney
