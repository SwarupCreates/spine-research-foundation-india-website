import React, { useState, useEffect, useRef, useCallback } from 'react'

export const CustomScrollbar: React.FC = () => {
  const [thumbHeight, setThumbHeight] = useState(64)
  const [isHovered, setIsHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const trackRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const thumbHeightRef = useRef(64)
  const startDragY = useRef(0)
  const startScrollTop = useRef(0)
  const isDraggingRef = useRef(false)

  // Update thumb position and size synchronously on scroll / resize
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
    thumbHeightRef.current = calculatedThumbHeight

    // If currently dragging, thumb position is already being manipulated directly
    if (!isDraggingRef.current && thumbRef.current) {
      const progress = Math.min(1, Math.max(0, scrollY / maxScroll))
      const maxThumbTop = trackHeight - calculatedThumbHeight
      const thumbTop = progress * maxThumbTop
      thumbRef.current.style.transform = `translate3d(0, ${thumbTop}px, 0)`
    }
  }, [])

  useEffect(() => {
    updateScroll()

    const onScroll = () => {
      // Synchronous, zero-delay DOM update for smooth response without waiting for React re-render
      if (!isDraggingRef.current && thumbRef.current) {
        const scrollY = window.scrollY || window.pageYOffset
        const windowHeight = window.innerHeight
        const docHeight = document.documentElement.scrollHeight
        const maxScroll = docHeight - windowHeight
        if (maxScroll > 0) {
          const trackHeight = windowHeight - 28
          const progress = Math.min(1, Math.max(0, scrollY / maxScroll))
          const maxThumbTop = trackHeight - thumbHeightRef.current
          const thumbTop = progress * maxThumbTop
          thumbRef.current.style.transform = `translate3d(0, ${thumbTop}px, 0)`
        }
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', updateScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', updateScroll)
    }
  }, [updateScroll])

  // Handle Dragging in real-time with zero latency & no cursor lag
  const handleThumbMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
    isDraggingRef.current = true
    startDragY.current = e.clientY
    startScrollTop.current = window.scrollY || window.pageYOffset

    // Prevent text selection across the page and lock cursor to grabbing
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'grabbing'

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = moveEvent.clientY - startDragY.current
      const windowHeight = window.innerHeight
      const docHeight = document.documentElement.scrollHeight
      const maxScroll = docHeight - windowHeight
      const trackHeight = windowHeight - 28
      const scrollableTrackSpace = trackHeight - thumbHeightRef.current

      if (scrollableTrackSpace <= 0 || maxScroll <= 0) return

      const scrollDelta = (deltaY / scrollableTrackSpace) * maxScroll
      const targetScrollTop = Math.min(maxScroll, Math.max(0, startScrollTop.current + scrollDelta))

      // Instant scroll
      window.scrollTo(0, targetScrollTop)

      // Direct synchronous update of thumb position for instant 1:1 cursor tracking
      if (thumbRef.current) {
        const progress = targetScrollTop / maxScroll
        const newThumbTop = progress * scrollableTrackSpace
        thumbRef.current.style.transform = `translate3d(0, ${newThumbTop}px, 0)`
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      isDraggingRef.current = false
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
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

  const isActive = isHovered || isDragging

  return (
    <aside
      ref={trackRef}
      onClick={handleTrackClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="hidden md:flex fixed right-1 sm:right-1.5 top-3.5 bottom-3.5 z-[9999] items-center justify-center cursor-pointer select-none"
      style={{
        width: isActive ? '14px' : '8px',
        transition: 'width 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
      aria-label="Custom Page Scroll Pill"
    >
      {/* Invisible wider target area for easy mouse grabbing */}
      <div className="absolute inset-y-0 -inset-x-2" />

      {/* Pill Thumb: Direct DOM transform with NO CSS transition on position guarantees 100% instant real-time sync with zero lag */}
      <div
        ref={thumbRef}
        onMouseDown={handleThumbMouseDown}
        className="absolute top-0 rounded-full cursor-grab active:cursor-grabbing will-change-transform"
        style={{
          transform: 'translate3d(0, 0, 0)',
          height: `${thumbHeight}px`,
          width: isActive ? '8px' : '4px',
          backgroundColor: isActive ? 'rgba(255, 255, 255, 0.88)' : 'rgba(255, 255, 255, 0.28)',
          boxShadow: isActive ? '0 0 12px rgba(255, 255, 255, 0.5), 0 0 4px rgba(255, 255, 255, 0.8)' : 'none',
          transition: 'width 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease',
        }}
      />
    </aside>
  )
}

export default CustomScrollbar
