import React, { useState, useEffect } from 'react'
import { MaterialIcon } from './icons'

export const EventSection: React.FC = () => {
  const [isPlayingInline, setIsPlayingInline] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Listen to Escape key to close full-screen modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false)
      }
    }
    if (isModalOpen) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isModalOpen])

  const videoId = 'MXwTXBckIQM'
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`

  return (
    <>
      <div className="relative rounded-3xl sm:rounded-[32px] overflow-hidden glass-panel border border-white/[0.08] p-6 sm:p-8 md:p-10 shadow-xl transition duration-300 hover:border-white/[0.14]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Media / Video Preview */}
          <div className="lg:col-span-5 w-full">
            <div className="group relative aspect-video rounded-2xl bg-black/50 border border-white/[0.08] overflow-hidden shadow-2xl transition hover:border-white/[0.18]">
              {isPlayingInline ? (
                <iframe
                  src={embedUrl}
                  title="Cervical Disc Replacement Surgery - Dr. Saumyajit Basu"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full rounded-2xl border-0"
                />
              ) : (
                <div 
                  onClick={() => setIsPlayingInline(true)}
                  className="relative w-full h-full cursor-pointer overflow-hidden flex items-center justify-center"
                >
                  {/* High Quality YouTube Thumbnail */}
                  <img
                    src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                    alt="Cervical Disc Replacement Surgery by Dr. Saumyajit Basu"
                    className="w-full h-full object-cover object-center filter brightness-90 group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />

                  {/* Gradient Glass Overlay */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20 group-hover:from-black/70 transition-colors"
                    aria-hidden="true" 
                  />

                  {/* Status Pill */}
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs text-gray-200 font-medium flex items-center gap-1.5 shadow-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Featured Video</span>
                  </div>

                  {/* Expand Modal Trigger Icon Button */}
                  <button
                    type="button"
                    title="Watch in Cinema Mode"
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsModalOpen(true)
                    }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white flex items-center justify-center transition-all hover:scale-110 cursor-pointer shadow-md"
                  >
                    <MaterialIcon name="open_in_full" size={16} />
                  </button>

                  {/* Center Play Button with Soft Glassmorphic Halo */}
                  <div className="relative z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/15 group-hover:bg-emerald-500/80 backdrop-blur-md border border-white/30 flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110 shadow-2xl group-hover:border-emerald-400">
                    <MaterialIcon
                      name="play_arrow"
                      size={32}
                      filled
                      className="text-white ml-1 transition-transform group-hover:scale-110"
                    />
                  </div>

                  {/* Duration / Caption Pill at Bottom */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] sm:text-xs text-gray-300">
                    <span className="font-medium bg-black/50 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10">
                      Dr. Saumyajit Basu &middot; SRF India
                    </span>
                    <span className="bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 font-mono">
                      Full Surgical Case
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:col-span-7 space-y-3.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-medium backdrop-blur-md">
              <MaterialIcon name="medical_services" size={16} />
              <span>Clinical Excellence Series</span>
            </div>

            <h3 className="text-2xl sm:text-3xl lg:text-[var(--font-size-card-title,28px)] font-medium text-white tracking-tight leading-snug">
              Cervical Disc Replacement Surgery
            </h3>

            <p className="text-gray-300 text-sm sm:text-base md:text-[var(--font-size-card-body,16px)] font-medium leading-relaxed">
              An insightful surgical walkthrough by renowned spine specialist Dr. Saumyajit Basu,
              demonstrating advanced cervical artificial disc replacement (ADR). This motion-preserving
              procedure alleviates neural compression while maintaining natural neck kinematics.
            </p>

            {/* Feature Bullets */}
            <div className="pt-1 flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-300">
              <div className="flex items-center gap-1.5 bg-white/[0.03] px-3 py-1 rounded-full border border-white/[0.06]">
                <MaterialIcon name="check_circle" size={16} className="text-emerald-400" />
                <span>Motion Preservation</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/[0.03] px-3 py-1 rounded-full border border-white/[0.06]">
                <MaterialIcon name="verified_user" size={16} className="text-emerald-400" />
                <span>Minimally Invasive</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/[0.03] px-3 py-1 rounded-full border border-white/[0.06]">
                <MaterialIcon name="smart_display" size={16} className="text-emerald-400" />
                <span>SRF Case Study</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm border border-white/15 transition-all duration-200 backdrop-blur-md shadow-md hover:scale-[1.02] cursor-pointer"
              >
                <MaterialIcon name="fullscreen" size={18} />
                <span>Watch in Cinema Mode</span>
              </button>

              <a
                href="https://www.youtube.com/watch?v=MXwTXBckIQM"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-gray-400 hover:text-white font-medium text-xs sm:text-sm hover:bg-white/5 transition-colors"
              >
                <span>View on YouTube</span>
                <MaterialIcon name="open_in_new" size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Full-Screen Glassmorphism Cinema Modal */}
      {isModalOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-black/85 backdrop-blur-2xl animate-fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl rounded-3xl glass-panel border border-white/15 shadow-2xl bg-[#0e0f14]/90 overflow-hidden flex flex-col"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <div>
                  <h4 className="text-white font-medium text-base sm:text-lg">
                    Cervical Disc Replacement Surgery
                  </h4>
                  <p className="text-gray-400 text-xs font-medium">
                    Dr. Saumyajit Basu &middot; Spine Research Foundation India
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center transition-all cursor-pointer"
                title="Close"
              >
                <MaterialIcon name="close" size={20} />
              </button>
            </div>

            {/* Large 16:9 Video Player */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                title="Cervical Disc Replacement Surgery - Dr. Saumyajit Basu"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            {/* Modal Footer / Description */}
            <div className="px-6 py-4 bg-white/[0.02] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-gray-300">
              <p className="max-w-2xl leading-relaxed">
                Watch the complete demonstration of arthroplasty techniques preserving spinal movement
                and enabling rapid rehabilitation.
              </p>

              <a
                href="https://www.youtube.com/watch?v=MXwTXBckIQM"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-gray-950 font-medium hover:bg-gray-100 transition-colors shrink-0"
              >
                <MaterialIcon name="smart_display" size={16} />
                <span>Open in YouTube</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default EventSection
