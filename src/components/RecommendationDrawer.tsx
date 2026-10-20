import { useState } from 'react'
import styled from 'styled-components'
import { Button, IconButton, Tag, ChevronButton } from '@zendesk-ui/react-components'
import XIcon from '@zendesk-ui/assets/icons/20px/x-fill.svg?react'
import CopilotIcon from '../assets/sparkle-fill.svg?react'
import ChevronDownIcon from '../assets/chevron-down.svg?react'
import { QuickPrompt } from '@zendesk-ui/ai-assistant-chat'
import type { RecommendationData } from './recommendationsData'

interface RecommendationDrawerProps {
  recommendation: RecommendationData
  onClose: () => void
  onAskCopilot: (text: string) => void
}

const Panel = styled.div`
  /* Fixed width so collapse/expand clips content instead of reflowing it */
  width: 380px;
  min-width: 380px;
  height: 100%;
  flex-shrink: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0px 0px 4px 0px rgba(12, 12, 13, 0.16);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 10px 10px 10px 20px;
  flex-shrink: 0;
`

const HeaderTitle = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: -0.154px;
  color: #2f3130;
  margin: 0;
`

const Body = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: clip;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 8px 0 32px;
`

const Section = styled.div`
  padding: 0 20px;
`

const TitleSection = styled(Section)`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const Title = styled.p`
  font-size: 18px;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: -0.45px;
  color: #2f3130;
  margin: 0;
`

const Subheading = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: -0.154px;
  color: #2f3130;
  margin: 0;
`

const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
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
    width: 16px;
    height: 16px;
  }
`

const Rationale = styled(Section)`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const SectionText = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: -0.154px;
  color: #2f3130;
  margin: 0;
`

const SectionHeading = styled(SectionText)`
  font-weight: 600;
`

const Accordion = styled.div`
  border-top: 1px solid #eae9e8;
`

const AccordionRow = styled.div`
  border-bottom: 1px solid #eae9e8;
`

const AccordionHeader = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 56px;
  box-sizing: border-box;
  padding: 12px;
  padding-left: 20px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: -0.154px;
  color: #2f3130;
  text-align: left;

  &:hover {
    background-color: rgba(100, 104, 100, 0.04);
  }
`

const Chevron = styled.span<{ $open: boolean }>`
  display: flex;
  color: #2f3130;
  transition: transform 200ms ease-out;
  transform: ${({ $open }) => ($open ? 'rotate(180deg)' : 'none')};

  svg {
    width: 20px;
    height: 20px;
  }
`

const AccordionContent = styled.div`
  padding: 0 12px 12px 20px;
`

const Footnote = styled(Section)`
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: #646864;
  margin: 0;
`

const AskCopilot = styled(Section)`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 20px;
`

const AskCopilotHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const SparkleIcon = styled(CopilotIcon)`
  width: 20px;
  height: 20px;
  color: #7b61c2;
`

const QuickPrompts = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: flex-start;
`

const Footer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  gap: 12px;
  box-sizing: border-box;
  padding: 20px;
  flex-shrink: 0;
`

const SplitButtonGroup = styled.div`
  display: flex;
  align-items: center;

  > button:first-child {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  > button:last-child {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
`

const ACCORDION_SECTIONS = [
  {
    id: 'insights',
    label: 'Supporting insights',
    content:
      'Tickets tagged with the affected intent take 2h 45min longer to resolve than the account average. 68% of them are currently handled by the EMEA Group.',
  },
  {
    id: 'steps',
    label: 'Next steps',
    content:
      'Review the existing trigger conditions, then create an automation to route matching tickets to the right assignee.',
  },
] as const

export default function RecommendationDrawer({
  recommendation,
  onClose,
  onAskCopilot,
}: RecommendationDrawerProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})

  const toggleSection = (id: string) =>
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }))

  return (
    <Panel>
      <Header>
        <HeaderTitle>Recommendation details</HeaderTitle>
        <IconButton aria-label="Close" onClick={onClose} focusInset>
          <XIcon />
        </IconButton>
      </Header>

      <Body>
        <TitleSection>
          <TitleGroup>
            <Title>{recommendation.title}</Title>
            <Subheading>{recommendation.description}</Subheading>
          </TitleGroup>
          <TagRow>
            {recommendation.tags.map((tag, tagIndex) =>
              tag.Icon ? (
                <ColorTag key={tagIndex} $bg={tag.bg} $color={tag.color}>
                  <tag.Icon />
                  {tag.label}
                </ColorTag>
              ) : (
                <Tag key={tagIndex}>{tag.label}</Tag>
              )
            )}
          </TagRow>
        </TitleSection>

        <Rationale>
          <SectionHeading>Rationale</SectionHeading>
          <SectionText>
            Tickets with some intents tend to be routed to the same agent.
            Automate this action with a trigger to reduce manual triage and help
            improve resolution time.
          </SectionText>
        </Rationale>

        <Accordion>
          {ACCORDION_SECTIONS.map(section => (
            <AccordionRow key={section.id}>
              <AccordionHeader onClick={() => toggleSection(section.id)}>
                {section.label}
                <Chevron $open={!!openSections[section.id]}>
                  <ChevronDownIcon />
                </Chevron>
              </AccordionHeader>
              {openSections[section.id] && (
                <AccordionContent>
                  <SectionText>{section.content}</SectionText>
                </AccordionContent>
              )}
            </AccordionRow>
          ))}
        </Accordion>

        <Footnote as="p">
          Based on a sample of 48,200 tickets from July 16, 2025 to July 23,
          2025.
        </Footnote>

        <AskCopilot>
          <AskCopilotHeader>
            <SectionHeading>Ask admin copilot</SectionHeading>
            <SparkleIcon />
          </AskCopilotHeader>
          <QuickPrompts>
            <QuickPrompt showIcon={false} onClick={() => onAskCopilot('Help me review this procedure')}>
              Help me review this procedure
            </QuickPrompt>
            <QuickPrompt showIcon={false} onClick={() => onAskCopilot('Share more insights')}>
              Share more insights
            </QuickPrompt>
          </QuickPrompts>
        </AskCopilot>
      </Body>

      <Footer>
        <Button isBasic isPill onClick={onClose}>
          Skip
        </Button>
        <SplitButtonGroup>
          <Button isPrimary isPill onClick={() => onAskCopilot(`Help me ${recommendation.reviewLabel.toLowerCase()}`)}>
            {recommendation.reviewLabel}
          </Button>
          <ChevronButton aria-label="Other actions" isPrimary isPill />
        </SplitButtonGroup>
      </Footer>
    </Panel>
  )
}
