import React, { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { MaterialIcon } from './icons'

interface MetricItem {
  id: string
  label: string
  targetValue: number
  suffix?: string
  iconName: string
}

const METRICS_DATA: MetricItem[] = [
  {
    id: 'beneficiaries',
    label: 'BENEFICIARIES',
    targetValue: 300,
    suffix: '+',
    iconName: 'handshake',
  },
  {
    id: 'spinal-surgeries',
    label: 'SPINAL SURGERIES',
    targetValue: 300,
    suffix: '+',
    iconName: 'surgical',
  },
  {
    id: 'spinal-fellowships',
    label: 'SPINAL FELLOWSHIPS',
    targetValue: 60,
    suffix: '+',
    iconName: 'school',
  },
  {
    id: 'short-seminars',
    label: 'SHORT SEMINARS',
    targetValue: 15,
    suffix: '+',
    iconName: 'groups',
  },
]

// Animated Counter component that dials up smoothly from 0
const AnimatedDialNumber: React.FC<{
  targetValue: number
  suffix?: string
  shouldStart: boolean
  delayMs?: number
}> = ({ targetValue, suffix = '', shouldStart, delayMs = 0 }) => {
  const [currentValue, setCurrentValue] = useState(0)

  useEffect(() => {
    if (!shouldStart) return

    let startTime: number | null = null
    let animationFrameId: number

    const duration = 1800 // 1.8 seconds dial-up duration

    const timeoutId = setTimeout(() => {
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / duration, 1)

        // Ease-out quartic curve for a natural, decelerating dial effect
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        const value = Math.round(easeOutQuart * targetValue)

        setCurrentValue(value)

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(step)
        }
      }

      animationFrameId = requestAnimationFrame(step)
    }, delayMs)

    return () => {
      clearTimeout(timeoutId)
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [shouldStart, targetValue, delayMs])

  return (
    <span className="tabular-nums">
      {currentValue}
      {suffix && (
        <span className="text-emerald-400/80 text-3xl sm:text-4xl lg:text-5xl font-medium ml-0.5">
          {suffix}
        </span>
      )}
    </span>
  )
}

export const ImpactMetrics: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.25 })

  return (
    <section
      ref={containerRef}
      className="relative py-8 sm:py-12 lg:py-16"
      aria-label="SRF India Humanitarian Impact Statistics"
    >
      {/* 4-Column Responsive Grid floating seamlessly with zero background glow */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6 sm:gap-x-8 sm:gap-y-12 items-center justify-center">
        {METRICS_DATA.map((metric, index) => {
          const delayEntrance = index * 0.14 // Staggered pop-up entrance

          return (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 32, scale: 0.88 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 32, scale: 0.88 }}
              transition={{
                duration: 0.65,
                delay: delayEntrance,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex flex-col items-center text-center group cursor-pointer select-none"
            >
              {/* Circular Icon: Clean & flat by default, radiant emerald glow ONLY on hover */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-emerald-500/30 bg-emerald-500/[0.04] flex items-center justify-center text-emerald-400 shadow-none group-hover:scale-108 group-hover:border-emerald-400 group-hover:bg-emerald-500/15 group-hover:text-emerald-300 group-hover:shadow-[0_0_24px_rgba(52,211,153,0.45)] transition-all duration-300">
                <MaterialIcon
                  name={metric.iconName}
                  size={30}
                  className="text-emerald-400 group-hover:text-emerald-300 transition-colors duration-300"
                />
              </div>

              {/* Metric Label: Clean Uppercase with Letter Spacing */}
              <h3 className="text-xs sm:text-sm font-semibold tracking-[0.14em] uppercase text-gray-300 group-hover:text-white mt-4 sm:mt-5 text-center leading-snug transition-colors duration-300">
                {metric.label}
              </h3>

              {/* Bigger Dialing Counter Number: Crisp flat text by default, vibrant glow ONLY on hover */}
              <div className="text-4xl sm:text-5xl lg:text-[56px] font-semibold text-emerald-400 tracking-tight mt-1.5 sm:mt-2 drop-shadow-none group-hover:drop-shadow-[0_0_18px_rgba(52,211,153,0.65)] group-hover:text-emerald-300 transition-all duration-300 leading-none">
                <AnimatedDialNumber
                  targetValue={metric.targetValue}
                  suffix={metric.suffix}
                  shouldStart={isInView}
                  delayMs={Math.round(delayEntrance * 1000) + 150}
                />
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

export default ImpactMetrics
