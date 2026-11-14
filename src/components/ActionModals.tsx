import React, { useState, useEffect } from 'react'
import { MaterialIcon, SrfLogo } from './icons'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export const BaseModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  // Listen to Escape key and lock body scroll while modal is open
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg rounded-3xl bg-[#121317]/95 border border-white/[0.12] backdrop-blur-2xl p-6 sm:p-7 shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08]">
          <h3 id="modal-title" className="text-lg sm:text-xl font-medium text-white tracking-tight">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/[0.05] hover:bg-white/10 text-gray-400 hover:text-white transition cursor-pointer"
            aria-label="Close dialog"
          >
            <MaterialIcon name="close" size={20} />
          </button>
        </div>

        <div className="mt-4 sm:mt-5">{children}</div>
      </div>
    </div>
  )
}

export const ParticipateModal: React.FC<{
  isOpen: boolean
  onClose: () => void
}> = ({ isOpen, onClose }) => {
  const [selectedRole, setSelectedRole] = useState('sponsor')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      onClose()
    }, 2000)
  }

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Participate with SRF India">
      {submitted ? (
        <div className="py-8 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
            <MaterialIcon name="check" size={32} />
          </div>
          <h4 className="text-lg font-medium text-white">Thank You for Reaching Out!</h4>
          <p className="text-sm text-gray-300 font-medium">
            Our medical coordination team will connect with you shortly.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-xs sm:text-sm text-gray-300 font-medium leading-relaxed">
            SRF India is dedicated to providing life-changing spinal care to underprivileged patients. How would you like to participate?
          </p>

          <div className="grid grid-cols-2 gap-2.5">
            {[
              { id: 'sponsor', label: 'Support a Patient', icon: 'favorite' },
              { id: 'volunteer', label: 'Volunteer / Doctor', icon: 'medical_services' },
              { id: 'conference', label: 'Upright 2026', icon: 'calendar_month' },
              { id: 'referral', label: 'Refer a Case', icon: 'assignment' },
            ].map((opt) => (
              <button
                type="button"
                key={opt.id}
                onClick={() => setSelectedRole(opt.id)}
                className={`p-3 sm:p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center gap-2.5 sm:gap-3 ${
                  selectedRole === opt.id
                    ? 'border-emerald-500 bg-emerald-500/15 text-white shadow-[0_0_16px_rgba(16,185,129,0.12)]'
                    : 'border-white/10 bg-white/[0.03] text-gray-300 hover:bg-white/[0.06] hover:border-white/15'
                }`}
              >
                <MaterialIcon
                  name={opt.icon}
                  size={20}
                  filled={selectedRole === opt.id}
                  className={`shrink-0 transition-colors ${
                    selectedRole === opt.id ? 'text-emerald-400' : 'text-gray-400'
                  }`}
                />
                <span className="font-medium leading-snug">{opt.label}</span>
              </button>
            ))}
          </div>

          <div className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Your Full Name
              </label>
              <input
                required
                type="text"
                placeholder="Dr. Rajesh / Priya Sharma"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-gray-500 text-sm font-medium focus:outline-none focus:border-emerald-400 focus:bg-white/[0.07] transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Contact Email or Phone
              </label>
              <input
                required
                type="text"
                placeholder="contact@example.com or +91 ..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-gray-500 text-sm font-medium focus:outline-none focus:border-emerald-400 focus:bg-white/[0.07] transition-all"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-6 rounded-2xl bg-[#1da824] hover:bg-[#189b20] active:scale-[0.99] text-white text-sm font-medium transition-all duration-200 cursor-pointer shadow-lg shadow-green-950/40 flex items-center justify-center gap-2"
            >
              <span>Submit Participation</span>
              <MaterialIcon name="arrow_forward" size={18} />
            </button>
          </div>
        </form>
      )}
    </BaseModal>
  )
}

