import React, { useEffect, useRef } from 'react'
import Hero from '../components/Hero'
import GlassCard from '../components/GlassCard'
import EventSection from '../components/EventSection'
import PromiseCard from '../components/PromiseCard'
import EducationCard from '../components/EducationCard'
import TrusteeMessage from '../components/TrusteeMessage'
import ImpactMetrics from '../components/ImpactMetrics'
import MisconceptionsCard from '../components/MisconceptionsCard'
import GradualBlur from '../components/GradualBlur'

interface HomePageProps {
  onReadMore: () => void
  onOpenPromise: () => void
  onOpenEducation: () => void
  onOpenMisconceptions: () => void
}

export const HomePage: React.FC<HomePageProps> = ({
  onReadMore,
  onOpenPromise,
  onOpenEducation,
  onOpenMisconceptions,
}) => {
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
      const scrollY = window.scrollY || window.pageYOffset

      if (scrollY <= MAGNETIC_SNAP_THRESHOLD) {
        // Magnetically snap to resting position at top of home page
        targetY = 0
      } else {
        // Parallax smoothly engages once scrolled past the magnetic snap zone
        targetY = (scrollY - MAGNETIC_SNAP_THRESHOLD) * PARALLAX_FACTOR
      }

      if (!isRunning) {
        isRunning = true
        rafId = requestAnimationFrame(animate)
      }
    }

    const animate = () => {
      // Lerp with 0.08 damping factor creates luxurious delayed inertia
      currentY += (targetY - currentY) * 0.08

      const isMobile = typeof window !== 'undefined' && window.innerWidth < 640
      const scaleStr = isMobile ? 'scale(1.02)' : 'scale(1.08)'

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
      {/* On mobile: Render at a compact height (~38% of viewport) with deep top bleed to prevent any top grey bar */}
      <div 
        className="absolute -top-[100px] sm:-top-[110px] left-0 right-0 h-[calc(38vh+100px)] sm:h-[calc(100vh+110px)] max-h-[calc(40vh+100px)] sm:max-h-none pointer-events-none z-0 overflow-hidden"
        aria-hidden="true"
      >
        {/* Generous overscan wrapper ensuring no top edge or gap ever exposes */}
        <div className="absolute inset-x-0 -top-16 sm:-top-36 -bottom-16 sm:-bottom-36 overflow-hidden">
          {/* Background Image with Delayed Parallax Scroll */}
          <img
            ref={bannerImgRef}
            src={`${import.meta.env.BASE_URL}banners/Solitary Boy Amid the Moving Crowd 1.jpg`}
            alt="Spine Research Foundation India patient banner"
            className="w-full h-full object-cover object-[50%_10%] sm:object-[50%_20%] select-none opacity-90 will-change-transform"
            style={{
              transform: 'translate3d(0, 0px, 0) scale(1.02)',
              transformOrigin: 'center center',
            }}
          />
        </div>

        {/* Gradual blur softening as we move up to the overlay */}
        <GradualBlur
          position="bottom"
          target="parent"
          height="60%"
          strength={2.2}
          layers={8}
          curve="linear"
          exponential
          zIndex={2}
        />

        {/* Vertical bottom-to-top linear gradient overlay: Smoothly merges into #0b0c0e */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, #0b0c0e 0%, rgba(11, 12, 14, 0.96) 28%, rgba(11, 12, 14, 0.52) 58%, rgba(11, 12, 14, 0) 100%)',
            zIndex: 3
          }}
        />
      </div>

      <Hero />

      {/* Floating Glass Cards with tight, balanced gap */}
      <div className="max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 space-y-4 sm:space-y-5">
        <GlassCard onReadMore={onReadMore} />
        <EventSection />
        <PromiseCard onCheckOutMore={onOpenPromise} />
      </div>

      {/* Managing Trustee's Message on Base Background */}
      <TrusteeMessage />

      {/* Education & Research, Humanitarian Impact Metrics, and Misconceptions Section */}
      <div className="max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 space-y-4 sm:space-y-5">
        <EducationCard onCheckOutMore={onOpenEducation} />
        <ImpactMetrics />
        <MisconceptionsCard onCheckOutMore={onOpenMisconceptions} />
      </div>
    </>
  )
}

export default HomePage
