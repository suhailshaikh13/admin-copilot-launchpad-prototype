import { useCallback, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { Button } from '@zendesk-ui/react-components'
import { QuickPrompt } from '@zendesk-ui/ai-assistant-chat'
import SparkleFillIcon from '../assets/sparkle-fill.svg?react'
import CheckCircleFillIcon from '../assets/check-circle-fill.svg?react'
import CopilotPreviewCard from './CopilotPreviewCard'
import {
  REFINED_REPLIES,
  REPLY_REFINEMENT_PROMPTS,
  SAMPLE_TICKET,
  type ReplyRefinementPrompt,
  type SampleTicketPhase,
} from '../launchpad/sampleTicket'

const TicketHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 14px;
`

const Eyebrow = styled.span`
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: #646864;
`

const Subject = styled.p`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  line-height: 22px;
  letter-spacing: -0.2px;
  color: #2f3130;
`

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`

const StatusPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px;
  border-radius: 999px;
  background: #e4eaf6;
  color: #2f3130;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #406cc4;
  }
`

const Channel = styled.span`
  font-size: 12px;
  line-height: 16px;
  color: #646864;
`

const ThreadLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  line-height: 16px;
  color: #646864;
  margin-bottom: 8px;
`

const CustomerBubble = styled.div`
  padding: 12px 14px;
  border-radius: 12px;
  background: #f8f9f9;
  border: 1px solid #eef0f2;
  font-size: 13px;
  line-height: 18px;
  color: #2f3130;
`

const Composer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #e4e4e2;
  background: #fafafa;
  margin-top: 14px;
`

const ToRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #646864;
`

const ToChip = styled.span`
  padding: 2px 8px;
  border-radius: 999px;
  background: #fff;
  border: 1px solid #e9ebed;
  font-size: 12px;
  font-weight: 600;
  color: #2f3130;
`

const ReplyArea = styled.textarea`
  width: 100%;
  min-height: 88px;
  box-sizing: border-box;
  border: none;
  resize: vertical;
  padding: 0;
  font-size: 13px;
  line-height: 18px;
  color: #2f3130;
  font-family: inherit;
  background: transparent;

  &:focus {
    outline: none;
  }

  &:read-only {
    color: #464a48;
  }
`

const CopilotTag = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  line-height: 16px;
  color: #646864;

  svg {
    width: 14px;
    height: 14px;
    color: #9256b1;
  }
`

const PromptRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`

const ActionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
`

const GhostButton = styled.button`
  padding: 8px 14px;
  border-radius: 99px;
  border: 1px solid #dcdcda;
  background: #fff;
  font-size: 13px;
  font-weight: 600;
  line-height: 18px;
  color: #2f3130;
  cursor: pointer;

  &:hover {
    background: #fafafa;
  }
`

const pulse = keyframes`
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
`

const SendingNote = styled.p`
  margin: 0;
  font-size: 13px;
  color: #646864;
  animation: ${pulse} 1.2s ease-in-out infinite;
`

const SuccessBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 10px;
  background: #edf7ed;
  color: #4b7d04;
  font-size: 13px;
  font-weight: 600;

  svg {
    width: 18px;
    height: 18px;
  }
`

const PostedLead = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  color: #2f3130;
`

const PostedPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 12px;
`

const TicketLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  width: fit-content;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: #406cc4;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`

const PostedHint = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 18px;
  color: #646864;
