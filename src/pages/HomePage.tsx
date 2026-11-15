import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Hero from '../components/Hero'
import GlassCard from '../components/GlassCard'
import EventSection from '../components/EventSection'
import PromiseCard from '../components/PromiseCard'
import EducationCard from '../components/EducationCard'
import TrusteeMessage from '../components/TrusteeMessage'
import ImpactMetrics from '../components/ImpactMetrics'
import MisconceptionsCard from '../components/MisconceptionsCard'
import GradualBlur from '../components/GradualBlur'
import AnimatedContent from '../components/AnimatedContent'

interface HomePageProps {
  onReadMore?: () => void
  onOpenPromise?: () => void
  onOpenEducation?: () => void
  onOpenMisconceptions?: () => void
  onReplayJourney?: () => void
  isEnteringFromJourney?: boolean
}

export const HomePage: React.FC<HomePageProps> = ({
  onReadMore,
  onOpenPromise,
  onOpenEducation,
  onOpenMisconceptions,
  onReplayJourney,
  isEnteringFromJourney,
}) => {
  const navigate = useNavigate()
  const bannerImgRef = useRef<HTMLImageElement>(null)
  const [isMobileCollapsed, setIsMobileCollapsed] = useState(false)

  // Reset to intermediate extended frame when entering from journey or replaying
  useEffect(() => {
    if (isEnteringFromJourney) {
      setIsMobileCollapsed(false)
    }
  }, [isEnteringFromJourney])

  // Touch and wheel collapse triggers for mobile viewport
  useEffect(() => {
    const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 768

    let touchStartY = 0

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isMobile()) return
      const currentY = e.touches[0].clientY
      const diff = touchStartY - currentY

      if (!isMobileCollapsed && diff > 15) {
        // Swiping up to scroll down -> collapse hero
        setIsMobileCollapsed(true)
      } else if (isMobileCollapsed && window.scrollY <= 2 && diff < -35) {
        // Pulling down while at the very top -> expand hero
        setIsMobileCollapsed(false)
      }
    }

    const handleWheel = (e: WheelEvent) => {
      if (!isMobile()) return
      if (!isMobileCollapsed && e.deltaY > 10) {
        setIsMobileCollapsed(true)
      } else if (isMobileCollapsed && window.scrollY <= 2 && e.deltaY < -15) {
        setIsMobileCollapsed(false)
      }
    }

    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('wheel', handleWheel, { passive: true })

    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('wheel', handleWheel)
    }
  }, [isMobileCollapsed])

  // Fluid delayed parallax scroll effect with magnetic top snapping
  useEffect(() => {
    let targetY = 0
    let currentY = 0
    let rafId: number
    let isRunning = false

    // Magnetic snap threshold: when within the top landing zone (scrollY <= 70px),
    // the background is magnetically locked at resting position (0px) so no parallax starts
    // until the user deliberately scrolls down from the home page.
    const MAGNETIC_SNAP_THRESHOLD = 70

    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
      const parallaxFactor = isMobile ? 0.24 : 0.20

      if (isMobile && scrollY > 20 && !isMobileCollapsed) {
        setIsMobileCollapsed(true)
      }

      if (scrollY <= MAGNETIC_SNAP_THRESHOLD) {
        // Magnetically snap to resting position at top of home page
        targetY = 0
      } else {
        // Parallax smoothly engages once scrolled past the magnetic snap zone
        // Background image scrolls ~20% slower on desktop / 24% on mobile than foreground content
        targetY = (scrollY - MAGNETIC_SNAP_THRESHOLD) * parallaxFactor
      }

      if (!isRunning) {
        isRunning = true
        rafId = requestAnimationFrame(animate)
      }
    }

    const animate = () => {
      const scaleStr = 'scale(1)'

      // Lerp with 0.08 damping factor creates luxurious delayed inertia
      currentY += (targetY - currentY) * 0.08

      if (bannerImgRef.current) {
        bannerImgRef.current.style.transform = `translate3d(0, ${currentY.toFixed(2)}px, 0) ${scaleStr}`
      }

      if (Math.abs(targetY - currentY) > 0.05) {
        rafId = requestAnimationFrame(animate)
      } else {
        currentY = targetY
        if (bannerImgRef.current) {
          bannerImgRef.current.style.transform = `translate3d(0, ${currentY.toFixed(2)}px, 0) ${scaleStr}`
        }
        isRunning = false
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(rafId)
    }
  }, [isMobileCollapsed])

  return (
    <>
      {/* Landing Scroll Level Hero Background Banner with Delayed Parallax & Magnetic Snap */}
      {/* On mobile: Render with full 100dvh height in intermediate state matching Frame 4 */}
      <div 
        className="absolute -top-[86px] sm:-top-[90px] left-0 right-0 h-[100dvh] sm:h-[calc(100vh+90px)] pointer-events-none z-0 overflow-hidden"
        aria-hidden="true"
      >
        {/* Background Image with Delayed Parallax Scroll: identical framing & zoom to Frame 4 */}
        <picture className="w-full h-full block">
          <source
            media="(max-width: 768px)"
            srcSet={`${import.meta.env.BASE_URL}banners/Solitary%20Boy%20Amid%20the%20Moving%20Crowd%201%20-%20phone.png`}
          />
          <img
            ref={bannerImgRef}
            src={`${import.meta.env.BASE_URL}banners/Solitary%20Boy%20Amid%20the%20Moving%20Crowd%201.jpg`}
            alt="Spine Research Foundation India patient banner"
            className="w-full h-full object-cover object-[50%_25%] sm:object-[50%_28%] select-none opacity-100 will-change-transform"
            style={{
              transform: 'translate3d(0, 0px, 0) scale(1)',
              transformOrigin: 'center center',
            }}
          />
        </picture>

        {/* Gradual blur softening as we move up to the overlay: adjusted for 100dvh height on mobile */}
        <div className="block sm:hidden">
          <GradualBlur
            position="bottom"
            target="parent"
            height="55%"
            strength={2.2}
            layers={8}
            curve="linear"
            exponential
            zIndex={2}
          />
        </div>
        <div className="hidden sm:block">
          <GradualBlur
            position="bottom"
            target="parent"
            height="60%"
            strength={2.4}
            layers={8}
            curve="linear"
            exponential
            zIndex={2}
          />
        </div>

        {/* Top-to-bottom subtle gradient overlay on mobile for soft header blending (#0b0c0e 100% to 0%) */}
        <div
          className="sm:hidden absolute top-0 inset-x-0 h-36 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, #0b0c0e 0%, rgba(11, 12, 14, 0.72) 40%, rgba(11, 12, 14, 0) 100%)',
            zIndex: 4,
          }}
        />

        {/* Vertical bottom-to-top linear gradient overlay: Smoothly merges into #0b0c0e with soft transition on mobile */}
        <div 
          className="sm:hidden absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, #0b0c0e 0%, rgba(11, 12, 14, 0.98) 25%, rgba(11, 12, 14, 0.6) 55%, rgba(11, 12, 14, 0) 100%)',
            zIndex: 3,
          }}
        />
        <div 
          className="hidden sm:block absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, #0b0c0e 0%, rgba(11, 12, 14, 0.96) 28%, rgba(11, 12, 14, 0.52) 58%, rgba(11, 12, 14, 0) 100%)',
            zIndex: 3,
          }}
        />
      </div>

      <Hero
        onReplayJourney={onReplayJourney}
        isEnteringFromJourney={isEnteringFromJourney}
        isMobileCollapsed={isMobileCollapsed}
        onCollapseMobile={() => setIsMobileCollapsed(true)}
      />

      {/* Floating Glass Cards with uniform 20px edge gutter and inter-card gap on mobile */}
      <div className="max-w-[1536px] mx-auto px-5 sm:px-10 lg:px-14 xl:px-16 space-y-5 sm:space-y-5">
        <AnimatedContent distance={36} duration={0.8} ease="power3.out" threshold={0.08}>
          <GlassCard onReadMore={onReadMore || (() => navigate('/about'))} />
        </AnimatedContent>
        <AnimatedContent distance={36} duration={0.8} ease="power3.out" threshold={0.08}>
          <EventSection />
        </AnimatedContent>
        <AnimatedContent distance={36} duration={0.8} ease="power3.out" threshold={0.08}>
          <PromiseCard onCheckOutMore={onOpenPromise || (() => navigate('/care'))} />
        </AnimatedContent>
      </div>

      {/* Managing Trustee's Message on Base Background */}
      <AnimatedContent distance={36} duration={0.8} ease="power3.out" threshold={0.08}>
        <TrusteeMessage />
      </AnimatedContent>

      {/* Education & Research, Humanitarian Impact Metrics, and Misconceptions Section */}
      <div className="max-w-[1536px] mx-auto px-5 sm:px-10 lg:px-14 xl:px-16 space-y-5 sm:space-y-5">
        <AnimatedContent distance={36} duration={0.8} ease="power3.out" threshold={0.08}>
          <EducationCard onCheckOutMore={onOpenEducation || (() => navigate('/discover'))} />
        </AnimatedContent>
        <AnimatedContent distance={36} duration={0.8} ease="power3.out" threshold={0.08}>
          <ImpactMetrics />
        </AnimatedContent>
        <AnimatedContent distance={36} duration={0.8} ease="power3.out" threshold={0.08}>
          <MisconceptionsCard onCheckOutMore={onOpenMisconceptions || (() => navigate('/treatments'))} />
        </AnimatedContent>
      </div>
    </>
  )
}

export default HomePage
