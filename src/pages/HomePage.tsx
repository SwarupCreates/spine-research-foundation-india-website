import React, { useEffect, useRef } from 'react'
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
}

export const HomePage: React.FC<HomePageProps> = ({
  onReadMore,
  onOpenPromise,
  onOpenEducation,
  onOpenMisconceptions,
}) => {
  const navigate = useNavigate()
  const bannerImgRef = useRef<HTMLImageElement>(null)

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
    const PARALLAX_FACTOR = 0.24

    const handleScroll = () => {
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 640
      if (!isMobile) return

      const scrollY = window.scrollY || window.pageYOffset

      if (scrollY <= MAGNETIC_SNAP_THRESHOLD) {
        // Magnetically snap to resting position at top of home page
        targetY = 0
      } else {
        // Parallax smoothly engages once scrolled past the magnetic snap zone on mobile
        targetY = (scrollY - MAGNETIC_SNAP_THRESHOLD) * PARALLAX_FACTOR
      }

      if (!isRunning) {
        isRunning = true
        rafId = requestAnimationFrame(animate)
      }
    }

    const animate = () => {
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 640
      if (!isMobile) {
        if (bannerImgRef.current) {
          bannerImgRef.current.style.transform = 'translate3d(0, 0px, 0) scale(1)'
        }
        isRunning = false
        return
      }

      // Lerp with 0.08 damping factor creates luxurious delayed inertia on mobile
      currentY += (targetY - currentY) * 0.08
      const scaleStr = 'scale(1.18)'

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
  }, [])

  return (
    <>
      {/* Landing Scroll Level Hero Background Banner with Delayed Parallax & Magnetic Snap */}
      {/* On mobile: Render with increased height (~76vh) and zoom to cover even more background elegantly */}
      <div 
        className="absolute -top-[100px] sm:-top-[110px] left-0 right-0 h-[calc(76vh+100px)] sm:h-[calc(100vh+110px)] max-h-[calc(80vh+100px)] sm:max-h-none pointer-events-none z-0 overflow-hidden"
        aria-hidden="true"
      >
        {/* Overscan wrapper: mobile keeps generous overscan for phone zoom; desktop stays flush at top-0 bottom-0 */}
        <div className="absolute inset-x-0 -top-16 sm:top-0 -bottom-16 sm:bottom-0 overflow-hidden">
          {/* Background Image with Delayed Parallax Scroll: 3:5 portrait on mobile, 16:9 on desktop */}
          <picture className="w-full h-full block">
            <source
              media="(max-width: 639px)"
              srcSet={`${import.meta.env.BASE_URL}banners/Solitary%20Boy%20Amid%20the%20Moving%20Crowd%201%20-%20phone.png`}
            />
            <img
              ref={bannerImgRef}
              src={`${import.meta.env.BASE_URL}banners/Solitary%20Boy%20Amid%20the%20Moving%20Crowd%201.jpg`}
              alt="Spine Research Foundation India patient banner"
              className="w-full h-full object-cover object-[50%_12%] sm:object-[50%_35%] select-none opacity-90 will-change-transform"
              style={{
                transform: 'translate3d(0, 0px, 0)',
                transformOrigin: 'center center',
              }}
            />
          </picture>
        </div>

        {/* Gradual blur softening as we move up to the overlay: adjusted for 76vh height on mobile */}
        <div className="block sm:hidden">
          <GradualBlur
            position="bottom"
            target="parent"
            height="50%"
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
            height="35%"
            strength={2.2}
            layers={8}
            curve="linear"
            exponential
            zIndex={2}
          />
        </div>

        {/* Vertical bottom-to-top linear gradient overlay: Smoothly merges into #0b0c0e with soft transition on mobile */}
        <div 
          className="sm:hidden absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, #0b0c0e 0%, rgba(11, 12, 14, 0.96) 20%, rgba(11, 12, 14, 0.45) 45%, rgba(11, 12, 14, 0) 75%)',
            zIndex: 3
          }}
        />
        <div 
          className="hidden sm:block absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, #0b0c0e 0%, rgba(11, 12, 14, 0.95) 15%, rgba(11, 12, 14, 0.35) 30%, rgba(11, 12, 14, 0) 52%)',
            zIndex: 3
          }}
        />
      </div>

      <Hero />

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
