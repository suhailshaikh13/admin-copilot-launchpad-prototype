import type { ComponentType } from 'react'
import styled from 'styled-components'
import { Anchor, Button, IconButton } from '@zendeskgarden/react-buttons'
import OverflowVerticalStrokeIcon from '@zendeskgarden/svg-icons/src/16/overflow-vertical-stroke.svg?react'
import FlowFillIcon from '@zendesk-ui/assets/icons/20px/flow-fill.svg?react'
import BookOpenFillIcon from '@zendesk-ui/assets/icons/20px/book-open-fill.svg?react'
import MonitorFillIcon from '@zendesk-ui/assets/icons/20px/monitor-fill.svg?react'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const SectionTitle = styled.p`
  font-size: 18px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: -0.45px;
  color: #313131;
  margin: 0;
`

const StyledAnchor = styled(Anchor)`
  && {
    font-size: 14px;
    line-height: 20px;
  }
`

const ListContainer = styled.div`
  border: 1px solid #dedddb;
  border-radius: 16px;
  overflow: hidden;
`

const RecommendationItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
  position: relative;
  background: white;
`

const Divider = styled.div`
  height: 1px;
  background: #eae8e7;
`

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const ItemTitle = styled.p`
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: -0.154px;
  color: #313131;
  margin: 0;
`

const ItemDescription = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: -0.154px;
  color: #706f6e;
  margin: 0;
`

const TagRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`

const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`

const ColorTag = styled.span<{ $bg: string; $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 16px;
  background: ${({ $bg }) => $bg};
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  color: ${({ $color }) => $color};
  white-space: nowrap;

  svg {
    width: 12px;
    height: 12px;
  }
`

interface RecommendationData {
  title: string
  description: string
  tags: { label: string; bg: string; color: string; Icon?: ComponentType }[]
}

const recommendations: RecommendationData[] = [
  {
    title: 'Route specific tickets to assignee: EMEA Group',
    description: 'Resolution time could improve by 2h 45min',
    tags: [
      { label: 'Triggers', bg: '#e4e8f6', color: '#304073', Icon: FlowFillIcon },
      { label: 'Optimization', bg: '#eae8e7', color: '#313131' },
    ],
  },
  {
    title: 'Change ticket status for intent: Unsolicited marketing',
    description: 'Resolution time could improve by 1h 05min',
    tags: [
      { label: 'Procedures', bg: '#e2edd4', color: '#344914', Icon: BookOpenFillIcon },
      { label: 'Optimization', bg: '#eae8e7', color: '#313131' },
      { label: 'Previously declined', bg: '#eae8e7', color: '#313131' },
    ],
  },
  {
    title: 'Turn on suggested macros',
    description: 'Resolution time could improve by 50min',
    tags: [
      { label: 'Macros', bg: '#dceeed', color: '#034a4b', Icon: MonitorFillIcon },
      { label: 'Maintenance', bg: '#eae8e7', color: '#313131' },
    ],
  },
]

export default function Recommendations() {
  return (
    <Container>
      <HeaderRow>
        <SectionTitle>Recommendations</SectionTitle>
        <StyledAnchor href="#" isUnderlined={false}>View all recommendations</StyledAnchor>
      </HeaderRow>

      <ListContainer>
        {recommendations.map((rec, index) => (
          <div key={index}>
            <RecommendationItem>
              <Content>
                <div>
                  <ItemTitle>{rec.title}</ItemTitle>
                  <ItemDescription>{rec.description}</ItemDescription>
                </div>
                <TagRow>
                  {rec.tags.map((tag, tagIndex) => (
                    <ColorTag key={tagIndex} $bg={tag.bg} $color={tag.color}>
                      {tag.Icon && <tag.Icon />}
                      {tag.label}
                    </ColorTag>
                  ))}
                </TagRow>
              </Content>
              <ActionGroup>
                <Button isBasic>View details</Button>
                <IconButton isBasic size="medium" aria-label="More options">
                  <OverflowVerticalStrokeIcon />
                </IconButton>
              </ActionGroup>
            </RecommendationItem>
            {index < recommendations.length - 1 && <Divider />}
          </div>
        ))}
      </ListContainer>
    </Container>
  )
}
