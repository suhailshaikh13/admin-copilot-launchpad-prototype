import styled from 'styled-components'
import CopilotIcon from '../assets/sparkle-fill.svg?react'
import OverflowVerticalStrokeIcon from '@zendeskgarden/svg-icons/src/16/overflow-vertical-stroke.svg?react'
import { IconButton } from '@zendeskgarden/react-buttons'
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
  gap: 8px;
`

const SuggestionPill = styled.button<{ $highlighted?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 10px 16px;
  border-radius: 99px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: -0.154px;
  color: #313131;
  background: ${({ $highlighted }) =>
    $highlighted
      ? 'rgba(125, 120, 103, 0.16)'
      : 'rgba(125, 120, 103, 0.08)'};
  position: relative;
  overflow: hidden;

  &:hover {
    background: rgba(125, 120, 103, 0.16);
  }
`

const OverflowButton = styled(IconButton)`
  border-radius: 99px;
`

export default function Greetings() {
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
        <OverflowButton size="medium" aria-label="More suggestions">
          <OverflowVerticalStrokeIcon />
        </OverflowButton>
      </SuggestionRow>
    </Container>
  )
}
