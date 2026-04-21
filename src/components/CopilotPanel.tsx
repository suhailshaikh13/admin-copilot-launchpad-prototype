import React, { useState, useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react'
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
import FloatIn from './FloatIn'
import AuroraGlow from './AuroraGlow'
import { CopilotErrorMessage } from './CopilotErrorMessage'
import { streamChat, parseSuggestions, getCannedResponse } from '../services/bedrock'
import type { ChatMessage } from '../services/bedrock'

interface Message {
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
  isError?: boolean
  suggestions?: string[]
}

interface SavedConversation {
  id: string
  title: string
  messages: Message[]
  savedAt: number
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

const HeaderIconButton = styled(IconButton)<{ $active?: boolean }>`
  border-radius: 99px;
  background-color: ${({ $active }) => ($active ? 'rgba(100, 104, 100, 0.16)' : 'transparent')};

  && svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    background-color: ${({ $active }) => ($active ? 'rgba(100, 104, 100, 0.16)' : 'rgba(100, 104, 100, 0.08)')};
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

const fadeOut = keyframes`
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-4px); }
`

const Suggestions = styled.div<{ $exiting?: boolean }>`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  position: relative;
  z-index: 1;
  animation: ${({ $exiting }) => $exiting ? fadeOut : fadeIn} ${({ $exiting }) => $exiting ? '200ms' : '300ms'} ease-out;
  animation-fill-mode: forwards;
`

const Disclaimer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px 96px;
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

const Footer = styled.div<{ $scrim?: boolean }>`
  padding: ${({ $scrim }) => ($scrim ? '36px 20px 20px' : '20px')};
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2;
  background: ${({ $scrim }) =>
    $scrim
      ? 'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, white 50%)'
      : 'transparent'};
  pointer-events: none;

  > * {
    pointer-events: auto;
  }
