import { useState, useRef, useEffect, useCallback } from 'react'
import styled, { keyframes } from 'styled-components'
import { IconButton } from '@zendeskgarden/react-buttons'
import HistoryIcon from '../assets/history.svg?react'
import EditIcon from '../assets/edit.svg?react'
import XIcon from '@zendesk-ui/assets/icons/20px/x-fill.svg?react'
import PlusStrokeIcon from '@zendeskgarden/svg-icons/src/16/plus-stroke.svg?react'
import PaperPlaneIcon from '@zendesk-ui/assets/icons/20px/paper-plane-fill.svg?react'
import CopilotIcon from '../assets/sparkle-fill.svg?react'
import { InteractiveButton } from './InteractiveButton'
import Markdown from 'react-markdown'
import AuroraGlow from './AuroraGlow'
import { streamChat } from '../services/bedrock'
import type { ChatMessage } from '../services/bedrock'

interface Message {
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
}

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

const HeaderIconButton = styled(IconButton)`
  border-radius: 99px;

  && svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    background-color: rgba(100, 104, 100, 0.08);
  }

  &:focus-visible {
    background-color: rgba(100, 104, 100, 0.08);
    box-shadow: inset 0 0 0 3px #406cc4, inset 0 0 0 4px white;
  }

  &:active {
    background-color: rgba(100, 104, 100, 0.16);
  }
`

const ConversationTitle = styled.span`
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: #313131;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  transition: border-color 150ms ease-in-out, box-shadow 150ms ease-in-out;

  &:hover {
    border-color: #a89dc4;
  }

  &:focus-within {
    border-color: #885BB3;
    box-shadow: 0px 2px 8px 0px #c5afda, 0px 8px 20px 0px #e2dbed, 0 0 0 3px rgba(136, 91, 179, 0.2);
  }
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

  transition: background-color 150ms ease-in-out, color 150ms ease-in-out;

  &:hover {
    background: rgba(136, 91, 179, 0.08);
    color: #885BB3;
  }

  &:focus-visible {
    outline: 2px solid #885BB3;
    outline-offset: -2px;
    background: rgba(136, 91, 179, 0.08);
  }

  &:active {
    background: rgba(136, 91, 179, 0.16);
    color: #7b61c2;
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

const SendButton = styled.button<{ $disabled?: boolean }>`
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
  cursor: ${({ $disabled }) => $disabled ? 'default' : 'pointer'};
  opacity: ${({ $disabled }) => $disabled ? 0.4 : 1};
  flex-shrink: 0;
  margin-right: 8px;

  svg {
    width: 16px;
    height: 16px;
    color: white;
  }

  transition: background-color 150ms ease-in-out, transform 100ms ease-in-out, opacity 150ms ease-in-out;

  &:hover {
    background: ${({ $disabled }) => $disabled ? '#313131' : '#49484a'};
  }

  &:focus-visible {
    outline: 2px solid #885BB3;
    outline-offset: 2px;
  }

  &:active {
    background: ${({ $disabled }) => $disabled ? '#313131' : '#1a1a1a'};
    transform: ${({ $disabled }) => $disabled ? 'none' : 'scale(0.95)'};
  }
`

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const UserBubble = styled.div`
  align-self: flex-end;
  background: #f9f5fa;
  border-radius: 16px 4px 16px 16px;
  padding: 10px 12px;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #313131;
  max-width: 85%;
  word-wrap: break-word;
`

const AssistantMessage = styled.div`
  align-self: flex-start;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #313131;
  max-width: 100%;
  word-wrap: break-word;

  p { margin: 0 0 8px; &:last-child { margin-bottom: 0; } }
  h1, h2, h3, h4 { margin: 12px 0 4px; font-size: 14px; font-weight: 600; line-height: 20px; }
  h1 { font-size: 16px; line-height: 22px; }
  h2 { font-size: 15px; line-height: 21px; }
  ul, ol { margin: 0 0 8px; padding-left: 20px; }
  li { margin-bottom: 2px; }
  code { background: #f5f3f0; padding: 1px 4px; border-radius: 4px; font-size: 13px; }
  pre { background: #f5f3f0; padding: 8px 12px; border-radius: 8px; margin: 0 0 8px; overflow-x: auto;
    code { background: none; padding: 0; }
  }
  strong { font-weight: 600; }
`

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`

const ThinkingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  align-self: flex-start;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #885bb3;
    flex-shrink: 0;
  }
