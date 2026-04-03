import styled from 'styled-components'
import { IconButton } from '@zendeskgarden/react-buttons'
import HistoryIcon from '../assets/history.svg?react'
import EditIcon from '../assets/edit.svg?react'
import XIcon from '@zendesk-ui/assets/icons/20px/x-fill.svg?react'
import PlusStrokeIcon from '@zendeskgarden/svg-icons/src/16/plus-stroke.svg?react'
import PaperPlaneIcon from '@zendesk-ui/assets/icons/20px/paper-plane-fill.svg?react'
import CopilotIcon from '../assets/sparkle-fill.svg?react'
import { InteractiveButton } from './InteractiveButton'
import AuroraGlow from './AuroraGlow'

const Panel = styled.div`
  width: 360px;
  min-width: 360px;
  height: 100%;
  flex-shrink: 0;
  background: white;
  border-radius: 24px 24px 0 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 56px;
  box-sizing: border-box;
  padding: 12px 8px 12px 20px;
  flex-shrink: 0;
  gap: 4px;
  color: #706f6e;
`

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 32px;
  padding: 20px 20px 0;
  position: relative;
  overflow: hidden;
`

const Title = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;
  z-index: 1;
`

const SparkleIcon = styled(CopilotIcon)`
  width: 20px;
  height: 20px;
  color: #7b61c2;
`

const Heading = styled.h2`
  font-size: 22px;
  font-weight: 400;
  line-height: 28px;
  letter-spacing: 0.352px;
  color: #313131;
  margin: 0;
  width: 256px;
`

const Suggestions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  position: relative;
  z-index: 1;
`

const Disclaimer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px 8px;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
`

const DisclaimerBold = styled.p`
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  color: #706f6e;
  margin: 0;
`

const DisclaimerText = styled.p`
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: #848f99;
  margin: 0;
  text-align: center;
`

const Footer = styled.div`
  padding: 20px;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
`

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  min-height: 48px;
  border: 1px solid #b8b7b5;
  border-radius: 99px;
  background: white;
  box-shadow: 0px 2px 8px 0px #c5afda, 0px 8px 20px 0px #e2dbed;
  padding-left: 8px;
`

const InputIconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: none;
  cursor: pointer;
  flex-shrink: 0;
  color: #706f6e;

  svg {
    width: 16px;
    height: 16px;
  }
`

const InputField = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: -0.154px;
  color: #313131;
  padding: 10px 12px 10px 4px;
  background: transparent;

  &::placeholder {
    color: #8d8c8b;
  }
`

const SendButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  box-sizing: border-box;
  border-radius: 99px;
  border: none;
  background: #313131;
  cursor: pointer;
  flex-shrink: 0;
  margin-right: 8px;

  svg {
    width: 16px;
    height: 16px;
    color: white;
  }
`

interface CopilotPanelProps {
  onClose: () => void
}

export default function CopilotPanel({ onClose }: CopilotPanelProps) {
  return (
    <Panel>
      <Header>
        <IconButton size="small" aria-label="History">
          <HistoryIcon />
        </IconButton>
        <IconButton size="small" aria-label="Open in new window">
          <EditIcon />
        </IconButton>
        <IconButton size="small" aria-label="Close" onClick={onClose}>
          <XIcon />
        </IconButton>
      </Header>

      <AuroraGlow />
      <Content>
        <Title>
          <SparkleIcon />
          <Heading>How can I help?</Heading>
        </Title>
        <Suggestions>
          <InteractiveButton>Route specific ticket to assignee</InteractiveButton>
          <InteractiveButton>Create a view of pending status tickets</InteractiveButton>
          <InteractiveButton>Explain intent</InteractiveButton>
        </Suggestions>
      </Content>

      <Disclaimer>
        <DisclaimerBold>Powered by AI</DisclaimerBold>
        <DisclaimerText>
          AI content can be inaccurate or misleading.
          <br />
          Review it carefully.
        </DisclaimerText>
      </Disclaimer>

      <Footer>
        <InputContainer>
          <InputIconButton aria-label="Add attachment">
            <PlusStrokeIcon />
          </InputIconButton>
          <InputField placeholder="Ask admin copilot" />
          <SendButton aria-label="Send">
            <PaperPlaneIcon />
          </SendButton>
        </InputContainer>
      </Footer>
    </Panel>
  )
}