`

const InputContainer = styled.div<{ $showPlus?: boolean; $disabled?: boolean; $glow?: boolean }>`
  display: flex;
  align-items: center;
  min-height: 48px;
  border: 1px solid ${({ $disabled }) => ($disabled ? '#dcdcda' : '#b7b7b3')};
  border-radius: 99px;
  background: ${({ $disabled }) => ($disabled ? 'rgba(100, 104, 100, 0.08)' : 'white')};
  box-shadow: ${({ $disabled, $glow }) => ($disabled || !$glow ? 'none' : '0px 2px 8px 0px #c5afda, 0px 8px 20px 0px #e2dbed')};
  padding-left: ${({ $showPlus }) => ($showPlus ? '8px' : '20px')};
  transition: border-color 150ms ease-out, box-shadow 150ms ease-out;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'text')};

  &:hover {
    border-color: ${({ $disabled }) => ($disabled ? '#dcdcda' : '#8d59b1')};
  }

  &:focus-within {
    border-color: ${({ $disabled }) => ($disabled ? '#dcdcda' : '#8d59b1')};
    outline: ${({ $disabled }) => ($disabled ? 'none' : '2px solid #8d59b1')};
    outline-offset: -1px;
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

  transition: background-color 150ms ease-out, color 150ms ease-out;

  &:hover {
    background: rgba(136, 91, 179, 0.08);
    color: #8D59B1;
  }

  &:focus-visible {
    outline: 2px solid #8D59B1;
    outline-offset: -2px;
    background: rgba(136, 91, 179, 0.08);
  }

  &:active {
    background: rgba(136, 91, 179, 0.16);
    color: #7b61c2;
  }
`

const InputField = styled.input<{ $showPlus?: boolean; $disabled?: boolean }>`
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: -0.154px;
  color: #313131;
  padding: 10px 12px 10px ${({ $showPlus }) => ($showPlus ? '4px' : '0')};
  background: transparent;
  pointer-events: ${({ $disabled }) => ($disabled ? 'none' : 'auto')};

  &::placeholder {
    color: #8b8e89;
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

  transition: background-color 150ms ease-out, transform 100ms ease-out, opacity 150ms ease-out;

  &:hover {
    background: ${({ $disabled }) => $disabled ? '#313131' : '#49484a'};
  }

  &:focus-visible {
    outline: 2px solid #8D59B1;
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
  padding: 0 20px 88px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const ScrollSpacer = styled.div`
  flex-shrink: 0;
`

const HistoryContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  box-sizing: border-box;
  width: 100%;
`

const HistorySectionHeader = styled.div`
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: #68737d;
  padding: 12px 20px 4px 20px;
`

const HistoryItemButton = styled.button<{ $active?: boolean }>`
  width: calc(100% - 40px);
  margin: 0 20px;
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  background: ${({ $active }) => ($active ? 'rgba(100, 104, 100, 0.16)' : 'transparent')};
  cursor: pointer;
  text-align: left;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #2f3130;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: background-color 150ms ease-out;
  box-sizing: border-box;

  &:hover {
    background: ${({ $active }) =>
      $active ? 'rgba(100, 104, 100, 0.16)' : 'rgba(100, 104, 100, 0.08)'};
  }

  &:focus-visible {
    outline: 2px solid #8d59b1;
    outline-offset: -2px;
  }
`

const UserBubble = styled.div`
  background: #f9f5fa;
  border-radius: 16px 4px 16px 16px;
  padding: 10px 12px;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #313131;
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
  0% { background-position: -400px center; }
  100% { background-position: 400px center; }
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
    background: #8D59B1;
    flex-shrink: 0;
  }
`

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const InlineSuggestions = styled.div<{ $exiting?: boolean }>`
  align-self: flex-end;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
  animation: ${({ $exiting }) => $exiting ? fadeOut : fadeIn} ${({ $exiting }) => $exiting ? '200ms' : '300ms'} ease-out;
  animation-fill-mode: forwards;
`

const ThinkingText = styled.span`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  background: linear-gradient(90deg, #8D59B1 25%,rgb(255, 255, 255) 50%, #8D59B1 75%);
  background-size: 400px auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${shimmer} 3500ms ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

const THINKING_PHRASES = ['Thinking', 'Working on it', 'Getting there', 'Almost done'] as const
const THINKING_PHRASE_MS = 3500

function ThinkingStatusText() {
  const [phraseIndex, setPhraseIndex] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => {
      setPhraseIndex((i) => (i + 1) % THINKING_PHRASES.length)
    }, THINKING_PHRASE_MS)
    return () => clearInterval(id)
  }, [])

  return <ThinkingText>{THINKING_PHRASES[phraseIndex]}</ThinkingText>
}

const StopIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="3" y="3" width="10" height="10" rx="2" fill="currentColor" />
  </svg>
)

export interface CopilotPanelHandle {
  sendMessage: (text: string) => void
}

interface CopilotPanelProps {
  openCount: number
  onClose: () => void
  onNavigateToSetupGuide?: () => void
  showPlus?: boolean
}

