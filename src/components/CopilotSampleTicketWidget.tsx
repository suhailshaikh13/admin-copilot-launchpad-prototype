import { useCallback, useState } from 'react'
import styled from 'styled-components'
import { Button } from '@zendesk-ui/react-components'
import CopilotPreviewCard from './CopilotPreviewCard'
import { SAMPLE_TICKET, type SampleTicketPhase } from '../launchpad/sampleTicket'

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

const MessageBubble = styled.div`
  padding: 12px 14px;
  border-radius: 12px;
  font-size: 13px;
  line-height: 18px;
  color: #2f3130;
  background: #f8f9f9;
  border: 1px solid #eef0f2;
`

const ReplyArea = styled.textarea<{ $inactive?: boolean }>`
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
  opacity: ${({ $inactive }) => ($inactive ? 0.72 : 1)};

  &:focus {
    outline: none;
  }

  &:read-only {
    color: #464a48;
    cursor: default;
  }
`

const ActionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
`

function previewTitle(phase: SampleTicketPhase): string {
  if (phase === 'reply-draft') return 'Suggested reply'
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
  onDraftReply?: () => void
  onApproveAndSend?: (reply: string) => void
}

export default function CopilotSampleTicketWidget({
  phase,
  draftReply,
  draftActive = true,
  onDraftReply,
  onApproveAndSend,
}: CopilotSampleTicketWidgetProps) {
  const initialReply = draftReply ?? SAMPLE_TICKET.defaultReply
  const [reply, setReply] = useState<string>(initialReply)

  const handleApproveSend = useCallback(() => {
    if (!draftActive || !reply.trim() || !onApproveAndSend) return
    onApproveAndSend(reply.trim())
  }, [draftActive, onApproveAndSend, reply])

  if (phase === 'reply-draft') {
    return (
      <CopilotPreviewCard title={previewTitle(phase)} expandable="none">
        <ReplyArea
          $inactive={!draftActive}
          value={reply}
          readOnly={!draftActive}
          aria-label="Suggested reply"
          onChange={event => setReply(event.target.value)}
        />
        {draftActive && (
          <ActionRow>
            <Button size="small" isPrimary onClick={handleApproveSend}>
              Approve and send
            </Button>
          </ActionRow>
        )}
      </CopilotPreviewCard>
    )
  }

  return (
    <CopilotPreviewCard title={previewTitle(phase)} expandable="none">
      <TicketPreviewCard />
      {onDraftReply && (
        <ActionRow>
          <Button size="small" isPrimary onClick={onDraftReply}>
            Yes, draft a reply
          </Button>
        </ActionRow>
      )}
    </CopilotPreviewCard>
  )
}
