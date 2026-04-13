import { useState, useCallback } from 'react'
import styled from 'styled-components'
import CopilotIcon from '../assets/sparkle-fill.svg?react'
import { BasicButton } from './BasicButton'
import { InteractiveButton } from './InteractiveButton'
import FloatIn from './FloatIn'

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

const replacementPool = [
  'Set up ticket routing rules',
  'Configure SLA policies',
  'Create a macro for common replies',
  'Automate ticket tagging',
  'Set up a custom ticket form',
  'View agent performance metrics',
]

interface GreetingsProps {
  onSuggestionClick?: (text: string) => void
}

export default function Greetings({ onSuggestionClick }: GreetingsProps) {
  const [expanded, setExpanded] = useState(false)
  const [suggestions, setSuggestions] = useState(initialSuggestions)
  const [extras, setExtras] = useState(extraSuggestions)
  const [, setPool] = useState(replacementPool)

  const handleClick = useCallback((text: string, list: 'main' | 'extra', index: number) => {
    onSuggestionClick?.(text)

    const setList = list === 'main' ? setSuggestions : setExtras
    setPool(prev => {
      if (prev.length > 0) {
        const randomIdx = Math.floor(Math.random() * prev.length)
        const replacement = prev[randomIdx]
        setList(items => items.map((s, i) => i === index ? replacement : s))
        return prev.filter((_, i) => i !== randomIdx)
      }
      setList(items => items.filter((_, i) => i !== index))
      return prev
    })
  }, [onSuggestionClick])

  return (
    <Container>
      <div>
        <Title>Good morning</Title>
        <SubheadingRow>
          <Subheading>Get help from admin copilot</Subheading>
          <SparkleIcon />
        </SubheadingRow>
      </div>
      <SuggestionRow>
        {suggestions.map((label, i) => (
          <FloatIn key={label} $delay={100 + i * 200}>
            <InteractiveButton onClick={() => handleClick(label, 'main', i)}>
              {label}
            </InteractiveButton>
          </FloatIn>
        ))}
        {!expanded && (
          <FloatIn $delay={700}>
            <BasicButton onClick={() => setExpanded(true)}>Show more</BasicButton>
          </FloatIn>
        )}
        {expanded && extras.map((label, i) => (
          <FloatIn key={label} $delay={i * 200}>
            <InteractiveButton onClick={() => handleClick(label, 'extra', i)}>
              {label}
            </InteractiveButton>
          </FloatIn>
        ))}
      </SuggestionRow>
    </Container>
  )
}
