import { useState, useRef, MouseEvent, ReactNode } from 'react'
import styled from 'styled-components'

interface InteractiveButtonProps {
  variant?: 'neutral' | 'accent'
  size?: 'medium' | 'small'
  children: ReactNode
  icon?: ReactNode
}

const COLORS = {
  neutral: {
    bg: 'rgba(112,111,110,0.08)',
    focusBg: 'rgba(136,91,179,0.24)',
    gradientColor: '#885BB3',
  },
  accent: {
    bg: 'rgba(136,91,179,0.08)',
    focusBg: 'rgba(136,91,179,0.24)',
    gradientColor: '#885BB3',
  },
}

const Button = styled.button<{ $bg: string; $small?: boolean }>`
  box-sizing: border-box;
  position: relative;
  height: ${({ $small }) => $small ? '32px' : '40px'};
  padding: ${({ $small }) => $small ? '8px 12px' : '10px 16px'};
  border-radius: 99px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  overflow: hidden;
  cursor: pointer;
  border: none;
  background: ${({ $bg }) => $bg};
  width: fit-content;

  @keyframes gradient-expand {
    0% { transform: translate(-50%, -50%) scale(0.3); opacity: 0; }
    100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  }

  @keyframes ripple {
    0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
    100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
  }
`

const GradientLayer = styled.div`
  position: absolute;
  pointer-events: none;
`

const GradientInner = styled.div`
  position: absolute;
  inset: -26.67%;
`

const Label = styled.span<{ $small?: boolean }>`
  position: relative;
  z-index: 10;
  font-size: ${({ $small }) => $small ? '12px' : '14px'};
  font-weight: 400;
  line-height: ${({ $small }) => $small ? '16px' : '20px'};
  letter-spacing: ${({ $small }) => $small ? '-0.0004px' : '-0.154px'};
  color: #313131;
  white-space: nowrap;
`

const IconWrapper = styled.span<{ $small?: boolean }>`
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: ${({ $small }) => $small ? '12px' : '16px'};
  height: ${({ $small }) => $small ? '12px' : '16px'};

  svg {
    width: ${({ $small }) => $small ? '12px' : '16px'};
    height: ${({ $small }) => $small ? '12px' : '16px'};
  }
`

export function InteractiveButton({ variant = 'neutral', size = 'medium', children, icon }: InteractiveButtonProps) {
  const isSmall = size === 'small'
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const [isExpanding, setIsExpanding] = useState(false)
  const [expandPosition, setExpandPosition] = useState({ x: 0, y: 0 })
  const [showFocusBg, setShowFocusBg] = useState(false)
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])
  const buttonRef = useRef<HTMLButtonElement>(null)
  const rippleIdCounter = useRef(0)

  const colors = COLORS[variant]

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const handleMouseDown = (e: MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return
    setIsPressed(true)
    setIsExpanding(true)
    setShowFocusBg(false)
    const rect = buttonRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setExpandPosition({ x, y })
    setTimeout(() => {
      if (isPressed) setShowFocusBg(true)
    }, 600)
    const id = rippleIdCounter.current++
    setRipples(prev => [...prev, { id, x, y }])
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 600)
  }

  const handleMouseUp = () => {
    setIsPressed(false)
    setIsExpanding(false)
    setShowFocusBg(false)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setIsPressed(false)
    setIsExpanding(false)
    setShowFocusBg(false)
  }

  const gradientSvg = (filterId: string, gradientId: string) => (
    <GradientInner>
      <svg style={{ display: 'block', width: '100%', height: '100%' }} fill="none" preserveAspectRatio="none" viewBox="0 0 184 184">
        <defs>
          <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="184" id={filterId} width="184" x="0" y="0">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
            <feGaussianBlur result="effect1_foregroundBlur" stdDeviation="16" />
          </filter>
          <radialGradient cx="0" cy="0" gradientTransform="translate(92 92) rotate(-90) scale(60)" gradientUnits="userSpaceOnUse" id={gradientId} r="1">
            <stop stopColor={colors.gradientColor} stopOpacity="0.40" />
            <stop offset="1" stopColor={colors.gradientColor} stopOpacity="0.16" />
          </radialGradient>
        </defs>
        <g filter={`url(#${filterId})`} opacity="0.5">
          <circle cx="92" cy="92" fill={`url(#${gradientId})`} r="60" />
        </g>
      </svg>
    </GradientInner>
  )

  return (
    <Button
      ref={buttonRef}
      $bg={showFocusBg ? colors.focusBg : colors.bg}
      $small={isSmall}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {/* Hover gradient */}
      <GradientLayer
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          transform: 'translate(-50%, -50%)',
          width: 120,
          height: 120,
          opacity: isHovered && !isExpanding ? 1 : 0,
          transition: `opacity ${isHovered && !isExpanding ? '300ms' : '600ms'}`,
        }}
      >
        {gradientSvg(`filter_hover_${variant}`, `gradient_hover_${variant}`)}
      </GradientLayer>

      {/* Expanding gradient on press */}
      {isExpanding && (
        <GradientLayer
          style={{
            left: expandPosition.x,
            top: expandPosition.y,
            transform: 'translate(-50%, -50%)',
            width: 120,
            height: 120,
            animation: 'gradient-expand 600ms ease-out forwards',
          }}
        >
          {gradientSvg(`filter_expand_${variant}`, `gradient_expand_${variant}`)}
        </GradientLayer>
      )}

      {/* Ripples */}
      {ripples.map(ripple => (
        <GradientLayer
          key={ripple.id}
          style={{
            left: ripple.x,
            top: ripple.y,
            transform: 'translate(-50%, -50%)',
            width: 120,
            height: 120,
            animation: 'ripple 600ms ease-out forwards',
          }}
        >
          {gradientSvg(`filter_ripple_${variant}_${ripple.id}`, `gradient_ripple_${variant}_${ripple.id}`)}
        </GradientLayer>
      ))}

      {icon && <IconWrapper $small={isSmall}>{icon}</IconWrapper>}
      <Label $small={isSmall}>{children}</Label>
    </Button>
  )
}
