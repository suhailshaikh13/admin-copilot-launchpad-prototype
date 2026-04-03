import styled from 'styled-components'
import { Button } from '@zendeskgarden/react-buttons'
import CheckLgStrokeIcon from '@zendeskgarden/svg-icons/src/16/check-lg-stroke.svg?react'
import ArrowTrendingStrokeIcon from '@zendeskgarden/svg-icons/src/16/arrow-trending-stroke.svg?react'
import AlertWarningStrokeIcon from '@zendeskgarden/svg-icons/src/16/alert-warning-stroke.svg?react'
import CopilotIcon from '../assets/sparkle-fill.svg?react'
import { InteractiveButton } from './InteractiveButton'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 4px;
`

const SectionTitle = styled.p`
  font-size: 18px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: -0.45px;
  color: #313131;
  margin: 0;
`

const DateText = styled.p`
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: #706f6e;
  margin: 0;
`

const CardGrid = styled.div`
  display: flex;
  gap: 12px;
`

const Card = styled.div`
  flex: 1;
  border: 1px solid #dedddb;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 152px;
`

const IconBadge = styled.div<{ $bg: string }>`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: ${({ $bg }) => $bg};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 16px;
    height: 16px;
  }
`

const CardTitle = styled.p`
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: -0.154px;
  color: #313131;
  margin: 0;
`

const CardDescription = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: -0.154px;
  color: #313131;
  margin: 0;
  flex: 1;
`

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  min-height: 32px;
`

const ChipSparkle = styled(CopilotIcon)`
  width: 12px;
  height: 12px;
  color: #7b61c2;
`

export default function LatestInsights() {
  return (
    <Container>
      <HeaderRow>
        <HeaderLeft>
          <SectionTitle>Latest insights</SectionTitle>
          <DateText>Sep 20–Sep 28, 2025</DateText>
        </HeaderLeft>
        <Button isBasic>Give feedback</Button>
      </HeaderRow>

      <CardGrid>
        <Card>
          <IconBadge $bg="#e4e8f6">
            <CheckLgStrokeIcon />
          </IconBadge>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <CardTitle>Full resolution time steady</CardTitle>
            <CardDescription>
              8h32min on average, which is the same as last week.
            </CardDescription>
          </div>
          <CardFooter>
            <InteractiveButton size="small" icon={<ChipSparkle />}>
              Show me more
            </InteractiveButton>
          </CardFooter>
        </Card>

        <Card>
          <IconBadge $bg="#f6ec94">
            <ArrowTrendingStrokeIcon />
          </IconBadge>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <CardTitle>Ticket volume increase</CardTitle>
            <CardDescription>
              Your team is answering 13% more tickets.
            </CardDescription>
          </div>
          <CardFooter>
            <InteractiveButton size="small" icon={<ChipSparkle />}>
              High volume topics today
            </InteractiveButton>
          </CardFooter>
        </Card>

        <Card>
          <IconBadge $bg="#f7e5eb">
            <AlertWarningStrokeIcon />
          </IconBadge>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <CardTitle>First reply time increase</CardTitle>
            <CardDescription>
              This time was 20 minutes longer on average.
            </CardDescription>
          </div>
          <CardFooter>
            <InteractiveButton size="small" icon={<ChipSparkle />}>
              How to improve it
            </InteractiveButton>
          </CardFooter>
        </Card>
      </CardGrid>
    </Container>
  )
}
