import styled from 'styled-components'
import ChevronDownIcon from '../assets/chevron-down.svg?react'
import CheckCircleFillIcon from '../assets/check-circle-fill.svg?react'
import LaunchpadPreviewIllustration from './LaunchpadPreviewIllustration'
import type { LaunchpadStage } from '../launchpad/types'

const Canvas = styled.div`
  flex: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 40px;
  gap: 32px;
  overflow-y: auto;
`

const TopRow = styled.div`
  display: flex;
  gap: 24px;
  align-items: flex-start;
  width: 100%;
`

const HeaderCopy = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const PageTitle = styled.h1`
  margin: 0;
  font-size: 18px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: -0.45px;
  color: #2f3130;
`

const PageSubtitle = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: -0.154px;
  color: #646864;
`

const ProgressBlock = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  height: 44px;
`

const ProgressLabel = styled.span`
  font-size: 12px;
  line-height: 16px;
  color: #646864;
  white-space: nowrap;
`

const ProgressTrack = styled.div`
  position: relative;
  width: 300px;
  height: 12px;
  border-radius: 6px;
  background: rgba(100, 104, 100, 0.16);
  overflow: hidden;
`

const ProgressFill = styled.div<{ $ratio: number }>`
  position: absolute;
  inset: 0 auto 0 0;
  width: ${({ $ratio }) => `${$ratio * 100}%`};
  border-radius: 6px;
  background: #4b7d04;
`

const TaskCard = styled.div`
  display: flex;
  align-items: stretch;
  width: 100%;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 0 0 1px #dcdcda;
`

const TaskList = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  border: 1px solid #dcdcda;
  border-right: none;
  border-radius: 16px 0 0 16px;
  overflow: hidden;
`

const RowShell = styled.div<{ $expanded?: boolean }>`
  border-bottom: 1px solid ${({ $expanded }) => ($expanded ? '#b7b7b3' : '#dcdcda')};
  background: #fff;

  &:last-child {
    border-bottom: none;
  }
`

const CollapsedRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
`

const StatusIconWrap = styled.div`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 20px;
    height: 20px;
  }
`

const CompletedIcon = styled(CheckCircleFillIcon)`
  color: #4b7d04;
`

const PendingRing = styled.span`
  display: block;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1.5px solid #b7b7b3;
  box-sizing: border-box;
`

const RowTitle = styled.span<{ $muted?: boolean; $large?: boolean }>`
  flex: 1;
  min-width: 0;
  font-size: ${({ $large }) => ($large ? '18px' : '14px')};
  font-weight: ${({ $large }) => ($large ? 600 : 400)};
  line-height: ${({ $large }) => ($large ? '24px' : '20px')};
  letter-spacing: ${({ $large }) => ($large ? '-0.45px' : '-0.154px')};
  color: ${({ $muted, $large }) => ($large ? '#2f3130' : $muted ? '#646864' : '#2f3130')};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const IconButton = styled.button`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 24px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;
  color: #646864;

  svg {
    width: 20px;
    height: 20px;
  }
`

const ExpandedBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 24px 20px 32px;
`

const ExpandedHeader = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
`

const ExpandedCopy = styled.div`
  flex: 1;
  min-width: 0;
  padding-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const ExpandedDescription = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: -0.154px;
  color: #646864;
`

const ActionColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding-left: 52px;
`

const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 40px;
  padding: 10px 16px;
  border: none;
  border-radius: 99px;
  background: #2f3130;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: -0.154px;
  cursor: default;
  white-space: nowrap;
`

const TeamBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
`

const TeamLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: #2f3130;
`

const MarkDoneLink = styled.button`
  margin-left: 52px;
  padding: 0;
  border: none;
  background: none;
  font-size: 14px;
  line-height: 20px;
  color: #406cc4;
  text-decoration: underline;
  cursor: default;
