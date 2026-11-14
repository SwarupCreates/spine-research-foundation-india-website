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
        className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/[0.04] rounded-full blur-[130px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Constrained width to bring left image and right text closer together */}
      <div className="max-w-5xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 xl:gap-14">
          
          {/* Left Column: Doctor's Image & Overlapping Identity Bundle */}
          <div className="relative flex flex-col items-center shrink-0">
            {/* Shorter, compact Doctor portrait with bottom gradual transparency */}
            <div className="relative w-[240px] sm:w-[270px] lg:w-[290px] h-[280px] sm:h-[310px] lg:h-[330px] flex items-end justify-center">
              {/* Ambient silhouette glow behind the doctor */}
              <div 
                className="absolute inset-0 bg-gradient-to-t from-emerald-500/15 via-blue-500/10 to-transparent blur-2xl opacity-75 rounded-full scale-90"
                aria-hidden="true"
              />
              
              <img
                src={`${import.meta.env.BASE_URL}images/drSaumyajitBasu.png`}
                alt="Dr. Saumyajit Basu - Managing Trustee, SRF India"
                className="w-full h-full object-contain object-bottom select-none filter contrast-[1.03]"
                style={{
                  maskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 62%, rgba(0, 0, 0, 0.25) 85%, rgba(0, 0, 0, 0) 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 62%, rgba(0, 0, 0, 0.25) 85%, rgba(0, 0, 0, 0) 100%)',
                }}
              />
            </div>

            {/* Floating Identity Bundle directly above the bottom part of his body without container box */}
            <div className="relative -mt-10 sm:-mt-12 z-20 text-center space-y-0.5 select-none pointer-events-none">
              <h3 className="text-lg sm:text-xl font-medium text-white tracking-tight whitespace-nowrap drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
                Dr. Saumyajit Basu
              </h3>
              
              <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-medium whitespace-nowrap drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                <MaterialIcon name="verified" size={15} filled className="text-emerald-400 shrink-0" />
                <span>Managing Trustee, SRF India</span>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] sm:text-xs text-gray-200 font-medium whitespace-nowrap drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                <MaterialIcon name="medical_services" size={15} className="text-gray-300 shrink-0" />
                <span>Senior Consultant Spine Surgeon</span>
              </div>
            </div>
          </div>

          {/* Right Column: Shortened Text Box Container & Scrollable Message */}
          <div className="max-w-lg lg:max-w-xl w-full flex flex-col justify-center">
            {/* Minimal & Compact Heading */}
            <div className="mb-3.5 text-center lg:text-left">
              <span className="text-[11px] uppercase tracking-[0.18em] text-emerald-400 font-medium block">
                Leadership Perspective
              </span>
              <h2 className="text-2xl sm:text-[28px] font-medium text-white tracking-tight font-jost mt-0.5 leading-snug">
                Managing Trustee&apos;s Message
              </h2>
              <div className="w-10 h-0.5 bg-emerald-500/40 mt-2 rounded-full mx-auto lg:mx-0" />
            </div>

            {/* Shortened Width Container with Hidden Scrollbar and Edge Transparency */}
            <div className="relative">
              <div
                ref={scrollRef}
                className="overflow-y-auto no-scrollbar max-h-[250px] sm:max-h-[270px] space-y-3.5 text-gray-300 text-sm sm:text-[15px] leading-relaxed select-text"
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

                <p className="text-white/95 font-medium border-l-2 border-emerald-500/50 pl-3 italic bg-white/[0.02] py-1.5 rounded-r-lg">
                  &ldquo;Delighted by getting an opportunity to serve, we will continue to work hard to
                  further our mission and vision and seek all your blessings and support for the future.&rdquo;
                </p>
              </div>

              {/* Dynamic Scroll Indicator if content continues below */}
              {scrollState.canScrollDown && (
                <div className="pt-2 flex items-center justify-center lg:justify-start gap-1.5 text-[11px] text-gray-400 font-medium select-none pointer-events-none">
                  <MaterialIcon name="arrow_downward" size={14} className="text-emerald-400 animate-bounce" />
                  <span>Scroll to continue reading</span>
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
