import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Hero from '../components/Hero'
import GlassCard from '../components/GlassCard'
import EventSection from '../components/EventSection'
import PromiseCard from '../components/PromiseCard'
import EducationCard from '../components/EducationCard'
import TrusteeMessage from '../components/TrusteeMessage'
import ImpactMetrics from '../components/ImpactMetrics'
import MisconceptionsCard from '../components/MisconceptionsCard'

interface HomePageProps {
  onReadMore?: () => void
  onOpenPromise?: () => void
  onOpenEducation?: () => void
  onOpenMisconceptions?: () => void
  onReplayJourney?: (startFrame?: number) => void
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

  // Ensure scroll is at top on mount or when entering from journey
  useEffect(() => {
    if (window.scrollY === 0) {
      window.scrollTo(0, 0)
    }
  }, [])

  useEffect(() => {
    if (isEnteringFromJourney && window.scrollY === 0) {
      window.scrollTo(0, 0)
    }
  }, [isEnteringFromJourney])

  // Bidirectional reverse scroll: when user is at the very top of HomePage (scrollY <= 0) and scrolls up,
  // smoothly transition back into Frame 2 of the Welcome Journey
  useEffect(() => {
    let lastGestureTime = 0
    let touchStartY = 0
    let touchStartX = 0

    const handleWheel = (e: WheelEvent) => {
      if (!onReplayJourney) return
      if (window.scrollY > 5) return
      const now = Date.now()
      if (now - lastGestureTime < 800) return

      if (e.deltaY < -28) {
        lastGestureTime = now
        onReplayJourney(2)
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartY = e.touches[0].clientY
        touchStartX = e.touches[0].clientX
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!onReplayJourney) return
      if (window.scrollY > 5) return
      if (e.changedTouches.length === 0) return
      const now = Date.now()
      if (now - lastGestureTime < 800) return

      const deltaY = touchStartY - e.changedTouches[0].clientY
      const deltaX = touchStartX - e.changedTouches[0].clientX

      if (deltaY < -45 && Math.abs(deltaY) > Math.abs(deltaX)) {
        lastGestureTime = now
        onReplayJourney(2)
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: true })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [onReplayJourney])

  return (
    <>
      <Hero
        isEnteringFromJourney={isEnteringFromJourney}
        onScrollToCards={() => window.scrollTo({ top: window.innerHeight - 80, behavior: 'smooth' })}
        onReadMore={onReadMore || (() => navigate('/about'))}
      />

      {/* Floating Glass Cards with uniform edge gutter and inter-card gap */}
      <div className="max-w-[1536px] mx-auto px-5 sm:px-10 lg:px-14 xl:px-16 space-y-5 sm:space-y-6 mt-2 sm:mt-6">
        <GlassCard onReadMore={onReadMore || (() => navigate('/about'))} />
        <EventSection />
        <PromiseCard onCheckOutMore={onOpenPromise || (() => navigate('/care'))} />
      </div>

      {/* Managing Trustee's Message on Base Background */}
      <TrusteeMessage />

      {/* Education & Research, Humanitarian Impact Metrics, and Misconceptions Section */}
      <div className="max-w-[1536px] mx-auto px-5 sm:px-10 lg:px-14 xl:px-16 space-y-5 sm:space-y-5">
        <EducationCard onCheckOutMore={onOpenEducation || (() => navigate('/discover'))} />
        <ImpactMetrics />
        <MisconceptionsCard onCheckOutMore={onOpenMisconceptions || (() => navigate('/treatments'))} />
      </div>
    </>
  )
}

export default HomePage
