import { useCallback, useId, useState } from 'react'
import styled from 'styled-components'
import { Button } from '@zendesk-ui/react-components'
import PlusStrokeIcon from '@zendeskgarden/svg-icons/src/16/plus-stroke.svg?react'
import CheckCircleFillIcon from '../assets/check-circle-fill.svg?react'
import {
  TEAM_INVITE_ROLES,
  isValidInviteEmail,
  type TeamInviteEntry,
  type TeamInviteRole,
} from '../launchpad/teamInvite'
import CopilotPreviewCard from './CopilotPreviewCard'

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  min-width: 0;
`

const Intro = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 18px;
  color: #646864;
`

const InviteStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const InviteBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  &:not(:first-child) {
    padding-top: 12px;
    border-top: 1px solid #eef0f2;
  }
`

const BlockHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`

const BlockTitle = styled.span`
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: #646864;
`

const FieldPair = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const FieldLabel = styled.label`
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  color: #2f3130;
`

const TextInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  height: 40px;
  padding: 0 12px;
  border: 1px solid #dcdcda;
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

  &:disabled {
    opacity: 0.6;
  }
`

const Select = styled.select`
  width: 100%;
  box-sizing: border-box;
  height: 40px;
  padding: 0 36px 0 12px;
  border: 1px solid #dcdcda;
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

  &:disabled {
    opacity: 0.6;
  }
`

const RemoveButton = styled.button`
  padding: 4px 8px;
  border: none;
  background: none;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  color: #646864;
  cursor: pointer;
  border-radius: 6px;

  &:hover:not(:disabled) {
    color: #2f3130;
    background: rgba(47, 49, 48, 0.06);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const ActionsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding-top: 4px;
`

const AddButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid #dcdcda;
  background: #fff;
  font-size: 13px;
  font-weight: 600;
  line-height: 18px;
  color: #406cc4;
  cursor: pointer;

  svg {
    width: 14px;
    height: 14px;
  }

  &:hover:not(:disabled) {
    background: #f4f7fc;
    border-color: #b7b7b3;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const ErrorText = styled.p`
  margin: 0;
  font-size: 12px;
  line-height: 16px;
  color: #c72a1a;
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
  }
`

const SuccessList = styled.ul`
  margin: 8px 0 0;
  padding-left: 20px;
  font-size: 13px;
  line-height: 20px;
  color: #2f3130;
`

interface RowState {
  id: string
  email: string
  role: TeamInviteRole
}

interface CopilotTeamInviteWidgetProps {
  /** When set, this card shows the sent confirmation instead of the form. */
  sentEntries?: TeamInviteEntry[]
  interactive?: boolean
  onInviteRequest?: (entries: TeamInviteEntry[]) => void
}

function createRow(partial?: Partial<RowState>): RowState {
  return {
    id: crypto.randomUUID(),
    email: partial?.email ?? 'alex@swiftfinance.io',
    role: partial?.role ?? 'Admin',
  }
}

export default function CopilotTeamInviteWidget({
  sentEntries,
  interactive = true,
  onInviteRequest,
}: CopilotTeamInviteWidgetProps) {
  const formId = useId()
  const [rows, setRows] = useState<RowState[]>(() => [createRow()])
  const [error, setError] = useState<string | null>(null)

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
    if (!interactive || !onInviteRequest) return

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
    onInviteRequest(entries)
  }, [interactive, onInviteRequest, rows])

  if (sentEntries && sentEntries.length > 0) {
    return (
      <CopilotPreviewCard title="Team invites">
        <Body aria-live="polite">
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
        </Body>
      </CopilotPreviewCard>
    )
  }

  return (
    <CopilotPreviewCard title="Team invites">
      <Body aria-labelledby={`${formId}-intro`}>
        <Intro id={`${formId}-intro`}>
          They&apos;ll join your trial workspace and work alongside AI in Agent Workspace.
        </Intro>

        <InviteStack>
          {rows.map((row, index) => (
            <InviteBlock key={row.id}>
              <BlockHeader>
                <BlockTitle>Teammate {index + 1}</BlockTitle>
                {rows.length > 1 && interactive && (
                  <RemoveButton type="button" onClick={() => removeRow(row.id)}>
                    Remove
                  </RemoveButton>
                )}
              </BlockHeader>
              <FieldPair>
                <FieldLabel htmlFor={`${formId}-email-${row.id}`}>Email</FieldLabel>
                <TextInput
                  id={`${formId}-email-${row.id}`}
                  type="email"
                  autoComplete="email"
                  value={row.email}
                  aria-invalid={Boolean(error && !isValidInviteEmail(row.email))}
                  disabled={!interactive}
                  onChange={event => updateRow(row.id, { email: event.target.value })}
                />
              </FieldPair>
              <FieldPair>
                <FieldLabel htmlFor={`${formId}-role-${row.id}`}>Role</FieldLabel>
                <Select
                  id={`${formId}-role-${row.id}`}
                  value={row.role}
                  disabled={!interactive}
                  onChange={event => updateRow(row.id, { role: event.target.value as TeamInviteRole })}
                >
                  {TEAM_INVITE_ROLES.map(role => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </Select>
              </FieldPair>
            </InviteBlock>
          ))}
        </InviteStack>

        {error && <ErrorText role="alert">{error}</ErrorText>}

        {interactive && (
          <ActionsRow>
            {rows.length < 5 ? (
              <AddButton type="button" onClick={addRow}>
                <PlusStrokeIcon aria-hidden />
                Add teammate
              </AddButton>
            ) : (
              <span />
            )}
            <Button size="small" isPrimary onClick={handleInvite}>
              Invite
            </Button>
          </ActionsRow>
        )}
      </Body>
    </CopilotPreviewCard>
  )
}
