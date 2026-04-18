import styled from 'styled-components'
import { Alert } from '@zendeskgarden/react-notifications'
import { Button } from '@zendeskgarden/react-buttons'

interface CopilotErrorMessageProps {
  onViewSetupGuide: () => void
}

const StyledAlert = styled(Alert)`
  margin-top: 12px;
`

const AlertContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const StyledButton = styled(Button)`
  align-self: flex-start;
  font-size: 13px;
`

export function CopilotErrorMessage({ onViewSetupGuide }: CopilotErrorMessageProps) {
  return (
    <StyledAlert type="warning">
      <AlertContent>
        <Alert.Title>Unable to connect to the AI service</Alert.Title>
        <Alert.Paragraph>
          This app needs to run locally for the copilot to work.
        </Alert.Paragraph>
        <StyledButton onClick={onViewSetupGuide} size="small" isPrimary>
          View setup guide
        </StyledButton>
      </AlertContent>
    </StyledAlert>
  )
}
