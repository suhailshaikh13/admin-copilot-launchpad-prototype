export type TeamInviteRole = 'Admin' | 'Agent' | 'Light agent'

export interface TeamInviteEntry {
  email: string
  role: TeamInviteRole
}

export const TEAM_INVITE_ROLES: TeamInviteRole[] = ['Admin', 'Agent', 'Light agent']

export function isValidInviteEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}
