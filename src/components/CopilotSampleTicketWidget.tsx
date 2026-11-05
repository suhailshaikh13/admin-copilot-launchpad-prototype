import { useCallback, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { Button } from '@zendesk-ui/react-components'
import { QuickPrompt } from '@zendesk-ui/ai-assistant-chat'
import SparkleFillIcon from '../assets/sparkle-fill.svg?react'
import CheckCircleFillIcon from '../assets/check-circle-fill.svg?react'
import {
  REFINED_REPLIES,
  REPLY_REFINEMENT_PROMPTS,
  SAMPLE_TICKET,
  type ReplyRefinementPrompt,
} from '../launchpad/sampleTicket'

const Card = styled.div`
  margin-top: 12px;
  border: 1px solid #dcdcda;
  border-radius: 14px;
  background: #fff;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(47, 49, 48, 0.05);
`

const CardHeader = styled.div`
  padding: 16px 16px 14px;
  border-bottom: 1px solid #f0f0ee;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const CardTitle = styled.h3`
  margin: 0;
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
  white-space: nowrap;
`

const Body = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`

const ThreadLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  line-height: 16px;
  color: #646864;
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

const StepCallout = styled.div`
  padding: 12px 14px;
  border-radius: 10px;
  background: #f9f5fa;
  border: 1px solid #efe9f2;
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
`

const ActionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 8px;
  padding-top: 4px;
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

type FlowPhase =
  | 'preview'
  | 'drafting'
  | 'review'
  | 'sending'
  | 'posted'
  | 'solving'
  | 'solved'

interface CopilotSampleTicketWidgetProps {
  onDraftRequested?: () => void
  onReplyReady?: () => void
  onReplySent: () => void
  onTicketSolved: () => void
}

export default function CopilotSampleTicketWidget({
  onDraftRequested,
  onReplyReady,
  onReplySent,
  onTicketSolved,
}: CopilotSampleTicketWidgetProps) {
  const [phase, setPhase] = useState<FlowPhase>('preview')
  const [reply, setReply] = useState<string>(SAMPLE_TICKET.defaultReply)
  const [isEditing, setIsEditing] = useState(false)
  const [activePrompt, setActivePrompt] = useState<ReplyRefinementPrompt | null>(null)

  const showComposer =
    phase === 'review' || phase === 'sending' || phase === 'posted' || phase === 'solving' || phase === 'solved'

  const showActions =
    phase === 'preview' || phase === 'review' || phase === 'posted'

  const applyPrompt = useCallback((prompt: ReplyRefinementPrompt) => {
    setActivePrompt(prompt)
    setReply(REFINED_REPLIES[prompt])
    setIsEditing(true)
  }, [])

  const handleDraftReply = useCallback(() => {
    onDraftRequested?.()
    setPhase('drafting')
    window.setTimeout(() => {
      setPhase('review')
      onReplyReady?.()
    }, 900)
  }, [onDraftRequested, onReplyReady])

  const handleApproveSend = useCallback(() => {
    if (!reply.trim()) return
    setPhase('sending')
    window.setTimeout(() => {
      setPhase('posted')
      onReplySent()
    }, 700)
  }, [onReplySent, reply])

  const handleSolve = useCallback(() => {
    setPhase('solving')
    window.setTimeout(() => {
      setPhase('solved')
      onTicketSolved()
    }, 600)
  }, [onTicketSolved])

  const replyReadOnly = phase !== 'review' || !isEditing

  return (
    <Card aria-labelledby="sample-ticket-title">
      <CardHeader>
        <CardTitle id="sample-ticket-title">Sample ticket #{SAMPLE_TICKET.id}</CardTitle>
        <Subject>{SAMPLE_TICKET.subject}</Subject>
        <MetaRow>
          <StatusPill>Open</StatusPill>
          <Channel>{SAMPLE_TICKET.channel}</Channel>
        </MetaRow>
      </CardHeader>

      <Body>
        <div>
          <ThreadLabel>
            <span>{SAMPLE_TICKET.customerLabel}</span>
            <span>{SAMPLE_TICKET.timestamp}</span>
          </ThreadLabel>
          <CustomerBubble>{SAMPLE_TICKET.customerMessage}</CustomerBubble>
        </div>

        {phase === 'preview' && (
          <StepCallout>
            Want me to <strong>draft a reply</strong> to this ticket? I will show it here for you to
            approve or edit before we post to the customer.
          </StepCallout>
        )}

        {phase === 'drafting' && (
          <SendingNote>Writing a Copilot reply…</SendingNote>
        )}

        {showComposer && (
          <>
            {phase === 'review' && (
              <StepCallout>
                Approve this reply, or change anything before we post it to the ticket.
              </StepCallout>
            )}

            <Composer>
              <ToRow>
                <span>To</span>
                <ToChip>{SAMPLE_TICKET.customerLabel}</ToChip>
              </ToRow>
              <ReplyArea
                value={reply}
                readOnly={replyReadOnly}
                aria-label="Suggested reply"
                onChange={event => setReply(event.target.value)}
              />
              <CopilotTag>
                <SparkleFillIcon aria-hidden />
                Copilot generated reply
              </CopilotTag>
            </Composer>

            {phase === 'review' && (
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
          </>
        )}

        {phase === 'solving' && <SendingNote>Marking ticket solved…</SendingNote>}
        {phase === 'solved' && (
          <SuccessBanner>
            <CheckCircleFillIcon aria-hidden />
            Ticket solved — nice work on your first resolution
          </SuccessBanner>
        )}

        {showActions && (
          <ActionRow>
            {phase === 'preview' && (
              <Button size="small" isPrimary onClick={handleDraftReply}>
                Yes, draft a reply
              </Button>
            )}
            {phase === 'review' && (
              <>
                <GhostButton type="button" onClick={() => setIsEditing(editing => !editing)}>
                  {isEditing ? 'Done editing' : 'Edit reply'}
                </GhostButton>
                <Button size="small" isPrimary onClick={handleApproveSend}>
                  Approve and send
                </Button>
              </>
            )}
            {phase === 'posted' && (
              <Button size="small" isPrimary onClick={handleSolve}>
                Solve this ticket
              </Button>
            )}
          </ActionRow>
        )}
      </Body>
    </Card>
  )
}
