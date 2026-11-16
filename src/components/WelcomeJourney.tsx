import React, { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { SrfLogo, MaterialIcon } from './icons'
import { BlurText } from './BlurText'
import GradualBlur from './GradualBlur'

interface WelcomeJourneyProps {
  onComplete: () => void
  onSkip: () => void
  onLandedAtNavbar?: () => void
  onFrameChange?: (frame: number) => void
  initialFrame?: number
  isBaseImageLoaded?: boolean
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
  initialFrame = 1,
  isBaseImageLoaded = false,
}) => {
  // Current journey frame: 1 and 2, then 3 for landing transition
  const [frame, setFrame] = useState<number>(initialFrame)

  // Keep the parent background layer in the same frame before paint. Its transform
  // mirrors the phone cutout's frame shift, so an effect after paint can briefly
  // leave the two copies of the boy at different vertical positions on reverse scroll.
  useLayoutEffect(() => {
    onFrameChange?.(frame)
  }, [frame, onFrameChange])

  const [isTransitioning, setIsTransitioning] = useState<boolean>(false)
  const [transitionDirection, setTransitionDirection] = useState<'forward' | 'backward'>(
    initialFrame === 2 ? 'backward' : 'forward'
  )

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
  const [showMeet, setShowMeet] = useState<boolean>(initialFrame === 2)
  const [showDurga, setShowDurga] = useState<boolean>(initialFrame === 2)
  const [showControls, setShowControls] = useState<boolean>(true)

  // Frame 2 progressive reveals (circular SRF logo + 5 storytelling lines)
  const [showFrame2Logo, setShowFrame2Logo] = useState<boolean>(initialFrame === 2)
  const [showLine1, setShowLine1] = useState<boolean>(initialFrame === 2)
  const [showLine2, setShowLine2] = useState<boolean>(initialFrame === 2)
  const [showLine3, setShowLine3] = useState<boolean>(initialFrame === 2)
  const [showWitness, setShowWitness] = useState<boolean>(initialFrame === 2)
  const [showBlesses, setShowBlesses] = useState<boolean>(initialFrame === 2)

  // Flight to navbar & seamless dissolve
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

  // Start coordinates for logo flight
  const [logoStartCoords, setLogoStartCoords] = useState<{
    left: number
    top: number
    width: number
    height: number
  }>({ left: 60, top: 500, width: 88, height: 88 })

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

    if (next >= 3) {
      // Advance from Frame 2 triggers flight to navbar directly
      const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768
      const primaryId = isDesktop ? 'journey-frame2-logo' : 'journey-frame2-logo-mobile'
      const fallbackId = isDesktop ? 'journey-frame2-logo-mobile' : 'journey-frame2-logo'

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
            top: h - 380,
            width: 88,
            height: 88,
          })
        } else {
          setLogoStartCoords({
            left: (w - 76) / 2,
            top: h * 0.52,
            width: 76,
            height: 76,
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
      setFrame(3)

      // 1. Flight reaches the top navbar in 850ms
      setTimeout(() => {
        onLandedAtNavbarRef.current?.()
      }, 850)

      // 2. Navbar entry animation completes
      setTimeout(() => {
        setIsDissolvingFlyingLogo(true)
      }, 2100)

      // 3. Complete journey and unmount
      setTimeout(() => {
        onCompleteRef.current()
      }, 2500)

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

      return () => {
        clearTimeout(tMeet)
        clearTimeout(tDurga)
        clearTimeout(tControls)
      }
    } else {
      setShowMeet(true)
      setShowDurga(true)
      setShowControls(true)
    }
  }, [frame])

  // -------------------------------------------------------------
  // Frame 2 Reveal: Stagger circular SRF logo & 5 BlurText lines chronologically
  // -------------------------------------------------------------
  useEffect(() => {
    if (frame !== 2) {
      setShowFrame2Logo(false)
      setShowLine1(false)
      setShowLine2(false)
      setShowLine3(false)
      setShowWitness(false)
      setShowBlesses(false)
      return
    }

    if (transitionDirection === 'backward') {
      setShowFrame2Logo(true)
      setShowLine1(true)
      setShowLine2(true)
      setShowLine3(true)
      setShowWitness(true)
      setShowBlesses(true)
      return
    }

    const tLogo = setTimeout(() => setShowFrame2Logo(true), 150)
    const t1 = setTimeout(() => setShowLine1(true), 400)
    const t2 = setTimeout(() => setShowLine2(true), 900)
    const t3 = setTimeout(() => setShowLine3(true), 1400)
    const t4 = setTimeout(() => setShowWitness(true), 1950)
    const t5 = setTimeout(() => setShowBlesses(true), 2450)

    return () => {
      clearTimeout(tLogo)
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      clearTimeout(t5)
    }
  }, [frame, transitionDirection])

  // -------------------------------------------------------------
  // Single-Scroll Section Gestures (Wheel, Touch, and Keyboard)
  // Exactly 2 forward scrolls from Frame 1 to Home page content state
  // -------------------------------------------------------------
  useEffect(() => {
    let lastGestureTime = 0
    let touchStartY = 0
    let touchStartX = 0

    const handleWheel = (e: WheelEvent) => {
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
        lastGestureTime = now
        advanceFrameRef.current()
      } else if (['ArrowUp', 'PageUp'].includes(e.code)) {
        e.preventDefault()
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
          frame === 3 ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
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
                      blur={10}
                      distance={16}
                      className="font-galano font-black uppercase tracking-tight text-[clamp(44px,5.7vw,88px)] leading-none select-none pointer-events-none drop-shadow-md"
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
                      className="w-full h-auto overflow-hidden select-none pointer-events-none drop-shadow-[0_2px_24px_rgba(255,0,0,0.4)]"
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

              {/* Mobile View (< md): Stacked vertically and centered at bottom above controls */}
              <div className="md:hidden absolute bottom-[108px] sm:bottom-[116px] inset-x-0 px-4 flex flex-col items-center justify-center text-center select-none pointer-events-none z-10">
                <div className="flex items-center justify-center">
                  {showMeet ? (
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
                  ) : (
                    <span
                      className="invisible text-white font-galano font-black uppercase tracking-wide leading-none text-[clamp(34px,10.95vw,44px)]"
                      aria-hidden="true"
                    >
                      MEET
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-center mt-1 sm:mt-1.5">
                  {showDurga ? (
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
                  ) : (
                    <span
                      className="invisible font-galano font-black uppercase tracking-tight leading-none text-[clamp(66px,21.4vw,86px)]"
                      aria-hidden="true"
                    >
                      DURGA
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile boy cutout stays aligned with the shifted base image and above its fade overlay. */}
        <AnimatePresence>
          {isMobile && frame <= 2 && (
            <motion.div
              key="mobile-boy-cutout"
              initial={{ opacity: 0 }}
              animate={{
                opacity: isBaseImageLoaded && frame === 1 ? 1 : 0,
                transition: { opacity: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
              }}
              exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
              className={`absolute inset-0 z-[5] pointer-events-none journey-frame-${frame === 2 ? '2' : '1'}-shift`}
              style={{
                transition: frame === 2 ? 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
              }}
            >
              <img
                src={`${import.meta.env.BASE_URL}banners/boy-phone.png`}
                alt=""
                aria-hidden="true"
                draggable={false}
                className="w-full h-full object-cover object-[50%_35%] select-none"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* -------------------------------------------------------- */}
        {/* BOY CUTOUT LAYER (Frame 1): Sits over "DURGA" text       */}
        {/* Desktop only (>= md): 3D depth effect                    */}
        {/* -------------------------------------------------------- */}
        <AnimatePresence>
          {frame === 1 && isBaseImageLoaded && (
            <motion.div
              key="boy-cutout-layer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } }}
              exit={{ opacity: 0, transition: { duration: 0.55, ease: 'easeInOut' } }}
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
        {/* FRAME 2: COMBINED 5-LINE STORYTELLING STANZA + SRF LOGO  */}
        {/* Desktop (>= md): SRF logo directly above text at left     */}
        {/* Mobile (< md): Centered SRF logo directly above text     */}
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
                <div className="absolute bottom-[116px] md:bottom-[124px] lg:bottom-[132px] left-0 select-none flex flex-col items-start">
                  {/* Circular SRF Logo: directly above text block (Matches 5a9549f9.jpg) */}
                  <div className="mb-5 md:mb-6 flex items-center">
                    {showFrame2Logo ? (
                      <motion.div
                        id="journey-frame2-logo"
                        initial={{ opacity: 0, scale: 0.8, filter: 'blur(8px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="w-20 h-20 md:w-22 md:h-22 lg:w-24 lg:h-24 text-white drop-shadow-[0_4px_24px_rgba(255,255,255,0.4)]"
                      >
                        <SrfLogo className="w-full h-full text-white" />
                      </motion.div>
                    ) : (
                      <div className="w-20 h-20 md:w-22 md:h-22 lg:w-24 lg:h-24 invisible pointer-events-none select-none" aria-hidden="true" />
                    )}
                  </div>

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

              {/* Mobile View (< md): Centered at bottom above controls (Matches 61658664.jpg) */}
              <div className="md:hidden absolute bottom-[108px] sm:bottom-[116px] inset-x-0 px-4 flex flex-col items-center text-center z-20">
                {/* Circular SRF Logo: centered horizontally directly above text block */}
                <div className="mb-4 sm:mb-5 flex items-center justify-center">
                  {showFrame2Logo ? (
                    <motion.div
                      id="journey-frame2-logo-mobile"
                      initial={{ opacity: 0, scale: 0.8, filter: 'blur(8px)' }}
                      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="w-18 h-18 sm:w-20 sm:h-20 text-white drop-shadow-[0_4px_24px_rgba(255,255,255,0.4)]"
                    >
                      <SrfLogo className="w-full h-full text-white" />
                    </motion.div>
                  ) : (
                    <div className="w-18 h-18 sm:w-20 sm:h-20 invisible pointer-events-none select-none" aria-hidden="true" />
                  )}
                </div>

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
        {/* BOTTOM EDGE GRADUAL BLUR OVERLAY (Frames 1-2)            */}
        {/* Sits at z-[45] above text (z-30) and below controls (z-50) */}
        {/* -------------------------------------------------------- */}
        {frame < 3 && (
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
        {/* BOTTOM INTRO CONTROLS: FRAME NAVIGATION + SKIP */}
        {/* -------------------------------------------------------- */}
        <AnimatePresence>
          {frame < 3 && showControls && (
            <>
              {/* Previous/Next Frame Buttons; Skip stays inline on mobile. */}
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
                      onClick={previousFrame}
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
                    onClick={() => advanceFrame()}
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
                    className="md:hidden h-11 sm:h-12 px-5 sm:px-6 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-white/90 hover:text-white hover:bg-black/70 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 font-sans text-xs sm:text-sm font-semibold tracking-normal cursor-pointer shadow-xl uppercase"
                    aria-label="Skip welcome journey"
                  >
                    <MaterialIcon name="fast_forward" size={17} />
                    <span>Skip</span>
                  </button>
                </div>
              </motion.div>

              {/* Desktop Skip takes the former play/pause position. */}
              <motion.div
                key="desktop-skip-control"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  scale: 0.3,
                  transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
                }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="hidden md:flex absolute bottom-6 sm:bottom-7 right-7 z-50 items-center pointer-events-none"
              >
                <button
                  type="button"
                  onClick={onSkip}
                  className="pointer-events-auto h-11 sm:h-12 px-5 sm:px-6 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-white/90 hover:text-white hover:bg-black/70 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 font-sans text-xs sm:text-sm font-semibold tracking-normal cursor-pointer shadow-xl uppercase"
                  aria-label="Skip welcome journey"
                >
                  <MaterialIcon name="fast_forward" size={17} />
                  <span>Skip</span>
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* -------------------------------------------------------- */}
      {/* FRAME 3: LOGO FLIGHT TO NAVBAR & SEAMLESS DISSOLVE       */}
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
