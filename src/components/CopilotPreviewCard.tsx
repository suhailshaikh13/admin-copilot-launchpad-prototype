import { useEffect, useState, type ReactNode } from 'react'
import styled from 'styled-components'

const Shell = styled.div`
  margin-top: 12px;
  width: 100%;
  max-width: 100%;
  background: #eee7f3;
  border-radius: 16px;
  overflow: clip;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  min-height: 32px;
  padding: 8px 20px 4px;
`

const Title = styled.p`
  margin: 0;
  flex: 1;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: -0.0004px;
  color: #422953;
`

const InnerCard = styled.div<{ $reserveCollapsedToggleSpace?: boolean }>`
  position: relative;
  margin: 0;
  background: #fff;
  border: 1px solid #dcdcda;
  border-radius: 16px;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: stretch;

  ${({ $reserveCollapsedToggleSpace }) =>
    $reserveCollapsedToggleSpace
      ? `
    padding-bottom: 56px;
  `
      : ''}
`

const Content = styled.div<{ $collapsed?: boolean; $collapsedMaxHeight?: number }>`
  width: 100%;
  min-width: 0;
  ${({ $collapsed, $collapsedMaxHeight = 184 }) =>
    $collapsed
      ? `
    max-height: ${$collapsedMaxHeight}px;
    overflow: hidden;
  `
      : ''}
`

const FadeGradient = styled.div`
  position: absolute;
  left: -1px;
  right: -1px;
  bottom: -1px;
  height: 96px;
  pointer-events: none;
  background: linear-gradient(to top, #ffffff 35%, rgba(255, 255, 255, 0));
`

const toggleButtonStyles = `
  border: none;
  background: transparent;
  padding: 10px 16px;
  border-radius: 99px;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: -0.154px;
  color: #406cc4;
  cursor: pointer;

  &:hover {
    background: rgba(64, 108, 196, 0.08);
  }
`

const CollapsedToggleButton = styled.button`
  position: absolute;
  left: 3px;
  bottom: 9px;
  z-index: 1;
  ${toggleButtonStyles}
`

const ExpandedToggleRow = styled.div`
  margin-top: 8px;
  flex-shrink: 0;
`

const ExpandedToggleButton = styled.button`
  align-self: flex-start;
  ${toggleButtonStyles}
`

export type CopilotPreviewExpandable = 'none' | 'collapsible'

interface CopilotPreviewCardProps {
  title: string
  children: ReactNode
  expandable?: CopilotPreviewExpandable
  defaultExpanded?: boolean
  collapsedMaxHeight?: number
}

export default function CopilotPreviewCard({
  title,
  children,
  expandable = 'none',
  defaultExpanded = false,
  collapsedMaxHeight = 184,
}: CopilotPreviewCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const isCollapsible = expandable === 'collapsible'
  const showCollapsed = isCollapsible && !expanded

  useEffect(() => {
    if (!isCollapsible) {
      setExpanded(false)
    }
  }, [isCollapsible])

  return (
    <Shell>
      <Header>
        <Title>{title}</Title>
      </Header>
      <InnerCard $reserveCollapsedToggleSpace={showCollapsed}>
        <Content $collapsed={showCollapsed} $collapsedMaxHeight={collapsedMaxHeight}>
          {children}
        </Content>
        {showCollapsed && (
          <>
            <FadeGradient aria-hidden />
            <CollapsedToggleButton type="button" onClick={() => setExpanded(true)}>
              View full preview
            </CollapsedToggleButton>
          </>
        )}
        {isCollapsible && expanded && (
          <ExpandedToggleRow>
            <ExpandedToggleButton type="button" onClick={() => setExpanded(false)}>
              Hide full preview
            </ExpandedToggleButton>
          </ExpandedToggleRow>
        )}
      </InnerCard>
    </Shell>
  )
}
