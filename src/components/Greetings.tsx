import { useState } from 'react'
import styled, { keyframes } from 'styled-components'
import CopilotIcon from '../assets/sparkle-fill.svg?react'
import { BasicButton } from './BasicButton'
import { QuickPrompt } from '@zendesk-ui/ai-assistant-chat'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const Title = styled.h1`
  font-size: 26px;
  font-weight: 400;
  line-height: 32px;
  letter-spacing: 0.35px;
  color: #313131;
  margin: 0;
`

const SubheadingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const Subheading = styled.p`
  font-size: 18px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: -0.45px;
  color: #706f6e;
  margin: 0;
`

const SparkleIcon = styled(CopilotIcon)`
  width: 20px;
  height: 20px;
  color: #7b61c2;
`

const SuggestionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 8px;
`

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const FadeIn = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  animation: ${fadeIn} 300ms ease-out;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

const initialSuggestions = [
  'What can copilot do?',
  'Create a view of pending tickets',
  'Learn about admin copilot',
]

const extraSuggestions = [
  'Enable Auto Assist for top agents',
  'Write an AI procedure based on a PDF',
  'Escalate tickets with negative sentiment',
]

interface GreetingsProps {
  onSuggestionClick?: (text: string) => void
}

export default function Greetings({ onSuggestionClick }: GreetingsProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Container>
      <div>
        <Title>Good morning</Title>
        <SubheadingRow>
          <Subheading>Get help from admin copilot</Subheading>
          <SparkleIcon />
        </SubheadingRow>
      </div>
      <FadeIn>
        <SuggestionRow>
          {initialSuggestions.map((label) => (
            <QuickPrompt showIcon={false} key={label} onClick={() => onSuggestionClick?.(label)}>
              {label}
            </QuickPrompt>
          ))}
          {!expanded && (
            <BasicButton onClick={() => setExpanded(true)}>Show more</BasicButton>
          )}
          {expanded && (
            <FadeIn>
              {extraSuggestions.map((label) => (
                <QuickPrompt showIcon={false} key={label} onClick={() => onSuggestionClick?.(label)}>
                  {label}
                </QuickPrompt>
              ))}
            </FadeIn>
          )}
        </SuggestionRow>
      </FadeIn>
    </Container>
  )
}
