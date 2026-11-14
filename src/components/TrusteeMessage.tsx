import React from 'react'

export const TrusteeMessage: React.FC = () => {
  return (
    <section className="relative py-16 sm:py-24 lg:py-32 overflow-hidden">
      {/* Subtle ambient lighting on base background */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-500/[0.04] rounded-full blur-[140px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <span className="text-emerald-400 text-xs sm:text-sm font-medium tracking-[0.2em] uppercase block mb-3">
            Leadership Perspective
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-white tracking-tight font-jost">
            MANAGING TRUSTEE&apos;S MESSAGE
          </h2>
          <div className="w-16 h-0.5 bg-emerald-500/40 mx-auto mt-4 rounded-full" />
        </div>

        {/* Dr. Saumyajit Basu Emerging Image with Gradual Transparency */}
        <div className="relative mx-auto w-64 sm:w-80 md:w-96 mb-8 sm:mb-12 flex flex-col items-center">
          <div className="relative w-full aspect-[3/4] flex items-end justify-center">
            {/* Ambient silhouette glow behind the doctor */}
            <div 
              className="absolute inset-0 bg-gradient-to-t from-emerald-500/15 via-blue-500/10 to-transparent blur-2xl opacity-70 rounded-full scale-90"
              aria-hidden="true"
            />
            
            {/* The portrait with gradual bottom transparency fade */}
            <img
              src={`${import.meta.env.BASE_URL}images/drSaumyajitBasu.png`}
              alt="Dr. Saumyajit Basu - Managing Trustee, Spine Research Foundation India"
              className="w-full h-full object-contain object-bottom select-none filter contrast-[1.03]"
              style={{
                maskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 68%, rgba(0, 0, 0, 0.4) 86%, rgba(0, 0, 0, 0) 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 68%, rgba(0, 0, 0, 0.4) 86%, rgba(0, 0, 0, 0) 100%)',
              }}
            />
          </div>

          {/* Doctor Credentials */}
          <div className="text-center mt-3 space-y-0.5">
            <h3 className="text-xl sm:text-2xl font-medium text-white tracking-tight">
              Dr. Saumyajit Basu
            </h3>
            <p className="text-xs sm:text-sm text-emerald-400 font-medium">
              Managing Trustee &amp; Founder, Spine Research Foundation India
            </p>
            <p className="text-xs text-gray-400 font-medium">
              Senior Consultant Spine Surgeon
            </p>
          </div>
        </div>

        {/* Message Content: Center Aligned Text on Base Background */}
        <div className="max-w-3xl sm:max-w-4xl mx-auto text-center space-y-6 sm:space-y-8 text-gray-300 text-base sm:text-lg lg:text-[19px] font-normal leading-relaxed">
          <p className="leading-relaxed">
            Spine Research Foundation (SRF) was set up to expedite our process of giving back to the
            society which has nurtured us to mature individuals, capable of doing something to uplift
            those in the community who desperately need the most but cannot get access to the same. Our
            key areas of focus remains on education, training and research along with providing
            financial support to those needy patients who cannot afford the complex spine surgery which
            they urgently need.
          </p>

          <p className="leading-relaxed">
            Over the last 15 years, our spine fellowship programs have been extremely successful in
            creating competent spine surgeons across the length and breadth of India and active
            research has created an environment of education in our department of spine surgery which
            now attracts the best of talents. We have been able to touch the lives of more than 200
            patients who had difficult spine surgeries with us where most of the treatment cost was
            borne by SRF and we had the pleasure and satisfaction of being able to offer our services
            entirely free of charge.
          </p>

          <p className="leading-relaxed text-white/95 font-medium pt-2">
            &ldquo;Delighted by getting an opportunity to serve, we will continue to work hard to
            further our mission and vision and seek all your blessings and support for the future.&rdquo;
          </p>
        </div>
      </div>
    </section>
  )
}

export default TrusteeMessage
