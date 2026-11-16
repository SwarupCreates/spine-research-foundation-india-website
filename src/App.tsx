import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from './components/Navbar'
import FloatingActions from './components/FloatingActions'
import CustomScrollbar from './components/CustomScrollbar'
import GradualBlur from './components/GradualBlur'
import {
  ParticipateModal,
  FeedbackModal,
  ReadMoreModal,
  PromiseModal,
  EducationModal,
  MisconceptionsModal,
} from './components/ActionModals'
import { SrfLogo } from './components/icons'
import { WelcomeJourney } from './components/WelcomeJourney'
import JourneyReplayButton from './components/JourneyReplayButton'
import { HomePage, WorkInProgressPage, NotFoundPage } from './pages'

export const App: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()

  // Match current active tab from pathname
  const pathSegment = location.pathname.replace(/^\//, '').split('/')[0].toLowerCase()
  const activeTab = pathSegment ? pathSegment : 'home'

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false
  )

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Automatically close mobile menu, dismiss any open modals, and scroll to top upon navigating
  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsParticipateOpen(false)
    setIsFeedbackOpen(false)
    setIsReadMoreOpen(false)
    setIsPromiseOpen(false)
    setIsEducationOpen(false)
    setIsMisconceptionsOpen(false)
    window.scrollTo(0, 0)
    // Synchronize ScrollTrigger coordinate triggers after route switch
    ScrollTrigger.refresh()
  }, [location.pathname])

  // Support ?connect=true query parameter to trigger Connect Modal from external or internal links
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    if (searchParams.get('connect') === 'true') {
      setIsFeedbackOpen(true)
    }
  }, [location.search])

  const handleTabChange = (tabId: string) => {
    if (tabId === 'home') {
      navigate('/')
    } else {
      navigate(`/${tabId}`)
    }
    setIsMobileMenuOpen(false)
  }

  // Modals state
  const [isParticipateOpen, setIsParticipateOpen] = useState(false)
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
  const [isReadMoreOpen, setIsReadMoreOpen] = useState(false)
  const [isPromiseOpen, setIsPromiseOpen] = useState(false)
  const [isEducationOpen, setIsEducationOpen] = useState(false)
  const [isMisconceptionsOpen, setIsMisconceptionsOpen] = useState(false)

  // Ensure the page always starts at top (scrollY = 0) on revisit, reload, or mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual'
      }
      window.scrollTo(0, 0)

      const handleResetScroll = () => {
        window.scrollTo(0, 0)
      }

      window.addEventListener('beforeunload', handleResetScroll)
      window.addEventListener('pagehide', handleResetScroll)
      window.addEventListener('pageshow', handleResetScroll)
      window.addEventListener('load', handleResetScroll)

      return () => {
        window.removeEventListener('beforeunload', handleResetScroll)
        window.removeEventListener('pagehide', handleResetScroll)
        window.removeEventListener('pageshow', handleResetScroll)
        window.removeEventListener('load', handleResetScroll)
      }
    }
  }, [])

  // Welcome Journey animation state on landing:
  // Automatically activates when landing directly on the homepage (both on localhost and GitHub Pages subpath).
  // Child pages (e.g. /about, /care) do not show the journey on direct landing.
  const [isJourneyActive, setIsJourneyActive] = useState(() => {
    return activeTab === 'home'
  })
  const [journeyFrame, setJourneyFrame] = useState<number>(1)
  const [isEnteringFromJourney, setIsEnteringFromJourney] = useState(false)

  const handleLandedAtNavbar = React.useCallback(() => {
    setIsEnteringFromJourney(true)
    if (window.scrollY > 0) {
      window.scrollTo(0, 0)
    }
  }, [])

  const handleJourneyComplete = React.useCallback(() => {
    setIsJourneyActive(false)
    if (window.scrollY > 0) {
      window.scrollTo(0, 0)
    }
    setTimeout(() => {
      setIsEnteringFromJourney(false)
    }, 2000)
  }, [])

  const handleJourneySkip = () => {
    setJourneyFrame(4)
    setIsJourneyActive(false)
    setIsEnteringFromJourney(false)
    window.scrollTo(0, 0)
  }

  // Lock manual scrolling while the cinematic journey is playing
  useEffect(() => {
    if (isJourneyActive && !isEnteringFromJourney) {
      document.body.style.overflow = 'hidden'
      window.scrollTo(0, 0)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isJourneyActive, isEnteringFromJourney])

  return (
    <div className="min-h-screen bg-[#0b0c0e] text-slate-100 flex flex-col relative selection:bg-emerald-500 selection:text-white font-medium">
      {/* Persistent App Shell Background Banner for Home View */}
      {activeTab === 'home' && (
        <div 
          className="absolute top-0 inset-x-0 h-[100dvh] sm:h-[100vh] pointer-events-none z-0 overflow-hidden select-none"
          aria-hidden="true"
        >
          <AnimatePresence initial={false}>
            {isJourneyActive && journeyFrame <= 2 ? (
              <motion.div
                key="bg-silent-crowd"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 w-full h-full overflow-hidden"
              >
                <div
                  className={`w-full h-[calc(100%+35vh)] md:h-full absolute top-0 inset-x-0 will-change-transform z-0 ${
                    journeyFrame === 2 ? 'journey-frame-2-shift' : 'journey-frame-1-shift'
                  }`}
                  style={{
                    transition: journeyFrame === 2 ? 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
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
                initial={{ opacity: 0, filter: 'blur(8px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, transition: { duration: 0.8 } }}
                transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 w-full h-full overflow-hidden"
              >
                <picture className="w-full h-full block">
                  <source
                    media="(max-width: 768px)"
                    srcSet={`${import.meta.env.BASE_URL}banners/Solitary%20Boy%20Amid%20the%20Moving%20Crowd%201%20-%20phone.png`}
                  />
                  <img
                    src={`${import.meta.env.BASE_URL}banners/Solitary%20Boy%20Amid%20the%20Moving%20Crowd%201.jpg`}
                    alt="Solitary Boy Amid the Moving Crowd"
                    className="w-full h-full object-cover object-[48%_25%] md:object-center select-none"
                  />
                </picture>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Gradual blur softening as we move up from the bottom */}
          <div className="block sm:hidden pointer-events-none z-[2]">
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
          <div className="hidden sm:block pointer-events-none z-[2]">
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

          {/* Top-to-bottom subtle gradient overlay on mobile for soft header blending */}
          <div
            className="sm:hidden absolute top-0 inset-x-0 h-36 sm:h-44 pointer-events-none z-[4]"
            style={{
              background: 'linear-gradient(to bottom, #0b0c0e 0%, rgba(11, 12, 14, 0.72) 40%, rgba(11, 12, 14, 0) 100%)',
            }}
          />

          {/* Vertical bottom-to-top linear gradient overlay: Smoothly merges into #0b0c0e on mobile */}
          <div 
            className="sm:hidden absolute inset-0 pointer-events-none z-[3]"
            style={{
              background: 'linear-gradient(to top, #0b0c0e 0%, rgba(11, 12, 14, 0.98) 25%, rgba(11, 12, 14, 0.6) 55%, rgba(11, 12, 14, 0) 100%)',
            }}
          />
          {/* Vertical bottom-to-top linear gradient overlay: Smoothly merges into #0b0c0e on desktop */}
          <div 
            className="hidden sm:block absolute inset-0 pointer-events-none z-[3]"
            style={{
              background: 'linear-gradient(to top, #0b0c0e 0%, rgba(11, 12, 14, 0.96) 28%, rgba(11, 12, 14, 0.52) 58%, rgba(11, 12, 14, 0) 100%)',
            }}
          />
        </div>
      )}

      {/* Welcome Journey Overlay Experience on Initial Landing */}
      {isJourneyActive && (
        <WelcomeJourney
          onComplete={handleJourneyComplete}
          onSkip={handleJourneySkip}
          onLandedAtNavbar={handleLandedAtNavbar}
          onFrameChange={setJourneyFrame}
        />
      )}

      {/* Top Page-level Gradual Blur: dynamically rolls all the way down (100vh) on mobile menu open */}
      {!isJourneyActive && (
        <GradualBlur
          position="top"
          target="page"
          height={isMobileMenuOpen ? '100vh' : '10rem'}
          strength={2.8}
          layers={8}
          curve="linear"
          exponential
          tint="rgba(11, 12, 14, 0.88)"
          autoHide={!isMobileMenuOpen}
          zIndex={isMobileMenuOpen ? 80 : 30}
          style={{
            transition: 'height 0.38s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      )}

      {/* Floating Navbar at z-50: Sits ON TOP of GradualBlur (z-30), staying 100% sharp and unblurred */}
      <Navbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuOpenChange={setIsMobileMenuOpen}
        isJourneyActive={isJourneyActive}
        isEnteringFromJourney={isEnteringFromJourney}
      />

      {/* Main Content Container at relative z-10 */}
      <div
        className={`relative z-10 flex flex-col flex-1 transition-opacity duration-700 ${
          isJourneyActive && !isEnteringFromJourney
            ? 'opacity-0 pointer-events-none invisible'
            : 'opacity-100 pointer-events-auto visible'
        }`}
      >
        {/* Spacing between last card and footer calibrated to exact OuterEdgeGutter + participateButtonHeight */}
        <main className="flex-1 pb-[80px] sm:pb-[88px] lg:pb-[96px]">
          <Routes>
            {/* Home Page */}
            <Route
              path="/"
              element={
                <HomePage
                  onReadMore={() => navigate('/about')}
                  onOpenPromise={() => navigate('/care')}
                  onOpenEducation={() => navigate('/discover')}
                  onOpenMisconceptions={() => navigate('/treatments')}
                  onReplayJourney={() => {
                    setJourneyFrame(1)
                    setIsEnteringFromJourney(false)
                    setIsJourneyActive(true)
                    window.scrollTo(0, 0)
                  }}
                  isEnteringFromJourney={isEnteringFromJourney}
                />
              }
            />
            <Route path="/home" element={<Navigate to="/" replace />} />

            {/* Child Pages (Work In Progress placeholder view with artwork and message) */}
            <Route
              path="/about"
              element={
                <WorkInProgressPage
                  onOpenParticipate={() => setIsParticipateOpen(true)}
                  onOpenFeedback={() => setIsFeedbackOpen(true)}
                />
              }
            />
            <Route
              path="/care"
              element={
                <WorkInProgressPage
                  onOpenParticipate={() => setIsParticipateOpen(true)}
                  onOpenFeedback={() => setIsFeedbackOpen(true)}
                />
              }
            />
            <Route
              path="/patient-portal"
              element={
                <WorkInProgressPage
                  onOpenParticipate={() => setIsParticipateOpen(true)}
                  onOpenFeedback={() => setIsFeedbackOpen(true)}
                />
              }
            />
            <Route
              path="/discover"
              element={
                <WorkInProgressPage
                  onOpenParticipate={() => setIsParticipateOpen(true)}
                  onOpenFeedback={() => setIsFeedbackOpen(true)}
                />
              }
            />
            <Route
              path="/courses"
              element={
                <WorkInProgressPage
                  onOpenParticipate={() => setIsParticipateOpen(true)}
                  onOpenFeedback={() => setIsFeedbackOpen(true)}
                />
              }
            />
            <Route
              path="/treatments"
              element={
                <WorkInProgressPage
                  onOpenParticipate={() => setIsParticipateOpen(true)}
                  onOpenFeedback={() => setIsFeedbackOpen(true)}
                />
              }
            />

            {/* Child Page Nested Subpaths */}
            <Route
              path="/about/*"
              element={
                <WorkInProgressPage
                  onOpenParticipate={() => setIsParticipateOpen(true)}
                  onOpenFeedback={() => setIsFeedbackOpen(true)}
                />
              }
            />
            <Route
              path="/care/*"
              element={
                <WorkInProgressPage
                  onOpenParticipate={() => setIsParticipateOpen(true)}
                  onOpenFeedback={() => setIsFeedbackOpen(true)}
                />
              }
            />
            <Route
              path="/patient-portal/*"
              element={
                <WorkInProgressPage
                  onOpenParticipate={() => setIsParticipateOpen(true)}
                  onOpenFeedback={() => setIsFeedbackOpen(true)}
                />
              }
            />
            <Route
              path="/discover/*"
              element={
                <WorkInProgressPage
                  onOpenParticipate={() => setIsParticipateOpen(true)}
                  onOpenFeedback={() => setIsFeedbackOpen(true)}
                />
              }
            />
            <Route
              path="/courses/*"
              element={
                <WorkInProgressPage
                  onOpenParticipate={() => setIsParticipateOpen(true)}
                  onOpenFeedback={() => setIsFeedbackOpen(true)}
                />
              }
            />
            <Route
              path="/treatments/*"
              element={
                <WorkInProgressPage
                  onOpenParticipate={() => setIsParticipateOpen(true)}
                  onOpenFeedback={() => setIsFeedbackOpen(true)}
                />
              }
            />

            {/* Older Sitemap backward-compatible redirect routes */}
            <Route path="/about-srf" element={<Navigate to="/about" replace />} />
            <Route path="/about-srf/*" element={<Navigate to="/about" replace />} />
            <Route path="/treatment" element={<Navigate to="/treatments" replace />} />
            <Route path="/treatment/*" element={<Navigate to="/treatments" replace />} />
            <Route path="/connect" element={<Navigate to="/?connect=true" replace />} />
            <Route path="/ethics-committee" element={<Navigate to="/about" replace />} />
            <Route path="/ethics-committee/*" element={<Navigate to="/about" replace />} />
            <Route path="/care/notablecases" element={<Navigate to="/care" replace />} />
            <Route path="/events" element={<Navigate to="/about" replace />} />
            <Route path="/events/*" element={<Navigate to="/about" replace />} />

            {/* 404 Error Page for any unrecognized route */}
            <Route
              path="*"
              element={
                <NotFoundPage
                  onOpenFeedback={() => setIsFeedbackOpen(true)}
                />
              }
            />
          </Routes>
        </main>

        {/* Global Footer */}
        <footer id="footer" className="border-t border-white/[0.06] bg-black/40 backdrop-blur-xl py-10 text-xs text-gray-400 font-medium">
          <div className="max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 flex flex-col gap-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-white/[0.06]">
              {/* Brand Branding */}
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 text-gray-300">
                  <SrfLogo className="w-full h-full text-gray-300" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-semibold text-gray-200 text-sm tracking-tight">
                    Spine Research Foundation India
                  </span>
                  <span className="text-[11px] text-gray-400">
                    A registered non-profit medical trust serving underprivileged spinal patients
                  </span>
                </div>
              </div>

              {/* Sitemap Links */}
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsFeedbackOpen(true)}
                  className="text-gray-300 hover:text-emerald-400 transition-colors font-medium cursor-pointer"
                >
                  Write to us
                </button>
                <a
                  href="https://srf-india.org/terms-condition/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-200 transition-colors font-medium"
                >
                  Terms &amp; Conditions
                </a>
                <a
                  href="https://srf-india.org/privacy-policy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-200 transition-colors font-medium"
                >
                  Privacy Policy
                </a>
              </div>

              {/* Social Media Links */}
              <div className="flex items-center gap-3">
                <a
                  href="https://www.facebook.com/SpineFoundationKolkata/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="SRF India Facebook"
                  className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-[#1877F2]/20 border border-white/[0.08] hover:border-[#1877F2]/40 text-gray-400 hover:text-[#1877F2] flex items-center justify-center transition-all hover:scale-105"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://www.youtube.com/@spineresearchfoundation-in6431"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="SRF India YouTube"
                  className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-[#FF0000]/20 border border-white/[0.08] hover:border-[#FF0000]/40 text-gray-400 hover:text-[#FF0000] flex items-center justify-center transition-all hover:scale-105"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/spineresearchfoundation/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="SRF India Instagram"
                  className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-[#E4405F]/20 border border-white/[0.08] hover:border-[#E4405F]/40 text-gray-400 hover:text-[#E4405F] flex items-center justify-center transition-all hover:scale-105"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Bottom Disclaimer & Copyright */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-500">
              <p>
                Spine Research Foundation &bull; Healthcare &bull; Education &bull; Community Outreach
              </p>
              <p>
                &copy; {new Date().getFullYear()} SRF India. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* Bottom Page-level Gradual Blur (renders on both mobile and PC with responsive calibration) */}
      {(!isJourneyActive || isEnteringFromJourney) && (
        <GradualBlur
          position="bottom"
          target="page"
          height={isMobile ? '6.5rem' : '7.5rem'}
          strength={2.5}
          layers={8}
          curve="linear"
          exponential
          tint="rgba(11, 12, 14, 0.7)"
          zIndex={30}
        />
      )}

      {/* Minimal Custom Pill-Shaped Page Scroller */}
      {(!isJourneyActive || isEnteringFromJourney) && <CustomScrollbar />}

      {/* Floating Action Buttons (z-[70]) */}
      {(!isJourneyActive || isEnteringFromJourney) && (
        <FloatingActions
          isParticipateOpen={isParticipateOpen}
          isFeedbackOpen={isFeedbackOpen}
          isEnteringFromJourney={isEnteringFromJourney}
          onOpenParticipate={() => {
            setIsFeedbackOpen(false)
            setIsParticipateOpen(true)
          }}
          onOpenFeedback={() => {
            setIsParticipateOpen(false)
            setIsFeedbackOpen(true)
          }}
          onCloseParticipate={() => setIsParticipateOpen(false)}
          onCloseFeedback={() => setIsFeedbackOpen(false)}
        />
      )}

      {/* Homepage Journey Replay Button (Bottom-Left z-[70]) */}
      {(!isJourneyActive || isEnteringFromJourney) && (activeTab === 'home' || location.pathname === '/') && (
        <JourneyReplayButton
          isEnteringFromJourney={isEnteringFromJourney}
          onReplay={() => {
            setIsEnteringFromJourney(false)
            setIsJourneyActive(true)
            window.scrollTo(0, 0)
          }}
        />
      )}

      {/* Interactive Modals */}
      <ParticipateModal
        isOpen={isParticipateOpen}
        onClose={() => setIsParticipateOpen(false)}
      />

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />

      <ReadMoreModal
        isOpen={isReadMoreOpen}
        onClose={() => setIsReadMoreOpen(false)}
      />

      <PromiseModal
        isOpen={isPromiseOpen}
        onClose={() => setIsPromiseOpen(false)}
      />

      <EducationModal
        isOpen={isEducationOpen}
        onClose={() => setIsEducationOpen(false)}
      />

      <MisconceptionsModal
        isOpen={isMisconceptionsOpen}
        onClose={() => setIsMisconceptionsOpen(false)}
      />
    </div>
  )
}

export default App
