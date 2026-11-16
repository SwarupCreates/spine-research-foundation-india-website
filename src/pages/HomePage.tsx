import React, { useEffect, useState } from 'react'
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
  const [isMobileCollapsed, setIsMobileCollapsed] = useState(false)
  const [mobileScrollProgress, setMobileScrollProgress] = useState(0)

  // Reset to intermediate extended frame on initial mount
  useEffect(() => {
    setIsMobileCollapsed(false)
    setMobileScrollProgress(0)
    if (window.scrollY === 0) {
      window.scrollTo(0, 0)
    }
  }, [])

  // Reset to intermediate extended frame when entering from journey or replaying
  useEffect(() => {
    if (isEnteringFromJourney) {
      setIsMobileCollapsed(false)
      setMobileScrollProgress(0)
      if (window.scrollY === 0) {
        window.scrollTo(0, 0)
      }
    }
  }, [isEnteringFromJourney])

  // Continuous scroll-linked collapse on mobile (220px range)
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

      if (isMobile) {
        const COLLAPSE_RANGE = 220
        const p = Math.min(1, Math.max(0, scrollY / COLLAPSE_RANGE))
        setMobileScrollProgress(p)
        setIsMobileCollapsed(p >= 0.85)
      } else {
        setIsMobileCollapsed(false)
        setMobileScrollProgress(0)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    if (window.scrollY > 0) {
      handleScroll()
    }

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
      <Hero
        onReplayJourney={onReplayJourney}
        isEnteringFromJourney={isEnteringFromJourney}
        mobileScrollProgress={mobileScrollProgress}
        isMobileCollapsed={isMobileCollapsed}
        onCollapseMobile={() => window.scrollTo({ top: 220, behavior: 'smooth' })}
      />

      {/* Floating Glass Cards with uniform 20px edge gutter and inter-card gap on mobile */}
      <div className="max-w-[1536px] mx-auto px-5 sm:px-10 lg:px-14 xl:px-16 space-y-5 sm:space-y-5">
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
