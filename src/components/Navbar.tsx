import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { SrfLogo, SrfLogoColored, MaterialIcon } from './icons'

export interface NavItem {
  id: string
  label: string
  icon: string
  href?: string
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: 'family_home' },
  { id: 'about', label: 'About Us', icon: 'info' },
  { id: 'care', label: 'Care At SRF', icon: 'diversity_1' },
  { id: 'patient-portal', label: 'Paitient Portal', icon: 'badge' },
  { id: 'discover', label: 'Discover', icon: 'travel_explore' },
  { id: 'courses', label: 'Courses', icon: 'school' },
  { id: 'treatments', label: 'Treatments', icon: 'accessibility_new' },
]

interface NavbarProps {
  activeTab?: string
  onTabChange?: (tabId: string) => void
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab = 'home',
  onTabChange,
}) => {
  const [currentTab, setCurrentTab] = useState(activeTab)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLogoHovered, setIsLogoHovered] = useState(false)

  const handleSelect = (id: string) => {
    setCurrentTab(id)
    if (onTabChange) {
      onTabChange(id)
    }
    setMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300 bg-transparent border-0 backdrop-blur-none pt-1.5 sm:pt-2.5">
      <div className="max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo & Interactive Morphing Brand Name in Jost font */}
        <a
          href="#home"
          onClick={() => handleSelect('home')}
          onMouseEnter={() => setIsLogoHovered(true)}
          onMouseLeave={() => setIsLogoHovered(false)}
          className={`relative flex items-center ${
            isLogoHovered ? 'gap-1 sm:gap-1.5' : 'gap-2 sm:gap-2.5'
          } group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-xl p-1.5 transition-all duration-300 cursor-pointer`}
          aria-label="SRF India Home"
        >
          {/* Logo Container with Enlarge-Scale Highlight Effect on Hover & Centered Glow */}
          <motion.div
            className="relative w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0"
            animate={{
              scale: isLogoHovered ? 1.09 : 1,
            }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Brand Gradient Glow strictly around the circular Logomark on the left */}
            <motion.div
              className="absolute -inset-2.5 sm:-inset-3 pointer-events-none -z-10 rounded-full blur-xl"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{
                opacity: isLogoHovered ? 0.82 : 0,
                scale: isLogoHovered ? 1.22 : 0.85,
              }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{
                background: 'radial-gradient(circle, rgba(27, 154, 247, 0.72) 0%, rgba(135, 205, 70, 0.58) 55%, transparent 100%)',
              }}
              aria-hidden="true"
            />

            {/* White Logo (default, crossfades out on hover) */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center text-white"
              animate={{
                opacity: isLogoHovered ? 0 : 1,
                scale: isLogoHovered ? 0.94 : 1,
              }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <SrfLogo className="w-full h-full text-white" />
            </motion.div>

            {/* Colored Logo (crossfades in on hover with highlight scale) */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{
                opacity: isLogoHovered ? 1 : 0,
                scale: isLogoHovered ? 1.02 : 0.95,
              }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <SrfLogoColored className="w-full h-full" />
            </motion.div>
          </motion.div>

          {/* Kinetic Morphing Brand Typography: Closer to logo and flowy expansion */}
          <div
            className={`overflow-visible min-h-[44px] flex items-center py-1 transition-transform duration-300 ${
              isLogoHovered ? '-translate-x-0.5 sm:-translate-x-1' : 'translate-x-0'
            }`}
          >
            <motion.div
              layout
              className={`font-jost select-none flex ${
                isLogoHovered ? 'flex-col items-start gap-y-0 leading-none' : 'flex-row items-baseline'
              }`}
              animate={{
                scale: isLogoHovered ? 0.82 : 1,
              }}
              style={{ transformOrigin: 'left center' }}
              transition={{
                layout: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                scale: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
              }}
            >
              {/* Line 1: S[PINE] + R[ESEARCH] */}
              <motion.div layout className="flex items-baseline whitespace-nowrap leading-none py-0.5">
                {/* Word 1: S + PINE */}
                <span className="flex items-baseline leading-none">
                  <span className="font-semibold text-white tracking-[0.14em] text-lg sm:text-[21px] leading-none">
                    S
                  </span>
                  <motion.span
                    className="overflow-hidden inline-block font-semibold text-white tracking-[0.12em] text-lg sm:text-[21px] leading-none"
                    initial={false}
                    animate={{
                      maxWidth: isLogoHovered ? 80 : 0,
                      opacity: isLogoHovered ? 1 : 0,
                    }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    PINE
                  </motion.span>
                </span>

                {/* Word 2: R + ESEARCH */}
                <motion.span
                  className="flex items-baseline leading-none"
                  animate={{
                    marginLeft: isLogoHovered ? '0.36em' : '0.04em',
                  }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="font-semibold text-white tracking-[0.14em] text-lg sm:text-[21px] leading-none">
                    R
                  </span>
                  <motion.span
                    className="overflow-hidden inline-block font-semibold text-white tracking-[0.12em] text-lg sm:text-[21px] leading-none"
                    initial={false}
                    animate={{
                      maxWidth: isLogoHovered ? 130 : 0,
                      opacity: isLogoHovered ? 1 : 0,
                    }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    ESEARCH
                  </motion.span>
                </motion.span>
              </motion.div>

              {/* Line 2: F[OUNDATION] + INDIA */}
              <motion.div
                layout
                className="flex items-baseline whitespace-nowrap leading-none py-0.5"
                animate={{
                  marginLeft: isLogoHovered ? '0em' : '0.04em',
                }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Word 3: F + OUNDATION */}
                <span className="flex items-baseline leading-none">
                  <span className="font-semibold text-white tracking-[0.14em] text-lg sm:text-[21px] leading-none">
                    F
                  </span>
                  <motion.span
                    className="overflow-hidden inline-block font-semibold text-white tracking-[0.12em] text-lg sm:text-[21px] leading-none"
                    initial={false}
                    animate={{
                      maxWidth: isLogoHovered ? 160 : 0,
                      opacity: isLogoHovered ? 1 : 0,
                    }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    OUNDATION
                  </motion.span>
                </span>

                {/* Word 4: INDIA */}
                <motion.span
                  className="font-normal text-white tracking-[0.16em] inline-block text-lg sm:text-[21px] leading-none"
                  animate={{
                    marginLeft: isLogoHovered ? '0.34em' : '0.24em',
                    opacity: isLogoHovered ? 0.6 : 0.48,
                  }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  INDIA
                </motion.span>
              </motion.div>
            </motion.div>
          </div>
        </a>

        {/* Floating Nav Menu: NO dark pill container, NO background, NO border, completely clear */}
        <nav
          className="hidden md:flex items-center gap-1.5 lg:gap-3 bg-transparent border-0 p-0 shadow-none"
          aria-label="Main Navigation"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = currentTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`group relative flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer select-none ${
                  isActive
                    ? 'bg-[#0f871e] text-white shadow-md shadow-emerald-950/40 hover:bg-[#149524]'
                    : 'text-gray-300 hover:text-white hover:bg-white/[0.08]'
                }`}
              >
                <MaterialIcon
                  name={item.icon}
                  filled={isActive}
                  size={19}
                  className={`transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'
                  }`}
                />
                <span className="tracking-tight whitespace-nowrap font-medium">
                  {item.label}
                </span>
              </button>
            )
          })}
        </nav>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-gray-200 hover:text-white border border-white/[0.08] backdrop-blur-xl transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 cursor-pointer"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <MaterialIcon
              name={mobileMenuOpen ? 'close' : 'menu'}
              size={24}
              className="text-white"
            />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/[0.08] bg-[#0c0d10]/95 backdrop-blur-2xl px-4 pt-3 pb-6 animate-in slide-in-from-top-2 duration-200 shadow-2xl">
          <div className="flex flex-col gap-1.5">
            {NAV_ITEMS.map((item) => {
              const isActive = currentTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`group flex items-center justify-between px-4 py-3 rounded-2xl text-base font-medium transition cursor-pointer ${
                    isActive
                      ? 'bg-[#0f871e] text-white shadow-md'
                      : 'text-gray-200 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <MaterialIcon
                      name={item.icon}
                      filled={isActive}
                      size={22}
                      className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}
                    />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
