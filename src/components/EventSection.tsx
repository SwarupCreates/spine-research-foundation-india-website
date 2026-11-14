import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { MaterialIcon } from './icons'

export const EventSection: React.FC = () => {
  const [isPlayingInline, setIsPlayingInline] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

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
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&enablejsapi=1&rel=0&modestbranding=1`

  const handlePauseAndCollapse = () => {
    try {
      iframeRef.current?.contentWindow?.postMessage(
        '{"event":"command","func":"pauseVideo","args":""}',
        '*'
      )
    } catch {
      // Ignore cross-origin limitations
    }
    setIsPlayingInline(false)
  }

  const layoutTransition = {
    duration: 0.65,
    ease: [0.16, 1, 0.3, 1] as const,
  }

  return (
    <>
      <motion.div 
        layout
        transition={{ layout: layoutTransition }}
        className="relative rounded-3xl sm:rounded-[32px] overflow-hidden glass-panel border border-white/[0.08] p-6 sm:p-8 md:p-10 shadow-xl transition-colors duration-300 hover:border-white/[0.14]"
      >
        <motion.div 
          layout
          transition={{ layout: layoutTransition }}
          className={
            isPlayingInline
              ? 'flex flex-col gap-6 sm:gap-8'
              : 'grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center'
          }
        >
          {/* Media / Video Preview - Smoothly morphs from left 5-col to top 12-col full width */}
          <motion.div 
            layout
            transition={{ layout: layoutTransition }}
            className={isPlayingInline ? 'w-full' : 'lg:col-span-5 w-full'}
          >
            <div 
              className={`group relative w-full aspect-video rounded-2xl ${
                isPlayingInline ? 'sm:rounded-[28px] max-h-[580px]' : ''
              } bg-black overflow-hidden border border-white/[0.08] shadow-2xl transition-all duration-300 hover:border-white/[0.18]`}
            >
              {isPlayingInline ? (
                <div className="relative w-full h-full">
                  <iframe
                    ref={iframeRef}
                    src={embedUrl}
                    title="Cervical Disc Replacement Surgery - Dr. Saumyajit Basu"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full border-0 rounded-2xl sm:rounded-[28px]"
                  />

                  {/* Floating Top-Right Controls: Pause & Collapse, Cinema Mode */}
                  <div className="absolute top-3.5 right-3.5 z-20 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePauseAndCollapse}
                      title="Pause and return video to compact left layout"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/75 hover:bg-black/90 backdrop-blur-md border border-white/20 hover:border-emerald-400 text-white font-medium text-xs shadow-xl transition-all hover:scale-105 cursor-pointer"
                    >
                      <MaterialIcon name="pause" size={16} className="text-emerald-400" />
                      <span>Pause &amp; Collapse</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      title="Watch in Cinema Mode"
                      className="w-8 h-8 rounded-full bg-black/75 hover:bg-black/90 backdrop-blur-md border border-white/20 hover:border-white/40 text-white flex items-center justify-center transition-all hover:scale-105 cursor-pointer shadow-xl"
                    >
                      <MaterialIcon name="open_in_full" size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => setIsPlayingInline(true)}
                  className="relative w-full h-full cursor-pointer overflow-hidden flex items-center justify-center select-none"
                >
                  {/* High Quality 16:9 YouTube Thumbnail - Edge to Edge */}
                  <img
                    src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                    alt="Cervical Disc Replacement Surgery by Dr. Saumyajit Basu"
                    className="w-full h-full object-cover object-center filter brightness-95 group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />

                  {/* Soft Vignette Overlay */}
                  <div 
                    className="absolute inset-0 bg-black/20 group-hover:bg-black/35 transition-colors pointer-events-none"
                    aria-hidden="true" 
                  />

                  {/* Expand Modal Trigger Icon in Top Right */}
                  <button
                    type="button"
                    title="Watch in Cinema Mode"
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsModalOpen(true)
                    }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white/80 hover:text-white flex items-center justify-center transition-all hover:scale-110 cursor-pointer shadow-md z-10"
                  >
                    <MaterialIcon name="open_in_full" size={16} />
                  </button>

                  {/* Perfectly Circular Centered Play Button with Glassmorphism Blur */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full aspect-square shrink-0 bg-black/40 group-hover:bg-black/60 backdrop-blur-md border border-white/25 group-hover:border-white/50 flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                      <MaterialIcon
                        name="play_arrow"
                        size={36}
                        className="text-white ml-0.5 fill-on-group-hover transition-transform group-hover:scale-105"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Text Content - Smoothly slides down when video expands to top */}
          <motion.div 
            layout
            transition={{ layout: layoutTransition }}
            className={isPlayingInline ? 'w-full space-y-4' : 'lg:col-span-7 space-y-3.5'}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-medium backdrop-blur-md">
              <MaterialIcon name="medical_services" size={16} />
              <span>Clinical Excellence Series</span>
            </div>

            <h3 className="text-2xl sm:text-3xl lg:text-[var(--font-size-card-title,28px)] font-medium text-white tracking-tight leading-snug">
              Cervical Disc Replacement Surgery
            </h3>

            <p className="text-gray-300 text-sm sm:text-base lg:text-[var(--font-size-card-body,16px)] font-medium leading-relaxed">
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

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              {isPlayingInline ? (
                <button
                  type="button"
                  onClick={handlePauseAndCollapse}
                  className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm border border-white/15 transition-all duration-300 backdrop-blur-md shadow-md hover:scale-[1.02] cursor-pointer"
                >
                  <MaterialIcon name="pause" size={18} className="text-emerald-400" />
                  <span>Pause &amp; Collapse View</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsPlayingInline(true)}
                  className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-medium text-xs sm:text-sm border border-emerald-500/30 transition-all duration-300 backdrop-blur-md shadow-md hover:scale-[1.02] cursor-pointer"
                >
                  <MaterialIcon name="play_arrow" size={18} className="text-emerald-400" />
                  <span>Play Video</span>
                </button>
              )}

              {/* Watch in Cinema Mode */}
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm border border-white/15 transition-all duration-300 backdrop-blur-md shadow-md hover:scale-[1.02] cursor-pointer"
              >
                <MaterialIcon name="fullscreen" size={18} />
                <span>Cinema Mode</span>
              </button>

              {/* View on YouTube with Official YouTube SVG Logo and Red Glow Hover */}
              <a
                href="https://www.youtube.com/watch?v=MXwTXBckIQM"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-[#FF0000] text-white hover:text-white font-medium text-xs sm:text-sm border border-white/15 hover:border-[#FF0000] transition-all duration-300 backdrop-blur-md shadow-md hover:shadow-[0_0_24px_rgba(255,0,0,0.65)] hover:scale-[1.02] cursor-pointer"
              >
                <svg 
                  className="w-4 h-4 fill-white shrink-0 transition-transform duration-200 group-hover:scale-110" 
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                <span>View on YouTube</span>
              </a>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

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
                className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-[#FF0000] text-white font-medium border border-white/15 hover:border-[#FF0000] transition-all hover:shadow-[0_0_20px_rgba(255,0,0,0.6)] shrink-0"
              >
                <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
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