export const FeedbackModal: React.FC<{
  isOpen: boolean
  onClose: () => void
}> = ({ isOpen, onClose }) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Connect with SRF India">
      <div className="space-y-4">
        <p className="text-xs sm:text-sm text-gray-300 font-medium leading-relaxed">
          Have an inquiry regarding patient treatment, donations, or surgical assistance? Reach our desk directly:
        </p>

        <div className="space-y-3">
          {/* Call Us At */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.14] transition-all flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <MaterialIcon name="call" size={20} />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <span className="text-[11px] font-semibold text-emerald-400 tracking-wider uppercase block">
                Call Us At
              </span>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 pt-0.5">
                <a
                  href="tel:+918335053315"
                  className="text-sm font-medium text-white hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5"
                >
                  <span>(+91) 83350 53315</span>
                </a>
                <span className="hidden sm:inline text-white/20">•</span>
                <a
                  href="tel:+918017015366"
                  className="text-sm font-medium text-white hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5"
                >
                  <span>(+91) 80170 15366</span>
                </a>
              </div>
            </div>
          </div>

          {/* Mail Us At */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.14] transition-all flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <MaterialIcon name="mail" size={20} />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <span className="text-[11px] font-semibold text-emerald-400 tracking-wider uppercase block">
                Mail Us At
              </span>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 pt-0.5">
                <a
                  href="mailto:sb@srf-india.org"
                  className="text-sm font-medium text-white hover:text-emerald-400 transition-colors truncate"
                >
                  sb@srf-india.org
                </a>
                <span className="hidden sm:inline text-white/20">•</span>
                <a
                  href="mailto:srfindia.org@gmail.com"
                  className="text-sm font-medium text-white hover:text-emerald-400 transition-colors truncate"
                >
                  srfindia.org@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Where to Find Us? */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.14] transition-all flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <MaterialIcon name="location_on" size={20} />
            </div>
            <div className="flex-1 min-w-0 space-y-0.5">
              <span className="text-[11px] font-semibold text-emerald-400 tracking-wider uppercase block">
                Where to Find Us?
              </span>
              <p className="text-sm font-medium text-white pt-0.5">
                Kolkata, India
              </p>
              <p className="text-xs text-gray-400 font-medium">
                Registered Medical Trust &amp; Healthcare Foundation
              </p>
            </div>
          </div>
        </div>
      </div>
    </BaseModal>
  )
}

export const ReadMoreModal: React.FC<{
  isOpen: boolean
  onClose: () => void
}> = ({ isOpen, onClose }) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="About Spine Research Foundation India">
      <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1 no-scrollbar">
        <div className="flex items-center gap-3 pb-3 border-b border-white/[0.08]">
          <div className="w-10 h-10 text-white flex-shrink-0">
            <SrfLogo className="w-full h-full text-white" />
          </div>
          <div>
            <h4 className="text-base font-medium text-white">Non-Profit Medical Foundation</h4>
            <p className="text-xs text-gray-400 font-medium">Established to bridge advanced healthcare and underserved communities</p>
          </div>
        </div>

        <p className="text-sm text-gray-300 font-medium leading-relaxed">
          Spine Research Foundation India (SRF India) is a premier philanthropic healthcare organisation dedicated to treating severe spine disorders, scoliosis deformities, and complex orthopedic conditions for individuals and children who lack financial access.
        </p>

        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md space-y-2">
          <h5 className="text-sm font-medium text-emerald-400 flex items-center gap-1.5">
            <MaterialIcon name="verified" size={18} filled />
            <span className="font-medium">Key Pillars</span>
          </h5>
          <ul className="text-xs sm:text-sm text-gray-300 font-medium space-y-1.5 list-disc list-inside">
            <li>Subsidized &amp; pro-bono corrective pediatric spine surgeries</li>
            <li>Advanced clinical research in deformity correction</li>
            <li>Global surgeon fellowship programs &amp; training</li>
            <li>Comprehensive post-operative physical rehabilitation</li>
          </ul>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-medium transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </BaseModal>
  )
}

