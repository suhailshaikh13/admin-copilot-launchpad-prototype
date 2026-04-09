import { useState } from 'react'
import styled from 'styled-components'
import CopilotIcon from '../assets/sparkle-fill.svg?react'
import { BasicButton } from './BasicButton'
import { InteractiveButton } from './InteractiveButton'

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

const ExtraSuggestion = styled.div<{ $visible: boolean }>`
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: translateY(${({ $visible }) => ($visible ? '0' : '-8px')});
  transition: opacity 200ms ease-out, transform 200ms ease-out;
`

const extraSuggestions = [
  'Enable Auto Assist for a top agents',
  'Write an AI procedure based on a PDF',
  'Escalate tickets with negative sentiment',
]

export default function Greetings() {
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
      <SuggestionRow>
        <InteractiveButton>What can copilot do?</InteractiveButton>
        <InteractiveButton>Create a view of pending tickets</InteractiveButton>
        <InteractiveButton>Learn about admin copilot</InteractiveButton>
        {!expanded && (
          <BasicButton onClick={() => setExpanded(true)}>Show more</BasicButton>
        )}
        {expanded && extraSuggestions.map((label) => (
          <ExtraSuggestion key={label} $visible={expanded}>
            <InteractiveButton>{label}</InteractiveButton>
          </ExtraSuggestion>
        ))}
      </SuggestionRow>
    </Container>
  )
}
