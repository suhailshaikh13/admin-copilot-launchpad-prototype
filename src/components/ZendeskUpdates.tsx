import { useState } from 'react'
import styled from 'styled-components'
import { Anchor } from '@zendesk-ui/react-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const TitleLink = styled(Anchor)`
  font-size: 18px;
  line-height: 24px;
  letter-spacing: -0.45px;
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

const AnchorLink = styled(Anchor)`
  font-size: 12px;
  line-height: 16px;
  letter-spacing: -0.0004px;
`

const ViewAllLink = styled(Anchor)`
  font-size: 12px;
  line-height: 16px;
  letter-spacing: -0.0004px;

  && {
    color: #2f3130;
  }

  &&:hover {
    color: #404241;
  }

  &&:active {
    color: #646864;
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
      <TitleLink href="#" isExternal isUnderlined={false} externalIconLabel="(opens in new tab)">
        Zendesk updates
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
              <AnchorLink href="#" isExternal isUnderlined={false} externalIconLabel="(opens in new tab)">
                {item.text}
              </AnchorLink>
            </ListItem>
          ))}
        </List>

        <ViewAllLink href="#" isExternal externalIconLabel="(opens in new tab)">
          View all announcements
        </ViewAllLink>
      </Card>
    </Container>
  )
}
