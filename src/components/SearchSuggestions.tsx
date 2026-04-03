import XStrokeIcon from '@zendeskgarden/svg-icons/src/16/x-stroke.svg?react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const SectionLabel = styled.div`
  padding: 12px 16px 4px;
  font-size: 12px;
  font-weight: 600;
  color: #68737d;
  line-height: 16px;
`

const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  cursor: pointer;

  &:hover {
    background: #f8f9f9;
  }
`

const ItemText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const ItemTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #2f3941;
  line-height: 20px;
`

const ItemSubtitle = styled.span`
  font-size: 12px;
  color: #68737d;
  line-height: 16px;
`

const DismissButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #68737d;
  border-radius: 4px;

  &:hover {
    color: #2f3941;
    background: #e9ebed;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`

const recentItems = [
  { title: 'Brands', subtitle: 'Brand management' },
  { title: 'Environments', subtitle: 'Sandbox' },
  { title: 'Channels', subtitle: 'Main navigation' },
]

export default function SearchSuggestions() {
  return (
    <Container>
      <SectionLabel>Recently viewed</SectionLabel>
      {recentItems.map(item => (
        <Item key={item.title}>
          <ItemText>
            <ItemTitle>{item.title}</ItemTitle>
            <ItemSubtitle>{item.subtitle}</ItemSubtitle>
          </ItemText>
          <DismissButton aria-label={`Remove ${item.title}`}>
            <XStrokeIcon />
          </DismissButton>
        </Item>
      ))}
    </Container>
  )
}
