import { useCallback, useId, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { Button } from '@zendesk-ui/react-components'
import PlusStrokeIcon from '@zendeskgarden/svg-icons/src/16/plus-stroke.svg?react'
import CheckCircleFillIcon from '../assets/check-circle-fill.svg?react'
import {
  TEAM_INVITE_ROLES,
  isValidInviteEmail,
  type TeamInviteEntry,
  type TeamInviteRole,
} from '../launchpad/teamInvite'

const Card = styled.div`
  margin-top: 12px;
  padding: 16px;
  border: 1px solid #dcdcda;
  border-radius: 12px;
  background: #fafafa;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const CardTitle = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: #2f3130;
`

const CardHint = styled.p`
  margin: -8px 0 0;
  font-size: 13px;
  line-height: 18px;
  color: #646864;
`

const RowGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const InviteRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e9ebed;

  &:last-of-type {
    border-bottom: none;
    padding-bottom: 0;
  }
`

const FieldLabel = styled.label`
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  color: #2f3130;
  display: flex;
  align-items: center;
  gap: 4px;
`

const TextInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  height: 40px;
  padding: 0 12px;
  border: 1px solid #b7b7b3;
  border-radius: 8px;
  font-size: 14px;
  line-height: 20px;
  color: #2f3130;
  background: #fff;

  &:focus {
    outline: 2px solid #406cc4;
    outline-offset: 1px;
    border-color: #406cc4;
  }

  &[aria-invalid='true'] {
    border-color: #c72a1a;
  }
`

const Select = styled.select`
  width: 100%;
  box-sizing: border-box;
  height: 40px;
  padding: 0 36px 0 12px;
  border: 1px solid #b7b7b3;
  border-radius: 8px;
  font-size: 14px;
  line-height: 20px;
  color: #2f3130;
  background: #fff;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 20 20' fill='%23646864'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M4.29 7.29a1 1 0 011.42 0L10 11.59l4.29-4.3a1 1 0 111.42 1.42l-5 5a1 1 0 01-1.42 0l-5-5a1 1 0 010-1.42z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;

  &:focus {
    outline: 2px solid #406cc4;
    outline-offset: 1px;
    border-color: #406cc4;
  }
`

const AddLink = styled.button`
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0;
  border: none;
  background: none;
  font-size: 14px;
  line-height: 20px;
  color: #406cc4;
  cursor: pointer;

  svg {
    width: 14px;
    height: 14px;
  }

  &:hover {
    text-decoration: underline;
  }
`

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 4px;
  border-top: 1px solid #e9ebed;
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

const ErrorText = styled.p`
  margin: 0;
  font-size: 12px;
  line-height: 16px;
  color: #c72a1a;
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

const SuccessBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const SuccessHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #4b7d04;

  svg {
    width: 20px;
    height: 20px;
    color: #4b7d04;
  }
`

const SuccessList = styled.ul`
  margin: 0;
  padding-left: 20px;
  font-size: 13px;
  line-height: 18px;
  color: #2f3130;
`

interface RowState {
  id: string
  email: string
  role: TeamInviteRole
}

interface CopilotTeamInviteWidgetProps {
  onInviteSent: (entries: TeamInviteEntry[]) => void
  onSkip?: () => void
}

function createRow(partial?: Partial<RowState>): RowState {
  return {
    id: crypto.randomUUID(),
    email: partial?.email ?? 'alex@swiftfinance.io',
    role: partial?.role ?? 'Admin',
  }
}

export default function CopilotTeamInviteWidget({
  onInviteSent,
  onSkip,
}: CopilotTeamInviteWidgetProps) {
  const formId = useId()
  const [rows, setRows] = useState<RowState[]>(() => [createRow()])
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<'editing' | 'sending' | 'sent'>('editing')
  const [sentEntries, setSentEntries] = useState<TeamInviteEntry[]>([])

  const updateRow = useCallback((id: string, patch: Partial<RowState>) => {
    setRows(prev => prev.map(row => (row.id === id ? { ...row, ...patch } : row)))
    setError(null)
  }, [])

  const addRow = useCallback(() => {
    setRows(prev => [...prev, createRow({ email: '', role: 'Agent' })])
  }, [])

  const removeRow = useCallback((id: string) => {
    setRows(prev => (prev.length <= 1 ? prev : prev.filter(row => row.id !== id)))
  }, [])

  const handleInvite = useCallback(() => {
    const entries: TeamInviteEntry[] = rows.map(row => ({
      email: row.email.trim(),
      role: row.role,
    }))

    const invalid = entries.find(entry => !isValidInviteEmail(entry.email))
    if (invalid) {
      setError('Enter a valid email address for each invite.')
      return
    }

    setError(null)
    setStatus('sending')

    window.setTimeout(() => {
      setSentEntries(entries)
      setStatus('sent')
      onInviteSent(entries)
    }, 900)
  }, [onInviteSent, rows])

  if (status === 'sent') {
    return (
      <Card aria-live="polite">
        <SuccessBlock>
          <SuccessHeader>
            <CheckCircleFillIcon aria-hidden />
            Invites sent
          </SuccessHeader>
          <SuccessList>
            {sentEntries.map(entry => (
              <li key={entry.email}>
                {entry.email} · {entry.role}
              </li>
            ))}
          </SuccessList>
        </SuccessBlock>
      </Card>
    )
  }

  return (
    <Card aria-labelledby={`${formId}-title`}>
      <CardTitle id={`${formId}-title`}>Send email invites</CardTitle>
      <CardHint>They'll join your trial workspace and work alongside AI in Agent Workspace.</CardHint>

      <RowGrid>
        {rows.map((row, index) => (
          <InviteRow key={row.id}>
            <FieldLabel htmlFor={`${formId}-email-${row.id}`}>Send an email invite</FieldLabel>
            <TextInput
              id={`${formId}-email-${row.id}`}
              type="email"
              autoComplete="email"
              value={row.email}
              aria-invalid={Boolean(error && !isValidInviteEmail(row.email))}
              disabled={status === 'sending'}
              onChange={event => updateRow(row.id, { email: event.target.value })}
            />
            <FieldLabel htmlFor={`${formId}-role-${row.id}`}>Give them a role</FieldLabel>
            <Select
              id={`${formId}-role-${row.id}`}
              value={row.role}
              disabled={status === 'sending'}
              onChange={event => updateRow(row.id, { role: event.target.value as TeamInviteRole })}
            >
              {TEAM_INVITE_ROLES.map(role => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </Select>
            {rows.length > 1 && (
              <TextButton type="button" onClick={() => removeRow(row.id)} disabled={status === 'sending'}>
                Remove
              </TextButton>
            )}
            {index === rows.length - 1 && rows.length < 5 && (
              <AddLink type="button" onClick={addRow} disabled={status === 'sending'}>
                <PlusStrokeIcon aria-hidden />
                Add
              </AddLink>
            )}
          </InviteRow>
        ))}
      </RowGrid>

      {error && <ErrorText role="alert">{error}</ErrorText>}
      {status === 'sending' && <SendingNote>Sending invites…</SendingNote>}

      <Footer>
        <TextButton type="button" onClick={onSkip} disabled={status === 'sending'}>
          Skip for now
        </TextButton>
        <Button size="small" isPrimary onClick={handleInvite} disabled={status === 'sending'}>
          Invite
        </Button>
      </Footer>
    </Card>
  )
}
