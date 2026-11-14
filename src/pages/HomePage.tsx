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

  // Fluid delayed parallax scroll effect for the background hero banner image
  useEffect(() => {
    let targetY = 0
    let currentY = 0
    let rafId: number
    let isRunning = false

    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset
      // Parallax translation ratio: ~28% of page scroll speed
      targetY = scrollY * 0.28

      if (!isRunning) {
        isRunning = true
        rafId = requestAnimationFrame(animate)
      }
    }

    const animate = () => {
      // Lerp with 0.075 damping factor creates luxurious delayed inertia
      currentY += (targetY - currentY) * 0.075

      if (bannerImgRef.current) {
        bannerImgRef.current.style.transform = `translate3d(0, ${currentY.toFixed(2)}px, 0) scale(1.12)`
      }

      if (Math.abs(targetY - currentY) > 0.08) {
        rafId = requestAnimationFrame(animate)
      } else {
        currentY = targetY
        if (bannerImgRef.current) {
          bannerImgRef.current.style.transform = `translate3d(0, ${currentY.toFixed(2)}px, 0) scale(1.12)`
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
      {/* Landing Scroll Level Hero Background Banner with Delayed Parallax */}
      <div 
        className="absolute top-0 left-0 right-0 h-screen pointer-events-none z-0 overflow-hidden"
        aria-hidden="true"
      >
        {/* Background Image with Delayed Parallax Scroll */}
        <img
          ref={bannerImgRef}
          src={`${import.meta.env.BASE_URL}banners/Solitary Boy Amid the Moving Crowd 1.jpg`}
          alt="Spine Research Foundation India patient banner"
          className="w-full h-full object-cover object-[50%_22%] select-none opacity-90 will-change-transform"
          style={{
            transform: 'translate3d(0, 0px, 0) scale(1.12)',
            transformOrigin: 'center 22%',
          }}
        />

        {/* Gradual blur softening as we move up to the overlay */}
        <GradualBlur
          position="bottom"
          target="parent"
          height="65%"
          strength={2.5}
          layers={8}
          curve="linear"
          exponential
          zIndex={2}
        />

        {/* Vertical bottom-to-top linear gradient overlay: #000000 100% -> #000000 0% */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, #0b0c0e 0%, rgba(11, 12, 14, 0.92) 22%, rgba(11, 12, 14, 0.55) 50%, rgba(11, 12, 14, 0) 100%)',
            zIndex: 3
          }}
        />

        {/* Top subtle vignette for clear floating navbar contrast */}
        <div 
          className="absolute inset-x-0 top-0 h-40 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0) 100%)',
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
