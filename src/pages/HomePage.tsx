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

  return (
    <>
      <Hero
        onReplayJourney={onReplayJourney}
        isEnteringFromJourney={isEnteringFromJourney}
        onScrollToCards={() => window.scrollTo({ top: window.innerHeight - 80, behavior: 'smooth' })}
      />

      {/* Floating Glass Cards with uniform 20px edge gutter and inter-card gap on mobile */}
      <div className="max-w-[1536px] mx-auto px-5 sm:px-10 lg:px-14 xl:px-16 space-y-5 sm:space-y-5 -mt-8 sm:mt-0">
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
