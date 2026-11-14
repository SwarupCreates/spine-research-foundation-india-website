import React, { useState, useEffect, useRef, useCallback } from 'react'

export const CustomScrollbar: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [thumbHeight, setThumbHeight] = useState(64)
  const [isHovered, setIsHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const trackRef = useRef<HTMLDivElement>(null)
  const startDragY = useRef(0)
  const startScrollTop = useRef(0)

  // Update thumb position and size on scroll / resize
  const updateScroll = useCallback(() => {
    const scrollY = window.scrollY || window.pageYOffset
    const windowHeight = window.innerHeight
    const docHeight = document.documentElement.scrollHeight
    const maxScroll = docHeight - windowHeight

    if (maxScroll <= 20) {
      setIsVisible(false)
      return
    }

    setIsVisible(true)

    // Calculate height of the pill thumb (minimum 48px, maximum 180px)
    const trackHeight = windowHeight - 28
    const calculatedThumbHeight = Math.max(48, Math.min(180, (windowHeight / docHeight) * trackHeight))
    setThumbHeight(calculatedThumbHeight)

    // Calculate current progress (0 to 1)
    const progress = Math.min(1, Math.max(0, scrollY / maxScroll))
    setScrollProgress(progress)
  }, [])

  useEffect(() => {
    updateScroll()
    window.addEventListener('scroll', updateScroll, { passive: true })
    window.addEventListener('resize', updateScroll)
    return () => {
      window.removeEventListener('scroll', updateScroll)
      window.removeEventListener('resize', updateScroll)
    }
  }, [updateScroll])

  // Handle Dragging
  const handleThumbMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
    startDragY.current = e.clientY
    startScrollTop.current = window.scrollY || window.pageYOffset

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = moveEvent.clientY - startDragY.current
      const windowHeight = window.innerHeight
      const docHeight = document.documentElement.scrollHeight
      const maxScroll = docHeight - windowHeight
      const trackHeight = windowHeight - 28
      const scrollableTrackSpace = trackHeight - thumbHeight

      if (scrollableTrackSpace <= 0) return

      const scrollDelta = (deltaY / scrollableTrackSpace) * maxScroll
      window.scrollTo({
        top: Math.min(maxScroll, Math.max(0, startScrollTop.current + scrollDelta)),
        behavior: 'instant' as ScrollBehavior,
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  // Handle Clicking on the track to jump smoothly
  const handleTrackClick = (e: React.MouseEvent) => {
    if (!trackRef.current) return
    const rect = trackRef.current.getBoundingClientRect()
    const clickY = e.clientY - rect.top
    const trackHeight = rect.height
    const windowHeight = window.innerHeight
    const docHeight = document.documentElement.scrollHeight
    const maxScroll = docHeight - windowHeight

    const targetProgress = Math.min(1, Math.max(0, (clickY - thumbHeight / 2) / (trackHeight - thumbHeight)))
    window.scrollTo({
      top: targetProgress * maxScroll,
      behavior: 'smooth',
    })
  }

  if (!isVisible) return null

  const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800
  const trackHeight = windowHeight - 28
  const maxThumbTop = trackHeight - thumbHeight
  const thumbTop = scrollProgress * maxThumbTop
  const isActive = isHovered || isDragging

  return (
    <aside
      ref={trackRef}
      onClick={handleTrackClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed right-1 sm:right-1.5 top-3.5 bottom-3.5 z-[9999] flex items-center justify-center cursor-pointer select-none"
      style={{
        width: isActive ? '14px' : '8px',
        transition: 'width 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
      aria-label="Custom Page Scroll Pill"
    >
      {/* Invisible wider target area for easy mouse grabbing */}
      <div className="absolute inset-y-0 -inset-x-2" />

      {/* Pill Thumb: Slender by default, thickens & brightens up on hover and click hold */}
      <div
        onMouseDown={handleThumbMouseDown}
        className="absolute rounded-full cursor-grab active:cursor-grabbing transition-all duration-200"
        style={{
          top: `${thumbTop}px`,
          height: `${thumbHeight}px`,
          width: isActive ? '8px' : '4px',
          backgroundColor: isActive ? 'rgba(255, 255, 255, 0.88)' : 'rgba(255, 255, 255, 0.28)',
          boxShadow: isActive ? '0 0 12px rgba(255, 255, 255, 0.5), 0 0 4px rgba(255, 255, 255, 0.8)' : 'none',
        }}
      />
    </aside>
  )
}

export default CustomScrollbar
