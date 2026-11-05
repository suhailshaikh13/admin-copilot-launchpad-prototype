import styled, { keyframes } from 'styled-components'
import RocketFillIcon from '@zendesk-ui/assets/icons/20px/rocket-fill.svg?react'
import CheckCircleFillIcon from '../assets/check-circle-fill.svg?react'
import MonitorFillIcon from '@zendesk-ui/assets/icons/20px/monitor-fill.svg?react'
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

const HeaderBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 720px;
`

const Eyebrow = styled.p`
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  color: #1f73b7;
`

const Title = styled.h1`
  margin: 0;
  font-size: 28px;
  font-weight: 400;
  line-height: 34px;
  letter-spacing: 0.2px;
  color: #2f3941;
`

const Subtitle = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 24px;
  color: #68737d;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 340px);
  gap: 24px;
  align-items: start;
  max-width: 960px;
  width: 100%;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

const Card = styled.div`
  background: #f8f9f9;
  border: 1px solid #e9ebed;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const CardTitle = styled.h2`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #2f3941;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    width: 20px;
    height: 20px;
    color: #1f73b7;
  }
`

const StepList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const StepItem = styled.li<{ $done?: boolean; $active?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  background: ${({ $active, $done }) =>
    $done ? '#edf7ed' : $active ? '#edf4fc' : 'white'};
  border: 1px solid
    ${({ $active, $done }) => ($done ? '#c8e6c9' : $active ? '#c2dff8' : '#e9ebed')};
  transition: background 0.25s ease, border-color 0.25s ease;
`

const StepIcon = styled.span<{ $done?: boolean }>`
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  margin-top: 2px;
  color: ${({ $done }) => ($done ? '#038153' : '#87929d')};

  svg {
    width: 20px;
    height: 20px;
  }
`

const StepCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const StepLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #2f3941;
`

const StepDetail = styled.span`
  font-size: 13px;
  line-height: 18px;
  color: #68737d;
`

const PreviewFrame = styled.div`
  background: white;
  border: 1px solid #d8dcde;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(10, 13, 14, 0.08);
`

const PreviewChrome = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 12px;
  background: #f4f6f8;
  border-bottom: 1px solid #e9ebed;
`

const Dot = styled.span<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`

const PreviewUrl = styled.span`
  margin-left: 8px;
  font-size: 12px;
  color: #68737d;
`

const PreviewBody = styled.div`
  padding: 32px 24px 48px;
  min-height: 200px;
  background: linear-gradient(180deg, #fafafa 0%, #ffffff 100%);
  position: relative;
`

const SitePlaceholder = styled.div`
  max-width: 280px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const SiteBar = styled.div<{ $w?: string }>`
  height: 10px;
  border-radius: 4px;
  background: #e9ebed;
  width: ${({ $w }) => $w ?? '100%'};
`

const pulse = keyframes`
  0%, 100% { transform: scale(1); box-shadow: 0 4px 16px rgba(31, 115, 183, 0.35); }
  50% { transform: scale(1.04); box-shadow: 0 6px 20px rgba(31, 115, 183, 0.45); }
`

const WidgetBubble = styled.button<{ $live?: boolean }>`
  position: absolute;
  right: 20px;
  bottom: 20px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  cursor: default;
  background: linear-gradient(135deg, #1f73b7 0%, #9256b1 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(31, 115, 183, 0.35);
  animation: ${({ $live }) => ($live ? pulse : 'none')} 2s ease-in-out infinite;

  svg {
    width: 24px;
    height: 24px;
  }
`

const LiveBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  background: #edf7ed;
  color: #038153;
  font-size: 12px;
  font-weight: 600;
`

const liveDot = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`

const LiveDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #038153;
  animation: ${liveDot} 1.5s ease-in-out infinite;
`

const steps = [
  {
    id: 'trial',
    label: 'Trial account',
    detail: 'Admin Center sandbox is ready for your team.',
  },
  {
    id: 'widget',
    label: 'Web widget',
    detail: 'Messaging widget installed on your demo site.',
  },
  {
    id: 'routing',
    label: 'Default routing',
    detail: 'New conversations route to your trial group.',
  },
  {
    id: 'live',
    label: 'Live on the web',
    detail: 'Visitors can start a chat from your site.',
  },
] as const

function stepDone(stage: LaunchpadStage, index: number): boolean {
  if (stage === 'idle') return false
  if (stage === 'live') return true
  return index <= 1
}

function stepActive(stage: LaunchpadStage, index: number): boolean {
  if (stage !== 'progress') return false
  return index === 2
}

interface LaunchpadTrialCanvasProps {
  stage: LaunchpadStage
}

export default function LaunchpadTrialCanvas({ stage }: LaunchpadTrialCanvasProps) {
  const isLive = stage === 'live'

  return (
    <Canvas>
      <HeaderBlock>
        <Eyebrow>Trial workspace</Eyebrow>
        <Title>Your launch preview</Title>
        <Subtitle>
          Configure on the right with Launchpad copilot. Changes appear here as you go live—no admin
          menus on this side.
        </Subtitle>
        {isLive && (
          <LiveBadge>
            <LiveDot aria-hidden />
            Live for demo visitors
          </LiveBadge>
        )}
      </HeaderBlock>

      <Grid>
        <Card>
          <CardTitle>
            <RocketFillIcon />
            Go-live checklist
          </CardTitle>
          <StepList>
            {steps.map((step, index) => (
              <StepItem
                key={step.id}
                $done={stepDone(stage, index)}
                $active={stepActive(stage, index)}
              >
                <StepIcon $done={stepDone(stage, index)}>
                  {stepDone(stage, index) ? <CheckCircleFillIcon /> : <MonitorFillIcon />}
                </StepIcon>
                <StepCopy>
                  <StepLabel>{step.label}</StepLabel>
                  <StepDetail>{step.detail}</StepDetail>
                </StepCopy>
              </StepItem>
            ))}
          </StepList>
        </Card>

        <PreviewFrame>
          <PreviewChrome>
            <Dot $color="#ff5f57" />
            <Dot $color="#febc2e" />
            <Dot $color="#28c840" />
            <PreviewUrl>
              {isLive ? 'https://demo.camera-obscura.app' : 'https://your-site.example'}
            </PreviewUrl>
          </PreviewChrome>
          <PreviewBody>
            <SitePlaceholder aria-hidden>
              <SiteBar $w="72%" />
              <SiteBar $w="100%" />
              <SiteBar $w="88%" />
              <SiteBar $w="64%" />
            </SitePlaceholder>
            <WidgetBubble $live={isLive} aria-label="Messaging widget">
              <RocketFillIcon />
            </WidgetBubble>
          </PreviewBody>
        </PreviewFrame>
      </Grid>
    </Canvas>
  )
}
