import React, { useState } from 'react'
import { MaterialIcon } from './icons'

export const EventSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <section className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-6 sm:py-10">
      <div className="relative rounded-3xl sm:rounded-[32px] overflow-hidden glass-panel backdrop-blur-2xl bg-[#131417]/55 border border-white/[0.08] p-6 sm:p-8 md:p-10 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Media / Video Preview */}
          <div className="lg:col-span-5 w-full">
            <div 
              onClick={() => setIsPlaying(!isPlaying)}
              className="group relative aspect-video sm:aspect-[16/10] rounded-2xl bg-gradient-to-tr from-black/60 via-[#14151a]/50 to-[#1e2029]/40 backdrop-blur-xl border border-white/[0.08] overflow-hidden flex items-center justify-center cursor-pointer shadow-inner transition hover:border-white/[0.18]"
            >
              {/* Subtle background ambient graphic */}
              <div 
                className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.25)_0%,transparent_70%)]" 
                aria-hidden="true" 
              />
              
              {/* Play Button Indicator */}
              <div className="relative z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/10 group-hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110 shadow-xl">
                <MaterialIcon
                  name={isPlaying ? 'pause' : 'play_arrow'}
                  size={32}
                  filled
                  className="text-white ml-0.5"
                />
              </div>

              {/* Status pill on video */}
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs text-gray-300 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-medium">Featured Highlights</span>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-medium backdrop-blur-md">
              <MaterialIcon name="event" size={16} />
              <span className="font-medium">Annual Conference Series</span>
            </div>

            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-white tracking-tight">
              Upright 2026
            </h3>

            <p className="text-gray-300 text-sm sm:text-base font-medium leading-relaxed">
              Congratulations to the SRF team for pulling off successfully, it&apos;s first ever annual conference...
              &ldquo;UPRIGHT 2024, Looking Back, Moving Forward.....&rdquo; CHEERS to the unending support and love from
              our patients who are the most important part of our family!
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-400 font-medium">
              <div className="flex items-center gap-1.5">
                <MaterialIcon name="location_on" size={18} className="text-emerald-400" />
                <span className="font-medium">SRF Medical Campus &amp; Virtual</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MaterialIcon name="groups" size={18} className="text-emerald-400" />
                <span className="font-medium">Doctors, Researchers &amp; Patient Community</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EventSection