`

function NewWindowIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        fill="currentColor"
        d="M5.833 4.167a.833.833 0 0 0-.833.833v10a.833.833 0 0 0 .833.833h10a.833.833 0 0 0 .833-.833v-3.334a.833.833 0 0 1 1.666 0v3.334A2.5 2.5 0 0 1 15.833 17.5h-10a2.5 2.5 0 0 1-2.5-2.5v-10a2.5 2.5 0 0 1 2.5-2.5h3.333a.833.833 0 0 1 0 1.666H5.833ZM11.667 3.333h5a.833.833 0 0 1 .833.833v5a.833.833 0 0 1-1.666 0V6.345l-6.488 6.488a.833.833 0 0 1-1.178-1.178L14.655 5.167H11.667a.833.833 0 0 1 0-1.666Z"
      />
    </svg>
  )
}

function progressRatio(_stage: LaunchpadStage): number {
  return 0.2
}

interface LaunchpadTrialCanvasProps {
  stage: LaunchpadStage
}

export default function LaunchpadTrialCanvas({ stage }: LaunchpadTrialCanvasProps) {
  const completedCount = 1
  const totalCount = 5

  return (
    <Canvas>
      <TopRow>
        <HeaderCopy>
          <PageTitle>Set up your trial essentials</PageTitle>
          <PageSubtitle>
            Your trial is taking shape with content pulled from your website. Keep going to see what
            Zendesk can do.
          </PageSubtitle>
        </HeaderCopy>
        <ProgressBlock>
          <ProgressLabel>
            {completedCount} of {totalCount} completed
          </ProgressLabel>
          <ProgressTrack aria-valuenow={completedCount} aria-valuemin={0} aria-valuemax={totalCount} role="progressbar">
            <ProgressFill $ratio={progressRatio(stage)} />
          </ProgressTrack>
        </ProgressBlock>
      </TopRow>

      <TaskCard>
        <TaskList>
          <RowShell>
            <CollapsedRow>
              <StatusIconWrap>
                <CompletedIcon aria-label="Completed" />
              </StatusIconWrap>
              <RowTitle $muted>Let AI take the easy ones</RowTitle>
              <IconButton type="button" aria-label="Expand task">
                <ChevronDownIcon />
              </IconButton>
            </CollapsedRow>
          </RowShell>

          <RowShell>
            <CollapsedRow>
              <StatusIconWrap>
                <PendingRing aria-hidden />
              </StatusIconWrap>
              <RowTitle $muted>Power your AI agent</RowTitle>
              <IconButton type="button" aria-label="Expand task">
                <ChevronDownIcon />
              </IconButton>
            </CollapsedRow>
          </RowShell>

          <RowShell $expanded>
            <ExpandedBlock>
              <ExpandedHeader>
                <StatusIconWrap>
                  <PendingRing aria-hidden />
                </StatusIconWrap>
                <ExpandedCopy>
                  <RowTitle $large>See every ticket in one place</RowTitle>
                  <ExpandedDescription>
                    Conversations from every channel become tickets both AI agents and your team
                    resolve.
                  </ExpandedDescription>
                </ExpandedCopy>
                <IconButton type="button" aria-label="Collapse task">
                  <ChevronDownIcon />
                </IconButton>
              </ExpandedHeader>

              <ActionColumn>
                <PrimaryButton type="button">
                  Go to Agent Workspace
                  <NewWindowIcon />
                </PrimaryButton>
                <TeamBlock>
                  <TeamLabel>For your team</TeamLabel>
                  <PrimaryButton type="button">
                    See agent copilot on a ticket
                    <NewWindowIcon />
                  </PrimaryButton>
                </TeamBlock>
              </ActionColumn>

              <MarkDoneLink type="button">Mark as done</MarkDoneLink>
            </ExpandedBlock>
          </RowShell>

          <RowShell>
            <CollapsedRow>
              <StatusIconWrap>
                <PendingRing aria-hidden />
              </StatusIconWrap>
              <RowTitle $muted>Try a real ticket</RowTitle>
              <IconButton type="button" aria-label="Expand task">
                <ChevronDownIcon />
              </IconButton>
            </CollapsedRow>
          </RowShell>

          <RowShell>
            <CollapsedRow>
              <StatusIconWrap>
                <PendingRing aria-hidden />
              </StatusIconWrap>
              <RowTitle $muted>Bring in your team</RowTitle>
              <IconButton type="button" aria-label="Expand task">
                <ChevronDownIcon />
              </IconButton>
            </CollapsedRow>
          </RowShell>
        </TaskList>

        <LaunchpadPreviewIllustration />
      </TaskCard>
    </Canvas>
  )
}
