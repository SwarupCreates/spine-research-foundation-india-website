import React, { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import GlassCard from './components/GlassCard'
import EventSection from './components/EventSection'
import PromiseCard from './components/PromiseCard'
import EducationCard from './components/EducationCard'
import TrusteeMessage from './components/TrusteeMessage'
import FloatingActions from './components/FloatingActions'
import CustomScrollbar from './components/CustomScrollbar'
import GradualBlur from './components/GradualBlur'
import {
  ParticipateModal,
  FeedbackModal,
  ReadMoreModal,
  PromiseModal,
  EducationModal,
} from './components/ActionModals'
import { SrfLogo } from './components/icons'

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home')
  const [isParticipateOpen, setIsParticipateOpen] = useState(false)
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
  const [isReadMoreOpen, setIsReadMoreOpen] = useState(false)
  const [isPromiseOpen, setIsPromiseOpen] = useState(false)
  const [isEducationOpen, setIsEducationOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#0b0c0e] text-slate-100 flex flex-col relative selection:bg-emerald-500 selection:text-white font-medium">
      {/* Landing Scroll Level Hero Background Banner */}
      <div 
        className="absolute top-0 left-0 right-0 h-screen pointer-events-none z-0 overflow-hidden"
        aria-hidden="true"
      >
        {/* Background Image */}
        <img
          src={`${import.meta.env.BASE_URL}banners/Solitary Boy Amid the Moving Crowd 1.jpg`}
          alt="Spine Research Foundation India patient banner"
          className="w-full h-full object-cover object-[50%_22%] select-none opacity-90"
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

      {/* Top Page-level Gradual Blur for scrolling content */}
      <GradualBlur
        position="top"
        target="page"
        height="10rem"
        strength={2.8}
        layers={8}
        curve="linear"
        exponential
        tint="rgba(11, 12, 14, 0.82)"
        autoHide
        zIndex={30}
      />

      {/* Floating Navbar at z-50: Sits ON TOP of GradualBlur (z-30), staying 100% sharp and unblurred */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId)}
      />

      {/* Main Content Container at relative z-10: Scrolls on top of the landing background */}
      <div className="relative z-10 flex flex-col flex-1">
        <main className="flex-1 pb-20">
          <Hero />

          {/* Floating Glass Cards with tight, balanced gap */}
          <div className="max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 space-y-4 sm:space-y-5">
            <GlassCard onReadMore={() => setIsReadMoreOpen(true)} />
            <EventSection />
            <PromiseCard onCheckOutMore={() => setIsPromiseOpen(true)} />
            <EducationCard onCheckOutMore={() => setIsEducationOpen(true)} />
          </div>

          {/* Managing Trustee's Message on Base Background */}
          <TrusteeMessage />
        </main>

        {/* Footer */}
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
    </div>
  )
}

export default App
