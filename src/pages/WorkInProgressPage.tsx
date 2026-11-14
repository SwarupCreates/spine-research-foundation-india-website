import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { WorkInProgressArt, MaterialIcon } from '../components/icons'

interface WorkInProgressPageProps {
  sectionTitle?: string
  sectionSubtitle?: string
  onOpenParticipate?: () => void
  onOpenFeedback?: () => void
}

const SECTION_CONFIG: Record<string, { title: string; subtitle: string; description: string }> = {
  about: {
    title: 'About Us',
    subtitle: 'Our Mission, Medical Trustees & Heritage',
    description: 'We are currently compiling comprehensive insights into the Spine Research Foundation India, our founding vision under Dr. Saumyajit Basu, our medical trustees, and two decades of humanitarian spine care across India.',
  },
  care: {
    title: 'Care At SRF',
    subtitle: 'Compassionate Patient Care & Humanitarian Surgeries',
    description: 'Detailed information regarding our subsidized and pro-bono surgical programs, patient assistance workflows, post-operative care, and partner hospital networks is being prepared.',
  },
  'patient-portal': {
    title: 'Patient Portal',
    subtitle: 'Teleconsultation, Records & Recovery Guidance',
    description: 'Our digital patient records system, appointment scheduling, teleconsultation services, and specialized recovery tracking portal is currently in active development.',
  },
  discover: {
    title: 'Discover',
    subtitle: 'Spine Health Knowledge & Public Education',
    description: 'An interactive repository of patient guides, spinal deformity awareness campaigns, interactive anatomy walkthroughs, and preventative spine health literature will be available here soon.',
  },
  courses: {
    title: 'Courses & Fellowships',
    subtitle: 'Surgical Training & Academic Excellence',
    description: 'Curricula for our competitive spine fellowships, clinical observerships, short surgical seminars, and CME workshops for orthopedic and neuro-spine specialists are being finalized.',
  },
  treatments: {
    title: 'Treatments & Procedures',
    subtitle: 'Advanced Spinal Interventions & Clinical Protocols',
    description: 'Comprehensive clinical guides to cervical disc replacements, scoliosis and deformity corrections, minimally invasive spine surgery (MISS), and rehabilitation pathways are being curated.',
  },
}

export const WorkInProgressPage: React.FC<WorkInProgressPageProps> = ({
  sectionTitle,
  sectionSubtitle,
  onOpenParticipate,
  onOpenFeedback,
}) => {
  const navigate = useNavigate()
  const location = useLocation()

  const pathKey = location.pathname.replace(/^\//, '').split('/')[0].toLowerCase()
  const matched = SECTION_CONFIG[pathKey]

  const title = sectionTitle || matched?.title || (pathKey ? pathKey.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Page Under Construction')
  const subtitle = sectionSubtitle || matched?.subtitle || 'Work In Progress · Under Active Development'
  const description = matched?.description || 'We are actively crafting this space with authentic clinical resources, patient education, and foundation initiatives. Check back soon or return to our homepage.'

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="relative w-full max-w-3xl mx-auto text-center">
        {/* Soft atmospheric ambient glow centered behind the floating artwork */}
        <div 
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[480px] h-96 sm:h-[480px] rounded-full pointer-events-none -z-10 blur-3xl opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.35) 0%, rgba(27, 154, 247, 0.15) 50%, transparent 75%)',
          }}
          aria-hidden="true"
        />

        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-medium backdrop-blur-md mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="tracking-wide uppercase text-[11px] sm:text-xs font-semibold">Under Construction</span>
        </div>

        {/* Work In Progress Artwork: Enhanced size matching 404 page */}
        <div className="flex justify-center mb-6 relative">
          <div className="h-44 sm:h-52 md:h-56 max-w-full flex items-center justify-center filter drop-shadow-[0_16px_32px_rgba(0,0,0,0.6)]">
            <WorkInProgressArt className="h-full w-auto max-h-full" />
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-tight mb-2 font-sans">
          {title}
        </h1>
        <p className="text-emerald-400 font-medium text-xs sm:text-sm mb-4 tracking-wider uppercase">
          {subtitle}
        </p>
        <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-8">
          {description}
        </p>

        {/* Navigation Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs sm:text-sm transition-all duration-300 shadow-lg shadow-emerald-950/50 hover:scale-[1.02] cursor-pointer"
          >
            <MaterialIcon name="family_home" size={18} />
            <span>Return to Home</span>
          </button>

          {onOpenParticipate && (
            <button
              type="button"
              onClick={onOpenParticipate}
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm border border-white/15 transition-all duration-300 backdrop-blur-md hover:scale-[1.02] cursor-pointer"
            >
              <MaterialIcon name="volunteer_activism" size={18} />
              <span>Get Involved</span>
            </button>
          )}

          {onOpenFeedback && (
            <button
              type="button"
              onClick={onOpenFeedback}
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-gray-300 hover:text-white font-medium text-xs sm:text-sm border border-white/[0.08] transition-all duration-300 backdrop-blur-md cursor-pointer"
            >
              <MaterialIcon name="rate_review" size={18} />
              <span>Send Feedback</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default WorkInProgressPage
