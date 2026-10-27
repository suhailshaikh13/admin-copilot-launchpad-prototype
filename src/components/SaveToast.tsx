import { useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import CheckCircleFillIcon from '../assets/check-circle-fill.svg?react'
import XSmallIcon from '../assets/x-small.svg?react'

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(calc(-100% - 24px));
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const slideOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(calc(-100% - 24px));
  }
`

const Toast = styled.div<{ $leaving: boolean }>`
  position: fixed;
  top: 68px;
  right: 20px;
  box-sizing: border-box;
  display: flex;
  gap: 8px;
  align-items: flex-start;
  width: 320px;
  padding: 16px 40px 16px 12px;
  border: 1px solid #dcdcda;
  border-radius: 16px;
  background: white;
  box-shadow: 0px 16px 12px 0px rgba(12, 12, 13, 0.16);
  z-index: 100;
  animation: ${({ $leaving }) => ($leaving ? slideOut : slideIn)} 250ms
    ${({ $leaving }) => ($leaving ? 'ease-in' : 'ease-out')} forwards;
`

const CheckIcon = styled(CheckCircleFillIcon)`
  flex: none;
  width: 20px;
  height: 20px;
  color: #4b7d04;
`

const TextContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`

const Message = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: -0.154px;
  color: #4b7d04;
`

const Description = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: -0.154px;
  color: black;
`

const DismissButton = styled.button`
  box-sizing: border-box;
  position: absolute;
  top: 7px;
  right: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: #646864;
  cursor: pointer;
  padding: 0;

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    background-color: rgba(100, 104, 100, 0.08);
  }

  &:active {
    background-color: rgba(100, 104, 100, 0.16);
  }
`

interface SaveToastProps {
  title: string
  description?: string
  onDismiss: () => void
}

const HOLD_MS = 3000
const EXIT_MS = 250

export default function SaveToast({ title, description, onDismiss }: SaveToastProps) {
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const holdTimer = setTimeout(() => setLeaving(true), HOLD_MS)
    const exitTimer = setTimeout(onDismiss, HOLD_MS + EXIT_MS)
    return () => {
      clearTimeout(holdTimer)
      clearTimeout(exitTimer)
    }
  }, [onDismiss])

  return (
    <Toast role="status" $leaving={leaving}>
      <CheckIcon />
      <TextContent>
        <Message>{title}</Message>
        {description && <Description>{description}</Description>}
      </TextContent>
      <DismissButton aria-label="Dismiss" onClick={onDismiss}>
        <XSmallIcon />
      </DismissButton>
    </Toast>
  )
}
