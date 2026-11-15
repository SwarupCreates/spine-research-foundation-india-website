import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SrfLogo, MaterialIcon } from './icons'
import { ScrollReveal } from './ScrollReveal'
import GradualBlur from './GradualBlur'

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1)

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

  // Continuous scroll reveal progress (0..1) within current frame
  const [frameProgress, setFrameProgress] = useState<number>(0)
  const targetProgressRef = useRef<number>(0)

  // Auto-play state: false = manual scrolling by default; true = auto-advances
  const [isPlaying, setIsPlaying] = useState<boolean>(false)

  // Frame progress mapping across frames
  // Frame 1 progress
  const f1_meet = clamp01(frameProgress / 0.5)
  const f1_durga = clamp01((frameProgress - 0.35) / 0.65)

  // Frame 2 progress (5 combined storytelling lines)
  const f2_p1 = clamp01((frameProgress - 0.0) / 0.22)
  const f2_p2 = clamp01((frameProgress - 0.18) / 0.22)
  const f2_p3 = clamp01((frameProgress - 0.36) / 0.22)
  const f2_p4 = clamp01((frameProgress - 0.54) / 0.24)
  const f2_p5 = clamp01((frameProgress - 0.74) / 0.26)

  // Frame 3 progress (4 narrative cards + logo + red title)
  const f3_p1 = clamp01((frameProgress - 0.0) / 0.20)
  const f3_p2 = clamp01((frameProgress - 0.16) / 0.20)
  const f3_p3 = clamp01((frameProgress - 0.32) / 0.20)
  const f3_p4 = clamp01((frameProgress - 0.48) / 0.20)
  const f3_logo = clamp01((frameProgress - 0.64) / 0.18)
  const f3_p5 = clamp01((frameProgress - 0.78) / 0.22)

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
    setFrameProgress(0.0)
    targetProgressRef.current = 0.0

    setTimeout(() => {
      setIsTransitioning(false)
      isTransitioningRef.current = false
    }, 500)
  }, [navbarTarget])

  const advanceFrameRef = useRef(advanceFrame)
  advanceFrameRef.current = advanceFrame

  // Reverse frame navigation
  const previousFrame = useCallback(() => {
    if (isTransitioningRef.current) return
    if (frame <= 1) return

    isTransitioningRef.current = true
    setIsTransitioning(true)

    const prev = frame - 1
    setFrame(prev)
    setFrameProgress(1.0)
    targetProgressRef.current = 1.0

    setTimeout(() => {
      setIsTransitioning(false)
      isTransitioningRef.current = false
    }, 500)
  }, [frame])

  const previousFrameRef = useRef(previousFrame)
  previousFrameRef.current = previousFrame

  // Initial gentle entrance reveal for Frame 1
  useEffect(() => {
    const t = setTimeout(() => {
      if (targetProgressRef.current === 0) {
        targetProgressRef.current = 1.0
      }
    }, 1200)
    return () => clearTimeout(t)
  }, [])

  // Smooth RAF ticker for frameProgress lerp (60fps continuous interpolation)
  useEffect(() => {
    let animId: number
    const tick = () => {
      setFrameProgress((curr) => {
        const target = Math.min(Math.max(targetProgressRef.current, 0), 1)
        const diff = target - curr
        if (Math.abs(diff) < 0.002) return target
        return curr + diff * 0.18
      })
      animId = requestAnimationFrame(tick)
    }
    animId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animId)
  }, [])

  // Auto-play progression when isPlaying is true
  useEffect(() => {
    if (!isPlaying) return
    let animId: number
    let holdTimer: ReturnType<typeof setTimeout> | null = null

    const autoTick = () => {
      if (targetProgressRef.current < 1.0) {
        targetProgressRef.current = Math.min(targetProgressRef.current + 0.0055, 1.0)
        animId = requestAnimationFrame(autoTick)
      } else {
        holdTimer = setTimeout(() => {
          advanceFrameRef.current()
        }, 1500)
      }
    }

    animId = requestAnimationFrame(autoTick)
    return () => {
      cancelAnimationFrame(animId)
      if (holdTimer) clearTimeout(holdTimer)
    }
  }, [isPlaying, frame])

  // Mouse wheel, touch gestures, and keyboard navigation with reverse scroll support
  useEffect(() => {
    let lastWheelTime = 0
    let touchLastY = 0

    const handleWheel = (e: WheelEvent) => {
      setIsPlaying(false)
      const delta = e.deltaY
      if (Math.abs(delta) < 3) return

      const progressDelta = delta / 420
      const currentTarget = targetProgressRef.current
      const nextTarget = currentTarget + progressDelta

      targetProgressRef.current = Math.min(Math.max(nextTarget, -0.2), 1.25)

      const now = Date.now()
      if (nextTarget >= 1.08) {
        if (now - lastWheelTime > 500) {
          lastWheelTime = now
          advanceFrameRef.current()
        }
      } else if (nextTarget <= -0.08) {
        if (now - lastWheelTime > 500) {
          lastWheelTime = now
          previousFrameRef.current()
        }
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchLastY = e.touches[0].clientY
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        setIsPlaying(false)
        const currentY = e.touches[0].clientY
        const delta = touchLastY - currentY
        touchLastY = currentY

        if (Math.abs(delta) < 2) return

        const progressDelta = delta / 260
        targetProgressRef.current = Math.min(
          Math.max(targetProgressRef.current + progressDelta, -0.2),
          1.25
        )
      }
    }

    const handleTouchEnd = () => {
      const p = targetProgressRef.current
      if (p >= 1.05) {
        advanceFrameRef.current()
      } else if (p <= -0.05) {
        previousFrameRef.current()
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowDown', 'PageDown', 'Space'].includes(e.code)) {
        e.preventDefault()
        setIsPlaying(false)
        if (targetProgressRef.current < 0.9) {
          targetProgressRef.current = Math.min(targetProgressRef.current + 0.35, 1.0)
        } else {
          advanceFrameRef.current()
        }
      } else if (['ArrowUp', 'PageUp'].includes(e.code)) {
        e.preventDefault()
        setIsPlaying(false)
        if (targetProgressRef.current > 0.1) {
          targetProgressRef.current = Math.max(targetProgressRef.current - 0.35, 0.0)
        } else {
          previousFrameRef.current()
        }
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: true })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

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
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 w-full h-full overflow-hidden"
            >
              <div className="w-full h-full block relative z-0">
                <img
                  src={`${import.meta.env.BASE_URL}banners/Solitary%20Boy%20Amid%20the%20Moving%20Crowd%201.jpg`}
                  alt="Solitary Boy Amid the Moving Crowd"
                  className="w-full h-full object-cover object-[48%_25%] md:object-center select-none"
                />
              </div>
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
              <div className="absolute top-[2.8%] sm:top-[3.2%] lg:top-[3.8%] left-0 text-white select-none">
                <ScrollReveal
                  mode="scrub"
                  progress={f1_meet}
                  splitBy="words"
                  effect="fade"
                  stagger={0.05}
                  duration={0.8}
                  smoothing={0}
                  baseOpacity={0.1}
                  baseRotation={0}
                  baseOffset={0}
                  enableBlur={true}
                  blurStrength={4}
                  containerClassName="text-white font-galano font-black uppercase tracking-wide leading-none text-3xl sm:text-4xl md:text-5xl lg:text-[56px] xl:text-[64px] 2xl:text-[70px]"
                >
                  MEET
                </ScrollReveal>
              </div>

              <motion.div
                style={{
                  opacity: f1_durga,
                  transform: `scale(${0.96 + 0.04 * f1_durga})`,
                  filter: `blur(${(8 * (1 - f1_durga)).toFixed(1)}px)`,
                }}
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
            </div>

            {/* Mobile View (< md): Centered at bottom above controls - fixed final positions */}
            <div className="md:hidden absolute bottom-[108px] sm:bottom-[116px] inset-x-0 flex flex-col items-center justify-center text-center px-4 z-20">
              <div className="flex items-center justify-center">
                <ScrollReveal
                  mode="scrub"
                  progress={f1_meet}
                  splitBy="words"
                  effect="fade"
                  stagger={0.05}
                  duration={0.8}
                  smoothing={0}
                  baseOpacity={0.1}
                  baseRotation={0}
                  baseOffset={0}
                  enableBlur={true}
                  blurStrength={4}
                  containerClassName="text-white font-galano font-black uppercase tracking-wide leading-none text-[clamp(34px,10.95vw,44px)] justify-center text-center"
                >
                  MEET
                </ScrollReveal>
              </div>

              <div className="flex items-center justify-center -mt-2 sm:-mt-2.5">
                <ScrollReveal
                  mode="scrub"
                  progress={f1_durga}
                  splitBy="words"
                  effect="fade"
                  stagger={0.05}
                  duration={0.8}
                  smoothing={0}
                  baseOpacity={0.1}
                  baseRotation={0}
                  baseOffset={0}
                  enableBlur={true}
                  blurStrength={4}
                  highlightColor="#ff0000"
                  containerClassName="text-[#ff0000] font-galano font-black uppercase tracking-tight leading-none text-[clamp(66px,21.4vw,86px)] drop-shadow-[0_2px_16px_rgba(255,0,0,0.4)] justify-center text-center"
                >
                  DURGA
                </ScrollReveal>
              </div>
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
        {frame === 1 && (
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
      {/* DURGA OUTLINE LAYER (Frame 1): Superimposed over boy layer */}
      {/* Desktop only (>= md): z-[25], 0 fill with red border      */}
      {/* Outlines the text so 'R' is visible across boy's body     */}
      {/* -------------------------------------------------------- */}
      <AnimatePresence>
        {frame === 1 && (
          <motion.div
            key="durga-outline-layer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.6 } }}
            className="absolute inset-0 w-full h-full pointer-events-none z-[25] hidden md:block"
          >
            <div className="w-[92%] mx-auto h-full relative">
              <motion.div
                style={{
                  opacity: f1_durga,
                  transform: `scale(${0.96 + 0.04 * f1_durga})`,
                  filter: `blur(${(8 * (1 - f1_durga)).toFixed(1)}px)`,
                }}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            className="absolute inset-0 z-30 pointer-events-none"
          >
            {/* Desktop View (>= md): Left-aligned inside standard 92% container - fixed final positions */}
            <div className="hidden md:block w-[92%] mx-auto h-full relative">
              <div className="absolute bottom-[116px] md:bottom-[124px] lg:bottom-[132px] left-0 select-none">
                {/* Line 1: As a son, he tends the mother, */}
                <div className="flex items-baseline gap-x-2.5 sm:gap-x-3 text-[clamp(22px,2.5vw,38.5px)] leading-tight">
                  <ScrollReveal
                    mode="scrub"
                    progress={f2_p1}
                    splitBy="words"
                    effect="fade"
                    stagger={0.05}
                    duration={0.8}
                    smoothing={0}
                    baseOpacity={0.1}
                    baseRotation={0}
                    baseOffset={0}
                    enableBlur={true}
                    blurStrength={4}
                    containerClassName="text-white/55 font-normal font-galano-alt"
                  >
                    {line1Prefix}
                  </ScrollReveal>
                  <ScrollReveal
                    mode="scrub"
                    progress={f2_p1}
                    splitBy="words"
                    effect="fade"
                    stagger={0.05}
                    duration={0.8}
                    smoothing={0}
                    baseOpacity={0.1}
                    baseRotation={0}
                    baseOffset={0}
                    enableBlur={true}
                    blurStrength={4}
                    containerClassName="text-white font-bold font-galano-alt drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
                  >
                    {line1Suffix}
                  </ScrollReveal>
                </div>

                {/* Line 2: As a father, he lulls the child, */}
                <div className="flex items-baseline gap-x-2.5 sm:gap-x-3 text-[clamp(22px,2.5vw,38.5px)] leading-tight pt-2 sm:pt-2.5 md:pt-3">
                  <ScrollReveal
                    mode="scrub"
                    progress={f2_p2}
                    splitBy="words"
                    effect="fade"
                    stagger={0.05}
                    duration={0.8}
                    smoothing={0}
                    baseOpacity={0.1}
                    baseRotation={0}
                    baseOffset={0}
                    enableBlur={true}
                    blurStrength={4}
                    containerClassName="text-white/55 font-normal font-galano-alt"
                  >
                    {line2Prefix}
                  </ScrollReveal>
                  <ScrollReveal
                    mode="scrub"
                    progress={f2_p2}
                    splitBy="words"
                    effect="fade"
                    stagger={0.05}
                    duration={0.8}
                    smoothing={0}
                    baseOpacity={0.1}
                    baseRotation={0}
                    baseOffset={0}
                    enableBlur={true}
                    blurStrength={4}
                    containerClassName="text-white font-bold font-galano-alt drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
                  >
                    {line2Suffix}
                  </ScrollReveal>
                </div>

                {/* Line 3: As a brother, he shares the fret ... */}
                <div className="flex items-baseline gap-x-2.5 sm:gap-x-3 text-[clamp(22px,2.5vw,38.5px)] leading-tight pt-2 sm:pt-2.5 md:pt-3">
                  <ScrollReveal
                    mode="scrub"
                    progress={f2_p3}
                    splitBy="words"
                    effect="fade"
                    stagger={0.05}
                    duration={0.8}
                    smoothing={0}
                    baseOpacity={0.1}
                    baseRotation={0}
                    baseOffset={0}
                    enableBlur={true}
                    blurStrength={4}
                    containerClassName="text-white/55 font-normal font-galano-alt"
                  >
                    {line3Prefix}
                  </ScrollReveal>
                  <ScrollReveal
                    mode="scrub"
                    progress={f2_p3}
                    splitBy="words"
                    effect="fade"
                    stagger={0.05}
                    duration={0.8}
                    smoothing={0}
                    baseOpacity={0.1}
                    baseRotation={0}
                    baseOffset={0}
                    enableBlur={true}
                    blurStrength={4}
                    containerClassName="text-white font-bold font-galano-alt drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
                  >
                    {line3Suffix}
                  </ScrollReveal>
                </div>

                {/* Line 4: BUT... AS A WITNESS, */}
                <div className="flex items-baseline gap-x-3 sm:gap-x-4 pt-1 sm:pt-1.5 md:pt-2">
                  <ScrollReveal
                    mode="scrub"
                    progress={f2_p4}
                    splitBy="words"
                    effect="fade"
                    stagger={0.05}
                    duration={0.8}
                    smoothing={0}
                    baseOpacity={0.1}
                    baseRotation={0}
                    baseOffset={0}
                    enableBlur={true}
                    blurStrength={4}
                    containerClassName="text-white font-galano font-black uppercase text-[clamp(38px,4.6vw,70.6px)] leading-none tracking-tight drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)]"
                  >
                    {line4Prefix}
                  </ScrollReveal>
                  <ScrollReveal
                    mode="scrub"
                    progress={f2_p4}
                    splitBy="words"
                    effect="fade"
                    stagger={0.05}
                    duration={0.8}
                    smoothing={0}
                    baseOpacity={0.1}
                    baseRotation={0}
                    baseOffset={0}
                    enableBlur={true}
                    blurStrength={4}
                    highlightColor="#ff0000"
                    containerClassName="text-[#ff0000] font-galano font-black uppercase text-[clamp(38px,4.6vw,70.6px)] leading-none tracking-tight drop-shadow-[0_2px_16px_rgba(255,0,0,0.4)]"
                  >
                    {line4Suffix}
                  </ScrollReveal>
                </div>

                {/* Line 5: he blesses the world! */}
                <div className="pt-2 sm:pt-2.5 md:pt-3">
                  <ScrollReveal
                    mode="scrub"
                    progress={f2_p5}
                    splitBy="words"
                    effect="fade"
                    stagger={0.05}
                    duration={0.8}
                    smoothing={0}
                    baseOpacity={0.1}
                    baseRotation={0}
                    baseOffset={0}
                    enableBlur={true}
                    blurStrength={4}
                    containerClassName="font-galano-alt font-bold text-white text-[clamp(22px,2.5vw,38.5px)] leading-tight tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
                  >
                    {line5Text}
                  </ScrollReveal>
                </div>
              </div>
            </div>

            {/* Mobile View (< md): Centered at bottom above controls - all 5 lines in final positions from start */}
            <div className="md:hidden absolute bottom-[108px] sm:bottom-[116px] inset-x-0 px-4 flex flex-col items-center text-center z-20">
              {/* Line 1: As a son, he tends the mother, */}
              <div className="flex flex-row items-center justify-center gap-x-1.5 text-[clamp(16px,4.9vw,21.5px)] leading-tight whitespace-nowrap">
                <ScrollReveal
                  mode="scrub"
                  progress={f2_p1}
                  splitBy="words"
                  effect="fade"
                  stagger={0.05}
                  duration={0.8}
                  smoothing={0}
                  baseOpacity={0.1}
                  baseRotation={0}
                  baseOffset={0}
                  enableBlur={true}
                  blurStrength={4}
                  containerClassName="text-white/55 font-normal font-galano-alt justify-center"
                >
                  {line1Prefix}
                </ScrollReveal>
                <ScrollReveal
                  mode="scrub"
                  progress={f2_p1}
                  splitBy="words"
                  effect="fade"
                  stagger={0.05}
                  duration={0.8}
                  smoothing={0}
                  baseOpacity={0.1}
                  baseRotation={0}
                  baseOffset={0}
                  enableBlur={true}
                  blurStrength={4}
                  containerClassName="text-white font-bold font-galano-alt justify-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                >
                  {line1Suffix}
                </ScrollReveal>
              </div>

              {/* Line 2: As a father, he lulls the child, */}
              <div className="flex flex-row items-center justify-center gap-x-1.5 text-[clamp(16px,4.9vw,21.5px)] leading-tight whitespace-nowrap pt-1.5 sm:pt-2">
                <ScrollReveal
                  mode="scrub"
                  progress={f2_p2}
                  splitBy="words"
                  effect="fade"
                  stagger={0.05}
                  duration={0.8}
                  smoothing={0}
                  baseOpacity={0.1}
                  baseRotation={0}
                  baseOffset={0}
                  enableBlur={true}
                  blurStrength={4}
                  containerClassName="text-white/55 font-normal font-galano-alt justify-center"
                >
                  {line2Prefix}
                </ScrollReveal>
                <ScrollReveal
                  mode="scrub"
                  progress={f2_p2}
                  splitBy="words"
                  effect="fade"
                  stagger={0.05}
                  duration={0.8}
                  smoothing={0}
                  baseOpacity={0.1}
                  baseRotation={0}
                  baseOffset={0}
                  enableBlur={true}
                  blurStrength={4}
                  containerClassName="text-white font-bold font-galano-alt justify-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                >
                  {line2Suffix}
                </ScrollReveal>
              </div>

              {/* Line 3: As a brother, he shares the fret ... */}
              <div className="flex flex-row items-center justify-center gap-x-1.5 text-[clamp(16px,4.9vw,21.5px)] leading-tight whitespace-nowrap pt-1.5 sm:pt-2">
                <ScrollReveal
                  mode="scrub"
                  progress={f2_p3}
                  splitBy="words"
                  effect="fade"
                  stagger={0.05}
                  duration={0.8}
                  smoothing={0}
                  baseOpacity={0.1}
                  baseRotation={0}
                  baseOffset={0}
                  enableBlur={true}
                  blurStrength={4}
                  containerClassName="text-white/55 font-normal font-galano-alt justify-center"
                >
                  {line3Prefix}
                </ScrollReveal>
                <ScrollReveal
                  mode="scrub"
                  progress={f2_p3}
                  splitBy="words"
                  effect="fade"
                  stagger={0.05}
                  duration={0.8}
                  smoothing={0}
                  baseOpacity={0.1}
                  baseRotation={0}
                  baseOffset={0}
                  enableBlur={true}
                  blurStrength={4}
                  containerClassName="text-white font-bold font-galano-alt justify-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                >
                  {line3Suffix}
                </ScrollReveal>
              </div>

              {/* Line 4: BUT... AS A WITNESS, */}
              <div className="flex flex-row items-center justify-center gap-x-2 text-[clamp(24px,7.4vw,32px)] leading-none whitespace-nowrap pt-1 sm:pt-1.5">
                <ScrollReveal
                  mode="scrub"
                  progress={f2_p4}
                  splitBy="words"
                  effect="fade"
                  stagger={0.05}
                  duration={0.8}
                  smoothing={0}
                  baseOpacity={0.1}
                  baseRotation={0}
                  baseOffset={0}
                  enableBlur={true}
                  blurStrength={4}
                  containerClassName="text-white font-galano font-black uppercase justify-center drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
                >
                  {line4Prefix}
                </ScrollReveal>
                <ScrollReveal
                  mode="scrub"
                  progress={f2_p4}
                  splitBy="words"
                  effect="fade"
                  stagger={0.05}
                  duration={0.8}
                  smoothing={0}
                  baseOpacity={0.1}
                  baseRotation={0}
                  baseOffset={0}
                  enableBlur={true}
                  blurStrength={4}
                  highlightColor="#ff0000"
                  containerClassName="text-[#ff0000] font-galano font-black uppercase justify-center drop-shadow-[0_2px_12px_rgba(255,0,0,0.4)]"
                >
                  {line4Suffix}
                </ScrollReveal>
              </div>

              {/* Line 5: he blesses the world! */}
              <div className="pt-1.5 sm:pt-2">
                <ScrollReveal
                  mode="scrub"
                  progress={f2_p5}
                  splitBy="words"
                  effect="fade"
                  stagger={0.05}
                  duration={0.8}
                  smoothing={0}
                  baseOpacity={0.1}
                  baseRotation={0}
                  baseOffset={0}
                  enableBlur={true}
                  blurStrength={4}
                  containerClassName="font-galano-alt font-bold text-white text-[clamp(16px,4.9vw,21.5px)] leading-tight justify-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] whitespace-nowrap"
                >
                  {line5Text}
                </ScrollReveal>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* -------------------------------------------------------- */}
      {/* FRAME 3: 5 NARRATIVE BLOCKS & LARGE SRF LOGO (formerly 4)  */}
      {/* Desktop (>= md): Single left column with space-between     */}
      {/* Mobile (< md): Centered vertical column in fixed slots     */}
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
            {/* iPad Air Portrait (md:max-lg): w-[68%] provides comfortable reading width without crowding */}
            <div className="hidden md:flex absolute top-[7.5%] lg:top-[8%] bottom-[124px] lg:bottom-[132px] left-[4%] xl:left-[5%] w-[68%] md:max-lg:w-[68%] lg:w-[44%] max-w-xl flex-col justify-between items-start pointer-events-none z-20">
              {/* Item 1: Two decades of commitment & counting ... */}
              <div className="w-full flex items-start">
                <ScrollReveal
                  mode="scrub"
                  progress={f3_p1}
                  splitBy="words"
                  effect="fade"
                  stagger={0.05}
                  duration={0.8}
                  smoothing={0}
                  baseOpacity={0.1}
                  baseRotation={0}
                  baseOffset={0}
                  enableBlur={true}
                  blurStrength={4}
                  containerClassName="font-galano-alt font-bold text-white text-[clamp(22px,2.5vw,38.5px)] leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
                >
                  Two decades of commitment &amp; counting ...
                </ScrollReveal>
              </div>

              {/* Item 2: A family to work with – A family to work for */}
              <div className="w-full flex items-start">
                <ScrollReveal
                  mode="scrub"
                  progress={f3_p2}
                  splitBy="words"
                  effect="fade"
                  stagger={0.05}
                  duration={0.8}
                  smoothing={0}
                  baseOpacity={0.1}
                  baseRotation={0}
                  baseOffset={0}
                  enableBlur={true}
                  blurStrength={4}
                  containerClassName="font-galano-alt font-bold text-white text-[clamp(22px,2.5vw,38.5px)] leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
                >
                  A family to work with – A family to work for
                </ScrollReveal>
              </div>

              {/* Item 3: A bounty of love, A legacy to uphold */}
              <div className="w-full flex items-start">
                <ScrollReveal
                  mode="scrub"
                  progress={f3_p3}
                  splitBy="words"
                  effect="fade"
                  stagger={0.05}
                  duration={0.8}
                  smoothing={0}
                  baseOpacity={0.1}
                  baseRotation={0}
                  baseOffset={0}
                  enableBlur={true}
                  blurStrength={4}
                  containerClassName="font-galano-alt font-bold text-white text-[clamp(22px,2.5vw,38.5px)] leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
                >
                  A bounty of love, A legacy to uphold
                </ScrollReveal>
              </div>

              {/* Item 4: A promise spoken in silence – fulfilled with glory */}
              <div className="w-full flex items-start">
                <ScrollReveal
                  mode="scrub"
                  progress={f3_p4}
                  splitBy="words"
                  effect="fade"
                  stagger={0.05}
                  duration={0.8}
                  smoothing={0}
                  baseOpacity={0.1}
                  baseRotation={0}
                  baseOffset={0}
                  enableBlur={true}
                  blurStrength={4}
                  containerClassName="font-galano-alt font-bold text-white text-[clamp(22px,2.5vw,38.5px)] leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
                >
                  A promise spoken in silence – fulfilled with glory
                </ScrollReveal>
              </div>

              {/* Item 5: Prominent SRF Logo */}
              <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-22 lg:h-22 flex items-center">
                <div
                  id="journey-frame4-logo"
                  style={{
                    opacity: Math.max(0.08, f3_logo),
                    transform: `scale(${(0.75 + 0.25 * f3_logo).toFixed(3)})`,
                    filter: f3_logo < 1 ? `blur(${((1 - f3_logo) * 4).toFixed(1)}px)` : 'none',
                  }}
                  className="w-full h-full text-white drop-shadow-[0_4px_24px_rgba(255,255,255,0.35)] transition-all duration-75"
                >
                  <SrfLogo className="w-full h-full text-white" />
                </div>
              </div>

              {/* Item 6: One spine at a time */}
              <div className="w-full flex items-start">
                <ScrollReveal
                  mode="scrub"
                  progress={f3_p5}
                  splitBy="words"
                  effect="fade"
                  stagger={0.05}
                  duration={0.8}
                  smoothing={0}
                  baseOpacity={0.1}
                  baseRotation={0}
                  baseOffset={0}
                  enableBlur={true}
                  blurStrength={4}
                  highlightColor="#ff0000"
                  containerClassName="font-galano-alt font-bold text-[#ff0000] text-[clamp(22px,2.5vw,38.5px)] leading-tight drop-shadow-[0_2px_16px_rgba(255,0,0,0.35)]"
                >
                  One spine at a time
                </ScrollReveal>
              </div>
            </div>

            {/* Mobile View (< md): Unified compact sequential flow matching Figma design */}
            <div className="md:hidden absolute top-[18%] sm:top-[19.5%] inset-x-0 flex flex-col items-center text-center px-4 pointer-events-none z-20">
              <div className="w-full max-w-[320px] sm:max-w-sm flex flex-col items-center space-y-3 sm:space-y-3.5">
                {/* Line 1: Two decades of commitment & counting ... */}
                <div className="w-full flex items-center justify-center text-center">
                  <ScrollReveal
                    mode="scrub"
                    progress={f3_p1}
                    splitBy="words"
                    effect="fade"
                    stagger={0.05}
                    duration={0.8}
                    smoothing={0}
                    baseOpacity={0.1}
                    baseRotation={0}
                    baseOffset={0}
                    enableBlur={true}
                    blurStrength={4}
                    containerClassName="font-galano-alt font-bold text-white text-[clamp(17px,5.2vw,22.5px)] leading-[1.22] text-center drop-shadow-md mx-auto justify-center"
                  >
                    Two decades of commitment &amp; counting ...
                  </ScrollReveal>
                </div>

                {/* Line 2: A family to work with – A family to work for */}
                <div className="w-full flex items-center justify-center text-center">
                  <ScrollReveal
                    mode="scrub"
                    progress={f3_p2}
                    splitBy="words"
                    effect="fade"
                    stagger={0.05}
                    duration={0.8}
                    smoothing={0}
                    baseOpacity={0.1}
                    baseRotation={0}
                    baseOffset={0}
                    enableBlur={true}
                    blurStrength={4}
                    containerClassName="font-galano-alt font-bold text-white text-[clamp(17px,5.2vw,22.5px)] leading-[1.22] text-center drop-shadow-md mx-auto justify-center"
                  >
                    A family to work with – A family to work for
                  </ScrollReveal>
                </div>

                {/* Line 3: A bounty of love, A legacy to uphold */}
                <div className="w-full flex items-center justify-center text-center">
                  <ScrollReveal
                    mode="scrub"
                    progress={f3_p3}
                    splitBy="words"
                    effect="fade"
                    stagger={0.05}
                    duration={0.8}
                    smoothing={0}
                    baseOpacity={0.1}
                    baseRotation={0}
                    baseOffset={0}
                    enableBlur={true}
                    blurStrength={4}
                    containerClassName="font-galano-alt font-bold text-white text-[clamp(17px,5.2vw,22.5px)] leading-[1.22] text-center drop-shadow-md mx-auto justify-center"
                  >
                    A bounty of love, A legacy to uphold
                  </ScrollReveal>
                </div>

                {/* Line 4: A promise spoken in silence – fulfilled with glory */}
                <div className="w-full flex items-center justify-center text-center">
                  <ScrollReveal
                    mode="scrub"
                    progress={f3_p4}
                    splitBy="words"
                    effect="fade"
                    stagger={0.05}
                    duration={0.8}
                    smoothing={0}
                    baseOpacity={0.1}
                    baseRotation={0}
                    baseOffset={0}
                    enableBlur={true}
                    blurStrength={4}
                    containerClassName="font-galano-alt font-bold text-white text-[clamp(17px,5.2vw,22.5px)] leading-[1.22] text-center drop-shadow-md mx-auto justify-center"
                  >
                    A promise spoken in silence – fulfilled with glory
                  </ScrollReveal>
                </div>

                {/* Prominent SRF Logo: positioned directly below line 4 matching Figma */}
                <div className="w-18 h-18 sm:w-20 sm:h-20 pt-1.5 sm:pt-2 flex items-center justify-center">
                  <div
                    id="journey-frame4-logo-mobile"
                    style={{
                      opacity: Math.max(0.08, f3_logo),
                      transform: `scale(${(0.75 + 0.25 * f3_logo).toFixed(3)})`,
                      filter: f3_logo < 1 ? `blur(${((1 - f3_logo) * 4).toFixed(1)}px)` : 'none',
                    }}
                    className="w-18 h-18 sm:w-20 sm:h-20 mx-auto text-white drop-shadow-[0_4px_24px_rgba(255,255,255,0.4)] transition-all duration-75"
                  >
                    <SrfLogo className="w-full h-full text-white" />
                  </div>
                </div>

                {/* One spine at a time: positioned directly below logo matching Figma */}
                <div className="w-full pt-1 flex items-center justify-center text-center">
                  <ScrollReveal
                    mode="scrub"
                    progress={f3_p5}
                    splitBy="words"
                    effect="fade"
                    stagger={0.05}
                    duration={0.8}
                    smoothing={0}
                    baseOpacity={0.1}
                    baseRotation={0}
                    baseOffset={0}
                    enableBlur={true}
                    blurStrength={4}
                    highlightColor="#ff0000"
                    containerClassName="font-galano-alt font-bold tracking-wide text-[#ff0000] text-[clamp(19px,5.8vw,25px)] leading-tight text-center drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] justify-center"
                  >
                    One spine at a time
                  </ScrollReveal>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* -------------------------------------------------------- */}
      {/* BOTTOM INTRO CONTROLS: DOWN ARROW & SKIP (LEFT/CENTER) + PLAY/PAUSE (TOP-RIGHT MOBILE / BOTTOM-RIGHT DESKTOP) */}
      {/* -------------------------------------------------------- */}
      <AnimatePresence>
        {frame < 4 && (
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
                      if (targetProgressRef.current > 0.15) {
                        targetProgressRef.current = 0.0
                      } else {
                        previousFrame()
                      }
                    }}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-white/90 hover:text-white hover:bg-black/70 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-xl rotate-180"
                    aria-label="Previous frame"
                    title="Previous frame / Reverse reveal"
                  >
                    <MaterialIcon name="arrow_cool_down" size={22} className="sm:text-[24px]" />
                  </button>
                )}

                {/* Next Frame Down Button with arrow_cool_down icon */}
                <button
                  type="button"
                  onClick={() => {
                    setIsPlaying(false)
                    if (targetProgressRef.current < 0.85) {
                      targetProgressRef.current = 1.0
                    } else {
                      advanceFrame()
                    }
                  }}
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-white/90 hover:text-white hover:bg-black/70 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-xl"
                  aria-label="Next frame"
                  title="Next frame / Reveal text"
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
