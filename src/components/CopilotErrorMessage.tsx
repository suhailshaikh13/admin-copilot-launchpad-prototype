import styled from 'styled-components'

interface CopilotErrorMessageProps {
  onViewSetupGuide: () => void
}

const WarningBox = styled.div`
  margin-top: 12px;
  background: #fff8ed;
  border: 1px solid #e8b84b;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const WarningTitle = styled.p`
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: #2f3130;
  margin: 0;
`

const WarningText = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #2f3130;
  margin: 0;
`

const WarningButton = styled.button`
  align-self: flex-start;
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  color: white;
  background: #1f73b7;
  border: none;
  border-radius: 4px;
  padding: 4px 12px;
  cursor: pointer;
  font-family: inherit;

  &:hover { background: #1a69a4; }
  &:focus-visible { outline: 2px solid #8d59b1; outline-offset: 2px; }
`

export function CopilotErrorMessage({ onViewSetupGuide }: CopilotErrorMessageProps) {
  return (
    <WarningBox>
      <WarningTitle>Unable to connect to the AI service</WarningTitle>
      <WarningText>
        This app needs to run locally for further responses from the copilot to work.
      </WarningText>
      <WarningButton onClick={onViewSetupGuide}>
        View setup guide
      </WarningButton>
    </WarningBox>
  )
}
