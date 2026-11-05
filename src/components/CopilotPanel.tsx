import React, { useState, useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react'
import styled, { keyframes } from 'styled-components'
import { IconButton } from '@zendesk-ui/react-components'
import BubblesStrokeIcon from '../assets/bubbles-stroke.svg?react'
import ChevronLeftIcon from '../assets/chevron-left.svg?react'
import ChevronDownIcon from '../assets/chevron-down.svg?react'
import ChevronUpIcon from '../assets/chevron-up.svg?react'
import NotePencilStrokeIcon from '../assets/note-pencil-stroke.svg?react'
import ArrowDiagonalOutIcon from '../assets/arrow-diagonal-out.svg?react'
import ArrowDiagonalInIcon from '../assets/arrow-diagonal-in.svg?react'
import XIcon from '@zendesk-ui/assets/icons/20px/x-fill.svg?react'
import DotsVerticalFillIcon from '@zendesk-ui/assets/icons/20px/dots-vertical-fill.svg?react'
import PlusStrokeIcon from '@zendeskgarden/svg-icons/src/16/plus-stroke.svg?react'
import PaperPlaneIcon from '@zendesk-ui/assets/icons/20px/paper-plane-fill.svg?react'
import CopilotIcon from '../assets/sparkle-fill.svg?react'
import { QuickPrompt } from '@zendesk-ui/ai-assistant-chat'
import Markdown from 'react-markdown'
import FloatIn from './FloatIn'
import AuroraGlow from './AuroraGlow'
import { CopilotErrorMessage } from './CopilotErrorMessage'
import { streamChat, parseSuggestions, parseAssistantPayload, getCannedResponse } from '../services/bedrock'
import type { AssistantWidget } from '../services/bedrock'
import type { LaunchpadStage } from '../launchpad/types'
import type { ChatMessage } from '../services/bedrock'
import CopilotTeamInviteWidget from './CopilotTeamInviteWidget'
import CopilotSampleTicketWidget from './CopilotSampleTicketWidget'
import CopilotHelpCenterPreviewWidget from './CopilotHelpCenterPreviewWidget'
import AssistantMessageFeedback from './AssistantMessageFeedback'
import type { HelpCenterCompletionSummary } from '../launchpad/helpCenterArticles'
import type { TeamInviteEntry } from '../launchpad/teamInvite'
import type { SampleTicketPhase, ReplyRefinementPrompt } from '../launchpad/sampleTicket'
import { REFINED_REPLIES, sampleTicketRefinementLine } from '../launchpad/sampleTicket'

interface Message {
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
  isError?: boolean
  suggestions?: string[]
  widget?: AssistantWidget
  sampleTicketPhase?: SampleTicketPhase
  sampleTicketReply?: string
  sampleTicketDraftReply?: string
  sampleTicketDraftActive?: boolean
}

function isLastAssistantInStreak(messages: Message[], index: number): boolean {
  const msg = messages[index]
  if (msg.role !== 'assistant') return false
  const next = messages[index + 1]
  return !next || next.role === 'user'
}

function assistantStreakFeedbackContent(messages: Message[], lastIndex: number): string {
  let start = lastIndex
  while (start > 0) {
    const prev = messages[start - 1]
    if (prev.role !== 'assistant' || prev.isStreaming || prev.isError) break
    start -= 1
  }

  const parts: string[] = []
  for (let i = start; i <= lastIndex; i += 1) {
    const entry = messages[i]
    if (entry.role === 'assistant' && entry.content && !entry.isError) {
      parts.push(entry.content)
    }
  }
  return parts.join('\n\n')
}

interface SavedConversation {
  id: string
  title: string
  messages: Message[]
  savedAt: number
}

const Panel = styled.div`
  width: 100%;
  min-width: 0;
  height: 100%;
  flex-shrink: 0;
  background: white;
  border-radius: 24px 24px 0 0;
  display: flex;
  flex-direction: column;
  overflow: clip;
  position: relative;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  height: 56px;
  box-sizing: border-box;
  padding: 12px;
  flex-shrink: 0;
  gap: 12px;
  color: #706f6e;

  svg {
    width: 20px !important;
    height: 20px !important;
  }
`

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  min-width: 0;
`

const HeaderIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

const SmallIcon = styled.span`
  display: flex;
  svg {
    width: 16px !important;
    height: 16px !important;
  }
`

const FloatingTooltip = styled.span<{ $x: number; $y: number; $align?: 'center' | 'end' }>`
  position: fixed;
  top: ${({ $y }) => $y}px;
  left: ${({ $x }) => $x}px;
  transform: ${({ $align }) => $align === 'end' ? 'translateX(-100%)' : 'translateX(-50%)'};
  background: #1f1f1f;
  color: white;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  padding: 6px 10px;
  border-radius: 6px;
  white-space: nowrap;
  pointer-events: none;
  z-index: 9999;

  &::before {
    content: '';
    position: absolute;
    top: -5px;
    left: ${({ $align }) => $align === 'end' ? 'auto' : '50%'};
    right: ${({ $align }) => $align === 'end' ? '10px' : 'auto'};
    transform: ${({ $align }) => $align === 'end' ? 'none' : 'translateX(-50%)'};
    border: 5px solid transparent;
    border-top: none;
    border-bottom-color: #1f1f1f;
  }
`


const ConversationTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: #313131;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
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
  max-width: 720px;
  width: 100%;
  margin: 0 auto;
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
  box-sizing: border-box;
  max-width: 680px;
  width: 100%;
  margin: 0 auto;
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
  width: 100%;
  display: flex;
  flex-direction: column;
`

const MessagesInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0 20px 88px;
  box-sizing: border-box;
  max-width: 720px;
  width: 100%;
  margin: 0 auto;
`

const ScrollSpacer = styled.div`
  flex-shrink: 0;
`

const HistoryContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  box-sizing: border-box;
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
`

const HistorySectionHeader = styled.div`
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: #646864;
  padding: 20px 0 8px;
`

const HistoryItemActions = styled.div`
  flex-shrink: 0;
  opacity: 0;
  pointer-events: none;
  transition: opacity 150ms ease-out;
`

const HistoryItemText = styled.span`
  flex: 1;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #2f3130;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
`

const HistoryItemButton = styled.div<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  max-height: 36px;
  padding: 8px 4px 8px 12px;
  border-radius: 4px;
  border: none;
  text-align: left;
  background: ${({ $active }) => ($active ? 'rgba(100, 104, 100, 0.16)' : 'transparent')};
  cursor: pointer;
  box-sizing: border-box;
  transition: background-color 150ms ease-out;

  &:hover {
    background: ${({ $active }) =>
      $active ? 'rgba(100, 104, 100, 0.16)' : 'rgba(100, 104, 100, 0.08)'};
  }

  &:hover ${HistoryItemActions},
  &:focus-visible ${HistoryItemActions} {
    opacity: 1;
    pointer-events: auto;
  }

  &:focus-visible {
    outline: 2px solid #8d59b1;
    outline-offset: -2px;
  }
`

const HistoryRenameInput = styled.input`
  flex: 1;
  min-width: 0;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #2f3130;
  border: 1px solid #8d59b1;
  border-radius: 4px;
  padding: 0 4px;
  outline: none;
  background: white;
  font-family: inherit;
`

const ContextMenu = styled.div`
  position: fixed;
  background: white;
  border: 1px solid #dcdcda;
  border-radius: 8px;
  box-shadow: 0px 8px 20px 0px rgba(12, 12, 13, 0.16);
  padding: 4px;
  min-width: 148px;
  z-index: 9999;
  overflow: hidden;
`

const ContextMenuItem = styled.button<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 12px;
  border: none;
  border-left: 3px solid transparent;
  border-radius: 4px;
  background: transparent;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ $danger }) => ($danger ? '#cc3340' : '#2f3130')};
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  box-sizing: border-box;

  &:hover {
    background: rgba(31, 115, 183, 0.08);
    border-left-color: #1f73b7;
  }
  &:focus-visible { outline: 2px solid #8d59b1; outline-offset: -2px; }
`

const DotsButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  padding: 0;
  color: #2f3130;
  flex-shrink: 0;

  &:hover { background: rgba(100, 104, 100, 0.08); }
  &:focus-visible { outline: 2px solid #8d59b1; outline-offset: -2px; }

  svg { width: 16px; height: 16px; }
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

// LoaderMessage component from @zendesk-ui/ai-assistant-chat
const getDotPulse = (color: string, faded: string) => keyframes`
  0%, 100% {
    transform: scale(1);
    background-color: ${color};
  }
  50% {
    transform: scale(0.4);
    background-color: ${faded};
  }
`

const textShimmer = keyframes`
  0% {
    background-position: 100% center;
  }
  50%, 100% {
    background-position: 0% center;
  }
`

const LoaderWrapper = styled.output`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xxs};
  align-self: flex-start;
`

const BASE_DURATION = 0.7

const LoaderIndicator = styled.div`
  width: ${({ theme }) => theme.space.base * 2}px;
  height: ${({ theme }) => theme.space.base * 2}px;
  border-radius: 50%;
  flex-shrink: 0;
  background-color: #8D59B1;
  animation: ${getDotPulse('#8D59B1', '#C38FE6')} ${BASE_DURATION}s ease-in-out infinite;
`

const LoaderText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.md};
  line-height: ${({ theme }) => theme.lineHeights.md};
  font-weight: ${({ theme }) => theme.fontWeights.regular};
  font-family: inherit;
  white-space: nowrap;
  background: linear-gradient(
    90deg,
    #8D59B1 0%,
    #8D59B1 30%,
    rgba(141, 89, 177, 0.2) 40%,
    rgba(141, 89, 177, 0.2) 60%,
    #8D59B1 70%,
    #8D59B1 100%
  );
  background-size: 400% 100%;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
  animation: ${textShimmer} ${BASE_DURATION * 2}s ease-in-out infinite;
`

const DEFAULT_LOADING_TEXTS = ['Thinking', 'Working on it', 'Still working', 'Making progress', 'Getting there']
const CYCLE_INTERVAL_MS = 5000

function LoaderMessage({ message }: { message?: string }) {
  const [textIndex, setTextIndex] = useState(0)

  useEffect(() => {
    if (message || textIndex >= DEFAULT_LOADING_TEXTS.length - 1) {
      return undefined
    }

    const timeoutId = setTimeout(() => {
      setTextIndex((prev) => prev + 1)
    }, CYCLE_INTERVAL_MS)

    return () => clearTimeout(timeoutId)
  }, [textIndex, message])

  const displayText = message || DEFAULT_LOADING_TEXTS[textIndex]

  return (
    <LoaderWrapper aria-live="polite" aria-label="Loading">
      <LoaderIndicator aria-hidden="true" />
      <LoaderText>{displayText}</LoaderText>
    </LoaderWrapper>
  )
}

const StopIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="3" y="3" width="10" height="10" rx="2" fill="currentColor" />
  </svg>
)

function groupConversationsByDate(conversations: SavedConversation[]): { label: string; items: SavedConversation[] }[] {
  const startOfToday = new Date(new Date().toDateString()).getTime()
  const startOfYesterday = startOfToday - 86400000
  const startOf7DaysAgo = startOfToday - 6 * 86400000
  const startOf30DaysAgo = startOfToday - 29 * 86400000

  const groups = [
    { label: 'Today', cutoff: startOfToday, items: [] as SavedConversation[] },
    { label: 'Yesterday', cutoff: startOfYesterday, items: [] as SavedConversation[] },
    { label: 'Last 7 days', cutoff: startOf7DaysAgo, items: [] as SavedConversation[] },
    { label: 'Last 30 days', cutoff: startOf30DaysAgo, items: [] as SavedConversation[] },
    { label: 'Older', cutoff: 0, items: [] as SavedConversation[] },
  ]

  for (const conv of conversations) {
    const group = groups.find(g => conv.savedAt >= g.cutoff)
    if (group) group.items.push(conv)
  }

  return groups.filter(g => g.items.length > 0)
}


export interface CopilotPanelHandle {
  sendMessage: (text: string) => void
}

interface CopilotPanelProps {
  openCount: number
  onClose: () => void
  onNavigateToSetupGuide?: () => void
  showPlus?: boolean
  isFullscreen?: boolean
  onToggleFullscreen?: () => void
  variant?: 'admin' | 'launchpad'
  onLaunchpadProgress?: (stage: LaunchpadStage) => void
  businessName?: string
}

const CopilotPanel = forwardRef<CopilotPanelHandle, CopilotPanelProps>(function CopilotPanel({
  openCount,
  onClose,
  onNavigateToSetupGuide,
  showPlus = false,
  isFullscreen = false,
  onToggleFullscreen,
  variant = 'admin',
  onLaunchpadProgress,
  businessName = 'your business',
}, ref) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [suggestionsExiting, setSuggestionsExiting] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [conversations, setConversations] = useState<SavedConversation[]>([])
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number; align?: 'center' | 'end' } | null>(null)
  const [convMenu, setConvMenu] = useState<{ id: string; x: number; y: number } | null>(null)
  const [renamingConvId, setRenamingConvId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const convMenuRef = useRef<HTMLDivElement>(null)

  const showTooltip = (text: string, align: 'center' | 'end' = 'center') => (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = align === 'end' ? Math.round(rect.right) : Math.round(rect.left + rect.width / 2)
    setTooltip({ text, x, y: Math.round(rect.bottom + 8), align })
  }
  const hideTooltip = () => setTooltip(null)
  const abortRef = useRef<AbortController | null>(null)
  const cannedIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
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

  const handleTeamInvitesSent = useCallback((entries: TeamInviteEntry[]) => {
    const summary =
      entries.length === 1
        ? `You're all set — **${entries[0].email}** will get an invite to join as **${entries[0].role}**. Once they accept, they'll see the same AI-powered Agent Workspace you're setting up.`
        : `You're all set — I sent **${entries.length}** invites. Once they accept, they'll join your trial and work alongside AI in Agent Workspace.`

    setMessages(prev => [
      ...prev,
      {
        role: 'assistant',
        content: summary,
        suggestions: ['Connect Support Email', 'Preview Help center', 'Try a sample ticket'],
      },
    ])
  }, [])

  const handleSampleRefinement = useCallback((prompt: ReplyRefinementPrompt) => {
    setMessages(prev => {
      const deactivated = prev.map(message =>
        message.sampleTicketPhase === 'reply-draft'
          ? { ...message, sampleTicketDraftActive: false }
          : message
      )
      return [
        ...deactivated,
        {
          role: 'assistant' as const,
          content: sampleTicketRefinementLine(prompt),
        },
      ]
    })

    window.setTimeout(() => {
      setMessages(prev => {
        const deactivated = prev.map(message =>
          message.sampleTicketPhase === 'reply-draft'
            ? { ...message, sampleTicketDraftActive: false }
            : message
        )
        return [
          ...deactivated,
          {
            role: 'assistant' as const,
            content:
              'Here is the updated reply — edit it directly or **Approve and send** when it looks good.',
            widget: 'sample-ticket' as const,
            sampleTicketPhase: 'reply-draft' as SampleTicketPhase,
            sampleTicketDraftReply: REFINED_REPLIES[prompt],
            sampleTicketDraftActive: true,
          },
        ]
      })
    }, 750)
  }, [])

  const handleSampleReplyApproved = useCallback((reply: string) => {
    setMessages(prev => {
      const deactivated = prev.map(message =>
        message.sampleTicketPhase === 'reply-draft'
          ? { ...message, sampleTicketDraftActive: false }
          : message
      )
      return [
        ...deactivated,
        {
          role: 'assistant',
          content:
            'Your reply is on the ticket. Expand the preview to see the customer message and what you sent.',
          widget: 'sample-ticket',
          sampleTicketPhase: 'posted-thread',
          sampleTicketReply: reply,
        },
      ]
    })
  }, [])

  const handleSampleTicketSolved = useCallback(() => {
    setMessages(prev => [
      ...prev,
      {
        role: 'assistant',
        content:
          'Ticket **#1** is solved — nice work. Open **View ticket #1** in the preview above anytime, or continue in Agent Workspace.',
        suggestions: ['Bring in your team', 'Connect Support Email', 'Preview Help center'],
      },
    ])
  }, [])

  const handleHelpCenterComplete = useCallback((summary: HelpCenterCompletionSummary) => {
    const published = summary.articles.filter(article => article.status === 'published')
    const unpublished = summary.articles.filter(article => article.status === 'unpublished')
    const publishedLine =
      published.length === 0
        ? 'You reviewed the articles without publishing — publish anytime from Help center when you are ready.'
        : published.length === 3
          ? 'All three articles are **published** on your Help center. Your trial agent can answer from them right away.'
          : `**${published.length}** article${published.length === 1 ? '' : 's'} published on **${summary.siteLabel}**${unpublished.length > 0 ? ` (${unpublished.length} left unpublished).` : '.'}`

    setMessages(prev => [
      ...prev,
      {
        role: 'assistant',
        content: `Help center preview saved for **${summary.businessName}**. ${publishedLine}

${published.length > 0 ? 'Try asking your agent a policy question in messaging or open **Try a sample ticket** to see replies in context.' : 'Publish at least one article when you want the agent to use this knowledge.'}`,
        suggestions: ['Try a sample ticket', 'Bring in your team', 'Connect Support Email'],
      },
    ])
  }, [])

  const handleSend = useCallback((text?: string) => {
    const content = (text ?? inputValue).trim()
    if (!content || isGenerating) return

    setInputValue('')

    if (content === 'Yes, draft a reply') {
      setMessages(prev => {
        const lastAssistantIdx = prev.findLastIndex(m => m.role === 'assistant')
        const updated = [...prev]
        if (lastAssistantIdx >= 0 && updated[lastAssistantIdx].suggestions?.length) {
          updated[lastAssistantIdx] = { ...updated[lastAssistantIdx], suggestions: undefined }
        }
        updated.push({ role: 'user', content })
        updated.push({
          role: 'assistant',
          content:
            'On it — I will draft a reply based on the customer message and your account policies.',
        })
        return updated
      })

      window.setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content:
              'Here is the suggested reply. Refine it with the quick prompts in the preview, then **Approve and send** when it looks good.',
            widget: 'sample-ticket',
            sampleTicketPhase: 'reply-draft',
            sampleTicketDraftActive: true,
          },
        ])
      }, 900)
      return
    }

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

    const cannedResponse = getCannedResponse(content, businessName)
    if (cannedResponse) {
      const parsed = parseAssistantPayload(cannedResponse)
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
                widget: parsed.widget,
                sampleTicketPhase:
                  parsed.widget === 'sample-ticket' ? ('ticket-preview' as SampleTicketPhase) : undefined,
                isStreaming: false,
              }
            }
            return updated
          })
          setIsGenerating(false)
        }
      }, 15)
      cannedIntervalRef.current = interval
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
  }, [inputValue, isGenerating, messages, activeConversationId, variant, onLaunchpadProgress, businessName])

  useImperativeHandle(ref, () => ({
    sendMessage: (text: string) => handleSend(text),
  }), [handleSend])

  const handleStop = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    if (cannedIntervalRef.current) {
      clearInterval(cannedIntervalRef.current)
      cannedIntervalRef.current = null
    }
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
    // Button unmounts on this action, so mouseleave never fires — clear tooltip manually
    setTooltip(null)
    abortRef.current?.abort()
    abortRef.current = null
    if (cannedIntervalRef.current) {
      clearInterval(cannedIntervalRef.current)
      cannedIntervalRef.current = null
    }

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
    // If clicking the already-active conversation, just close history
    if (id === activeConversationId) {
      setShowHistory(false)
      return
    }

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


  useEffect(() => {
    if (!convMenu) return
    const handler = (e: MouseEvent) => {
      if (convMenuRef.current && !convMenuRef.current.contains(e.target as Node)) {
        setConvMenu(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [convMenu])

  const handleDotsClick = useCallback((e: React.MouseEvent<HTMLElement>, convId: string) => {
    e.stopPropagation()
    const rect = e.currentTarget.getBoundingClientRect()
    setConvMenu(prev => prev?.id === convId ? null : { id: convId, x: rect.right, y: rect.bottom + 4 })
  }, [])

  const commitRename = useCallback(() => {
    if (!renamingConvId) return
    const trimmed = renameValue.trim()
    if (trimmed) {
      setConversations(prev =>
        prev.map(c => c.id === renamingConvId ? { ...c, title: trimmed } : c)
      )
    }
    setRenamingConvId(null)
  }, [renamingConvId, renameValue])

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
        <IconButton size="small" aria-label="Conversations" onClick={handleToggleHistory} onMouseEnter={showTooltip('Conversations')} onMouseLeave={hideTooltip}>
          {showHistory ? <ChevronLeftIcon /> : <BubblesStrokeIcon />}
        </IconButton>
        <TitleGroup>
          <ConversationTitle>
            {showHistory
              ? 'Conversations'
              : variant === 'launchpad' && !isConversation
                ? 'Launchpad'
                : conversationTitle}
          </ConversationTitle>
          {isConversation && !showHistory && activeConversationId && (
            <IconButton
              size="small"
              aria-label="Conversation options"
              onClick={(e) => handleDotsClick(e, activeConversationId)}
            >
              {convMenu?.id === activeConversationId ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </IconButton>
          )}
        </TitleGroup>
        <HeaderIcons>
          {(isConversation || showHistory) && (
            <IconButton size="small" aria-label="New conversation" onClick={handleNewConversation} onMouseEnter={showTooltip('New conversation')} onMouseLeave={hideTooltip}>
              <NotePencilStrokeIcon />
            </IconButton>
          )}
          <IconButton
            size="small"
            aria-label={isFullscreen ? 'Exit full screen' : 'View in full screen'}
            onClick={() => onToggleFullscreen?.()}
            onMouseEnter={showTooltip(isFullscreen ? 'Exit full screen' : 'View in full screen')}
            onMouseLeave={hideTooltip}
          >
            <SmallIcon>{isFullscreen ? <ArrowDiagonalInIcon /> : <ArrowDiagonalOutIcon />}</SmallIcon>
          </IconButton>
          <IconButton size="small" aria-label="Close admin copilot" onClick={onClose} onMouseEnter={showTooltip('Close admin copilot', 'end')} onMouseLeave={hideTooltip}>
            <XIcon />
          </IconButton>
        </HeaderIcons>
      </Header>
      {tooltip && <FloatingTooltip $x={tooltip.x} $y={tooltip.y} $align={tooltip.align}>{tooltip.text}</FloatingTooltip>}

      {showHistory && (
        <HistoryContainer>
          {groupConversationsByDate(conversations).map(group => (
            <React.Fragment key={group.label}>
              <HistorySectionHeader>{group.label}</HistorySectionHeader>
              {group.items.map(conv => (
                <HistoryItemButton
                  key={conv.id}
                  role="button"
                  tabIndex={0}
                  $active={activeConversationId === conv.id}
                  onClick={() => { if (renamingConvId !== conv.id) handleHistoryItemClick(conv.id) }}
                  onKeyDown={e => { if ((e.key === 'Enter' || e.key === ' ') && renamingConvId !== conv.id) handleHistoryItemClick(conv.id) }}
                >
                  {renamingConvId === conv.id ? (
                    <HistoryRenameInput
                      autoFocus
                      value={renameValue}
                      onChange={e => setRenameValue(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') commitRename()
                        if (e.key === 'Escape') setRenamingConvId(null)
                      }}
                      onBlur={commitRename}
                      onClick={e => e.stopPropagation()}
                    />
                  ) : (
                    <HistoryItemText>{conv.title}</HistoryItemText>
                  )}
                  <HistoryItemActions>
                    <DotsButton aria-label="More options" onClick={(e) => handleDotsClick(e, conv.id)}>
                      <DotsVerticalFillIcon />
                    </DotsButton>
                  </HistoryItemActions>
                </HistoryItemButton>
              ))}
            </React.Fragment>
          ))}
        </HistoryContainer>
      )}

      {!showHistory && !isConversation && (
        <>
          <AuroraGlow isFullscreen={isFullscreen} />
          <Content>
            <Title>
              <SparkleIcon />
              <Heading>
                {variant === 'launchpad' ? 'Launch your trial' : 'How can I help?'}
              </Heading>
            </Title>
            {variant === 'launchpad' && (
              <DisclaimerText style={{ textAlign: 'center', maxWidth: 320, margin: '0 auto 8px' }}>
                Ask how to go live—I'll configure your trial and update the preview on the left.
              </DisclaimerText>
            )}
            <Suggestions key={openCount} $exiting={suggestionsExiting}>
              {variant === 'launchpad' ? (
                <>
                  <QuickPrompt showIcon={false} onClick={() => handleSuggestionClick('Go live quickly')}>
                    Go live quickly
                  </QuickPrompt>
                  <QuickPrompt showIcon={false} onClick={() => handleSuggestionClick('Set up messaging for my trial')}>
                    Set up messaging for my trial
                  </QuickPrompt>
                  <QuickPrompt showIcon={false} onClick={() => handleSuggestionClick('Connect email channel')}>
                    Connect email channel
                  </QuickPrompt>
                </>
              ) : (
                <>
                  <QuickPrompt showIcon={false} onClick={() => handleSuggestionClick('Route specific ticket to assignee')}>
                    Route specific ticket to assignee
                  </QuickPrompt>
                  <QuickPrompt showIcon={false} onClick={() => handleSuggestionClick('Create a view of pending status tickets')}>
                    Create a view of pending status tickets
                  </QuickPrompt>
                  <QuickPrompt showIcon={false} onClick={() => handleSuggestionClick('Explain intent')}>
                    Explain intent
                  </QuickPrompt>
                </>
              )}
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
          <MessagesInner>
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
              return <LoaderMessage key={i} />
            }
            const showFeedback =
              !msg.isStreaming &&
              !msg.isError &&
              isLastAssistantInStreak(messages, i) &&
              assistantStreakFeedbackContent(messages, i).length > 0
            const feedbackContent = showFeedback ? assistantStreakFeedbackContent(messages, i) : ''

            return (
              <React.Fragment key={i}>
                <AssistantMessage>
                  {msg.content && <Markdown>{msg.content}</Markdown>}
                  {msg.isError && (
                    <CopilotErrorMessage onViewSetupGuide={() => onNavigateToSetupGuide?.()} />
                  )}
                  {msg.widget === 'team-invite' && !msg.isStreaming && (
                    <CopilotTeamInviteWidget onInviteSent={handleTeamInvitesSent} />
                  )}
                  {msg.widget === 'sample-ticket' && !msg.isStreaming && (
                    <CopilotSampleTicketWidget
                      phase={msg.sampleTicketPhase ?? 'ticket-preview'}
                      draftReply={msg.sampleTicketDraftReply}
                      draftActive={msg.sampleTicketDraftActive ?? msg.sampleTicketPhase !== 'reply-draft'}
                      postedReply={msg.sampleTicketReply}
                      onRefinementRequest={handleSampleRefinement}
                      onReplyApproved={handleSampleReplyApproved}
                      onTicketSolved={handleSampleTicketSolved}
                    />
                  )}
                  {msg.widget === 'help-center-preview' && !msg.isStreaming && (
                    <CopilotHelpCenterPreviewWidget onComplete={handleHelpCenterComplete} />
                  )}
                  {showFeedback && <AssistantMessageFeedback content={feedbackContent} />}
                </AssistantMessage>
                {!msg.isStreaming && msg.suggestions && msg.suggestions.length > 0 && i === messages.length - 1 && (
                  <InlineSuggestions $exiting={suggestionsExiting}>
                    {msg.suggestions.map((suggestion, j) => (
                      <QuickPrompt showIcon={false}
                        key={j}
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </QuickPrompt>
                    ))}
                  </InlineSuggestions>
                )}
              </React.Fragment>
            )
          })}
          <ScrollSpacer ref={spacerRef} style={{ minHeight: spacerHeight }} />
          </MessagesInner>
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
      {convMenu && (
        <ContextMenu
          ref={convMenuRef}
          style={{ top: convMenu.y, left: convMenu.x, transform: 'translateX(-100%)' }}
        >
          <ContextMenuItem onClick={() => setConvMenu(null)}>Rename</ContextMenuItem>
          <ContextMenuItem $danger onClick={() => setConvMenu(null)}>Delete</ContextMenuItem>
        </ContextMenu>
      )}
    </Panel>
  )
})

export default CopilotPanel