`

function NewWindowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        fill="currentColor"
        d="M5.833 4.167a.833.833 0 0 0-.833.833v10a.833.833 0 0 0 .833.833h10a.833.833 0 0 0 .833-.833v-3.334a.833.833 0 0 1 1.666 0v3.334A2.5 2.5 0 0 1 15.833 17.5h-10a2.5 2.5 0 0 1-2.5-2.5v-10a2.5 2.5 0 0 1 2.5-2.5h3.333a.833.833 0 0 1 0 1.666H5.833ZM11.667 3.333h5a.833.833 0 0 1 .833.833v5a.833.833 0 0 1-1.666 0V6.345l-6.488 6.488a.833.833 0 0 1-1.178-1.178L14.655 5.167H11.667a.833.833 0 0 1 0-1.666Z"
      />
    </svg>
  )
}

function previewTitle(phase: SampleTicketPhase): string {
  if (phase === 'reply-review' || phase === 'drafting-reply') return 'Suggested reply'
  if (phase === 'posted' || phase === 'solving' || phase === 'solved') return 'Reply posted'
  return 'Ticket preview'
}

function TicketThread() {
  return (
    <>
      <TicketHeader>
        <Eyebrow>Sample ticket #{SAMPLE_TICKET.id}</Eyebrow>
        <Subject>{SAMPLE_TICKET.subject}</Subject>
        <MetaRow>
          <StatusPill>Open</StatusPill>
          <Channel>{SAMPLE_TICKET.channel}</Channel>
        </MetaRow>
      </TicketHeader>
      <div>
        <ThreadLabel>
          <span>{SAMPLE_TICKET.customerLabel}</span>
          <span>{SAMPLE_TICKET.timestamp}</span>
        </ThreadLabel>
        <CustomerBubble>{SAMPLE_TICKET.customerMessage}</CustomerBubble>
      </div>
    </>
  )
}

interface CopilotSampleTicketWidgetProps {
  phase: SampleTicketPhase
  onPhaseChange: (phase: SampleTicketPhase) => void
  onReplySent: () => void
  onTicketSolved: () => void
}

export default function CopilotSampleTicketWidget({
  phase,
  onPhaseChange,
  onReplySent,
  onTicketSolved,
}: CopilotSampleTicketWidgetProps) {
  const [reply, setReply] = useState<string>(SAMPLE_TICKET.defaultReply)
  const [isEditing, setIsEditing] = useState(false)
  const [activePrompt, setActivePrompt] = useState<ReplyRefinementPrompt | null>(null)

  const applyPrompt = useCallback((prompt: ReplyRefinementPrompt) => {
    setActivePrompt(prompt)
    setReply(REFINED_REPLIES[prompt])
    setIsEditing(true)
  }, [])

  const handleApproveSend = useCallback(() => {
    if (!reply.trim()) return
    onPhaseChange('sending')
    window.setTimeout(() => {
      onPhaseChange('posted')
      onReplySent()
    }, 700)
  }, [onPhaseChange, onReplySent, reply])

  const handleSolve = useCallback(() => {
    onPhaseChange('solving')
    window.setTimeout(() => {
      onPhaseChange('solved')
      onTicketSolved()
    }, 600)
  }, [onPhaseChange, onTicketSolved])

  const showReplyComposer =
    phase === 'reply-review' || phase === 'sending' || phase === 'posted' || phase === 'solving' || phase === 'solved'

  const useCollapsible = phase === 'ticket-preview' || phase === 'reply-review'

  return (
    <CopilotPreviewCard
      title={previewTitle(phase)}
      expandable={useCollapsible ? 'collapsible' : 'none'}
      collapsedMaxHeight={phase === 'ticket-preview' ? 200 : 240}
    >
      {phase === 'drafting-reply' && <SendingNote>Writing a Copilot reply…</SendingNote>}

      {(phase === 'ticket-preview' || phase === 'drafting-reply' || showReplyComposer) && <TicketThread />}

      {showReplyComposer && (
        <>
          <Composer>
            <ToRow>
              <span>To</span>
              <ToChip>{SAMPLE_TICKET.customerLabel}</ToChip>
            </ToRow>
            <ReplyArea
              value={reply}
              readOnly={phase !== 'reply-review' || !isEditing}
              aria-label="Suggested reply"
              onChange={event => setReply(event.target.value)}
            />
            <CopilotTag>
              <SparkleFillIcon aria-hidden />
              Copilot generated reply
            </CopilotTag>
          </Composer>

          {phase === 'reply-review' && (
            <>
              <PromptRow>
                {REPLY_REFINEMENT_PROMPTS.map(prompt => (
                  <QuickPrompt
                    key={prompt}
                    showIcon={false}
                    size="small"
                    onClick={() => applyPrompt(prompt)}
                  >
                    {prompt}
                  </QuickPrompt>
                ))}
              </PromptRow>
              {activePrompt && (
                <CopilotTag>Updated reply: {activePrompt.toLowerCase()}</CopilotTag>
              )}
              <ActionRow>
                <GhostButton type="button" onClick={() => setIsEditing(editing => !editing)}>
                  {isEditing ? 'Done editing' : 'Edit reply'}
                </GhostButton>
                <Button size="small" isPrimary onClick={handleApproveSend}>
                  Approve and send
                </Button>
              </ActionRow>
            </>
          )}
        </>
      )}

      {phase === 'sending' && <SendingNote>Posting reply to the ticket…</SendingNote>}

      {(phase === 'posted' || phase === 'solving' || phase === 'solved') && (
        <>
          <SuccessBanner>
            <CheckCircleFillIcon aria-hidden />
            Reply sent — customer notified by email
          </SuccessBanner>
          <PostedPanel>
            <PostedLead>The reply has been posted to the ticket.</PostedLead>
            <TicketLink href="#" onClick={event => event.preventDefault()}>
              View ticket #{SAMPLE_TICKET.id}
              <NewWindowIcon />
            </TicketLink>
            <PostedHint>
              To see the experience from the customer&apos;s side, submit a test request through
              your Help Center and watch it arrive as a new ticket in Agent Workspace.
            </PostedHint>
          </PostedPanel>
          {phase === 'posted' && (
            <ActionRow>
              <Button size="small" isPrimary onClick={handleSolve}>
                Solve this ticket
              </Button>
            </ActionRow>
          )}
        </>
      )}

      {phase === 'solving' && <SendingNote>Marking ticket solved…</SendingNote>}
      {phase === 'solved' && (
        <SuccessBanner>
          <CheckCircleFillIcon aria-hidden />
          Ticket solved — nice work on your first resolution
        </SuccessBanner>
      )}
    </CopilotPreviewCard>
  )
}
