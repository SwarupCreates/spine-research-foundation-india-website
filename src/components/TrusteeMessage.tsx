import React, { useState, useRef, useEffect, useCallback } from 'react'
import { MaterialIcon } from './icons'

export const TrusteeMessage: React.FC = () => {
  const [scrollState, setScrollState] = useState({
    canScrollUp: false,
    canScrollDown: true,
  })
  const scrollRef = useRef<HTMLDivElement>(null)

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const canUp = el.scrollTop > 8
    const canDown = el.scrollHeight - el.scrollTop - el.clientHeight > 8
    setScrollState({ canScrollUp: canUp, canScrollDown: canDown })
  }, [])

  useEffect(() => {
    checkScroll()
    const el = scrollRef.current
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true })
    }
    window.addEventListener('resize', checkScroll)
    return () => {
      if (el) {
        el.removeEventListener('scroll', checkScroll)
      }
      window.removeEventListener('resize', checkScroll)
    }
  }, [checkScroll])

  // Dynamic edge gradient mask conditionally applied based on scroll position
  const getMaskStyle = () => {
    const { canScrollUp, canScrollDown } = scrollState
    if (canScrollUp && canScrollDown) {
      return 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 12%, rgba(0,0,0,1) 88%, rgba(0,0,0,0) 100%)'
    }
    if (canScrollUp && !canScrollDown) {
      return 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 14%, rgba(0,0,0,1) 100%)'
    }
    if (!canScrollUp && canScrollDown) {
      return 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 86%, rgba(0,0,0,0) 100%)'
    }
    return 'none'
  }

  return (
    <section className="relative py-12 sm:py-16 lg:py-20 overflow-hidden">
      {/* Subtle ambient lighting on base background */}
      <div 
        className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[550px] h-[550px] bg-emerald-500/[0.04] rounded-full blur-[130px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Column: Doctor's Emerging Portrait & Intro Details */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="relative w-full max-w-[280px] sm:max-w-[340px] lg:max-w-[380px] aspect-[3/4] flex items-end justify-center">
              {/* Ambient silhouette glow behind the doctor */}
              <div 
                className="absolute inset-0 bg-gradient-to-t from-emerald-500/15 via-blue-500/10 to-transparent blur-2xl opacity-75 rounded-full scale-90"
                aria-hidden="true"
              />
              
              {/* Doctor portrait with gradual bottom transparency fade */}
              <img
                src={`${import.meta.env.BASE_URL}images/drSaumyajitBasu.png`}
                alt="Dr. Saumyajit Basu - Managing Trustee, SRF India"
                className="w-full h-full object-contain object-bottom select-none filter contrast-[1.03]"
                style={{
                  maskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 68%, rgba(0, 0, 0, 0.3) 88%, rgba(0, 0, 0, 0) 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 68%, rgba(0, 0, 0, 0.3) 88%, rgba(0, 0, 0, 0) 100%)',
                }}
              />
            </div>

            {/* Doctor Intro Details */}
            <div className="mt-3.5 space-y-1">
              <h3 className="text-xl sm:text-2xl font-medium text-white tracking-tight">
                Dr. Saumyajit Basu
              </h3>
              
              <div className="flex items-center justify-center lg:justify-start gap-1.5 text-xs sm:text-sm text-emerald-400 font-medium">
                <MaterialIcon name="verified" size={16} filled className="text-emerald-400 shrink-0" />
                <span>Managing Trustee, SRF India</span>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-1.5 text-xs sm:text-sm text-gray-300 font-medium">
                <MaterialIcon name="medical_services" size={16} className="text-gray-400 shrink-0" />
                <span>Senior Consultant Spine Surgeon</span>
              </div>
            </div>
          </div>

          {/* Right Column: Minimal Heading & Height-Limited Scrollable Message */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Minimal & Compact Heading */}
            <div className="mb-4 sm:mb-5 text-center lg:text-left">
              <span className="text-xs uppercase tracking-[0.18em] text-emerald-400 font-medium block">
                Leadership Perspective
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-medium text-white tracking-tight font-jost mt-1 leading-snug">
                Managing Trustee&apos;s Message
              </h2>
              <div className="w-12 h-0.5 bg-emerald-500/40 mt-2.5 rounded-full mx-auto lg:mx-0" />
            </div>

            {/* Height-Limited Container with Conditional Gradual Transparency */}
            <div className="relative">
              <div
                ref={scrollRef}
                className="overflow-y-auto max-h-[300px] sm:max-h-[340px] lg:max-h-[360px] pr-3 sm:pr-4 space-y-4 text-gray-300 text-sm sm:text-base leading-relaxed"
                style={{
                  maskImage: getMaskStyle(),
                  WebkitMaskImage: getMaskStyle(),
                }}
              >
                <p>
                  Spine Research Foundation (SRF) was set up to expedite our process of giving back to
                  the society which has nurtured us to mature individuals, capable of doing something
                  to uplift those in the community who desperately need the most but cannot get access
                  to the same. Our key areas of focus remains on education, training and research along
                  with providing financial support to those needy patients who cannot afford the complex
                  spine surgery which they urgently need.
                </p>

                <p>
                  Over the last 15 years, our spine fellowship programs have been extremely successful
                  in creating competent spine surgeons across the length and breadth of India and active
                  research has created an environment of education in our department of spine surgery
                  which now attracts the best of talents. We have been able to touch the lives of more
                  than 200 patients who had difficult spine surgeries with us where most of the treatment
                  cost was borne by SRF and we had the pleasure and satisfaction of being able to offer
                  our services entirely free of charge.
                </p>

                <p className="text-white/95 font-medium border-l-2 border-emerald-500/50 pl-3.5 italic bg-white/[0.02] py-2 rounded-r-lg">
                  &ldquo;Delighted by getting an opportunity to serve, we will continue to work hard to
                  further our mission and vision and seek all your blessings and support for the future.&rdquo;
                </p>
              </div>

              {/* Dynamic Scroll Indicator if content continues below */}
              {scrollState.canScrollDown && (
                <div className="pt-2.5 flex items-center justify-center lg:justify-start gap-1.5 text-[11px] text-gray-400 font-medium select-none pointer-events-none">
                  <MaterialIcon name="arrow_downward" size={14} className="text-emerald-400 animate-bounce" />
                  <span>Scroll to read more</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default TrusteeMessage
