import { useCallback, useState } from 'react'
import styled from 'styled-components'
import { Button } from '@zendesk-ui/react-components'
import { QuickPrompt } from '@zendesk-ui/ai-assistant-chat'
import CopilotPreviewCard from './CopilotPreviewCard'
import {
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

const ThreadBlock = styled.div`
  &:not(:last-child) {
    margin-bottom: 14px;
  }
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

const MessageBubble = styled.div<{ $variant?: 'customer' | 'agent' }>`
  padding: 12px 14px;
  border-radius: 12px;
  font-size: 13px;
  line-height: 18px;
  color: #2f3130;
  background: ${({ $variant }) => ($variant === 'agent' ? '#f4f7fc' : '#f8f9f9')};
  border: 1px solid ${({ $variant }) => ($variant === 'agent' ? '#e4eaf6' : '#eef0f2')};
`

const Composer = styled.div<{ $inactive?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #e4e4e2;
  background: ${({ $inactive }) => ($inactive ? '#f4f4f3' : '#fafafa')};
  opacity: ${({ $inactive }) => ($inactive ? 0.72 : 1)};
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
    cursor: default;
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

const PostedLead = styled.p`
  margin: 0 0 10px;
  font-size: 14px;
  line-height: 20px;
  color: #2f3130;
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
  margin-bottom: 14px;

  &:hover {
    text-decoration: underline;
  }

  svg {
    width: 16px;
    height: 16px;
  }
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

const SubjectInThread = styled(Subject)`
  margin: 0 0 14px;
`

function previewTitle(phase: SampleTicketPhase): string {
  if (phase === 'reply-draft') return 'Suggested reply'
  if (phase === 'posted-thread') return 'Reply on ticket'
  return 'Ticket preview'
}

function TicketPreviewCard() {
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
      <ThreadBlock>
        <ThreadLabel>
          <span>{SAMPLE_TICKET.customerLabel}</span>
          <span>{SAMPLE_TICKET.timestamp}</span>
        </ThreadLabel>
        <MessageBubble>{SAMPLE_TICKET.customerMessage}</MessageBubble>
      </ThreadBlock>
    </>
  )
}

interface CopilotSampleTicketWidgetProps {
  phase: SampleTicketPhase
  draftReply?: string
  draftActive?: boolean
  postedReply?: string
  onRefinementRequest: (prompt: ReplyRefinementPrompt) => void
  onReplyApproved: (reply: string) => void
  onTicketSolved: () => void
}

export default function CopilotSampleTicketWidget({
  phase,
  draftReply,
  draftActive = true,
  postedReply = SAMPLE_TICKET.defaultReply,
  onRefinementRequest,
  onReplyApproved,
  onTicketSolved,
}: CopilotSampleTicketWidgetProps) {
  const initialReply = draftReply ?? SAMPLE_TICKET.defaultReply
  const [reply, setReply] = useState<string>(initialReply)
  const [solved, setSolved] = useState(false)

  const handleApproveSend = useCallback(() => {
    if (!draftActive || !reply.trim()) return
    onReplyApproved(reply.trim())
  }, [draftActive, onReplyApproved, reply])

  const handleRefinement = useCallback(
    (prompt: ReplyRefinementPrompt) => {
      if (!draftActive) return
      onRefinementRequest(prompt)
    },
    [draftActive, onRefinementRequest]
  )

  const handleSolve = useCallback(() => {
    if (solved) return
    setSolved(true)
    onTicketSolved()
  }, [onTicketSolved, solved])

  if (phase === 'ticket-preview') {
    return (
      <CopilotPreviewCard title={previewTitle(phase)} expandable="none">
        <TicketPreviewCard />
      </CopilotPreviewCard>
    )
  }

  if (phase === 'reply-draft') {
    return (
      <CopilotPreviewCard title={previewTitle(phase)} expandable="none">
        <Composer $inactive={!draftActive}>
          <ToRow>
            <span>To</span>
            <ToChip>{SAMPLE_TICKET.customerLabel}</ToChip>
          </ToRow>
          <ReplyArea
            value={reply}
            readOnly={!draftActive}
            aria-label="Suggested reply"
            onChange={event => setReply(event.target.value)}
          />
        </Composer>
        {draftActive && (
          <>
            <PromptRow>
              {REPLY_REFINEMENT_PROMPTS.map(prompt => (
                <QuickPrompt
                  key={prompt}
                  showIcon={false}
                  size="small"
                  onClick={() => handleRefinement(prompt)}
                >
                  {prompt}
                </QuickPrompt>
              ))}
            </PromptRow>
            <ActionRow>
              <Button size="small" isPrimary onClick={handleApproveSend}>
                Approve and send
              </Button>
            </ActionRow>
          </>
        )}
      </CopilotPreviewCard>
    )
  }

  return (
    <CopilotPreviewCard
      title={previewTitle(phase)}
      expandable="collapsible"
      defaultExpanded
      collapsedMaxHeight={240}
    >
      <Eyebrow>Sample ticket #{SAMPLE_TICKET.id}</Eyebrow>
      <SubjectInThread>{SAMPLE_TICKET.subject}</SubjectInThread>
      <ThreadBlock>
        <ThreadLabel>
          <span>{SAMPLE_TICKET.customerLabel}</span>
          <span>{SAMPLE_TICKET.timestamp}</span>
        </ThreadLabel>
        <MessageBubble>{SAMPLE_TICKET.customerMessage}</MessageBubble>
      </ThreadBlock>
      <ThreadBlock>
        <ThreadLabel>
          <span>You</span>
          <span>Just now</span>
        </ThreadLabel>
        <MessageBubble $variant="agent">{postedReply}</MessageBubble>
      </ThreadBlock>
      <PostedLead>The reply has been posted to the ticket.</PostedLead>
      <TicketLink href="#" onClick={event => event.preventDefault()}>
        View ticket #{SAMPLE_TICKET.id}
        <NewWindowIcon />
      </TicketLink>
      {!solved && (
        <ActionRow>
          <Button size="small" isPrimary onClick={handleSolve}>
            Solve this ticket
          </Button>
        </ActionRow>
      )}
    </CopilotPreviewCard>
  )
}
