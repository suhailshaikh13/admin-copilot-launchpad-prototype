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
  border-radius: 12px;
  background: #fff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`

const CardHeader = styled.div`
  padding: 14px 16px 12px;
  border-bottom: 1px solid #e9ebed;
  background: #fafafa;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const CardTitle = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: #2f3130;
`

const TicketMeta = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
`

const StatusPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 8px;
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

const Subject = styled.p`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  line-height: 20px;
  color: #2f3130;
  flex: 1;
`

const Channel = styled.span`
  font-size: 12px;
  line-height: 16px;
  color: #646864;
  white-space: nowrap;
`

const SummaryRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-start;
  font-size: 12px;
  line-height: 16px;
  color: #646864;

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    margin-top: 1px;
    color: #9256b1;
  }
`

const Body = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: linear-gradient(180deg, #f4f7fc 0%, #fafafa 40%, #fff 100%);
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
  background: #f4f6f8;
  border: 1px solid #e9ebed;
  font-size: 13px;
  line-height: 18px;
  color: #2f3130;
`

const Composer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #dcdcda;
  background: #fff;
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
  background: #f4f6f8;
  font-size: 12px;
  font-weight: 600;
  color: #2f3130;
`

const ReplyArea = styled.textarea`
  width: 100%;
  min-height: 96px;
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

  &:disabled {
    color: #646864;
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

const Footer = styled.div`
  padding: 12px 16px 16px;
  border-top: 1px solid #e9ebed;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #fff;
`

const FooterActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`

const TextButton = styled.button`
  padding: 8px 4px;
  border: none;
  background: none;
  font-size: 14px;
  line-height: 20px;
  color: #646864;
  cursor: pointer;

  &:hover {
    color: #2f3130;
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
  border-radius: 8px;
  background: #edf7ed;
  color: #4b7d04;
  font-size: 13px;
  font-weight: 600;

  svg {
    width: 18px;
    height: 18px;
  }
`

type FlowPhase = 'compose' | 'sending' | 'awaiting_solve' | 'solving' | 'solved'

interface CopilotSampleTicketWidgetProps {
  onReplySent: () => void
  onTicketSolved: () => void
  onSkip?: () => void
}

export default function CopilotSampleTicketWidget({
  onReplySent,
  onTicketSolved,
  onSkip,
}: CopilotSampleTicketWidgetProps) {
  const [phase, setPhase] = useState<FlowPhase>('compose')
  const [reply, setReply] = useState<string>(SAMPLE_TICKET.defaultReply)
  const [activePrompt, setActivePrompt] = useState<ReplyRefinementPrompt | null>(null)

  const applyPrompt = useCallback((prompt: ReplyRefinementPrompt) => {
    setActivePrompt(prompt)
    setReply(REFINED_REPLIES[prompt])
  }, [])

  const handleSendReply = useCallback(() => {
    if (!reply.trim()) return
    setPhase('sending')
    window.setTimeout(() => {
      setPhase('awaiting_solve')
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

  const replyDisabled = phase !== 'compose'

  return (
    <Card aria-labelledby="sample-ticket-title">
      <CardHeader>
        <CardTitle id="sample-ticket-title">Sample ticket</CardTitle>
        <TicketMeta>
          <div>
            <StatusPill>Open</StatusPill>
            <Subject>{SAMPLE_TICKET.subject}</Subject>
          </div>
          <Channel>{SAMPLE_TICKET.channel}</Channel>
        </TicketMeta>
        <SummaryRow>
          <SparkleFillIcon aria-hidden />
          <span>{SAMPLE_TICKET.summary}</span>
        </SummaryRow>
      </CardHeader>

      <Body>
        <div>
          <ThreadLabel>
            <span>{SAMPLE_TICKET.customerLabel}</span>
            <span>{SAMPLE_TICKET.timestamp}</span>
          </ThreadLabel>
          <CustomerBubble>{SAMPLE_TICKET.customerMessage}</CustomerBubble>
        </div>

        <Composer>
          <ToRow>
            <span>To</span>
            <ToChip>{SAMPLE_TICKET.customerLabel}</ToChip>
          </ToRow>
          <ReplyArea
            value={reply}
            disabled={replyDisabled}
            aria-label="Suggested reply"
            onChange={event => setReply(event.target.value)}
          />
          <CopilotTag>
            <SparkleFillIcon aria-hidden />
            Copilot generated reply
          </CopilotTag>
        </Composer>

        {phase === 'compose' && (
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
              <CopilotTag>
                Updated reply: {activePrompt.toLowerCase()}
              </CopilotTag>
            )}
          </>
        )}

        {phase === 'sending' && <SendingNote>Sending reply to customer…</SendingNote>}
        {phase === 'awaiting_solve' && (
          <SuccessBanner>
            <CheckCircleFillIcon aria-hidden />
            Reply sent — customer notified by email
          </SuccessBanner>
        )}
        {phase === 'solving' && <SendingNote>Marking ticket solved…</SendingNote>}
        {phase === 'solved' && (
          <SuccessBanner>
            <CheckCircleFillIcon aria-hidden />
            Ticket solved — nice work on your first resolution
          </SuccessBanner>
        )}
      </Body>

      <Footer>
        <FooterActions>
          {phase === 'compose' && (
            <>
              <TextButton type="button" onClick={onSkip}>
                Skip for now
              </TextButton>
              <Button size="small" isPrimary onClick={handleSendReply}>
                Send reply
              </Button>
            </>
          )}
          {phase === 'awaiting_solve' && (
            <>
              <span />
              <Button size="small" isPrimary onClick={handleSolve}>
                Solve this ticket
              </Button>
            </>
          )}
          {(phase === 'sending' || phase === 'solving' || phase === 'solved') && <span />}
        </FooterActions>
      </Footer>
    </Card>
  )
}
