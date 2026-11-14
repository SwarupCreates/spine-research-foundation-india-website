import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
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
import { HomePage, WorkInProgressPage, NotFoundPage } from './pages'

export const App: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()

  // Match current active tab from pathname
  const pathSegment = location.pathname.replace(/^\//, '').split('/')[0].toLowerCase()
  const activeTab = pathSegment ? pathSegment : 'home'

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Automatically close mobile menu and scroll to top upon navigating
  useEffect(() => {
    setIsMobileMenuOpen(false)
    window.scrollTo(0, 0)
  }, [location.pathname])

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

  return (
    <div className="min-h-screen bg-[#0b0c0e] text-slate-100 flex flex-col relative selection:bg-emerald-500 selection:text-white font-medium">
      {/* Top Page-level Gradual Blur: dynamically rolls all the way down (100vh) on mobile menu open */}
      <GradualBlur
        position="top"
        target="page"
        height={isMobileMenuOpen ? '100vh' : '10rem'}
        strength={isMobileMenuOpen ? 4.5 : 2.8}
        layers={8}
        curve="linear"
        exponential
        tint={isMobileMenuOpen ? 'rgba(11, 12, 14, 0.94)' : 'rgba(11, 12, 14, 0.82)'}
        autoHide={!isMobileMenuOpen}
        zIndex={30}
        style={{
          transition: 'height 0.38s cubic-bezier(0.16, 1, 0.3, 1), background 0.38s ease',
        }}
      />

      {/* Floating Navbar at z-50: Sits ON TOP of GradualBlur (z-30), staying 100% sharp and unblurred */}
      <Navbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuOpenChange={setIsMobileMenuOpen}
      />

      {/* Main Content Container at relative z-10 */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* Spacing between last card and footer calibrated to exact OuterEdgeGutter + participateButtonHeight */}
        <main className="flex-1 pb-[80px] sm:pb-[88px] lg:pb-[96px]">
          <Routes>
            {/* Home Page */}
            <Route
              path="/"
              element={
                <HomePage
                  onReadMore={() => setIsReadMoreOpen(true)}
                  onOpenPromise={() => setIsPromiseOpen(true)}
                  onOpenEducation={() => setIsEducationOpen(true)}
                  onOpenMisconceptions={() => setIsMisconceptionsOpen(true)}
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
        <footer className="border-t border-white/[0.06] bg-black/40 backdrop-blur-xl py-8 text-center text-xs text-gray-400 font-medium">
          <div className="max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 text-gray-300">
                <SrfLogo className="w-full h-full text-gray-300" />
              </div>
              <span className="font-medium text-gray-300">
                Spine Research Foundation India
              </span>
            </div>
            <p className="text-gray-400 font-medium">
              A registered non-profit medical trust serving underprivileged spinal patients.
            </p>
            <p className="text-gray-400 font-medium">
              &copy; {new Date().getFullYear()} SRF India. All rights reserved.
            </p>
          </div>
        </footer>
      </div>

      {/* Bottom Page-level Gradual Blur */}
      <GradualBlur
        position="bottom"
        target="page"
        height="7.5rem"
        strength={2.5}
        layers={8}
        curve="linear"
        exponential
        tint="rgba(11, 12, 14, 0.7)"
        autoHide
        zIndex={30}
      />

      {/* Minimal Custom Pill-Shaped Page Scroller */}
      <CustomScrollbar />

      {/* Floating Action Buttons (z-50) */}
      <FloatingActions
        onOpenParticipate={() => setIsParticipateOpen(true)}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
      />

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