const CopilotPanel = forwardRef<CopilotPanelHandle, CopilotPanelProps>(function CopilotPanel({ openCount, onClose, onNavigateToSetupGuide, showPlus = false }, ref) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [suggestionsExiting, setSuggestionsExiting] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [conversations, setConversations] = useState<SavedConversation[]>([])
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const lastUserMessageRef = useRef<HTMLDivElement>(null)
  const prevMessagesLenRef = useRef(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const pendingSendRef = useRef<string | null>(null)
  const spacerRef = useRef<HTMLDivElement>(null)
  const [spacerHeight, setSpacerHeight] = useState(0)

  const isConversation = messages.length > 0
  const conversationTitle = messages.find(m => m.role === 'user')?.content ?? ''

  const updateSpacerHeight = useCallback(() => {
    const container = messagesContainerRef.current
    const userMsg = lastUserMessageRef.current
    const spacer = spacerRef.current
    if (!container || !userMsg || !spacer) return

    // Temporarily collapse spacer so it doesn't affect measurement
    const prevHeight = spacer.style.minHeight
    spacer.style.minHeight = '0px'

    const containerH = container.clientHeight
    const userMsgTop = userMsg.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop
    const contentHeight = container.scrollHeight
    const contentBelowUserMsg = contentHeight - userMsgTop
    const needed = Math.max(0, containerH - contentBelowUserMsg + 16)

    spacer.style.minHeight = prevHeight
    setSpacerHeight(needed)
  }, [])

  useEffect(() => {
    const prevLen = prevMessagesLenRef.current
    prevMessagesLenRef.current = messages.length

    if (messages.length === 0) return

    const lastMessage = messages[messages.length - 1]

    // User just sent a message (user + empty assistant added together)
    // Scroll so the user message sits near the top with some padding
    if (
      messages.length >= 2 &&
      messages.length - prevLen === 2 &&
      lastMessage.role === 'assistant' &&
      lastMessage.isStreaming &&
      !lastMessage.content
    ) {
      requestAnimationFrame(() => {
        updateSpacerHeight()
        requestAnimationFrame(() => {
          const container = messagesContainerRef.current
          const userMsg = lastUserMessageRef.current
          if (!container || !userMsg) return
          const containerRect = container.getBoundingClientRect()
          const msgRect = userMsg.getBoundingClientRect()
          const scrollTarget = container.scrollTop + (msgRect.top - containerRect.top) - 16
          container.scrollTo({ top: scrollTarget, behavior: 'smooth' })
        })
      })
      return
    }

    // Content changed (response arrived) — recalculate spacer
    requestAnimationFrame(() => updateSpacerHeight())
  }, [messages, updateSpacerHeight])

  useEffect(() => {
    const container = messagesContainerRef.current
    if (!container) return
    const observer = new ResizeObserver(() => {
      updateSpacerHeight()
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [isConversation, updateSpacerHeight])

  useEffect(() => {
    if (openCount > 0) {
      inputRef.current?.focus()
    }
  }, [openCount])

  // Sync current conversation to history as messages change
  useEffect(() => {
    if (activeConversationId && messages.length > 0) {
      const cleanedMessages = messages.map(m =>
        m.isStreaming ? { ...m, isStreaming: false } : m
      )
      setConversations(prev =>
        prev.map(c =>
          c.id === activeConversationId
            ? { ...c, messages: cleanedMessages, savedAt: Date.now() }
            : c
        )
      )
    }
  }, [messages, activeConversationId])

  const saveCurrentConversation = useCallback(() => {
    if (messages.length === 0) return

    // Clean streaming flags before saving
    const cleanedMessages = messages.map(m =>
      m.isStreaming ? { ...m, isStreaming: false } : m
    )

    if (activeConversationId) {
      // Update existing conversation in place
      setConversations(prev =>
        prev.map(c =>
          c.id === activeConversationId
            ? { ...c, messages: cleanedMessages, savedAt: Date.now() }
            : c
        )
      )
    } else {
      // Save as new conversation
      const title = messages.find(m => m.role === 'user')?.content ?? 'Untitled'
      const newConversation: SavedConversation = {
        id: crypto.randomUUID(),
        title,
        messages: cleanedMessages,
        savedAt: Date.now(),
      }
      setConversations(prev => [newConversation, ...prev])
    }
  }, [messages, activeConversationId])

  const handleSend = useCallback((text?: string) => {
    const content = (text ?? inputValue).trim()
    if (!content || isGenerating) return

    setInputValue('')

    setMessages(prev => {
      const lastAssistantIdx = prev.findLastIndex(m => m.role === 'assistant')
      if (lastAssistantIdx === -1 || !prev[lastAssistantIdx].suggestions?.length) return prev
      const updated = [...prev]
      updated[lastAssistantIdx] = { ...updated[lastAssistantIdx], suggestions: undefined }
      return updated
    })

    const userMessage: Message = { role: 'user', content }
    const assistantMessage: Message = { role: 'assistant', content: '', isStreaming: true }

    setMessages(prev => [...prev, userMessage, assistantMessage])
    setIsGenerating(true)

    // Create conversation immediately on first message
    if (messages.length === 0 && !activeConversationId) {
      const newConversation: SavedConversation = {
        id: crypto.randomUUID(),
        title: content,
        messages: [userMessage, assistantMessage],
        savedAt: Date.now(),
      }
      setConversations(prev => [newConversation, ...prev])
      setActiveConversationId(newConversation.id)
    }

    const cannedResponse = messages.length === 0 ? getCannedResponse(content) : undefined
    if (cannedResponse) {
      const parsed = parseSuggestions(cannedResponse)
      let charIndex = 0
      const interval = setInterval(() => {
        const chunkSize = Math.floor(Math.random() * 12) + 4
        const nextIndex = Math.min(charIndex + chunkSize, cannedResponse.length)
        const chunk = cannedResponse.slice(charIndex, nextIndex)
        charIndex = nextIndex

        setMessages(prev => {
          const updated = [...prev]
          const last = updated[updated.length - 1]
          if (last.role === 'assistant') {
            updated[updated.length - 1] = { ...last, content: last.content + chunk }
          }
          return updated
        })

        if (charIndex >= cannedResponse.length) {
          clearInterval(interval)
          setMessages(prev => {
            const updated = [...prev]
            const last = updated[updated.length - 1]
            if (last.role === 'assistant') {
              updated[updated.length - 1] = {
                ...last,
                content: parsed.content,
                suggestions: parsed.suggestions,
                isStreaming: false,
              }
            }
            return updated
          })
          setIsGenerating(false)
        }
      }, 15)
      return
    }

    const controller = new AbortController()
    abortRef.current = controller

    const chatMessages: ChatMessage[] = [
      ...messages.filter(m => m.content),
      { role: 'user' as const, content },
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
            const parsed = parseSuggestions(last.content)
            updated[updated.length - 1] = {
              ...last,
              content: parsed.content,
              suggestions: parsed.suggestions,
              isStreaming: false,
            }
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
              content: last.content || '',
              isError: true,
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
  }, [inputValue, isGenerating, messages, activeConversationId])

  useImperativeHandle(ref, () => ({
    sendMessage: (text: string) => handleSend(text),
  }), [handleSend])

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

    // Save current conversation before resetting
    saveCurrentConversation()

    setMessages([])
    setInputValue('')
    setIsGenerating(false)
    setSuggestionsExiting(false)
    setShowHistory(false)
    setActiveConversationId(null)
  }, [saveCurrentConversation])

  const handleSuggestionClick = useCallback((text: string) => {
    setSuggestionsExiting(true)
    pendingSendRef.current = text
    setTimeout(() => {
      if (pendingSendRef.current) {
        handleSend(pendingSendRef.current)
        pendingSendRef.current = null
      }
      setSuggestionsExiting(false)
    }, 200)
  }, [handleSend])

  const handleToggleHistory = useCallback(() => {
    setShowHistory(prev => !prev)
  }, [])

  const handleHistoryItemClick = useCallback((id: string) => {
    // Don't reload if already viewing this conversation
    if (id === activeConversationId) return

    // Abort any in-flight generation
    abortRef.current?.abort()
    abortRef.current = null

    // Save current conversation before switching
    saveCurrentConversation()

    // Load the selected conversation
    const conversation = conversations.find(c => c.id === id)
    if (!conversation) return

    setMessages([...conversation.messages])
    setActiveConversationId(id)
    setIsGenerating(false)
    setSuggestionsExiting(false)
    setShowHistory(false)
    setInputValue('')
  }, [activeConversationId, conversations, saveCurrentConversation])


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
        {showHistory && (
          <ConversationTitle>Conversations</ConversationTitle>
        )}
        {!showHistory && isConversation && (
          <ConversationTitle>{conversationTitle}</ConversationTitle>
        )}
        {conversations.length > 0 && (
          <HeaderIconButton size="small" aria-label="History" $active={showHistory} onClick={handleToggleHistory}>
            <HistoryIcon />
          </HeaderIconButton>
        )}
        <HeaderIconButton size="small" aria-label="New conversation" onClick={handleNewConversation}>
          <EditIcon />
        </HeaderIconButton>
        <HeaderIconButton size="small" aria-label="Close" onClick={onClose}>
          <XIcon />
        </HeaderIconButton>
      </Header>

      {showHistory && (
        <HistoryContainer>
          <HistorySectionHeader>Today</HistorySectionHeader>
          {conversations.map(conv => (
            <HistoryItemButton
              key={conv.id}
              $active={activeConversationId === conv.id}
              onClick={() => handleHistoryItemClick(conv.id)}
            >
              {conv.title}
            </HistoryItemButton>
          ))}
        </HistoryContainer>
      )}

      {!showHistory && !isConversation && (
        <>
          <AuroraGlow />
          <Content>
            <Title>
              <SparkleIcon />
              <Heading>How can I help?</Heading>
            </Title>
            <Suggestions key={openCount} $exiting={suggestionsExiting}>
              <InteractiveButton onClick={() => handleSuggestionClick('Route specific ticket to assignee')}>
                Route specific ticket to assignee
              </InteractiveButton>
              <InteractiveButton onClick={() => handleSuggestionClick('Create a view of pending status tickets')}>
                Create a view of pending status tickets
              </InteractiveButton>
              <InteractiveButton onClick={() => handleSuggestionClick('Explain intent')}>
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

      {!showHistory && isConversation && (
        <MessagesContainer ref={messagesContainerRef}>
          {messages.map((msg, i) => {
            if (msg.role === 'user') {
              const isLastUser = i === messages.findLastIndex(m => m.role === 'user')
              return (
                <FloatIn key={i} ref={isLastUser ? lastUserMessageRef : undefined} style={{ alignSelf: 'flex-end', maxWidth: '85%' }}>
                  <UserBubble>{msg.content}</UserBubble>
                </FloatIn>
              )
            }
            if (msg.isStreaming && !msg.content) {
              return (
                <ThinkingIndicator key={i}>
                  <ThinkingStatusText />
                </ThinkingIndicator>
              )
            }
            return (
              <React.Fragment key={i}>
                <AssistantMessage>
                  {msg.content && <Markdown>{msg.content}</Markdown>}
                  {msg.isError && onNavigateToSetupGuide && (
                    <CopilotErrorMessage onViewSetupGuide={onNavigateToSetupGuide} />
                  )}
                </AssistantMessage>
                {!msg.isStreaming && msg.suggestions && msg.suggestions.length > 0 && i === messages.length - 1 && (
                  <InlineSuggestions $exiting={suggestionsExiting}>
                    {msg.suggestions.map((suggestion, j) => (
                      <InteractiveButton
                        key={j}
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </InteractiveButton>
                    ))}
                  </InlineSuggestions>
                )}
              </React.Fragment>
            )
          })}
          <ScrollSpacer ref={spacerRef} style={{ minHeight: spacerHeight }} />
        </MessagesContainer>
      )}

      {!showHistory && (
        <Footer $scrim={isConversation}>
          <InputContainer $showPlus={showPlus} $glow={!isConversation}>
            {showPlus && (
              <InputIconButton aria-label="Add attachment">
                <PlusStrokeIcon />
              </InputIconButton>
            )}
            <InputField
              ref={inputRef}
              $showPlus={showPlus}
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
      )}
    </Panel>
  )
})

export default CopilotPanel