`

const ThinkingText = styled.span`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  background: linear-gradient(90deg, #885bb3 25%, #c5afda 50%, #885bb3 75%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${shimmer} 2s linear infinite;
`

const StopIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="3" y="3" width="10" height="10" rx="2" fill="currentColor" />
  </svg>
)

interface CopilotPanelProps {
  onClose: () => void
}

export default function CopilotPanel({ onClose }: CopilotPanelProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const isConversation = messages.length > 0
  const conversationTitle = messages.find(m => m.role === 'user')?.content ?? ''

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = useCallback((text?: string) => {
    const content = (text ?? inputValue).trim()
    if (!content || isGenerating) return

    setInputValue('')

    const userMessage: Message = { role: 'user', content }
    const assistantMessage: Message = { role: 'assistant', content: '', isStreaming: true }

    setMessages(prev => [...prev, userMessage, assistantMessage])
    setIsGenerating(true)

    const controller = new AbortController()
    abortRef.current = controller

    const chatMessages: ChatMessage[] = [
      ...messages.filter(m => m.content),
      { role: 'user', content },
    ].map(({ role, content }) => ({ role, content }))

    streamChat(
      chatMessages,
      (chunk) => {
        setMessages(prev => {
          const updated = [...prev]
          const last = updated[updated.length - 1]
          if (last.role === 'assistant') {
            updated[updated.length - 1] = { ...last, content: last.content + chunk }
          }
          return updated
        })
      },
      () => {
        setMessages(prev => {
          const updated = [...prev]
          const last = updated[updated.length - 1]
          if (last.role === 'assistant') {
            updated[updated.length - 1] = { ...last, isStreaming: false }
          }
          return updated
        })
        setIsGenerating(false)
        abortRef.current = null
      },
      (error) => {
        setMessages(prev => {
          const updated = [...prev]
          const last = updated[updated.length - 1]
          if (last.role === 'assistant') {
            updated[updated.length - 1] = {
              ...last,
              content: last.content + '\n\n[Error: Failed to get response]',
              isStreaming: false,
            }
          }
          return updated
        })
        setIsGenerating(false)
        abortRef.current = null
        console.error('Stream error:', error)
      },
      controller.signal
    )
  }, [inputValue, isGenerating, messages])

  const handleStop = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    setMessages(prev => {
      const updated = [...prev]
      const last = updated[updated.length - 1]
      if (last?.role === 'assistant') {
        updated[updated.length - 1] = { ...last, isStreaming: false }
      }
      return updated
    })
    setIsGenerating(false)
  }, [])

  const handleNewConversation = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    setMessages([])
    setInputValue('')
    setIsGenerating(false)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const canSend = inputValue.trim().length > 0 && !isGenerating

  return (
    <Panel>
      <Header>
        {isConversation && (
          <ConversationTitle>{conversationTitle}</ConversationTitle>
        )}
        <HeaderIconButton size="small" aria-label="History">
          <HistoryIcon />
        </HeaderIconButton>
        <HeaderIconButton size="small" aria-label="New conversation" onClick={handleNewConversation}>
          <EditIcon />
        </HeaderIconButton>
        <HeaderIconButton size="small" aria-label="Close" onClick={onClose}>
          <XIcon />
        </HeaderIconButton>
      </Header>

      {!isConversation && (
        <>
          <AuroraGlow />
          <Content>
            <Title>
              <SparkleIcon />
              <Heading>How can I help?</Heading>
            </Title>
            <Suggestions>
              <InteractiveButton onClick={() => handleSend('Route specific ticket to assignee')}>
                Route specific ticket to assignee
              </InteractiveButton>
              <InteractiveButton onClick={() => handleSend('Create a view of pending status tickets')}>
                Create a view of pending status tickets
              </InteractiveButton>
              <InteractiveButton onClick={() => handleSend('Explain intent')}>
                Explain intent
              </InteractiveButton>
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
        </>
      )}

      {isConversation && (
        <MessagesContainer>
          {messages.map((msg, i) => {
            if (msg.role === 'user') {
              return <UserBubble key={i}>{msg.content}</UserBubble>
            }
            if (msg.isStreaming && !msg.content) {
              return (
                <ThinkingIndicator key={i}>
                  <ThinkingText>Thinking…</ThinkingText>
                </ThinkingIndicator>
              )
            }
            return (
              <AssistantMessage key={i}>
                <Markdown>{msg.content}</Markdown>
                {msg.isStreaming && msg.content && (
                  <ThinkingText> ●</ThinkingText>
                )}
              </AssistantMessage>
            )
          })}
          <div ref={messagesEndRef} />
        </MessagesContainer>
      )}

      <Footer>
        <InputContainer>
          <InputIconButton aria-label="Add attachment">
            <PlusStrokeIcon />
          </InputIconButton>
          <InputField
            placeholder="Ask admin copilot"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {isGenerating ? (
            <SendButton aria-label="Stop" onClick={handleStop}>
              <StopIcon />
            </SendButton>
          ) : (
            <SendButton
              aria-label="Send"
              $disabled={!canSend}
              onClick={() => canSend && handleSend()}
            >
              <PaperPlaneIcon />
            </SendButton>
          )}
        </InputContainer>
      </Footer>
    </Panel>
  )
}
