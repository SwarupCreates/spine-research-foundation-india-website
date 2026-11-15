import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SrfLogo, MaterialIcon } from './icons'
import { BlurText } from './BlurText'
import GradualBlur from './GradualBlur'

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

  // Frame 2 progressive reveals (5 combined storytelling lines)
  const [showLine1, setShowLine1] = useState<boolean>(false)
  const [showLine2, setShowLine2] = useState<boolean>(false)
  const [showLine3, setShowLine3] = useState<boolean>(false)
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

  // Ensure viewport starts at the top
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

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
  const line1Prefix = 'As a son,'
  const line1Suffix = 'he tends the mother,'

  const line2Prefix = 'As a father,'
  const line2Suffix = 'he lulls the child,'

  const line3Prefix = 'As a brother,'
  const line3Suffix = 'he shares the fret ...'

  const line4Prefix = 'BUT...'
  const line4Suffix = 'AS A WITNESS,'

  const line5Text = 'he blesses the world!'

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

    if (next >= 4) {
      // Find visible logo from Frame 3 (formerly Frame 4)
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
          const contentWidth = w * 0.92
          const containerLeft = (w - contentWidth) / 2
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
      setFrame(4)

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
  // Frame 2 Reveal: Stagger 5 BlurText lines chronologically in one combined story frame
  // -------------------------------------------------------------
  useEffect(() => {
    if (frame !== 2) {
      setShowLine1(false)
      setShowLine2(false)
      setShowLine3(false)
      setShowWitness(false)
      setShowBlesses(false)
      return
    }

    const t1 = setTimeout(() => setShowLine1(true), 300)
    const t2 = setTimeout(() => setShowLine2(true), 1200)
    const t3 = setTimeout(() => setShowLine3(true), 2100)
    const t4 = setTimeout(() => setShowWitness(true), 3100)
    const t5 = setTimeout(() => setShowBlesses(true), 3900)

    let tAuto: ReturnType<typeof setTimeout>
    if (isPlayingRef.current) {
      tAuto = setTimeout(() => {
        advanceFrameRef.current(3)
      }, 6500)
    }

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      clearTimeout(t5)
      if (tAuto) clearTimeout(tAuto)
    }
  }, [frame])

  // Resume auto-advance if user toggles play while already on Frame 2 after text has rendered
  useEffect(() => {
    if (frame === 2 && showBlesses && isPlaying) {
      const t = setTimeout(() => {
        advanceFrameRef.current(3)
      }, 1800)
      return () => clearTimeout(t)
    }
  }, [frame, showBlesses, isPlaying])

  // -------------------------------------------------------------
  // Frame 3 Visual Reveal: 5 Text blocks -> Large Logo (formerly Frame 4)
  // -------------------------------------------------------------
  useEffect(() => {
    if (frame !== 3) {
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

  // Frame 3 Auto-advance timer (active only when user clicks play)
  useEffect(() => {
    if (frame === 3 && isPlaying) {
      const t7 = setTimeout(() => {
        advanceFrame(4)
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
          frame === 4 ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
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
              {/* On mobile: h-[calc(100%+35vh)] ensures the image extends well below the bottom of the viewport even when shifted */}
              {/* On desktop: full-bleed object-cover covers 100% of the display edge-to-edge with ZERO grey bars */}
              <div
                className={`w-full h-[calc(100%+35vh)] md:h-full absolute top-0 inset-x-0 will-change-transform z-0 ${
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
                    className="w-full h-full object-cover object-[50%_35%] md:object-center select-none"
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
              <picture className="w-full h-full block relative z-0">
                <source
                  media="(max-width: 768px)"
                  srcSet={`${import.meta.env.BASE_URL}banners/Solitary%20Boy%20Amid%20the%20Moving%20Crowd%201%20-%20phone.png`}
                />
                <img
                  src={`${import.meta.env.BASE_URL}banners/Solitary%20Boy%20Amid%20the%20Moving%20Crowd%201.jpg`}
                  alt="Solitary Boy Amid the Moving Crowd"
                  className="w-full h-full object-cover object-[50%_25%] md:object-center select-none"
                />
              </picture>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gradual blur softening as we move up from the bottom */}
        <div className="block sm:hidden pointer-events-none z-[6]">
          <GradualBlur
            position="bottom"
            target="parent"
            height="55%"
            strength={2.2}
            layers={8}
            curve="linear"
            exponential
            zIndex={6}
          />
        </div>
        <div className="hidden sm:block pointer-events-none z-[6]">
          <GradualBlur
            position="bottom"
            target="parent"
            height="60%"
            strength={2.4}
            layers={8}
            curve="linear"
            exponential
            zIndex={6}
          />
        </div>

        {/* Top-to-bottom subtle gradient overlay on mobile for soft header blending (#0b0c0e 100% to 0%) */}
        <div
          className="sm:hidden absolute top-0 inset-x-0 h-36 sm:h-44 pointer-events-none z-[8]"
          style={{
            background: 'linear-gradient(to bottom, #0b0c0e 0%, rgba(11, 12, 14, 0.72) 40%, rgba(11, 12, 14, 0) 100%)',
          }}
        />

        {/* Vertical bottom-to-top linear gradient overlay: Smoothly merges into #0b0c0e on mobile */}
        <div 
          className="sm:hidden absolute inset-0 pointer-events-none z-[7]"
          style={{
            background: 'linear-gradient(to top, #0b0c0e 0%, rgba(11, 12, 14, 0.98) 25%, rgba(11, 12, 14, 0.6) 55%, rgba(11, 12, 14, 0) 100%)',
          }}
        />
        {/* Vertical bottom-to-top linear gradient overlay: Smoothly merges into #0b0c0e on desktop */}
        <div 
          className="hidden sm:block absolute inset-0 pointer-events-none z-[7]"
          style={{
            background: 'linear-gradient(to top, #0b0c0e 0%, rgba(11, 12, 14, 0.96) 20%, rgba(11, 12, 14, 0.5) 45%, rgba(11, 12, 14, 0) 75%)',
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
            {/* Desktop View (>= md): Full-width 92% container */}
            <div className="hidden md:block w-[92%] mx-auto h-full relative">
              {showMeet && (
                <div className={`absolute top-[7.5%] left-0 text-white select-none ${sharedTextClass}`}>
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
        {frame === 1 && showBoy && (
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
              style={{
                maskImage: 'linear-gradient(to bottom, black 0%, black 70%, rgba(0,0,0,0.6) 84%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 70%, rgba(0,0,0,0.6) 84%, transparent 100%)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* -------------------------------------------------------- */}
      {/* FRAME 2: COMBINED 5-LINE STORYTELLING STANZA             */}
      {/* Desktop (>= md): Left-aligned at lower left              */}
      {/* Mobile (< md): Centered at bottom above controls         */}
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
            {/* Desktop View (>= md): Left-aligned inside standard 92% container */}
            <div className="hidden md:block w-[92%] mx-auto h-full relative">
              <div className="absolute bottom-20 md:bottom-24 lg:bottom-28 left-0 select-none">
                {/* Line 1: As a son, he tends the mother, */}
                {showLine1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-baseline gap-x-2.5 sm:gap-x-3 text-xl sm:text-2xl md:text-[24px] lg:text-[28px] xl:text-[30px] leading-tight"
                  >
                    <BlurText
                      text={line1Prefix}
                      effect="blur"
                      animateBy="words"
                      direction="bottom"
                      trigger="load"
                      delay={60}
                      stepDuration={0.3}
                      blur={10}
                      distance={14}
                      color="rgba(255, 255, 255, 0.55)"
                      className="font-normal font-galano"
                    />
                    <BlurText
                      text={line1Suffix}
                      effect="blur"
                      animateBy="words"
                      direction="bottom"
                      trigger="load"
                      delay={60}
                      stepDuration={0.3}
                      blur={10}
                      distance={14}
                      color="#ffffff"
                      className="font-bold font-galano drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
                    />
                  </motion.div>
                )}

                {/* Line 2: As a father, he lulls the child, */}
                {showLine2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-baseline gap-x-2.5 sm:gap-x-3 text-xl sm:text-2xl md:text-[24px] lg:text-[28px] xl:text-[30px] leading-tight pt-1.5 sm:pt-2 md:pt-2.5"
                  >
                    <BlurText
                      text={line2Prefix}
                      effect="blur"
                      animateBy="words"
                      direction="bottom"
                      trigger="load"
                      delay={60}
                      stepDuration={0.3}
                      blur={10}
                      distance={14}
                      color="rgba(255, 255, 255, 0.55)"
                      className="font-normal font-galano"
                    />
                    <BlurText
                      text={line2Suffix}
                      effect="blur"
                      animateBy="words"
                      direction="bottom"
                      trigger="load"
                      delay={60}
                      stepDuration={0.3}
                      blur={10}
                      distance={14}
                      color="#ffffff"
                      className="font-bold font-galano drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
                    />
                  </motion.div>
                )}

                {/* Line 3: As a brother, he shares the fret ... */}
                {showLine3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-baseline gap-x-2.5 sm:gap-x-3 text-xl sm:text-2xl md:text-[24px] lg:text-[28px] xl:text-[30px] leading-tight pt-1.5 sm:pt-2 md:pt-2.5"
                  >
                    <BlurText
                      text={line3Prefix}
                      effect="blur"
                      animateBy="words"
                      direction="bottom"
                      trigger="load"
                      delay={60}
                      stepDuration={0.3}
                      blur={10}
                      distance={14}
                      color="rgba(255, 255, 255, 0.55)"
                      className="font-normal font-galano"
                    />
                    <BlurText
                      text={line3Suffix}
                      effect="blur"
                      animateBy="words"
                      direction="bottom"
                      trigger="load"
                      delay={60}
                      stepDuration={0.3}
                      blur={10}
                      distance={14}
                      color="#ffffff"
                      className="font-bold font-galano drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
                    />
                  </motion.div>
                )}

                {/* Line 4: BUT... AS A WITNESS, */}
                {showWitness && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-baseline gap-x-3 sm:gap-x-4 pt-4 sm:pt-5 md:pt-6"
                  >
                    <BlurText
                      text={line4Prefix}
                      effect="blur"
                      animateBy="letters"
                      direction="bottom"
                      trigger="load"
                      delay={70}
                      stepDuration={0.32}
                      blur={12}
                      distance={18}
                      color="#ffffff"
                      className="font-galano font-black uppercase text-3xl sm:text-4xl md:text-[40px] lg:text-[48px] xl:text-[52px] tracking-tight drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)]"
                    />
                    <BlurText
                      text={line4Suffix}
                      effect="blur"
                      animateBy="words"
                      direction="bottom"
                      trigger="load"
                      delay={80}
                      stepDuration={0.35}
                      blur={14}
                      distance={20}
                      color="#ff0000"
                      className="font-galano font-black uppercase text-3xl sm:text-4xl md:text-[40px] lg:text-[48px] xl:text-[52px] tracking-tight drop-shadow-[0_2px_16px_rgba(255,0,0,0.4)]"
                    />
                  </motion.div>
                )}

                {/* Line 5: he blesses the world! */}
                {showBlesses && (
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="pt-2 sm:pt-2.5 md:pt-3"
                  >
                    <BlurText
                      text={line5Text}
                      effect="blur"
                      animateBy="words"
                      direction="bottom"
                      trigger="load"
                      delay={60}
                      stepDuration={0.32}
                      blur={10}
                      distance={16}
                      color="#ffffff"
                      className="font-galano font-bold text-white text-2xl sm:text-3xl md:text-[28px] lg:text-[34px] xl:text-[38px] tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
                    />
                  </motion.div>
                )}
              </div>
            </div>

            {/* Mobile View (< md): Centered at bottom above controls */}
            <div className="md:hidden absolute bottom-[96px] sm:bottom-[108px] inset-x-0 px-4 flex flex-col items-center text-center z-20">
              {/* Line 1: As a son, he tends the mother, */}
              {showLine1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-row items-center justify-center gap-x-1.5 text-[clamp(14.5px,4.1vw,17.5px)] leading-tight whitespace-nowrap"
                >
                  <BlurText
                    text={line1Prefix}
                    effect="blur"
                    animateBy="words"
                    direction="bottom"
                    trigger="load"
                    delay={60}
                    stepDuration={0.3}
                    blur={8}
                    distance={12}
                    color="rgba(255, 255, 255, 0.55)"
                    className="font-normal font-galano justify-center"
                  />
                  <BlurText
                    text={line1Suffix}
                    effect="blur"
                    animateBy="words"
                    direction="bottom"
                    trigger="load"
                    delay={60}
                    stepDuration={0.3}
                    blur={8}
                    distance={12}
                    color="#ffffff"
                    className="font-bold font-galano justify-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                  />
                </motion.div>
              )}

              {/* Line 2: As a father, he lulls the child, */}
              {showLine2 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-row items-center justify-center gap-x-1.5 text-[clamp(14.5px,4.1vw,17.5px)] leading-tight whitespace-nowrap pt-1.5 sm:pt-2"
                >
                  <BlurText
                    text={line2Prefix}
                    effect="blur"
                    animateBy="words"
                    direction="bottom"
                    trigger="load"
                    delay={60}
                    stepDuration={0.3}
                    blur={8}
                    distance={12}
                    color="rgba(255, 255, 255, 0.55)"
                    className="font-normal font-galano justify-center"
                  />
                  <BlurText
                    text={line2Suffix}
                    effect="blur"
                    animateBy="words"
                    direction="bottom"
                    trigger="load"
                    delay={60}
                    stepDuration={0.3}
                    blur={8}
                    distance={12}
                    color="#ffffff"
                    className="font-bold font-galano justify-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                  />
                </motion.div>
              )}

              {/* Line 3: As a brother, he shares the fret ... */}
              {showLine3 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-row items-center justify-center gap-x-1.5 text-[clamp(14.5px,4.1vw,17.5px)] leading-tight whitespace-nowrap pt-1.5 sm:pt-2"
                >
                  <BlurText
                    text={line3Prefix}
                    effect="blur"
                    animateBy="words"
                    direction="bottom"
                    trigger="load"
                    delay={60}
                    stepDuration={0.3}
                    blur={8}
                    distance={12}
                    color="rgba(255, 255, 255, 0.55)"
                    className="font-normal font-galano justify-center"
                  />
                  <BlurText
                    text={line3Suffix}
                    effect="blur"
                    animateBy="words"
                    direction="bottom"
                    trigger="load"
                    delay={60}
                    stepDuration={0.3}
                    blur={8}
                    distance={12}
                    color="#ffffff"
                    className="font-bold font-galano justify-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                  />
                </motion.div>
              )}

              {/* Line 4: BUT... AS A WITNESS, */}
              {showWitness && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-row items-center justify-center gap-x-2 text-[clamp(21px,5.8vw,26px)] leading-none whitespace-nowrap pt-3.5 sm:pt-4"
                >
                  <BlurText
                    text={line4Prefix}
                    effect="blur"
                    animateBy="letters"
                    direction="bottom"
                    trigger="load"
                    delay={65}
                    stepDuration={0.3}
                    blur={10}
                    distance={15}
                    color="#ffffff"
                    className="font-galano font-black uppercase justify-center drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
                  />
                  <BlurText
                    text={line4Suffix}
                    effect="blur"
                    animateBy="words"
                    direction="bottom"
                    trigger="load"
                    delay={70}
                    stepDuration={0.32}
                    blur={10}
                    distance={15}
                    color="#ff0000"
                    className="font-galano font-black uppercase justify-center drop-shadow-[0_2px_12px_rgba(255,0,0,0.4)]"
                  />
                </motion.div>
              )}

              {/* Line 5: he blesses the world! */}
              {showBlesses && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="pt-2 sm:pt-2.5"
                >
                  <BlurText
                    text={line5Text}
                    effect="blur"
                    animateBy="words"
                    direction="bottom"
                    trigger="load"
                    delay={60}
                    stepDuration={0.3}
                    blur={8}
                    distance={12}
                    color="#ffffff"
                    className="font-galano font-bold text-[clamp(16.5px,4.6vw,20px)] leading-tight justify-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] whitespace-nowrap"
                  />
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* -------------------------------------------------------- */}
      {/* FRAME 3: 5 NARRATIVE BLOCKS & LARGE SRF LOGO (formerly 4)  */}
      {/* Desktop (>= md): Classic 2-column layout                   */}
      {/* Mobile (< md): Centered vertical column (27px, all centered)*/}
      {/* -------------------------------------------------------- */}
      <AnimatePresence>
        {frame === 3 && (
          <motion.div
            key="frame-3-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
            className="absolute inset-0 z-30 pointer-events-none"
          >
            {/* Desktop View (>= md): Fixed 2-column layout - all boxes in final positions from start */}
            <div className="hidden md:block absolute inset-0 w-[92%] mx-auto pointer-events-none">
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
              <div className="absolute bottom-24 sm:bottom-28 md:bottom-32 left-0 flex flex-col items-start gap-3 sm:gap-4">
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
        {frame < 4 && showControls && (
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
