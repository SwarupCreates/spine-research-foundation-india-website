import React, { useState } from 'react'
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
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg rounded-3xl bg-[#121317]/90 border border-white/[0.12] backdrop-blur-2xl p-6 sm:p-8 shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <h3 id="modal-title" className="text-xl font-medium text-white">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition cursor-pointer"
            aria-label="Close dialog"
          >
            <MaterialIcon name="close" size={22} />
          </button>
        </div>

        <div className="mt-4">{children}</div>
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
          <p className="text-sm text-gray-300 font-medium">
            SRF India is dedicated to providing life-changing spinal care to underprivileged patients. How would you like to participate?
          </p>

          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'sponsor', label: 'Support a Patient', icon: 'favorite' },
              { id: 'volunteer', label: 'Volunteer / Doctor', icon: 'medical_services' },
              { id: 'conference', label: 'Upright 2026', icon: 'event' },
              { id: 'referral', label: 'Refer a Case', icon: 'badge' },
            ].map((opt) => (
              <button
                type="button"
                key={opt.id}
                onClick={() => setSelectedRole(opt.id)}
                className={`p-3 rounded-2xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer flex flex-col gap-1.5 ${
                  selectedRole === opt.id
                    ? 'border-emerald-500 bg-emerald-500/15 text-white'
                    : 'border-white/10 bg-white/[0.03] text-gray-300 hover:bg-white/[0.07]'
                }`}
              >
                <MaterialIcon
                  name={opt.icon}
                  size={20}
                  filled={selectedRole === opt.id}
                  className={selectedRole === opt.id ? 'text-emerald-400' : 'text-gray-400'}
                />
                <span className="font-medium">{opt.label}</span>
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Your Full Name
              </label>
              <input
                required
                type="text"
                placeholder="Dr. Rajesh / Priya Sharma"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-gray-500 text-sm font-medium focus:outline-none focus:border-emerald-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Contact Email or Phone
              </label>
              <input
                required
                type="text"
                placeholder="contact@example.com or +91 ..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-gray-500 text-sm font-medium focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-[#1da824] hover:bg-[#189b20] text-white text-sm font-medium transition cursor-pointer shadow-lg shadow-green-950/50"
            >
              Submit
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
        <p className="text-sm text-gray-300 font-medium">
          Have an inquiry regarding patient treatment, donations, or surgical assistance?
        </p>

        <div className="space-y-2.5 text-sm">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
            <MaterialIcon name="call" size={20} className="text-emerald-400" />
            <div>
              <p className="font-medium text-white">Helpline</p>
              <p className="text-xs text-gray-400 font-medium">+91 (0) 44 2829 0000 / Emergency Spine Desk</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
            <MaterialIcon name="mail" size={20} className="text-emerald-400" />
            <div>
              <p className="font-medium text-white">Email Care Desk</p>
              <p className="text-xs text-gray-400 font-medium">help@srfindia.org</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
            <MaterialIcon name="schedule" size={20} className="text-emerald-400" />
            <div>
              <p className="font-medium text-white">Clinic Hours</p>
              <p className="text-xs text-gray-400 font-medium">Monday &ndash; Saturday, 9:00 AM &ndash; 6:00 PM IST</p>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition cursor-pointer"
          >
            Close
          </button>
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
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
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
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition cursor-pointer"
          >
            Done
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
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
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
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </BaseModal>
  )
}
