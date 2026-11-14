import React, { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import GlassCard from './components/GlassCard'
import EventSection from './components/EventSection'
import FloatingActions from './components/FloatingActions'
import GradualBlur from './components/GradualBlur'
import {
  ParticipateModal,
  FeedbackModal,
  ReadMoreModal,
} from './components/ActionModals'
import { SrfLogo } from './components/icons'

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home')
  const [isParticipateOpen, setIsParticipateOpen] = useState(false)
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
  const [isReadMoreOpen, setIsReadMoreOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#0b0c0e] text-slate-100 flex flex-col relative selection:bg-emerald-500 selection:text-white font-medium">
      {/* Top Gradual Blur with inward translating motion & dynamic scroll reveal */}
      <GradualBlur
        position="top"
        target="page"
        height="8.5rem"
        strength={3.5}
        layers={8}
        curve="bezier"
        exponential={false}
        tint="transparent"
        autoHide
        zIndex={30}
        className="gradual-blur-in-top"
      />

      {/* Main App Container */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* Navigation Bar (Clear, no bg, no border, no blur) */}
        <Navbar
          activeTab={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId)}
        />

        {/* Main Body */}
        <main className="flex-1 pb-20">
          <Hero />

          <GlassCard onReadMore={() => setIsReadMoreOpen(true)} />

          <EventSection />
        </main>

        {/* Footer */}
        <footer className="border-t border-white/[0.06] bg-black/40 backdrop-blur-xl py-8 text-center text-xs text-gray-400 font-medium">
          <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
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

      {/* Bottom Gradual Blur with inward translating motion & dynamic scroll reveal */}
      <GradualBlur
        position="bottom"
        target="page"
        height="8rem"
        strength={3.5}
        layers={8}
        curve="bezier"
        exponential={false}
        tint="transparent"
        autoHide
        zIndex={30}
        className="gradual-blur-in-bottom"
      />

      {/* Floating Action Buttons */}
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
    </div>
  )
}

export default App
