import styled, { keyframes } from 'styled-components'

const floatIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`

const FloatIn = styled.div<{ $delay?: number }>`
  animation: ${floatIn} 500ms cubic-bezier(0.23, 1, 0.32, 1) ${({ $delay = 0 }) => $delay}ms backwards;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

export default FloatIn
