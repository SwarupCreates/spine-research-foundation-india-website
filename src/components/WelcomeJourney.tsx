import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SrfLogo, MaterialIcon } from './icons'
import { BlurText } from './BlurText'

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

  // Frame 2 progressive reveals
  const [showLine1, setShowLine1] = useState<boolean>(false)
  const [showLine2, setShowLine2] = useState<boolean>(false)
  const [showLine3, setShowLine3] = useState<boolean>(false)
  const [isElevated, setIsElevated] = useState<boolean>(false)

  // Frame 3 reveals
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
  const line1Prefix = 'AS A SON,'
  const line1Suffix = 'HE TENDS THE MOTHER,'

  const line2Prefix = 'AS A FATHER,'
  const line2Suffix = 'HE LULLS THE CHILD,'

  const line3Prefix = 'AS A BROTHER,'
  const line3Suffix = 'HE SHARES THE FRET ...'

  const isTransitioningRef = React.useRef(false)
  isTransitioningRef.current = isTransitioning

  const frameRef = React.useRef(frame)
  frameRef.current = frame

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

    const currentFrame = frameRef.current
    const next = targetFrame !== undefined ? targetFrame : currentFrame + 1

    if (next >= 5) {
      // Find visible Frame 4 logo by checking which element is actively rendered with positive layout dimensions (> 0)
      const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768
      const primaryId = isDesktop ? 'journey-frame4-logo' : 'journey-frame4-logo-mobile'
      const fallbackId = isDesktop ? 'journey-frame4-logo-mobile' : 'journey-frame4-logo'

      const elPrimary = document.getElementById(primaryId)
      const elFallback = document.getElementById(fallbackId)

      let activeLogo: HTMLElement | null = null
      if (elPrimary) {
        const r = elPrimary.getBoundingClientRect()
        if (r.width > 0 && r.height > 0) {
          activeLogo = elPrimary
        }
      }
      if (!activeLogo && elFallback) {
        const r = elFallback.getBoundingClientRect()
        if (r.width > 0 && r.height > 0) {
          activeLogo = elFallback
        }
      }

      if (activeLogo) {
        const r = activeLogo.getBoundingClientRect()
        setLogoStartCoords({
          left: r.left,
          top: r.top,
          width: r.width,
          height: r.height,
        })
      } else {
        // High-precision viewport fallback so the flight never originates from (0, 0)
        const w = typeof window !== 'undefined' ? window.innerWidth : 1024
        const h = typeof window !== 'undefined' ? window.innerHeight : 768
        if (isDesktop) {
          const contentWidth = Math.min(w, h * 1.54)
          const containerLeft = (w - contentWidth) / 2 + 32
          setLogoStartCoords({
            left: Math.max(32, containerLeft),
            top: h - 220,
            width: 96,
            height: 96,
          })
        } else {
          setLogoStartCoords({
            left: (w - 88) / 2,
            top: h * 0.65,
            width: 88,
            height: 88,
          })
        }
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
      setFrame(5)

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

      return
    }

    setFrame(next)

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
  // Frame 1 Visual Reveal: Sequential reveals
  // 1. Background image begins dissolve with slight bottom-to-top motion (t = 0..1000ms)
  // 2. Boy cutout layer dissolves in place after background finishes rendering (t = 1000ms..1800ms)
  // 3. MEET text brings in after boy layer completely rendered (t = 1900ms)
  // 4. DURGA text brings in behind the boy layer (t = 2500ms)
  // -------------------------------------------------------------
  useEffect(() => {
    if (frame !== 1) {
      setShowBoy(true)
      setShowControls(true)
      return
    }

    const t1 = setTimeout(() => setShowBoy(true), 1000)
    const t2 = setTimeout(() => setShowControls(true), 400)
    const t3 = setTimeout(() => setShowMeet(true), 1900)
    const t4 = setTimeout(() => setShowDurga(true), 2500)

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
      }, 6200)
      return () => clearTimeout(t5)
    }
  }, [frame, isPlaying, advanceFrame])

  // -------------------------------------------------------------
  // Frame 2 Reveal: Stagger 3 BlurText lines in-place -> elevate -> advance
  // -------------------------------------------------------------
  useEffect(() => {
    if (frame !== 2) {
      setShowLine1(false)
      setShowLine2(false)
      setShowLine3(false)
      setIsElevated(false)
      return
    }

    const t1 = setTimeout(() => setShowLine1(true), 200)
    const t2 = setTimeout(() => setShowLine2(true), 1300)
    const t3 = setTimeout(() => setShowLine3(true), 2400)
    const t4 = setTimeout(() => setIsElevated(true), 3600)

    let t5: ReturnType<typeof setTimeout>
    if (isPlayingRef.current) {
      t5 = setTimeout(() => {
        advanceFrameRef.current(3)
      }, 5400)
    }

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      if (t5) clearTimeout(t5)
    }
  }, [frame])

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
      setShowWitness(false)
      setShowBlesses(false)
      return
    }

    const t1 = setTimeout(() => setShowWitness(true), 1000)
    const t2 = setTimeout(() => setShowBlesses(true), 2000)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
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
    const t2 = setTimeout(() => setShowCard2(true), 750)
    const t3 = setTimeout(() => setShowCard3(true), 1300)
    const t4 = setTimeout(() => setShowCard4(true), 1850)
    const t5 = setTimeout(() => setShowCard5(true), 2400)
    const t6 = setTimeout(() => setShowLogo(true), 2950)

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
      }, 4900)
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              exit={{
                opacity: 0,
                filter: 'blur(10px)',
                transition: { duration: 1.2, ease: 'easeInOut' },
              }}
              className="absolute inset-0 w-full h-full"
            >
              {/* Ambient blurred backdrop for desktop ultrawide / 16:9 displays */}
              <div className="hidden md:block absolute inset-0 overflow-hidden pointer-events-none">
                <img
                  src={`${import.meta.env.BASE_URL}banners/Silent%20Amidst%20the%20Passing%20Crowd%201.png`}
                  alt=""
                  aria-hidden="true"
                  className="w-full h-full object-cover blur-3xl opacity-35 scale-110 select-none"
                />
              </div>

              {/* On mobile: Position background higher up in Frame 1 (-22vh) to avoid rug overlap with MEET, and climb +10vh further in Frame 2 (-32vh) */}
              {/* On desktop: object-contain with ambient backdrop ensures boy and full scene are NOT zoomed in, matching Figma */}
              <div
                className={`w-full h-full absolute top-0 inset-x-0 will-change-transform z-10 ${
                  frame === 2 ? 'journey-frame-2-shift' : 'journey-frame-1-shift'
                }`}
                style={{
                  transition: frame === 2 ? 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
                }}
              >
                <picture className="w-full h-full block">
                  <source
                    media="(max-width: 768px)"
                    srcSet={`${import.meta.env.BASE_URL}banners/Silent%20Amidst%20the%20Passing%20Crowd%201%20-%20phone.png`}
                  />
                  <img
                    src={`${import.meta.env.BASE_URL}banners/Silent%20Amidst%20the%20Passing%20Crowd%201.png`}
                    alt="Silent Amidst the Passing Crowd"
                    className="w-full h-full object-cover md:object-contain object-[50%_40%] md:object-center select-none"
                  />
                </picture>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="bg-solitary-boy"
              initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, transition: { duration: 0.8 } }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 w-full h-full"
            >
              {/* Ambient blurred backdrop for desktop ultrawide / 16:9 displays */}
              <div className="hidden md:block absolute inset-0 overflow-hidden pointer-events-none">
                <img
                  src={`${import.meta.env.BASE_URL}banners/Solitary%20Boy%20Amid%20the%20Moving%20Crowd%201.jpg`}
                  alt=""
                  aria-hidden="true"
                  className="w-full h-full object-cover blur-3xl opacity-35 scale-110 select-none"
                />
              </div>

              <picture className="w-full h-full block relative z-10">
                <source
                  media="(max-width: 768px)"
                  srcSet={`${import.meta.env.BASE_URL}banners/Solitary%20Boy%20Amid%20the%20Moving%20Crowd%201%20-%20phone.png`}
                />
                <img
                  src={`${import.meta.env.BASE_URL}banners/Solitary%20Boy%20Amid%20the%20Moving%20Crowd%201.jpg`}
                  alt="Solitary Boy Amid the Moving Crowd"
                  className="w-full h-full object-cover md:object-contain object-[50%_25%] md:object-center select-none"
                />
              </picture>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top-to-bottom subtle gradient overlay on mobile for soft header blending (#0b0c0e 100% to 0%) */}
        <div
          className="md:hidden absolute top-0 inset-x-0 h-36 sm:h-44 pointer-events-none z-[5]"
          style={{
            background: 'linear-gradient(to bottom, #0b0c0e 0%, rgba(11, 12, 14, 0.72) 40%, rgba(11, 12, 14, 0) 100%)',
          }}
        />

        {/* Bottom-to-top linear gradient overlay: 100% #0b0c0e at bottom to 0% #0b0c0e at top */}
        <div
          className="absolute bottom-0 inset-x-0 h-[58%] sm:h-1/2 pointer-events-none z-[5]"
          style={{
            background: 'linear-gradient(to top, #0b0c0e 0%, rgba(11, 12, 14, 0.96) 28%, rgba(11, 12, 14, 0.6) 60%, rgba(11, 12, 14, 0) 100%)',
          }}
        />
      </div>

      {/* -------------------------------------------------------- */}
      {/* FRAME 1: Text                                            */}
      {/* Desktop (>= md): 3D Depth text behind boy cutout          */}
      {/* Mobile (< md): Centered at bottom above controls         */}
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
            {/* Desktop View (>= md): Match image frame on wide displays */}
            <div className="hidden md:block w-full max-w-[calc(100vh*1.54)] mx-auto h-full relative px-6 md:px-8">
              {showMeet && (
                <div className={`absolute top-[7.5%] left-6 md:left-8 text-white select-none ${sharedTextClass}`}>
                  <BlurText
                    text="MEET"
                    effect="blur"
                    animateBy="letters"
                    direction="bottom"
                    trigger="load"
                    delay={90}
                    stepDuration={0.32}
                    blur={12}
                    distance={20}
                  />
                </div>
              )}

              {showDurga && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, filter: 'blur(16px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 0.85, ease: 'easeOut' }}
                  className="absolute top-[16%] left-0 w-full select-none pointer-events-none px-6 md:px-8"
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

            {/* Mobile View (< md): Centered at bottom above controls (44px MEET, 86px DURGA on 402px base) */}
            <div className="md:hidden absolute bottom-24 sm:bottom-28 inset-x-0 flex flex-col items-center justify-center text-center px-4 z-20">
              {showMeet && (
                <BlurText
                  text="MEET"
                  effect="blur"
                  animateBy="letters"
                  direction="bottom"
                  trigger="load"
                  delay={90}
                  stepDuration={0.32}
                  blur={12}
                  distance={20}
                  className="text-white font-galano font-black uppercase tracking-wide leading-none text-[clamp(34px,10.95vw,44px)] justify-center"
                />
              )}

              {showDurga && (
                <BlurText
                  text="DURGA"
                  effect="blur"
                  animateBy="letters"
                  direction="bottom"
                  trigger="load"
                  delay={90}
                  stepDuration={0.35}
                  blur={16}
                  distance={25}
                  color="#ff0000"
                  className="font-galano font-black uppercase tracking-tight leading-none text-[clamp(66px,21.4vw,86px)] -mt-2 sm:-mt-2.5 drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)] justify-center"
                />
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
              className="w-full h-full object-cover md:object-contain object-center select-none"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* -------------------------------------------------------- */}
      {/* FRAME 2: 3 TYPED LINES & ELEVATION CONTRAST               */}
      {/* Desktop (>= md): Inline left-aligned with sharedTextClass  */}
      {/* Mobile (< md): Centered at bottom (27px, 3 pairs of lines)*/}
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
            {/* Desktop View (>= md): Unified Container matching image frame, lower position above controls */}
            <div className="hidden md:block w-full max-w-[calc(100vh*1.54)] mx-auto h-full relative px-6 md:px-8">
              <div className="absolute bottom-20 md:bottom-24 lg:bottom-28 left-6 md:left-8 right-6 md:right-8 space-y-2 sm:space-y-2.5 md:space-y-3">
                {/* Line 1 */}
                <div className={`${sharedTextClass} min-h-[1.25em]`}>
                  {showLine1 && (
                    <div className="flex flex-wrap items-center gap-x-3.5">
                      <div className={`transition-opacity duration-700 ${isElevated ? 'opacity-65 text-white/65' : 'text-white'}`}>
                        <BlurText
                          text={line1Prefix}
                          effect="blur"
                          animateBy="words"
                          direction="bottom"
                          trigger="load"
                          delay={70}
                          stepDuration={0.32}
                          blur={10}
                          distance={16}
                        />
                      </div>
                      <div className="text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                        <BlurText
                          text={line1Suffix}
                          effect="blur"
                          animateBy="words"
                          direction="bottom"
                          trigger="load"
                          delay={70}
                          stepDuration={0.32}
                          blur={10}
                          distance={16}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Line 2 */}
                <div className={`${sharedTextClass} min-h-[1.25em]`}>
                  {showLine2 && (
                    <div className="flex flex-wrap items-center gap-x-3.5">
                      <div className={`transition-opacity duration-700 ${isElevated ? 'opacity-65 text-white/65' : 'text-white'}`}>
                        <BlurText
                          text={line2Prefix}
                          effect="blur"
                          animateBy="words"
                          direction="bottom"
                          trigger="load"
                          delay={70}
                          stepDuration={0.32}
                          blur={10}
                          distance={16}
                        />
                      </div>
                      <div className="text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                        <BlurText
                          text={line2Suffix}
                          effect="blur"
                          animateBy="words"
                          direction="bottom"
                          trigger="load"
                          delay={70}
                          stepDuration={0.32}
                          blur={10}
                          distance={16}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Line 3 */}
                <div className={`${sharedTextClass} min-h-[1.25em]`}>
                  {showLine3 && (
                    <div className="flex flex-wrap items-center gap-x-3.5">
                      <div className={`transition-opacity duration-700 ${isElevated ? 'opacity-65 text-white/65' : 'text-white'}`}>
                        <BlurText
                          text={line3Prefix}
                          effect="blur"
                          animateBy="words"
                          direction="bottom"
                          trigger="load"
                          delay={70}
                          stepDuration={0.32}
                          blur={10}
                          distance={16}
                        />
                      </div>
                      <div className="text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                        <BlurText
                          text={line3Suffix}
                          effect="blur"
                          animateBy="words"
                          direction="bottom"
                          trigger="load"
                          delay={70}
                          stepDuration={0.32}
                          blur={10}
                          distance={16}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile View (< md): Centered at bottom above controls (27px on 402px base, fixed in-place sequential slots) */}
            <div className="md:hidden absolute bottom-[92px] sm:bottom-[104px] inset-x-0 h-[216px] sm:h-[228px] flex flex-col justify-between items-center text-center px-6 z-20">
              <div className="w-full h-full flex flex-col justify-between text-center text-[clamp(19px,6.72vw,27px)] font-galano font-black uppercase leading-tight">
                {/* Slot 1: AS A SON, HE TENDS THE MOTHER, */}
                <div className="h-[60px] sm:h-[64px] flex flex-col items-center justify-center text-center">
                  {showLine1 && (
                    <>
                      <div className={`transition-opacity duration-700 ${isElevated ? 'opacity-65 text-white/65' : 'text-white'}`}>
                        <BlurText
                          text={line1Prefix}
                          effect="blur"
                          animateBy="words"
                          direction="bottom"
                          trigger="load"
                          delay={60}
                          stepDuration={0.32}
                          blur={10}
                          distance={16}
                          className="justify-center"
                        />
                      </div>
                      <div className="text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                        <BlurText
                          text={line1Suffix}
                          effect="blur"
                          animateBy="words"
                          direction="bottom"
                          trigger="load"
                          delay={60}
                          stepDuration={0.32}
                          blur={10}
                          distance={16}
                          className="justify-center"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Slot 2: AS A FATHER, HE LULLS THE CHILD, */}
                <div className="h-[60px] sm:h-[64px] flex flex-col items-center justify-center text-center">
                  {showLine2 && (
                    <>
                      <div className={`transition-opacity duration-700 ${isElevated ? 'opacity-65 text-white/65' : 'text-white'}`}>
                        <BlurText
                          text={line2Prefix}
                          effect="blur"
                          animateBy="words"
                          direction="bottom"
                          trigger="load"
                          delay={60}
                          stepDuration={0.32}
                          blur={10}
                          distance={16}
                          className="justify-center"
                        />
                      </div>
                      <div className="text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                        <BlurText
                          text={line2Suffix}
                          effect="blur"
                          animateBy="words"
                          direction="bottom"
                          trigger="load"
                          delay={60}
                          stepDuration={0.32}
                          blur={10}
                          distance={16}
                          className="justify-center"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Slot 3: AS A BROTHER, HE SHARES THE FRET ... */}
                <div className="h-[60px] sm:h-[64px] flex flex-col items-center justify-center text-center">
                  {showLine3 && (
                    <>
                      <div className={`transition-opacity duration-700 ${isElevated ? 'opacity-65 text-white/65' : 'text-white'}`}>
                        <BlurText
                          text={line3Prefix}
                          effect="blur"
                          animateBy="words"
                          direction="bottom"
                          trigger="load"
                          delay={60}
                          stepDuration={0.32}
                          blur={10}
                          distance={16}
                          className="justify-center"
                        />
                      </div>
                      <div className="text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                        <BlurText
                          text={line3Suffix}
                          effect="blur"
                          animateBy="words"
                          direction="bottom"
                          trigger="load"
                          delay={60}
                          stepDuration={0.32}
                          blur={10}
                          distance={16}
                          className="justify-center"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* -------------------------------------------------------- */}
      {/* FRAME 3: BUT... AS A WITNESS -> HE BLESSES THE WORLD!     */}
      {/* Desktop (>= md): Classic left-aligned statements           */}
      {/* Mobile (< md): Centered at top (BUT... AS A WITNESS,) and  */}
      {/*                centered at bottom (HE BLESSES THE WORLD!)  */}
      {/* -------------------------------------------------------- */}
      <AnimatePresence>
        {frame === 3 && (
          <motion.div
            key="frame-3-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            className="absolute inset-0 z-30 pointer-events-none"
          >
            {/* Desktop View (>= md): Classic left-aligned top statement and bottom statement */}
            <div className="hidden md:flex flex-col justify-between h-full w-full max-w-[calc(100vh*1.54)] mx-auto px-6 md:px-8 pb-28 sm:pb-32 md:pb-36">
              <div className="pt-10 sm:pt-14 md:pt-16">
                <div className="space-y-0.5 sm:space-y-1 md:space-y-1.5">
                  <BlurText
                    text="BUT..."
                    effect="blur"
                    animateBy="letters"
                    direction="bottom"
                    trigger="load"
                    delay={110}
                    stepDuration={0.32}
                    blur={10}
                    distance={18}
                    className={`text-white leading-[1.08] ${sharedTextClass}`}
                  />

                  {showWitness && (
                    <BlurText
                      text="AS A WITNESS,"
                      effect="blur"
                      animateBy="words"
                      direction="bottom"
                      trigger="load"
                      delay={80}
                      stepDuration={0.32}
                      blur={10}
                      distance={18}
                      color="#ff0000"
                      className={`leading-[1.08] ${sharedTextClass}`}
                    />
                  )}
                </div>
              </div>

              {showBlesses && (
                <BlurText
                  text="HE BLESSES THE WORLD!"
                  effect="blur"
                  animateBy="words"
                  direction="bottom"
                  trigger="load"
                  delay={80}
                  stepDuration={0.35}
                  blur={12}
                  distance={22}
                  className={`text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] max-w-4xl ${sharedTextClass}`}
                />
              )}
            </div>

            {/* Mobile View (< md): Centered at top (BUT... AS A WITNESS,) and centered at bottom (HE BLESSES THE WORLD!) (44px on 402px base) */}
            <div className="md:hidden flex flex-col justify-between h-full pt-14 pb-24 sm:pb-28 px-6 text-center">
              {/* Top: BUT... AS A WITNESS, */}
              <div className="flex flex-col items-center text-center">
                <BlurText
                  text="BUT..."
                  effect="blur"
                  animateBy="letters"
                  direction="bottom"
                  trigger="load"
                  delay={110}
                  stepDuration={0.32}
                  blur={10}
                  distance={18}
                  className="text-white font-galano font-black uppercase leading-[0.88] text-[clamp(34px,10.95vw,44px)] justify-center"
                />

                {showWitness && (
                  <div className="mt-1 sm:mt-1.5 flex justify-center">
                    <BlurText
                      text="AS A WITNESS,"
                      effect="blur"
                      animateBy="words"
                      direction="bottom"
                      trigger="load"
                      delay={80}
                      stepDuration={0.32}
                      blur={10}
                      distance={18}
                      color="#ff0000"
                      className="font-galano font-black uppercase leading-[0.88] text-[clamp(34px,10.95vw,44px)] justify-center"
                    />
                  </div>
                )}
              </div>

              {/* Bottom: HE BLESSES THE WORLD! */}
              {showBlesses && (
                <div className="text-white font-galano font-black uppercase leading-[0.88] sm:leading-[0.9] text-[clamp(34px,10.95vw,44px)] text-center drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] flex flex-col items-center">
                  <BlurText
                    text="HE BLESSES"
                    effect="blur"
                    animateBy="words"
                    direction="bottom"
                    trigger="load"
                    delay={80}
                    stepDuration={0.35}
                    blur={12}
                    distance={20}
                    className="justify-center"
                  />
                  <div className="mt-1 sm:mt-1.5 flex justify-center">
                    <BlurText
                      text="THE WORLD!"
                      effect="blur"
                      animateBy="words"
                      direction="bottom"
                      trigger="load"
                      delay={80}
                      stepDuration={0.35}
                      blur={12}
                      distance={20}
                      className="justify-center"
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* -------------------------------------------------------- */}
      {/* FRAME 4: 5 NARRATIVE BLOCKS & LARGE SRF LOGO              */}
      {/* Desktop (>= md): Classic 2-column layout                   */}
      {/* Mobile (< md): Centered vertical column (27px, all centered)*/}
      {/* -------------------------------------------------------- */}
      <AnimatePresence>
        {frame === 4 && (
          <motion.div
            key="frame-4-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
            className="absolute inset-0 z-30 pointer-events-none"
          >
            {/* Desktop View (>= md): Fixed 2-column layout - all boxes in final positions from start */}
            <div className="hidden md:block absolute inset-0 w-full max-w-[calc(100vh*1.54)] mx-auto px-6 md:px-8 pointer-events-none">
              {/* Top Row: Two Decades & A Family */}
              <div className="absolute top-[10%] lg:top-[12%] inset-x-0 flex flex-row justify-between items-start gap-4">
                <div className="w-[45%] min-h-[3.5em]">
                  {showCard1 && (
                    <BlurText
                      text="TWO DECADES OF COMMITMENT & COUNTING ..."
                      effect="blur"
                      animateBy="words"
                      direction="bottom"
                      trigger="load"
                      delay={60}
                      stepDuration={0.32}
                      blur={10}
                      distance={16}
                      className={`max-w-md sm:max-w-lg lg:max-w-xl text-white ${frame4TextClass}`}
                    />
                  )}
                </div>

                <div className="w-[45%] min-h-[3.5em] flex justify-end">
                  {showCard2 && (
                    <BlurText
                      text="A FAMILY TO WORK WITH – A FAMILY TO WORK FOR"
                      effect="blur"
                      animateBy="words"
                      direction="bottom"
                      trigger="load"
                      delay={60}
                      stepDuration={0.32}
                      blur={10}
                      distance={16}
                      className={`max-w-md sm:max-w-lg lg:max-w-xl text-white text-right justify-end ${frame4TextClass}`}
                    />
                  )}
                </div>
              </div>

              {/* Mid Row: A Bounty of Love & A Promise Spoken */}
              <div className="absolute top-[42%] lg:top-[44%] inset-x-0 flex flex-row justify-between items-start gap-4">
                <div className="w-[45%] min-h-[3.5em]">
                  {showCard3 && (
                    <BlurText
                      text="A BOUNTY OF LOVE, A LEGACY TO UPHOLD"
                      effect="blur"
                      animateBy="words"
                      direction="bottom"
                      trigger="load"
                      delay={60}
                      stepDuration={0.32}
                      blur={10}
                      distance={16}
                      className={`max-w-md sm:max-w-lg lg:max-w-xl text-white ${frame4TextClass}`}
                    />
                  )}
                </div>

                <div className="w-[45%] min-h-[3.5em] flex justify-end">
                  {showCard4 && (
                    <BlurText
                      text="A PROMISE SPOKEN IN SILENCE – FULFILLED WITH GLORY"
                      effect="blur"
                      animateBy="words"
                      direction="bottom"
                      trigger="load"
                      delay={60}
                      stepDuration={0.32}
                      blur={10}
                      distance={16}
                      className={`max-w-md sm:max-w-lg lg:max-w-xl text-white text-right justify-end ${frame4TextClass}`}
                    />
                  )}
                </div>
              </div>

              {/* Bottom-Left: Large SRF Logo & ONE SPINE AT A TIME */}
              <div className="absolute bottom-24 sm:bottom-28 md:bottom-32 left-6 md:left-8 flex flex-col items-start gap-3 sm:gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28">
                  {showLogo && (
                    <motion.div
                      id="journey-frame4-logo"
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="w-full h-full text-white drop-shadow-[0_4px_24px_rgba(255,255,255,0.35)]"
                    >
                      <SrfLogo className="w-full h-full text-white" />
                    </motion.div>
                  )}
                </div>

                <div className="min-h-[1.5em]">
                  {showCard5 && (
                    <BlurText
                      text="ONE SPINE AT A TIME"
                      effect="blur"
                      animateBy="words"
                      direction="bottom"
                      trigger="load"
                      delay={70}
                      stepDuration={0.32}
                      blur={12}
                      distance={18}
                      color="#ff0000"
                      className={frame4RedTitleClass}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Mobile View (< md): Stacked vertically in fixed sequential slots, equidistant and positioned matching Figma */}
            <div className="md:hidden absolute inset-0 z-20 pointer-events-none">
              {/* Upper cluster: 4 text blocks + prominent SRF logo distributed equidistantly */}
              <div className="absolute top-[16%] bottom-[19%] sm:bottom-[19.5%] inset-x-0 flex flex-col items-center justify-between text-center px-4">
                {/* Slot 1: TWO DECADES OF COMMITMENT & COUNTING ... */}
                <div className="min-h-[56px] sm:min-h-[64px] flex items-center justify-center text-center">
                  {showCard1 && (
                    <BlurText
                      text="TWO DECADES OF COMMITMENT & COUNTING ..."
                      effect="blur"
                      animateBy="words"
                      direction="bottom"
                      trigger="load"
                      delay={50}
                      stepDuration={0.32}
                      blur={10}
                      distance={16}
                      className="text-white font-galano font-black uppercase text-[clamp(18px,6vw,25px)] leading-[1.14] text-center drop-shadow-md max-w-[270px] sm:max-w-xs mx-auto justify-center"
                    />
                  )}
                </div>

                {/* Slot 2: A FAMILY TO WORK WITH – A FAMILY TO WORK FOR */}
                <div className="min-h-[56px] sm:min-h-[64px] flex items-center justify-center text-center">
                  {showCard2 && (
                    <BlurText
                      text="A FAMILY TO WORK WITH – A FAMILY TO WORK FOR"
                      effect="blur"
                      animateBy="words"
                      direction="bottom"
                      trigger="load"
                      delay={50}
                      stepDuration={0.32}
                      blur={10}
                      distance={16}
                      className="text-white font-galano font-black uppercase text-[clamp(18px,6vw,25px)] leading-[1.14] text-center drop-shadow-md max-w-[270px] sm:max-w-xs mx-auto justify-center"
                    />
                  )}
                </div>

                {/* Slot 3: A BOUNTY OF LOVE, A LEGACY TO UPHOLD */}
                <div className="min-h-[56px] sm:min-h-[64px] flex items-center justify-center text-center">
                  {showCard3 && (
                    <BlurText
                      text="A BOUNTY OF LOVE, A LEGACY TO UPHOLD"
                      effect="blur"
                      animateBy="words"
                      direction="bottom"
                      trigger="load"
                      delay={50}
                      stepDuration={0.32}
                      blur={10}
                      distance={16}
                      className="text-white font-galano font-black uppercase text-[clamp(18px,6vw,25px)] leading-[1.14] text-center drop-shadow-md max-w-[260px] sm:max-w-xs mx-auto justify-center"
                    />
                  )}
                </div>

                {/* Slot 4: A PROMISE SPOKEN IN SILENCE – FULFILLED WITH GLORY */}
                <div className="min-h-[56px] sm:min-h-[64px] flex items-center justify-center text-center">
                  {showCard4 && (
                    <BlurText
                      text="A PROMISE SPOKEN IN SILENCE – FULFILLED WITH GLORY"
                      effect="blur"
                      animateBy="words"
                      direction="bottom"
                      trigger="load"
                      delay={50}
                      stepDuration={0.32}
                      blur={10}
                      distance={16}
                      className="text-white font-galano font-black uppercase text-[clamp(18px,6vw,25px)] leading-[1.14] text-center drop-shadow-md max-w-[270px] sm:max-w-xs mx-auto justify-center"
                    />
                  )}
                </div>

                {/* Slot 5: Prominent SRF Logo */}
                <div className="w-20 h-20 sm:w-22 sm:h-22 min-h-[76px] sm:min-h-[84px] flex items-center justify-center">
                  {showLogo && (
                    <motion.div
                      id="journey-frame4-logo-mobile"
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="w-20 h-20 sm:w-22 sm:h-22 mx-auto text-white drop-shadow-[0_4px_24px_rgba(255,255,255,0.4)]"
                    >
                      <SrfLogo className="w-full h-full text-white" />
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Lower position: ONE SPINE AT A TIME directly above floating buttons */}
              <div className="absolute bottom-[11.5%] sm:bottom-[12%] inset-x-0 min-h-[28px] sm:min-h-[32px] flex items-center justify-center px-4">
                {showCard5 && (
                  <BlurText
                    text="ONE SPINE AT A TIME"
                    effect="blur"
                    animateBy="words"
                    direction="bottom"
                    trigger="load"
                    delay={70}
                    stepDuration={0.32}
                    blur={12}
                    distance={18}
                    color="#ff0000"
                    className="font-galano font-black uppercase tracking-wide text-[clamp(21px,6.72vw,27px)] leading-tight text-center drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] justify-center"
                  />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* -------------------------------------------------------- */}
      {/* BOTTOM INTRO CONTROLS: DOWN ARROW & SKIP (LEFT/CENTER) + PLAY/PAUSE (TOP-RIGHT MOBILE / BOTTOM-RIGHT DESKTOP) */}
      {/* -------------------------------------------------------- */}
      <AnimatePresence>
        {frame < 5 && showControls && (
          <>
            {/* Left/Center Controls: Next Frame Down Arrow + Skip Pill Button */}
            <motion.div
              key="left-journey-controls"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{
                opacity: 0,
                scale: 0.3,
                transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
              }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-6 sm:bottom-7 inset-x-0 md:inset-x-auto md:left-7 z-50 flex items-center justify-center md:justify-start pointer-events-none"
            >
              <div className="flex items-center gap-3.5 pointer-events-auto">
                {/* Next Frame Down Button with arrow_cool_down icon */}
                <button
                  type="button"
                  onClick={() => advanceFrame()}
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-white/90 hover:text-white hover:bg-black/70 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-xl"
                  aria-label="Next frame"
                  title="Next frame"
                >
                  <MaterialIcon name="arrow_cool_down" size={22} className="sm:text-[24px]" />
                </button>

                {/* Skip Pill Button: In usual Google Sans font (font-sans) */}
                <button
                  type="button"
                  onClick={onSkip}
                  className="h-11 sm:h-12 px-5 sm:px-6 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-white/90 hover:text-white hover:bg-black/70 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 font-sans text-xs sm:text-sm font-semibold tracking-normal cursor-pointer shadow-xl uppercase"
                  aria-label="Skip welcome journey"
                >
                  <MaterialIcon name="fast_forward" size={17} />
                  <span>Skip</span>
                </button>
              </div>
            </motion.div>

            {/* Play / Pause Button: Top-Right on Mobile (< md), Bottom-Right on Desktop (>= md) */}
            <motion.div
              key="right-journey-controls"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{
                opacity: 0,
                scale: 0.3,
                transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
              }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-5 right-5 sm:top-6 sm:right-6 md:top-auto md:bottom-7 md:right-7 z-50 flex items-center pointer-events-auto"
            >
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-white/90 hover:text-white hover:bg-black/70 transition-all flex items-center justify-center cursor-pointer shadow-xl hover:scale-105 active:scale-95"
                aria-label={isPlaying ? 'Pause auto-play' : 'Start auto-play'}
                title={isPlaying ? 'Pause auto-play (switch to manual scroll)' : 'Start auto-play'}
              >
                <MaterialIcon name={isPlaying ? 'pause' : 'play_arrow'} size={20} className="md:text-[22px]" />
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
