import { useState } from 'react'
import styled from 'styled-components'
import ExternalLinkIcon from '@zendesk-ui/assets/icons/20px/external-link-fill.svg?react'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const TitleLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 18px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: -0.45px;
  color: #406cc4;
  text-decoration: none;
  cursor: pointer;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    color: #284173;
  }
`

const Card = styled.div`
  background: white;
  border: 1px solid #d8dcde;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 9px;
`

const TabBar = styled.div`
  display: flex;
  border-bottom: 1px solid #dcdcda;
`

const Tab = styled.button<{ $active?: boolean }>`
  padding: 10px 28px 9px;
  border: none;
  background: none;
  font-family: inherit;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: -0.0004px;
  color: ${({ $active }) => ($active ? '#406cc4' : '#2f3130')};
  cursor: pointer;
  border-bottom: ${({ $active }) => ($active ? '3px solid #406cc4' : '3px solid transparent')};
  white-space: nowrap;

  &:hover {
    color: #406cc4;
  }
`

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`

const ListItem = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`

const DateText = styled.p`
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: -0.0004px;
  color: #646864;
  margin: 0;
  white-space: nowrap;
`

const AnchorLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: -0.0004px;
  color: #406cc4;
  text-decoration: none;
  cursor: pointer;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    color: #284173;
  }
`

const tabs = ['Announcements', "What's new", 'Developer updates', 'Release notes', 'Service notifications']

const announcements = [
  { date: 'Oct 31, 2024', text: 'Announcing the Authenticated SMTP Connector' },
  { date: 'Oct 30, 2024', text: 'Announcing CSAT public API and updates to CSAT email' },
  { date: 'Oct 31, 2024', text: 'Announcing Department Spaces' },
  { date: 'Oct 24, 2024', text: 'Announcing user suspension for the messaging channel' },
  { date: 'Oct 28, 2024', text: 'Advisory: Increase in phishing attempts to Zendesk accounts' },
]

export default function ZendeskUpdates() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <Container>
      <TitleLink href="#">
        Zendesk updates
        <ExternalLinkIcon />
      </TitleLink>

      <Card>
        <TabBar>
          {tabs.map((tab, index) => (
            <Tab key={tab} $active={index === activeTab} onClick={() => setActiveTab(index)}>
              {tab}
            </Tab>
          ))}
        </TabBar>

        <List>
          {announcements.map((item, index) => (
            <ListItem key={index}>
              <DateText>{item.date}</DateText>
              <AnchorLink href="#">
                {item.text}
                <ExternalLinkIcon />
              </AnchorLink>
            </ListItem>
          ))}
        </List>

        <AnchorLink href="#">
          View all announcements
          <ExternalLinkIcon />
        </AnchorLink>
      </Card>
    </Container>
  )
}
