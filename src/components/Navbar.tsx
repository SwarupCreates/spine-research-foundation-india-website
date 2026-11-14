import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SrfLogo, SrfLogoColored, MaterialIcon } from './icons'

export interface NavItem {
  id: string
  label: string
  icon: string
  href?: string
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: 'home' },
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
    <header className="sticky top-0 z-40 w-full transition-all duration-300 bg-transparent border-0 backdrop-blur-none">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo & Interactive Morphing Brand Name in Jost font */}
        <a
          href="#home"
          onClick={() => handleSelect('home')}
          onMouseEnter={() => setIsLogoHovered(true)}
          onMouseLeave={() => setIsLogoHovered(false)}
          className="flex items-center gap-3.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-xl p-1 transition cursor-pointer"
          aria-label="SRF India Home"
        >
          {/* Logo Container with Smooth White-to-Color Transformation */}
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
            {/* White Logo (default, crossfades out on hover) */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center text-white"
              animate={{
                opacity: isLogoHovered ? 0 : 1,
                scale: isLogoHovered ? 0.94 : 1,
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
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
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              <SrfLogoColored className="w-full h-full" />
            </motion.div>
          </div>

          {/* Morphing Brand Text in Jost Font */}
          <div className="font-jost select-none overflow-hidden py-1">
            <AnimatePresence mode="wait">
              {!isLogoHovered ? (
                <motion.div
                  key="short-name"
                  initial={{ opacity: 0, y: 3, filter: 'blur(3px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -3, filter: 'blur(3px)' }}
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  className="flex items-center tracking-[0.16em] uppercase text-base sm:text-lg"
                >
                  <span className="font-bold text-white opacity-100">
                    SRF
                  </span>
                  <span className="font-medium text-white opacity-48 ml-2">
                    INDIA
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="full-name"
                  initial={{ opacity: 0, y: 3, filter: 'blur(3px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -3, filter: 'blur(3px)' }}
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  className="flex items-center tracking-[0.12em] uppercase text-xs sm:text-sm whitespace-nowrap"
                >
                  <span className="font-bold text-white opacity-100">
                    SPINE RESEARCH FOUNDATION
                  </span>
                  <span className="font-medium text-white opacity-48 ml-2">
                    INDIA
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
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