export const PromiseModal: React.FC<{
  isOpen: boolean
  onClose: () => void
}> = ({ isOpen, onClose }) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Our Humanitarian Promise">
      <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1 no-scrollbar">
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-start gap-3">
          <MaterialIcon name="volunteer_activism" size={24} className="shrink-0 mt-0.5 text-emerald-400" />
          <p className="text-sm font-medium leading-relaxed">
            &ldquo;We care for people at the lowest points in their lives, and we do it no matter who they are, where they&apos;re from, or whether or not they can pay.&rdquo;
          </p>
        </div>

        <p className="text-sm text-gray-300 font-medium leading-relaxed">
          Founded under the clinical leadership of Dr. Saumyajit Basu, the Spine Research Foundation (SRF India) operates as a registered non-profit medical trust. We believe that world-class spine health care and mobility must be accessible to all, irrespective of socio-economic status.
        </p>

        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md space-y-2">
          <h5 className="text-sm font-medium text-emerald-400 flex items-center gap-1.5">
            <MaterialIcon name="verified" size={18} filled />
            <span className="font-medium">Core Commitments</span>
          </h5>
          <ul className="text-xs sm:text-sm text-gray-300 font-medium space-y-1.5 list-disc list-inside">
            <li>100% subsidized &amp; philanthropic complex spine surgeries for underprivileged families</li>
            <li>Pediatric scoliosis correction &amp; deformity rehabilitation</li>
            <li>Evidence-based clinical research and surgeon fellowship training</li>
            <li>Rural screening camps &amp; rapid emergency trauma support</li>
          </ul>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-medium transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </BaseModal>
  )
}

export const EducationModal: React.FC<{
  isOpen: boolean
  onClose: () => void
}> = ({ isOpen, onClose }) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Education & Research Endeavours">
      <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1 no-scrollbar">
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-start gap-3">
          <MaterialIcon name="school" size={24} className="shrink-0 mt-0.5 text-emerald-400" />
          <p className="text-sm font-medium leading-relaxed">
            &ldquo;We strive everyday to open up new avenues in spine surgery and impact future spine surgeons through our mentorship and guidance.&rdquo;
          </p>
        </div>

        <p className="text-sm text-gray-300 font-medium leading-relaxed">
          Through comprehensive fellowship training and clinical immersion, SRF India prepares the next generation of spine specialists to tackle the most demanding orthopedic and spinal pathologies.
        </p>

        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md space-y-2">
          <h5 className="text-sm font-medium text-emerald-400 flex items-center gap-1.5">
            <MaterialIcon name="verified" size={18} filled />
            <span className="font-medium">Academic Programs</span>
          </h5>
          <ul className="text-xs sm:text-sm text-gray-300 font-medium space-y-1.5 list-disc list-inside">
            <li>Post-doctoral spine surgery fellowship training</li>
            <li>Hands-on cadaveric workshops &amp; live surgical telecasts</li>
            <li>Peer-reviewed research published in premier global journals</li>
            <li>International observer programs with visiting spine faculties</li>
          </ul>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-medium transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </BaseModal>
  )
}

export const MisconceptionsModal: React.FC<{
  isOpen: boolean
  onClose: () => void
}> = ({ isOpen, onClose }) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Debunking Spine Surgery Myths">
      <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1 no-scrollbar">
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-start gap-3">
          <MaterialIcon name="fact_check" size={24} className="shrink-0 mt-0.5 text-emerald-400" />
          <p className="text-sm font-medium leading-relaxed">
            &ldquo;Getting authentic information for your illness is difficult. The SRF team urges you to not fall prey to wrong ideas and notions of spine surgery.&rdquo;
          </p>
        </div>

        <p className="text-sm text-gray-300 font-medium leading-relaxed">
          Spine surgery in modern times has evolved with microscopic, endoscopic, and navigation-guided precision. Misconceptions about permanent paralysis or prolonged immobility often delay essential intervention when timely care could offer complete recovery.
        </p>

        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md space-y-2">
          <h5 className="text-sm font-medium text-emerald-400 flex items-center gap-1.5">
            <MaterialIcon name="verified" size={18} filled />
            <span className="font-medium">Common Myths vs. Scientific Reality</span>
          </h5>
          <ul className="text-xs sm:text-sm text-gray-300 font-medium space-y-2 list-disc list-inside">
            <li><strong className="text-white">Myth:</strong> Spine surgery leaves you bedridden forever.<br /><span className="text-emerald-400/90 pl-4 block text-xs">Reality: Most patients walk within 24–48 hours post-op.</span></li>
            <li><strong className="text-white">Myth:</strong> Every back ache requires an operation.<br /><span className="text-emerald-400/90 pl-4 block text-xs">Reality: Over 90% of spinal conditions are managed non-surgically.</span></li>
            <li><strong className="text-white">Myth:</strong> Spine surgeries always fail.<br /><span className="text-emerald-400/90 pl-4 block text-xs">Reality: Modern techniques achieve high success and long-term relief.</span></li>
          </ul>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-medium transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </BaseModal>
  )
}
