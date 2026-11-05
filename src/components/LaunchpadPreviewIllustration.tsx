import styled from 'styled-components'

const Panel = styled.div`
  position: relative;
  width: 392px;
  flex-shrink: 0;
  align-self: stretch;
  min-height: 420px;
  background: #e4eaf6;
  border: 1px solid #dcdcda;
  border-left: none;
  border-radius: 0 16px 16px 0;
  overflow: hidden;
`

const Glow = styled.div`
  position: absolute;
  width: 364px;
  height: 364px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.85) 0%,
    rgba(228, 234, 246, 0.4) 45%,
    transparent 70%
  );
  pointer-events: none;
`

const MockFrame = styled.div`
  position: absolute;
  left: 12%;
  right: 12%;
  top: 50%;
  transform: translateY(-50%);
  aspect-ratio: 297 / 267;
  border-radius: 8px;
  box-shadow: 0 12px 32px rgba(47, 49, 48, 0.12);
  display: flex;
  overflow: hidden;
  background: #fff;
`

const MockSidebar = styled.div`
  width: 28%;
  background: #2f3130;
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const SidebarLine = styled.div<{ $w?: string; $bright?: boolean }>`
  height: 6px;
  border-radius: 3px;
  width: ${({ $w }) => $w ?? '100%'};
  background: ${({ $bright }) => ($bright ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.12)')};
`

const MockMain = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: #fafafa;
`

const MockHeader = styled.div`
  padding: 10px 12px;
  background: #fff;
  border-bottom: 1px solid #e9ebed;
  font-size: 11px;
  font-weight: 600;
  color: #2f3130;
  letter-spacing: -0.02em;
`

const MockTable = styled.div`
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const MockRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  background: #fff;
  border-radius: 4px;
  border: 1px solid #e9ebed;
`

const RowDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #406cc4;
  flex-shrink: 0;
`

const RowBar = styled.div<{ $w: string }>`
  height: 5px;
  border-radius: 2px;
  background: #e9ebed;
  width: ${({ $w }) => $w};
`

export default function LaunchpadPreviewIllustration() {
  return (
    <Panel aria-hidden>
      <Glow />
      <MockFrame>
        <MockSidebar>
          <SidebarLine $w="72%" $bright />
          <SidebarLine $w="55%" />
          <SidebarLine $w="80%" />
          <SidebarLine $w="60%" />
          <SidebarLine $w="70%" />
        </MockSidebar>
        <MockMain>
          <MockHeader>Tickets</MockHeader>
          <MockTable>
            <MockRow>
              <RowDot />
              <RowBar $w="78%" />
            </MockRow>
            <MockRow>
              <RowDot />
              <RowBar $w="65%" />
            </MockRow>
            <MockRow>
              <RowDot />
              <RowBar $w="82%" />
            </MockRow>
          </MockTable>
        </MockMain>
      </MockFrame>
    </Panel>
  )
}
