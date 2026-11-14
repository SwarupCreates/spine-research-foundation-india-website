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
          className="relative flex items-center gap-3.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-xl p-1.5 transition cursor-pointer"
          aria-label="SRF India Home"
        >
          {/* Brand Gradient Glow on Hover: #1B9AF7 (blue) to #87CD46 (green) - Brighter & Wider Spread */}
          <motion.div
            className="absolute -inset-x-8 -inset-y-4 pointer-events-none -z-10 rounded-3xl blur-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: isLogoHovered ? 0.88 : 0,
              scale: isLogoHovered ? 1.12 : 0.9,
            }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{
              background: 'radial-gradient(ellipse at 30% 50%, rgba(27, 154, 247, 0.78) 0%, rgba(135, 205, 70, 0.65) 50%, rgba(27, 154, 247, 0.22) 75%, transparent 100%)',
            }}
            aria-hidden="true"
          />

          {/* Logo Container with Smooth White-to-Color Transformation */}
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0 group-hover:scale-105 transition-transform duration-250">
            {/* White Logo (default, crossfades out on hover) */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center text-white"
              animate={{
                opacity: isLogoHovered ? 0 : 1,
                scale: isLogoHovered ? 0.94 : 1,
              }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
            >
              <SrfLogo className="w-full h-full text-white" />
            </motion.div>

            {/* Colored Logo (crossfades in on hover) */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{
                opacity: isLogoHovered ? 1 : 0,
                scale: isLogoHovered ? 1 : 1.06,
              }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
            >
              <SrfLogoColored className="w-full h-full" />
            </motion.div>
          </div>

          {/* Morphing Brand Text in Jost Font - Simultaneous Instant Cross-Fade */}
          <div className="font-jost select-none overflow-hidden min-h-[44px] grid grid-cols-1 items-center">
            {/* Acronym "SRF INDIA" */}
            <motion.div
              key="short-name"
              animate={{
                opacity: isLogoHovered ? 0 : 1,
                y: isLogoHovered ? -5 : 0,
                filter: isLogoHovered ? 'blur(2px)' : 'blur(0px)',
                pointerEvents: isLogoHovered ? 'none' : 'auto',
              }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="col-start-1 row-start-1 flex items-baseline tracking-[0.16em] uppercase text-lg sm:text-[22px] whitespace-nowrap"
            >
              <span className="font-semibold text-white">
                SRF
              </span>
              <span className="font-normal text-white/50 ml-2.5">
                INDIA
              </span>
            </motion.div>

            {/* Full Form "SPINE RESEARCH FOUNDATION INDIA" */}
            <motion.div
              key="full-name"
              animate={{
                opacity: isLogoHovered ? 1 : 0,
                y: isLogoHovered ? 0 : 5,
                filter: isLogoHovered ? 'blur(0px)' : 'blur(2px)',
                pointerEvents: isLogoHovered ? 'auto' : 'none',
              }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="col-start-1 row-start-1 flex flex-col tracking-[0.11em] uppercase text-[13px] sm:text-[15px] lg:text-[16px] leading-[1.18] whitespace-nowrap"
            >
              <span className="font-semibold text-white whitespace-nowrap">
                SPINE RESEARCH
              </span>
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="font-semibold text-white">
                  FOUNDATION
                </span>
                <span className="font-normal text-white/50">
                  INDIA
                </span>
              </div>
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
