import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { ComponentType } from 'react'
import styled from 'styled-components'
import { Button, Anchor } from '@zendesk-ui/react-components'
import FlowFillIcon from '@zendesk-ui/assets/icons/20px/flow-fill.svg?react'
import BookOpenFillIcon from '@zendesk-ui/assets/icons/20px/book-open-fill.svg?react'
import MonitorFillIcon from '@zendesk-ui/assets/icons/20px/monitor-fill.svg?react'
import DotsVerticalIcon from '@zendesk-ui/assets/icons/20px/dots-vertical-fill.svg?react'

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

const ViewAllLink = styled(Anchor)`
  font-size: 14px;
  line-height: 20px;
  letter-spacing: -0.154px;

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

const ListContainer = styled.div`
  border: 1px solid #dedddb;
  border-radius: 16px;
  overflow: hidden;
`

const RecommendationItem = styled.div<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
  position: relative;
  background: ${({ $active }) =>
    $active ? 'linear-gradient(90deg, #f8f9f9 0%, white 100%)' : 'white'};
  cursor: pointer;
  transition: background-color 150ms ease;

  &:hover {
    background-color: rgba(64, 108, 196, 0.08);
  }

  &:focus-visible {
    outline: none;
    box-shadow: inset 0 0 0 3px #406cc4, inset 0 0 0 4px white;
  }
`

const AccentBar = styled.div`
  position: absolute;
  left: 0;
  top: 16px;
  bottom: 16px;
  width: 5px;
  border-radius: 0 5px 5px 0;
  background: #284173;
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

const OverflowButton = styled.button`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 24px;
  background: transparent;
  color: #646864;
  cursor: pointer;
  padding: 0;

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    background-color: rgba(100, 104, 100, 0.08);
  }

  &:focus-visible {
    outline: none;
    box-shadow: inset 0 0 0 3px #406cc4, inset 0 0 0 4px white;
  }

  &:active {
    background-color: rgba(100, 104, 100, 0.16);
  }
`

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const Menu = styled.div<{ $top: number; $right: number }>`
  position: fixed;
  top: ${({ $top }) => $top}px;
  right: ${({ $right }) => $right}px;
  background: white;
  border: 1px solid #d8dcde;
  border-radius: 4px;
  box-shadow: 0px 16px 24px 0px rgba(10, 13, 14, 0.16);
  padding: 4px 1px;
  z-index: 10;
  min-width: 140px;
  overflow: hidden;
`

const MenuItem = styled.button`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
  padding: 8px 36px 8px 12px;
  border: none;
  background: transparent;
  font-family: inherit;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: -0.154px;
  color: #293239;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background-color: rgba(100, 104, 100, 0.08);
  }
`

const MenuDivider = styled.div`
  height: 1px;
  background: #e8eaec;
  margin: 4px 0;
`

interface RecommendationData {
  title: string
  description: string
  reviewLabel: string
  tags: { label: string; bg: string; color: string; Icon?: ComponentType }[]
}

const recommendations: RecommendationData[] = [
  {
    title: 'Route specific tickets to assignee: EMEA Group',
    description: 'Resolution time could improve by 2h 45min',
    reviewLabel: 'Review trigger',
    tags: [
      { label: 'Triggers', bg: '#e4e8f6', color: '#304073', Icon: FlowFillIcon },
      { label: 'Optimization', bg: '#F6F5F4', color: '#313131' },
    ],
  },
  {
    title: 'Change ticket status for intent: Unsolicited marketing',
    description: 'Resolution time could improve by 1h 05min',
    reviewLabel: 'Review procedure',
    tags: [
      { label: 'Procedures', bg: '#e2edd4', color: '#344914', Icon: BookOpenFillIcon },
      { label: 'Optimization', bg: '#F6F5F4', color: '#313131' },
    ],
  },
  {
    title: 'Turn on suggested macros',
    description: 'Resolution time could improve by 50min',
    reviewLabel: 'Review macros',
    tags: [
      { label: 'Macros', bg: '#dceeed', color: '#034a4b', Icon: MonitorFillIcon },
      { label: 'Maintenance', bg: '#F6F5F4', color: '#313131' },
    ],
  },
]

export default function Recommendations() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [menuIndex, setMenuIndex] = useState<number | null>(null)
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 })
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([])

  const handleClick = (index: number) => {
    setActiveIndex(prev => (prev === index ? null : index))
  }

  const toggleMenu = (index: number) => {
    if (menuIndex === index) {
      setMenuIndex(null)
      return
    }
    const btn = buttonRefs.current[index]
    if (btn) {
      const rect = btn.getBoundingClientRect()
      setMenuPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right })
    }
    setMenuIndex(index)
  }

  useEffect(() => {
    if (menuIndex === null) return
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) &&
          !buttonRefs.current[menuIndex]?.contains(e.target as Node)) {
        setMenuIndex(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuIndex])

  return (
    <Container>
      <HeaderRow>
        <SectionTitle>Recommendations</SectionTitle>
        <ViewAllLink href="#">View all</ViewAllLink>
      </HeaderRow>

      <ListContainer>
        {recommendations.map((rec, index) => (
          <div key={index}>
            <RecommendationItem
              $active={activeIndex === index}
              tabIndex={0}
              onClick={() => handleClick(index)}
            >
              {activeIndex === index && <AccentBar />}
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
              <ButtonGroup>
                <Button isBasic isPill onClick={(e) => { e.stopPropagation(); handleClick(index) }}>
                  {activeIndex === index ? 'Close details' : 'View details'}
                </Button>
                <OverflowButton
                  ref={(el) => { buttonRefs.current[index] = el }}
                  aria-label="More options"
                  onClick={(e) => { e.stopPropagation(); toggleMenu(index) }}
                >
                  <DotsVerticalIcon />
                </OverflowButton>
              </ButtonGroup>
            </RecommendationItem>
            {index < recommendations.length - 1 && <Divider />}
          </div>
        ))}
      </ListContainer>

      {menuIndex !== null && createPortal(
        <Menu ref={menuRef} $top={menuPos.top} $right={menuPos.right}>
          <MenuItem onClick={() => setMenuIndex(null)}>
            {recommendations[menuIndex].reviewLabel}
          </MenuItem>
          <MenuDivider />
          <MenuItem onClick={() => setMenuIndex(null)}>
            Mark as done
          </MenuItem>
          <MenuItem onClick={() => setMenuIndex(null)}>
            Decline
          </MenuItem>
        </Menu>,
        document.body
      )}
    </Container>
  )
}
