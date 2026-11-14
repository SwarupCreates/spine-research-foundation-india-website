import React from 'react'

export interface MaterialIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string
  filled?: boolean
  hoverFill?: boolean
  size?: number | string
  className?: string
}

export const MaterialIcon: React.FC<MaterialIconProps> = ({
  name,
  filled = false,
  hoverFill = true,
  size,
  className = '',
  style,
  ...props
}) => {
  const dynamicStyle: React.CSSProperties = {
    ...(size ? { fontSize: typeof size === 'number' ? `${size}px` : size } : {}),
    ...(filled
      ? {
          fontVariationSettings: "'FILL' 1, 'wght' 300, 'GRAD' 0, 'opsz' 24",
        }
      : {}),
    ...style,
  }

  const fillClass = filled
    ? 'filled'
    : hoverFill
      ? 'group-hover-fill'
      : ''

  return (
    <span
      className={`material-symbols-outlined ${fillClass} ${className}`}
      style={dynamicStyle}
      data-filled={filled ? 'true' : 'false'}
      aria-hidden="true"
      {...props}
    >
      {name}
    </span>
  )
}

export default MaterialIcon
