import styled, { keyframes } from 'styled-components'

const gradientPulse = keyframes`
  0%, 100% { transform: scale(0.8) rotate(-90deg); }
  50% { transform: scale(2.0) rotate(90deg); }
`

const Container = styled.div<{ $isFullscreen?: boolean }>`
  position: absolute;
  bottom: -323px;
  left: -124px;
  right: -138px;
  height: 623px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 0;
`

const OuterWrapper = styled.div<{ $isFullscreen?: boolean }>`
  flex: none;
  width: 444px;
  height: 444px;
  transform: ${({ $isFullscreen }) => $isFullscreen ? 'scaleX(2.5) rotate(-38deg)' : 'rotate(-38deg)'};
`

const RadialBg = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 999px;
  opacity: 0.7;
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  box-sizing: border-box;
  background-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 444 444' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%25' width='100%25' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(14.294 -18.273 18.273 14.294 222 222)'><stop stop-color='rgba(246,245,244,1)' offset='0'/><stop stop-color='rgba(246,245,244,0)' offset='1'/></radialGradient></defs></svg>");
`

const AnimatedGroup = styled.div`
  position: absolute;
  inset: 0;
  animation: ${gradientPulse} 8s ease-in-out infinite;
  transform-origin: center center;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

const MainEllipseWrapper = styled.div`
  flex: 1 0 0;
  height: 100%;
  min-height: 0;
  min-width: 0;
  position: relative;
`

const MainEllipseInner = styled.div`
  position: absolute;
  inset: -24.28%;
`

const InnerGlowWrapper = styled.div`
  position: absolute;
  inset: 26.6px 121.43px 132.59px 37.76px;
`

const InnerGlowInner = styled.div`
  position: absolute;
  inset: -28.1%;
`

const GradientBand = styled.div<{ $isFullscreen?: boolean }>`
  position: absolute;
  bottom: 124.8px;
  left: ${({ $isFullscreen }) => $isFullscreen ? '0' : '82.05px'};
  right: ${({ $isFullscreen }) => $isFullscreen ? '0' : '27.77px'};
  height: 286.4px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const GradientBandRect = styled.div<{ $isFullscreen?: boolean }>`
  flex: none;
  width: ${({ $isFullscreen }) => $isFullscreen ? '1200px' : '380px'};
  height: 82px;
  transform: rotate(38deg);
  background-image: linear-gradient(0.63deg, rgb(202, 184, 228) 2.59%, rgba(226, 219, 237, 0) 97.99%);
`

const SvgBlock = { display: 'block', width: '100%', height: '100%' } as const

export default function AuroraGlow({ isFullscreen }: { isFullscreen?: boolean }) {
  return (
    <Container $isFullscreen={isFullscreen}>
      <OuterWrapper $isFullscreen={isFullscreen}>
        <RadialBg>
          <AnimatedGroup>
            <MainEllipseWrapper>
              <MainEllipseInner>
                <svg style={SvgBlock} fill="none" preserveAspectRatio="none" viewBox="0 0 612 612">
                  <defs>
                    <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="762" id="aurora-filter-main" width="762" x="-75" y="-75">
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                      <feGaussianBlur result="effect1_foregroundBlur" stdDeviation="50" />
                    </filter>
                    <linearGradient gradientUnits="userSpaceOnUse" id="aurora-gradient-main" x1="430.83" x2="414.59" y1="146.3" y2="411.58">
                      <stop stopColor="#E2DBED" />
                      <stop offset="0.216" stopColor="#CDB3E6" />
                      <stop offset="0.88" stopColor="#D0DAF3" />
                    </linearGradient>
                  </defs>
                  <g filter="url(#aurora-filter-main)">
                    <circle cx="306" cy="306" fill="url(#aurora-gradient-main)" fillOpacity="0.8" r="206" />
                    <circle cx="306" cy="306" r="205.5" stroke="black" strokeOpacity="0" />
                  </g>
                </svg>
              </MainEllipseInner>
            </MainEllipseWrapper>

            <InnerGlowWrapper>
              <InnerGlowInner>
                <svg style={SvgBlock} fill="none" preserveAspectRatio="none" viewBox="0 0 445 445">
                  <defs>
                    <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="565" id="aurora-filter-glow" width="565" x="-60" y="-60">
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                      <feGaussianBlur result="effect1_foregroundBlur" stdDeviation="40" />
                    </filter>
                  </defs>
                  <g filter="url(#aurora-filter-glow)">
                    <circle cx="222.5" cy="222.5" fill="#F6F5F4" fillOpacity="0.8" r="142.5" />
                  </g>
                </svg>
              </InnerGlowInner>
            </InnerGlowWrapper>
          </AnimatedGroup>

          <GradientBand $isFullscreen={isFullscreen}>
            <GradientBandRect $isFullscreen={isFullscreen} />
          </GradientBand>
        </RadialBg>
      </OuterWrapper>
    </Container>
  )
}
