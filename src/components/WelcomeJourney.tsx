import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { SrfLogo, MaterialIcon } from './icons'
import { BlurText } from './BlurText'
import GradualBlur from './GradualBlur'

interface WelcomeJourneyProps {
  onComplete: () => void
  onSkip: () => void
  onLandedAtNavbar?: () => void
  onFrameChange?: (frame: number) => void
}

const frameMotionVariants: Variants = {
  initial: (dir: 'forward' | 'backward') => ({
    opacity: 0,
    y: dir === 'backward' ? -45 : 45,
    filter: 'blur(10px)',
  }),
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
  exit: (dir: 'forward' | 'backward') => ({
    opacity: 0,
    y: dir === 'backward' ? 45 : -45,
    filter: 'blur(14px)',
    transition: { duration: 0.5, ease: [0.33, 1, 0.68, 1] },
  }),
}

export const WelcomeJourney: React.FC<WelcomeJourneyProps> = ({
  onComplete,
  onSkip,
  onLandedAtNavbar,
  onFrameChange,
}) => {
  // Current journey frame: 1 through 3, then 4 for landing transition
  const [frame, setFrame] = useState<number>(1)

  useEffect(() => {
    onFrameChange?.(frame)
  }, [frame, onFrameChange])
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false)
  const [transitionDirection, setTransitionDirection] = useState<'forward' | 'backward'>('forward')

  // Auto-play state: false = manual scrolling by default; true = auto-advances
  const [isPlaying, setIsPlaying] = useState<boolean>(false)

  // Mobile detection for responsive offsets
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Frame 1 slow sequential reveal states (BlurText)
  const [showMeet, setShowMeet] = useState<boolean>(false)
  const [showDurga, setShowDurga] = useState<boolean>(false)
  const [showControls, setShowControls] = useState<boolean>(false)

  // Frame 2 progressive reveals (5 combined storytelling lines)
  const [showLine1, setShowLine1] = useState<boolean>(false)
  const [showLine2, setShowLine2] = useState<boolean>(false)
  const [showLine3, setShowLine3] = useState<boolean>(false)
  const [showWitness, setShowWitness] = useState<boolean>(false)
  const [showBlesses, setShowBlesses] = useState<boolean>(false)

  // Frame 3 sequenced reveals (4 narrative items + SRF Logo + red title)
  const [showCard1, setShowCard1] = useState<boolean>(false)
  const [showCard2, setShowCard2] = useState<boolean>(false)
  const [showCard3, setShowCard3] = useState<boolean>(false)
  const [showCard4, setShowCard4] = useState<boolean>(false)
  const [showLogo, setShowLogo] = useState<boolean>(false)
  const [showCard5, setShowCard5] = useState<boolean>(false)

  // Frame 4 flight to navbar & seamless dissolve
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

  const isTransitioningRef = useRef(false)
  isTransitioningRef.current = isTransitioning

  const frameRef = useRef(frame)
  frameRef.current = frame

  const isPlayingRef = useRef(isPlaying)
  isPlayingRef.current = isPlaying

  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const onLandedAtNavbarRef = useRef(onLandedAtNavbar)
  onLandedAtNavbarRef.current = onLandedAtNavbar

  // Advance Frame (Forward Scroll)
  const advanceFrame = useCallback((targetFrame?: number) => {
    if (isTransitioningRef.current) return
    setIsTransitioning(true)
    isTransitioningRef.current = true
    setTransitionDirection('forward')

    const currentFrame = frameRef.current
    const next = targetFrame !== undefined ? targetFrame : currentFrame + 1

    if (next >= 4) {
      // Find visible logo from Frame 3
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
        // Fallback coordinates
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

      // 2. Navbar entry animation takes ~1250ms to finish all items
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

  const advanceFrameRef = useRef(advanceFrame)
  advanceFrameRef.current = advanceFrame

  // Reverse frame navigation (Reverse Scroll)
  const previousFrame = useCallback(() => {
    if (isTransitioningRef.current) return
    if (frameRef.current <= 1) return

    setIsTransitioning(true)
    isTransitioningRef.current = true
    setTransitionDirection('backward')

    const prev = frameRef.current - 1
    setFrame(prev)

    setTimeout(() => {
      setIsTransitioning(false)
      isTransitioningRef.current = false
    }, 600)
  }, [])

  const previousFrameRef = useRef(previousFrame)
  previousFrameRef.current = previousFrame

  // -------------------------------------------------------------
  // Frame 1 Reveal: Auto-animates on load
  // -------------------------------------------------------------
  useEffect(() => {
    if (frame === 1) {
      const tMeet = setTimeout(() => setShowMeet(true), 350)
      const tDurga = setTimeout(() => setShowDurga(true), 850)
      const tControls = setTimeout(() => setShowControls(true), 1250)

      let tAuto: ReturnType<typeof setTimeout>
      if (isPlayingRef.current) {
        tAuto = setTimeout(() => {
          advanceFrameRef.current(2)
        }, 3200)
      }

      return () => {
        clearTimeout(tMeet)
        clearTimeout(tDurga)
        clearTimeout(tControls)
        if (tAuto) clearTimeout(tAuto)
      }
    } else {
      setShowMeet(true)
      setShowDurga(true)
      setShowControls(true)
    }
  }, [frame])

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

    if (transitionDirection === 'backward') {
      setShowLine1(true)
      setShowLine2(true)
      setShowLine3(true)
      setShowWitness(true)
      setShowBlesses(true)
      return
    }

    const t1 = setTimeout(() => setShowLine1(true), 200)
    const t2 = setTimeout(() => setShowLine2(true), 750)
    const t3 = setTimeout(() => setShowLine3(true), 1300)
    const t4 = setTimeout(() => setShowWitness(true), 1900)
    const t5 = setTimeout(() => setShowBlesses(true), 2450)

    let tAuto: ReturnType<typeof setTimeout>
    if (isPlayingRef.current) {
      tAuto = setTimeout(() => {
        advanceFrameRef.current(3)
      }, 4400)
    }

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      clearTimeout(t5)
      if (tAuto) clearTimeout(tAuto)
    }
  }, [frame, transitionDirection])

  // -------------------------------------------------------------
  // Frame 3 Reveal: Stagger narrative items, prominent SRF logo, and red title
  // -------------------------------------------------------------
  useEffect(() => {
    if (frame !== 3) {
      setShowCard1(false)
      setShowCard2(false)
      setShowCard3(false)
      setShowCard4(false)
      setShowLogo(false)
      setShowCard5(false)
      return
    }

    if (transitionDirection === 'backward') {
      setShowCard1(true)
      setShowCard2(true)
      setShowCard3(true)
      setShowCard4(true)
      setShowLogo(true)
      setShowCard5(true)
      return
    }

    const t1 = setTimeout(() => setShowCard1(true), 200)
    const t2 = setTimeout(() => setShowCard2(true), 700)
    const t3 = setTimeout(() => setShowCard3(true), 1200)
    const t4 = setTimeout(() => setShowCard4(true), 1700)
    const tLogo = setTimeout(() => setShowLogo(true), 2150)
    const t5 = setTimeout(() => setShowCard5(true), 2550)

    let tAuto: ReturnType<typeof setTimeout>
    if (isPlayingRef.current) {
      tAuto = setTimeout(() => {
        advanceFrameRef.current(4)
      }, 4700)
    }

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      clearTimeout(tLogo)
      clearTimeout(t5)
      if (tAuto) clearTimeout(tAuto)
    }
  }, [frame, transitionDirection])

  // -------------------------------------------------------------
  // Single-Scroll Section Gestures (Wheel, Touch, and Keyboard)
  // Exactly 3 forward scrolls from Frame 1 to Home page content state
  // -------------------------------------------------------------
  useEffect(() => {
    let lastGestureTime = 0
    let touchStartY = 0
    let touchStartX = 0

    const handleWheel = (e: WheelEvent) => {
      setIsPlaying(false)
      if (isTransitioningRef.current) return
      const now = Date.now()
      if (now - lastGestureTime < 800) return

      const delta = e.deltaY
      if (Math.abs(delta) < 18) return

      if (delta > 0) {
        lastGestureTime = now
        advanceFrameRef.current()
      } else if (delta < 0) {
        lastGestureTime = now
        previousFrameRef.current()
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartY = e.touches[0].clientY
        touchStartX = e.touches[0].clientX
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      setIsPlaying(false)
      if (isTransitioningRef.current) return
      if (e.changedTouches.length === 0) return
      const now = Date.now()
      if (now - lastGestureTime < 800) return

      const deltaY = touchStartY - e.changedTouches[0].clientY
      const deltaX = touchStartX - e.changedTouches[0].clientX

      if (Math.abs(deltaY) > 35 && Math.abs(deltaY) > Math.abs(deltaX)) {
        if (deltaY > 0) {
          lastGestureTime = now
          advanceFrameRef.current()
        } else {
          lastGestureTime = now
          previousFrameRef.current()
        }
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioningRef.current) return
      const now = Date.now()
      if (now - lastGestureTime < 600) return

      if (['ArrowDown', 'PageDown', 'Space'].includes(e.code)) {
        e.preventDefault()
        setIsPlaying(false)
        lastGestureTime = now
        advanceFrameRef.current()
      } else if (['ArrowUp', 'PageUp'].includes(e.code)) {
        e.preventDefault()
        setIsPlaying(false)
        lastGestureTime = now
        previousFrameRef.current()
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
  }, [])

  return (
    <div className="fixed inset-0 z-[100] w-full h-full pointer-events-none overflow-hidden select-none font-galano">
      {/* Background dark backdrop & story frames (smoothly dissolves to 0 on landing flight) */}
      <div
        className={`absolute inset-0 w-full h-full bg-transparent transition-opacity duration-700 ${
          frame === 4 ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
        }`}
      >
        {/* -------------------------------------------------------- */}
        {/* FRAME 1: Text                                            */}
        {/* Desktop (>= md): 3D Depth text behind boy cutout          */}
        {/* Mobile (< md): Centered at bottom above controls         */}
        {/* -------------------------------------------------------- */}
        <AnimatePresence>
          {frame === 1 && (
            <motion.div
              key="frame-1-depth-text"
              custom={transitionDirection}
              variants={frameMotionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
            >
              {/* Desktop View (>= md): Full-width 92% container */}
              <div className="hidden md:block w-[92%] mx-auto h-full relative">
                {showMeet && (
                  <div className="absolute top-[3.2%] sm:top-[3.6%] lg:top-[4.0%] left-0 text-white select-none">
                    <BlurText
                      text="MEET"
                      effect="blur"
                      animateBy="letters"
                      direction="bottom"
                      trigger="load"
                      delay={80}
                      stepDuration={0.3}
                      blur={12}
                      distance={20}
                      className="text-white font-galano font-black uppercase tracking-wide leading-none text-3xl sm:text-4xl md:text-5xl lg:text-[56px] xl:text-[64px] 2xl:text-[70px]"
                    />
                  </div>
                )}

                {showDurga && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96, filter: 'blur(16px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-[14%] lg:top-[14.5%] left-0 w-full select-none pointer-events-none"
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

              {/* Mobile View (< md): Centered at bottom above controls */}
              <div className="md:hidden absolute bottom-[108px] sm:bottom-[116px] inset-x-0 flex flex-col items-center justify-center text-center px-4 z-20">
                {showMeet && (
                  <div className="flex items-center justify-center">
                    <BlurText
                      text="MEET"
                      effect="blur"
                      animateBy="letters"
                      direction="bottom"
                      trigger="load"
                      delay={80}
                      stepDuration={0.3}
                      blur={10}
                      distance={16}
                      className="text-white font-galano font-black uppercase tracking-wide leading-none text-[clamp(34px,10.95vw,44px)] justify-center text-center"
                    />
                  </div>
                )}

                {showDurga && (
                  <div className="flex items-center justify-center mt-1 sm:mt-1.5">
                    <BlurText
                      text="DURGA"
                      effect="blur"
                      animateBy="letters"
                      direction="bottom"
                      trigger="load"
                      delay={90}
                      stepDuration={0.32}
                      blur={14}
                      distance={20}
                      color="#ff0000"
                      className="font-galano font-black uppercase tracking-tight leading-none text-[clamp(66px,21.4vw,86px)] drop-shadow-[0_2px_16px_rgba(255,0,0,0.4)] justify-center text-center"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* -------------------------------------------------------- */}
        {/* BOY CUTOUT LAYER (Frame 1): Sits over "DURGA" text       */}
        {/* Desktop only (>= md): 3D depth effect                    */}
        {/* -------------------------------------------------------- */}
        <AnimatePresence>
          {frame === 1 && (
            <motion.div
              key="boy-cutout-layer"
              custom={transitionDirection}
              variants={frameMotionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
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
        {/* DURGA OUTLINE LAYER (Frame 1): Superimposed over boy layer */}
        {/* Desktop only (>= md): z-[25], 0 fill with red border      */}
        {/* Outlines the text so 'R' is visible across boy's body     */}
        {/* -------------------------------------------------------- */}
        <AnimatePresence>
          {frame === 1 && (
            <motion.div
              key="durga-outline-layer"
              custom={transitionDirection}
              variants={frameMotionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute inset-0 w-full h-full pointer-events-none z-[25] hidden md:block"
            >
              <div className="w-[92%] mx-auto h-full relative">
                {showDurga && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96, filter: 'blur(16px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-[14%] lg:top-[14.5%] left-0 w-full select-none pointer-events-none"
                  >
                    <svg
                      viewBox="0 0 720 152"
                      className="w-full h-auto overflow-hidden select-none pointer-events-none"
                      aria-hidden="true"
                    >
                      <text
                        x="360"
                        y="146"
                        textAnchor="middle"
                        fill="none"
                        stroke="#ff0000"
                        strokeWidth="2"
                        strokeMiterlimit="3"
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
        {/* FRAME 2: COMBINED 5-LINE STORYTELLING STANZA             */}
        {/* Desktop (>= md): Left-aligned at lower left              */}
        {/* Mobile (< md): Centered at bottom above controls         */}
        {/* -------------------------------------------------------- */}
        <AnimatePresence>
          {frame === 2 && (
            <motion.div
              key="frame-2-content"
              custom={transitionDirection}
              variants={frameMotionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute inset-0 z-30 pointer-events-none"
            >
              {/* Desktop View (>= md): Left-aligned inside standard 92% container */}
              <div className="hidden md:block w-[92%] mx-auto h-full relative">
                <div className="absolute bottom-[116px] md:bottom-[124px] lg:bottom-[132px] left-0 select-none">
                  {/* Line 1: As a son, he tends the mother, */}
                  {showLine1 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="flex items-baseline gap-x-2.5 sm:gap-x-3 text-[clamp(22px,2.5vw,38.5px)] leading-tight"
                    >
                      <BlurText
                        text={line1Prefix}
                        effect="blur"
                        animateBy="words"
                        direction="bottom"
                        trigger="load"
                        delay={45}
                        stepDuration={0.25}
                        blur={10}
                        distance={12}
                        color="rgba(255, 255, 255, 0.55)"
                        className="font-normal font-galano-alt"
                      />
                      <BlurText
                        text={line1Suffix}
                        effect="blur"
                        animateBy="words"
                        direction="bottom"
                        trigger="load"
                        delay={45}
                        stepDuration={0.25}
                        blur={10}
                        distance={12}
                        color="#ffffff"
                        className="font-bold font-galano-alt drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
                      />
                    </motion.div>
                  ) : (
                    <div
                      className="invisible select-none pointer-events-none flex items-baseline gap-x-2.5 sm:gap-x-3 text-[clamp(22px,2.5vw,38.5px)] leading-tight font-galano-alt"
                      aria-hidden="true"
                    >
                      <span className="font-normal">{line1Prefix}</span>
                      <span className="font-bold">{line1Suffix}</span>
                    </div>
                  )}

                  {/* Line 2: As a father, he lulls the child, */}
                  {showLine2 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="flex items-baseline gap-x-2.5 sm:gap-x-3 text-[clamp(22px,2.5vw,38.5px)] leading-tight pt-2 sm:pt-2.5 md:pt-3"
                    >
                      <BlurText
                        text={line2Prefix}
                        effect="blur"
                        animateBy="words"
                        direction="bottom"
                        trigger="load"
                        delay={45}
                        stepDuration={0.25}
                        blur={10}
                        distance={12}
                        color="rgba(255, 255, 255, 0.55)"
                        className="font-normal font-galano-alt"
                      />
                      <BlurText
                        text={line2Suffix}
                        effect="blur"
                        animateBy="words"
                        direction="bottom"
                        trigger="load"
                        delay={45}
                        stepDuration={0.25}
                        blur={10}
                        distance={12}
                        color="#ffffff"
                        className="font-bold font-galano-alt drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
                      />
                    </motion.div>
                  ) : (
                    <div
                      className="invisible select-none pointer-events-none flex items-baseline gap-x-2.5 sm:gap-x-3 text-[clamp(22px,2.5vw,38.5px)] leading-tight pt-2 sm:pt-2.5 md:pt-3 font-galano-alt"
                      aria-hidden="true"
                    >
                      <span className="font-normal">{line2Prefix}</span>
                      <span className="font-bold">{line2Suffix}</span>
                    </div>
                  )}

                  {/* Line 3: As a brother, he shares the fret ... */}
                  {showLine3 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="flex items-baseline gap-x-2.5 sm:gap-x-3 text-[clamp(22px,2.5vw,38.5px)] leading-tight pt-2 sm:pt-2.5 md:pt-3"
                    >
                      <BlurText
                        text={line3Prefix}
                        effect="blur"
                        animateBy="words"
                        direction="bottom"
                        trigger="load"
                        delay={45}
                        stepDuration={0.25}
                        blur={10}
                        distance={12}
                        color="rgba(255, 255, 255, 0.55)"
                        className="font-normal font-galano-alt"
                      />
                      <BlurText
                        text={line3Suffix}
                        effect="blur"
                        animateBy="words"
                        direction="bottom"
                        trigger="load"
                        delay={45}
                        stepDuration={0.25}
                        blur={10}
                        distance={12}
                        color="#ffffff"
                        className="font-bold font-galano-alt drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
                      />
                    </motion.div>
                  ) : (
                    <div
                      className="invisible select-none pointer-events-none flex items-baseline gap-x-2.5 sm:gap-x-3 text-[clamp(22px,2.5vw,38.5px)] leading-tight pt-2 sm:pt-2.5 md:pt-3 font-galano-alt"
                      aria-hidden="true"
                    >
                      <span className="font-normal">{line3Prefix}</span>
                      <span className="font-bold">{line3Suffix}</span>
                    </div>
                  )}

                  {/* Line 4: BUT... AS A WITNESS, */}
                  {showWitness ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="flex items-baseline gap-x-3 sm:gap-x-4 pt-1 sm:pt-1.5 md:pt-2"
                    >
                      <BlurText
                        text={line4Prefix}
                        effect="blur"
                        animateBy="letters"
                        direction="bottom"
                        trigger="load"
                        delay={50}
                        stepDuration={0.25}
                        blur={12}
                        distance={14}
                        color="#ffffff"
                        className="font-galano font-black uppercase text-[clamp(38px,4.6vw,70.6px)] leading-none tracking-tight drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)]"
                      />
                      <BlurText
                        text={line4Suffix}
                        effect="blur"
                        animateBy="words"
                        direction="bottom"
                        trigger="load"
                        delay={50}
                        stepDuration={0.28}
                        blur={14}
                        distance={14}
                        color="#ff0000"
                        className="font-galano font-black uppercase text-[clamp(38px,4.6vw,70.6px)] leading-none tracking-tight drop-shadow-[0_2px_16px_rgba(255,0,0,0.4)]"
                      />
                    </motion.div>
                  ) : (
                    <div
                      className="invisible select-none pointer-events-none flex items-baseline gap-x-3 sm:gap-x-4 pt-1 sm:pt-1.5 md:pt-2 font-galano font-black uppercase text-[clamp(38px,4.6vw,70.6px)] leading-none tracking-tight"
                      aria-hidden="true"
                    >
                      <span>{line4Prefix}</span>
                      <span>{line4Suffix}</span>
                    </div>
                  )}

                  {/* Line 5: he blesses the world! */}
                  {showBlesses ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="pt-2 sm:pt-2.5 md:pt-3"
                    >
                      <BlurText
                        text={line5Text}
                        effect="blur"
                        animateBy="words"
                        direction="bottom"
                        trigger="load"
                        delay={45}
                        stepDuration={0.25}
                        blur={10}
                        distance={12}
                        color="#ffffff"
                        className="font-galano-alt font-bold text-white text-[clamp(22px,2.5vw,38.5px)] leading-tight tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
                      />
                    </motion.div>
                  ) : (
                    <div
                      className="invisible select-none pointer-events-none pt-2 sm:pt-2.5 md:pt-3 font-galano-alt font-bold text-[clamp(22px,2.5vw,38.5px)] leading-tight tracking-tight"
                      aria-hidden="true"
                    >
                      <span>{line5Text}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile View (< md): Centered at bottom above controls */}
              <div className="md:hidden absolute bottom-[108px] sm:bottom-[116px] inset-x-0 px-4 flex flex-col items-center text-center z-20">
                {/* Line 1: As a son, he tends the mother, */}
                {showLine1 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="flex flex-row items-center justify-center gap-x-1.5 text-[clamp(16px,4.9vw,21.5px)] leading-tight whitespace-nowrap"
                  >
                    <BlurText
                      text={line1Prefix}
                      effect="blur"
                      animateBy="words"
                      direction="bottom"
                      trigger="load"
                      delay={45}
                      stepDuration={0.24}
                      blur={8}
                      distance={10}
                      color="rgba(255, 255, 255, 0.55)"
                      className="font-normal font-galano-alt justify-center"
                    />
                    <BlurText
                      text={line1Suffix}
                      effect="blur"
                      animateBy="words"
                      direction="bottom"
                      trigger="load"
                      delay={45}
                      stepDuration={0.24}
                      blur={8}
                      distance={10}
                      color="#ffffff"
                      className="font-bold font-galano-alt justify-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                    />
                  </motion.div>
                ) : (
                  <div
                    className="invisible select-none pointer-events-none flex flex-row items-center justify-center gap-x-1.5 text-[clamp(16px,4.9vw,21.5px)] leading-tight whitespace-nowrap font-galano-alt"
                    aria-hidden="true"
                  >
                    <span className="font-normal">{line1Prefix}</span>
                    <span className="font-bold">{line1Suffix}</span>
                  </div>
                )}

                {/* Line 2: As a father, he lulls the child, */}
                {showLine2 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="flex flex-row items-center justify-center gap-x-1.5 text-[clamp(16px,4.9vw,21.5px)] leading-tight whitespace-nowrap pt-3 sm:pt-3.5"
                  >
                    <BlurText
                      text={line2Prefix}
                      effect="blur"
                      animateBy="words"
                      direction="bottom"
                      trigger="load"
                      delay={45}
                      stepDuration={0.24}
                      blur={8}
                      distance={10}
                      color="rgba(255, 255, 255, 0.55)"
                      className="font-normal font-galano-alt justify-center"
                    />
                    <BlurText
                      text={line2Suffix}
                      effect="blur"
                      animateBy="words"
                      direction="bottom"
                      trigger="load"
                      delay={45}
                      stepDuration={0.24}
                      blur={8}
                      distance={10}
                      color="#ffffff"
                      className="font-bold font-galano-alt justify-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                    />
                  </motion.div>
                ) : (
                  <div
                    className="invisible select-none pointer-events-none flex flex-row items-center justify-center gap-x-1.5 text-[clamp(16px,4.9vw,21.5px)] leading-tight whitespace-nowrap pt-3 sm:pt-3.5 font-galano-alt"
                    aria-hidden="true"
                  >
                    <span className="font-normal">{line2Prefix}</span>
                    <span className="font-bold">{line2Suffix}</span>
                  </div>
                )}

                {/* Line 3: As a brother, he shares the fret ... */}
                {showLine3 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="flex flex-row items-center justify-center gap-x-1.5 text-[clamp(16px,4.9vw,21.5px)] leading-tight whitespace-nowrap pt-3 sm:pt-3.5"
                  >
                    <BlurText
                      text={line3Prefix}
                      effect="blur"
                      animateBy="words"
                      direction="bottom"
                      trigger="load"
                      delay={45}
                      stepDuration={0.24}
                      blur={8}
                      distance={10}
                      color="rgba(255, 255, 255, 0.55)"
                      className="font-normal font-galano-alt justify-center"
                    />
                    <BlurText
                      text={line3Suffix}
                      effect="blur"
                      animateBy="words"
                      direction="bottom"
                      trigger="load"
                      delay={45}
                      stepDuration={0.24}
                      blur={8}
                      distance={10}
                      color="#ffffff"
                      className="font-bold font-galano-alt justify-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                    />
                  </motion.div>
                ) : (
                  <div
                    className="invisible select-none pointer-events-none flex flex-row items-center justify-center gap-x-1.5 text-[clamp(16px,4.9vw,21.5px)] leading-tight whitespace-nowrap pt-3 sm:pt-3.5 font-galano-alt"
                    aria-hidden="true"
                  >
                    <span className="font-normal">{line3Prefix}</span>
                    <span className="font-bold">{line3Suffix}</span>
                  </div>
                )}

                {/* Line 4: BUT... AS A WITNESS, */}
                {showWitness ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="flex flex-row items-center justify-center gap-x-2 text-[clamp(24px,7.4vw,32px)] leading-none whitespace-nowrap pt-3 sm:pt-3.5"
                  >
                    <BlurText
                      text={line4Prefix}
                      effect="blur"
                      animateBy="letters"
                      direction="bottom"
                      trigger="load"
                      delay={50}
                      stepDuration={0.25}
                      blur={10}
                      distance={12}
                      color="#ffffff"
                      className="font-galano font-black uppercase justify-center drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
                    />
                    <BlurText
                      text={line4Suffix}
                      effect="blur"
                      animateBy="words"
                      direction="bottom"
                      trigger="load"
                      delay={50}
                      stepDuration={0.25}
                      blur={10}
                      distance={12}
                      color="#ff0000"
                      className="font-galano font-black uppercase justify-center drop-shadow-[0_2px_12px_rgba(255,0,0,0.4)]"
                    />
                  </motion.div>
                ) : (
                  <div
                    className="invisible select-none pointer-events-none flex flex-row items-center justify-center gap-x-2 text-[clamp(24px,7.4vw,32px)] leading-none whitespace-nowrap pt-3 sm:pt-3.5 font-galano font-black uppercase"
                    aria-hidden="true"
                  >
                    <span>{line4Prefix}</span>
                    <span>{line4Suffix}</span>
                  </div>
                )}

                {/* Line 5: he blesses the world! */}
                {showBlesses ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="pt-3 sm:pt-3.5"
                  >
                    <BlurText
                      text={line5Text}
                      effect="blur"
                      animateBy="words"
                      direction="bottom"
                      trigger="load"
                      delay={45}
                      stepDuration={0.24}
                      blur={8}
                      distance={10}
                      color="#ffffff"
                      className="font-galano-alt font-bold text-[clamp(16px,4.9vw,21.5px)] leading-tight justify-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] whitespace-nowrap"
                    />
                  </motion.div>
                ) : (
                  <div
                    className="invisible select-none pointer-events-none pt-3 sm:pt-3.5 font-galano-alt font-bold text-[clamp(16px,4.9vw,21.5px)] leading-tight whitespace-nowrap"
                    aria-hidden="true"
                  >
                    <span>{line5Text}</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* -------------------------------------------------------- */}
        {/* FRAME 3: 5 NARRATIVE BLOCKS & LARGE SRF LOGO             */}
        {/* Desktop (>= md): Single left column with space-between     */}
        {/* Mobile (< md): Centered vertical column matching Figma    */}
        {/* -------------------------------------------------------- */}
        <AnimatePresence>
          {frame === 3 && (
            <motion.div
              key="frame-3-content"
              custom={transitionDirection}
              variants={frameMotionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute inset-0 z-30 pointer-events-none"
            >
              {/* Desktop Fade Gradient Overlay behind text: Dissolves in smoothly */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="hidden md:block absolute inset-y-0 left-0 w-[55%] pointer-events-none z-10"
                style={{
                  background:
                    'linear-gradient(to right, rgba(11, 12, 14, 0.94) 0%, rgba(11, 12, 14, 0.82) 35%, rgba(11, 12, 14, 0.45) 65%, rgba(11, 12, 14, 0) 100%)',
                }}
              />

              {/* Desktop View (>= md): Single left-aligned vertical column distributed with space-between */}
              <div className="hidden md:flex absolute top-[7.5%] lg:top-[8%] bottom-[124px] lg:bottom-[132px] left-[4%] xl:left-[5%] w-[68%] md:max-lg:w-[68%] lg:w-[44%] max-w-xl flex-col justify-between items-start pointer-events-none z-20">
                {/* Item 1: Two decades of commitment & counting ... */}
                <div className="w-full flex items-start">
                  {showCard1 ? (
                    <BlurText
                      text="Two decades of commitment & counting ..."
                      effect="blur"
                      animateBy="words"
                      direction="bottom"
                      trigger="load"
                      delay={50}
                      stepDuration={0.3}
                      blur={10}
                      distance={14}
                      className="text-white font-galano-alt font-bold text-[clamp(22px,2.5vw,38.5px)] leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
                    />
                  ) : (
                    <div
                      className="invisible select-none pointer-events-none font-galano-alt font-bold text-[clamp(22px,2.5vw,38.5px)] leading-tight"
                      aria-hidden="true"
                    >
                      Two decades of commitment &amp; counting ...
                    </div>
                  )}
                </div>

                {/* Item 2: A family to work with – A family to work for */}
                <div className="w-full flex items-start">
                  {showCard2 ? (
                    <BlurText
                      text="A family to work with – A family to work for"
                      effect="blur"
                      animateBy="words"
                      direction="bottom"
                      trigger="load"
                      delay={50}
                      stepDuration={0.3}
                      blur={10}
                      distance={14}
                      className="text-white font-galano-alt font-bold text-[clamp(22px,2.5vw,38.5px)] leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
                    />
                  ) : (
                    <div
                      className="invisible select-none pointer-events-none font-galano-alt font-bold text-[clamp(22px,2.5vw,38.5px)] leading-tight"
                      aria-hidden="true"
                    >
                      A family to work with – A family to work for
                    </div>
                  )}
                </div>

                {/* Item 3: A bounty of love, A legacy to uphold */}
                <div className="w-full flex items-start">
                  {showCard3 ? (
                    <BlurText
                      text="A bounty of love, A legacy to uphold"
                      effect="blur"
                      animateBy="words"
                      direction="bottom"
                      trigger="load"
                      delay={50}
                      stepDuration={0.3}
                      blur={10}
                      distance={14}
                      className="text-white font-galano-alt font-bold text-[clamp(22px,2.5vw,38.5px)] leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
                    />
                  ) : (
                    <div
                      className="invisible select-none pointer-events-none font-galano-alt font-bold text-[clamp(22px,2.5vw,38.5px)] leading-tight"
                      aria-hidden="true"
                    >
                      A bounty of love, A legacy to uphold
                    </div>
                  )}
                </div>

                {/* Item 4: A promise spoken in silence – fulfilled with glory */}
                <div className="w-full flex items-start">
                  {showCard4 ? (
                    <BlurText
                      text="A promise spoken in silence – fulfilled with glory"
                      effect="blur"
                      animateBy="words"
                      direction="bottom"
                      trigger="load"
                      delay={50}
                      stepDuration={0.3}
                      blur={10}
                      distance={14}
                      className="text-white font-galano-alt font-bold text-[clamp(22px,2.5vw,38.5px)] leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
                    />
                  ) : (
                    <div
                      className="invisible select-none pointer-events-none font-galano-alt font-bold text-[clamp(22px,2.5vw,38.5px)] leading-tight"
                      aria-hidden="true"
                    >
                      A promise spoken in silence – fulfilled with glory
                    </div>
                  )}
                </div>

                {/* Item 5: Prominent SRF Logo */}
                <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-22 lg:h-22 flex items-center">
                  {showLogo ? (
                    <motion.div
                      id="journey-frame4-logo"
                      initial={{ opacity: 0, scale: 0.75, filter: 'blur(8px)' }}
                      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="w-full h-full text-white drop-shadow-[0_4px_24px_rgba(255,255,255,0.35)]"
                    >
                      <SrfLogo className="w-full h-full text-white" />
                    </motion.div>
                  ) : (
                    <div className="w-full h-full invisible select-none pointer-events-none" aria-hidden="true" />
                  )}
                </div>

                {/* Item 6: One spine at a time */}
                <div className="w-full flex items-start">
                  {showCard5 ? (
                    <BlurText
                      text="One spine at a time"
                      effect="blur"
                      animateBy="words"
                      direction="bottom"
                      trigger="load"
                      delay={60}
                      stepDuration={0.32}
                      blur={12}
                      distance={16}
                      color="#ff0000"
                      className="font-galano-alt font-bold text-[#ff0000] text-[clamp(22px,2.5vw,38.5px)] leading-tight drop-shadow-[0_2px_16px_rgba(255,0,0,0.35)]"
                    />
                  ) : (
                    <div
                      className="invisible select-none pointer-events-none font-galano-alt font-bold text-[clamp(22px,2.5vw,38.5px)] leading-tight"
                      aria-hidden="true"
                    >
                      One spine at a time
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile View (< md): Unified vertical flow distributed to match Figma design */}
              <div className="md:hidden absolute top-[12%] sm:top-[13%] bottom-[114px] sm:bottom-[120px] inset-x-0 flex flex-col items-center justify-between text-center px-4 pointer-events-none z-20">
                {/* Line 1: Two decades of commitment & counting ... */}
                <div className="w-full max-w-[270px] sm:max-w-[290px] flex items-center justify-center text-center">
                  {showCard1 ? (
                    <BlurText
                      text="Two decades of commitment & counting ..."
                      effect="blur"
                      animateBy="words"
                      direction="bottom"
                      trigger="load"
                      delay={50}
                      stepDuration={0.3}
                      blur={10}
                      distance={14}
                      className="font-galano-alt font-bold text-white text-[clamp(17px,5.0vw,21px)] leading-[1.16] text-center drop-shadow-md mx-auto justify-center"
                    />
                  ) : (
                    <div
                      className="invisible select-none pointer-events-none font-galano-alt font-bold text-white text-[clamp(17px,5.0vw,21px)] leading-[1.16] text-center mx-auto"
                      aria-hidden="true"
                    >
                      Two decades of commitment &amp; counting ...
                    </div>
                  )}
                </div>

                {/* Line 2: A family to work with – A family to work for */}
                <div className="w-full max-w-[270px] sm:max-w-[290px] flex items-center justify-center text-center">
                  {showCard2 ? (
                    <BlurText
                      text="A family to work with – A family to work for"
                      effect="blur"
                      animateBy="words"
                      direction="bottom"
                      trigger="load"
                      delay={50}
                      stepDuration={0.3}
                      blur={10}
                      distance={14}
                      className="font-galano-alt font-bold text-white text-[clamp(17px,5.0vw,21px)] leading-[1.16] text-center drop-shadow-md mx-auto justify-center"
                    />
                  ) : (
                    <div
                      className="invisible select-none pointer-events-none font-galano-alt font-bold text-white text-[clamp(17px,5.0vw,21px)] leading-[1.16] text-center mx-auto"
                      aria-hidden="true"
                    >
                      A family to work with – A family to work for
                    </div>
                  )}
                </div>

                {/* Line 3: A bounty of love, A legacy to uphold */}
                <div className="w-full max-w-[270px] sm:max-w-[290px] flex items-center justify-center text-center">
                  {showCard3 ? (
                    <BlurText
                      text="A bounty of love, A legacy to uphold"
                      effect="blur"
                      animateBy="words"
                      direction="bottom"
                      trigger="load"
                      delay={50}
                      stepDuration={0.3}
                      blur={10}
                      distance={14}
                      className="font-galano-alt font-bold text-white text-[clamp(17px,5.0vw,21px)] leading-[1.16] text-center drop-shadow-md mx-auto justify-center"
                    />
                  ) : (
                    <div
                      className="invisible select-none pointer-events-none font-galano-alt font-bold text-white text-[clamp(17px,5.0vw,21px)] leading-[1.16] text-center mx-auto"
                      aria-hidden="true"
                    >
                      A bounty of love, A legacy to uphold
                    </div>
                  )}
                </div>

                {/* Line 4: A promise spoken in silence – fulfilled with glory */}
                <div className="w-full max-w-[270px] sm:max-w-[290px] flex items-center justify-center text-center">
                  {showCard4 ? (
                    <BlurText
                      text="A promise spoken in silence – fulfilled with glory"
                      effect="blur"
                      animateBy="words"
                      direction="bottom"
                      trigger="load"
                      delay={50}
                      stepDuration={0.3}
                      blur={10}
                      distance={14}
                      className="font-galano-alt font-bold text-white text-[clamp(17px,5.0vw,21px)] leading-[1.16] text-center drop-shadow-md mx-auto justify-center"
                    />
                  ) : (
                    <div
                      className="invisible select-none pointer-events-none font-galano-alt font-bold text-white text-[clamp(17px,5.0vw,21px)] leading-[1.16] text-center mx-auto"
                      aria-hidden="true"
                    >
                      A promise spoken in silence – fulfilled with glory
                    </div>
                  )}
                </div>

                {/* Logo + One spine at a time block */}
                <div className="flex flex-col items-center shrink-0">
                  {/* Prominent SRF Logo matching Figma */}
                  <div className="w-[72px] h-[72px] sm:w-[76px] sm:h-[76px] flex items-center justify-center">
                    {showLogo ? (
                      <motion.div
                        id="journey-frame4-logo-mobile"
                        initial={{ opacity: 0, scale: 0.75, filter: 'blur(8px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full h-full mx-auto text-white drop-shadow-[0_4px_24px_rgba(255,255,255,0.4)]"
                      >
                        <SrfLogo className="w-full h-full text-white" />
                      </motion.div>
                    ) : (
                      <div className="w-full h-full invisible" aria-hidden="true" />
                    )}
                  </div>

                  {/* One spine at a time: directly below logo matching Figma */}
                  <div className="pt-2 flex items-center justify-center text-center">
                    {showCard5 ? (
                      <BlurText
                        text="One spine at a time"
                        effect="blur"
                        animateBy="words"
                        direction="bottom"
                        trigger="load"
                        delay={60}
                        stepDuration={0.32}
                        blur={12}
                        distance={16}
                        color="#ff0000"
                        className="font-galano font-bold tracking-normal text-[#ff0000] text-[clamp(20px,6.0vw,25px)] leading-tight text-center drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] justify-center"
                      />
                    ) : (
                      <div
                        className="invisible select-none pointer-events-none font-galano font-bold tracking-normal text-[#ff0000] text-[clamp(20px,6.0vw,25px)] leading-tight text-center justify-center"
                        aria-hidden="true"
                      >
                        One spine at a time
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* -------------------------------------------------------- */}
        {/* BOTTOM EDGE GRADUAL BLUR OVERLAY (Frames 1-3)            */}
        {/* Sits at z-[45] above text (z-30) and below controls (z-50) */}
        {/* -------------------------------------------------------- */}
        {frame < 4 && (
          <div className="fixed bottom-0 inset-x-0 pointer-events-none z-[45]">
            <GradualBlur
              position="bottom"
              target="parent"
              height={isMobile ? '6.5rem' : '7.5rem'}
              strength={2.5}
              layers={8}
              curve="linear"
              exponential
              tint="rgba(11, 12, 14, 0.75)"
              zIndex={45}
            />
          </div>
        )}

        {/* -------------------------------------------------------- */}
        {/* BOTTOM INTRO CONTROLS: DOWN ARROW & SKIP (LEFT/CENTER) + PLAY/PAUSE (TOP-RIGHT MOBILE / BOTTOM-RIGHT DESKTOP) */}
        {/* -------------------------------------------------------- */}
        <AnimatePresence>
          {frame < 4 && showControls && (
            <>
              {/* Left/Center Controls: Previous/Next Frame Buttons + Skip Pill Button */}
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
                <div className="flex items-center gap-3 pointer-events-auto">
                  {/* Previous Frame Up Button (visible when frame > 1) */}
                  {frame > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsPlaying(false)
                        previousFrame()
                      }}
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-white/90 hover:text-white hover:bg-black/70 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-xl rotate-180"
                      aria-label="Previous frame"
                      title="Previous frame"
                    >
                      <MaterialIcon name="arrow_cool_down" size={22} className="sm:text-[24px]" />
                    </button>
                  )}

                  {/* Next Frame Down Button with arrow_cool_down icon */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsPlaying(false)
                      advanceFrame()
                    }}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-white/90 hover:text-white hover:bg-black/70 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-xl"
                    aria-label="Next frame"
                    title="Next frame"
                  >
                    <MaterialIcon name="arrow_cool_down" size={22} className="sm:text-[24px]" />
                  </button>

                  {/* Skip Pill Button */}
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
      {/* FRAME 4: LOGO FLIGHT TO NAVBAR & SEAMLESS DISSOLVE       */}
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
