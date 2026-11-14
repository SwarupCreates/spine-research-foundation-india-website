import React from 'react'
import { SrfLogo, MaterialIcon } from './icons'

interface GlassCardProps {
  onReadMore?: () => void
}

export const GlassCard: React.FC<GlassCardProps> = ({ onReadMore }) => {
  return (
    <section className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-4 sm:py-6">
      <div className="relative rounded-3xl sm:rounded-[32px] overflow-hidden glass-panel border border-white/[0.08] backdrop-blur-2xl bg-[#141519]/55 px-6 py-12 sm:px-12 sm:py-16 text-center shadow-2xl transition duration-300 hover:border-white/[0.14]">
        {/* Background Watermark Logo - exactly as seen in design */}
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.06] select-none"
          aria-hidden="true"
        >
          <div className="w-64 h-64 sm:w-80 sm:h-80 text-white transform scale-110">
            <SrfLogo className="w-full h-full text-white" />
          </div>
        </div>

        {/* Foreground Content */}
        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-white tracking-tight">
            The best of health care within your reach
          </h2>
          <p className="text-gray-300 text-sm sm:text-base md:text-lg font-medium max-w-xl mx-auto leading-relaxed">
            We commit to your problems with all zeal and might
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={onReadMore}
              className="group inline-flex items-center gap-2.5 px-6 py-2.5 sm:px-7 sm:py-3 rounded-full bg-white text-gray-950 font-medium text-sm sm:text-base hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] cursor-pointer"
            >
              <MaterialIcon
                name="menu_book"
                size={20}
                className="text-gray-900 group-hover:text-emerald-700 transition-colors"
              />
              <span className="font-medium">Read more about SRF India</span>
              <MaterialIcon
                name="arrow_forward"
                size={18}
                className="text-gray-700 group-hover:translate-x-1 group-hover:text-black transition-all"
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default GlassCard
