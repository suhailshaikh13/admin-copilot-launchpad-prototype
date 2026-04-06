import { useState } from 'react'
import { Product, Header, Nav, Main, ProfileMenu } from '@zendesk-ui/navigation'
import { Tooltip } from '@zendeskgarden/react-tooltips'
import HomeFillIcon from '@zendesk-ui/assets/icons/20px/home-fill.svg?react'
import BuildingFillIcon from '@zendesk-ui/assets/icons/20px/building-fill.svg?react'
import PeopleFillIcon from '@zendesk-ui/assets/icons/20px/people-fill.svg?react'
import PaperPlaneFillIcon from '@zendesk-ui/assets/icons/20px/paper-plane-fill.svg?react'
import SparkleFillIcon from '@zendesk-ui/assets/icons/20px/sparkle-fill.svg?react'
import MonitorFillIcon from '@zendesk-ui/assets/icons/20px/monitor-fill.svg?react'
import FlowFillIcon from '@zendesk-ui/assets/icons/20px/flow-fill.svg?react'
import SquareGridCircleFillIcon from '@zendesk-ui/assets/icons/20px/square-grid-circle-fill.svg?react'
import RescueRingFillIcon from '@zendesk-ui/assets/icons/20px/rescue-ring-fill.svg?react'
import CopilotIcon from './assets/sparkle-fill.svg?react'
import ProductSupportIcon from '@zendesk-ui/assets/icons/20px/product-support.svg?react'
import ProductKnowledgeIcon from '@zendesk-ui/assets/icons/20px/product-knowledge.svg?react'
import ProductCommunityIcon from '@zendesk-ui/assets/icons/20px/product-community.svg?react'
import ProductChatIcon from '@zendesk-ui/assets/icons/20px/product-chat.svg?react'
import ProductVoiceIcon from '@zendesk-ui/assets/icons/20px/product-voice.svg?react'
import ProductAnalyticsIcon from '@zendesk-ui/assets/icons/20px/product-analytics.svg?react'
import ProductSalesIcon from '@zendesk-ui/assets/icons/20px/product-sales.svg?react'
import ProductWorkforceManagementIcon from '@zendesk-ui/assets/icons/20px/product-workforce-management.svg?react'
import ProductQualityAssuranceIcon from '@zendesk-ui/assets/icons/20px/product-quality-assurance.svg?react'
import ProductAiAgentsIcon from '@zendesk-ui/assets/icons/20px/product-ai-agents.svg?react'
import ProductAdminCenterIcon from '@zendesk-ui/assets/icons/20px/product-admin-center.svg?react'
import Greetings from './components/Greetings'
import LatestInsights from './components/LatestInsights'
import Recommendations from './components/Recommendations'
import CopilotPanel from './components/CopilotPanel'
import SearchSuggestions from './components/SearchSuggestions'
import styled from 'styled-components'

const CopilotToggle = styled.button<{ $isOpen: boolean; $animateHover: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: background 0.15s ease;
  background: ${({ $isOpen }) =>
    $isOpen
      ? 'linear-gradient(var(--gradient-angle, 135deg), #9256B1 30%, #1F73B7 100%)'
      : 'transparent'};
  ${({ $isOpen }) =>
    $isOpen ? 'animation: gradient-rotation 3s linear infinite;' : ''}

  svg {
    width: 20px;
    height: 20px;
    color: ${({ $isOpen }) => ($isOpen ? 'white' : '#885BB3')};
    transition: transform 0.3s ease, filter 0.3s ease;
  }

  ${({ $animateHover }) =>
    $animateHover
      ? `svg { animation: rotate-360 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards; }`
      : ''}

  &:hover {
    background: ${({ $isOpen }) =>
      $isOpen
        ? 'linear-gradient(var(--gradient-angle, 135deg), #9256B1 30%, #1F73B7 100%)'
        : 'rgba(136, 91, 179, 0.08)'};
  }

  &:active {
    animation: button-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    background: ${({ $isOpen }) =>
      $isOpen
        ? 'linear-gradient(var(--gradient-angle, 135deg), #9256B1 30%, #1F73B7 100%)'
        : 'rgba(136, 91, 179, 0.16)'};
  }

  &:active > * {
    transform: scale(0.909);
  }
`

const StyledMain = styled(Main)`
  && {
    background: transparent;
    box-shadow: none;
    border-radius: 0;
    overflow: visible;
  }
`

const MainWrapper = styled.div<{ $hasCopilot?: boolean }>`
  display: flex;
  flex: 1;
  gap: ${({ $hasCopilot }) => ($hasCopilot ? '8px' : '0px')};
  min-height: 0;
  height: 100%;
  padding-right: ${({ $hasCopilot }) => ($hasCopilot ? '8px' : '0')};
  transition: padding-right 0.2s cubic-bezier(0.4, 0, 0.2, 1),
              gap 0.2s cubic-bezier(0.4, 0, 0.2, 1);
`

const PanelSlider = styled.div<{ $open: boolean }>`
  width: ${({ $open }) => ($open ? '360px' : '0px')};
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
  flex-shrink: 0;
  height: 100%;
  overflow: hidden;
  border-radius: 24px 24px 0 0;
  box-shadow: ${({ $open }) => ($open ? '0px 0px 4px 0px rgba(10, 13, 14, 0.16)' : 'none')};
  transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1),
              opacity 0.35s ease 0.05s,
              box-shadow 0.35s ease 0.05s;
`

const HomeContent = styled.div<{ $roundedRight?: boolean }>`
  padding: 40px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  flex: 1;
  background: white;
  border-radius: ${({ $roundedRight }) => ($roundedRight ? '24px 24px 0 0' : '24px 0 0 0')};
  box-shadow: 0px 0px 4px 0px rgba(10, 13, 14, 0.16);
  transition: border-radius 0.2s cubic-bezier(0.4, 0, 0.2, 1);
`

const HomeInner = styled.div`
  max-width: 952px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 40px;
`

const products = [
  { value: 'support', label: 'Support', href: '#', icon: <ProductSupportIcon /> },
  { value: 'knowledge', label: 'Knowledge', href: '#', icon: <ProductKnowledgeIcon /> },
  { value: 'community', label: 'Community', href: '#', icon: <ProductCommunityIcon /> },
  { value: 'chat', label: 'Chat', href: '#', icon: <ProductChatIcon /> },
  { value: 'voice', label: 'Voice', href: '#', icon: <ProductVoiceIcon /> },
  { value: 'analytics', label: 'Analytics', href: '#', icon: <ProductAnalyticsIcon /> },
  { value: 'sales', label: 'Sales', href: '#', icon: <ProductSalesIcon /> },
  { value: 'workforce-management', label: 'Workforce management', href: '#', icon: <ProductWorkforceManagementIcon /> },
  { value: 'quality-assurance', label: 'Quality assurance', href: '#', icon: <ProductQualityAssuranceIcon /> },
  { value: 'ai-agents', label: 'AI agents', href: '#', icon: <ProductAiAgentsIcon /> },
  { value: 'admin-center', label: 'Admin center', href: '#', icon: <ProductAdminCenterIcon />, isSelected: true },
]

function App() {
  const [copilotOpen, setCopilotOpen] = useState(false)
  const [hovering, setHovering] = useState(false)

  return (
    <Product
      locale="en-US"
      products={products}
    >
      <Header
        startChildren={
          <>
            <Header.Separator />
            <Header.Button>Camera obscura</Header.Button>
          </>
        }
      >
        <Header.Search placeholder="Search admin center">
          <SearchSuggestions />
        </Header.Search>
        <Header.Separator />
        <Tooltip content="Copilot" placement="bottom" zIndex={100} appendToNode={document.body}>
          <CopilotToggle
            $isOpen={copilotOpen}
            $animateHover={hovering}
            onClick={() => {
              setCopilotOpen(prev => !prev)
              setHovering(false)
            }}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            aria-label="Copilot"
          >
            <CopilotIcon />
          </CopilotToggle>
        </Tooltip>
        <Header.IconButton tooltip="Help">
          <RescueRingFillIcon />
        </Header.IconButton>
        <ProfileMenu name="User">
          <ProfileMenu.Item value="profile">My profile</ProfileMenu.Item>
          <ProfileMenu.Item value="signout">Sign out</ProfileMenu.Item>
        </ProfileMenu>
      </Header>
      <Nav>
        <Nav.Item icon={<HomeFillIcon />} isCurrent>Home</Nav.Item>
        <Nav.Item icon={<BuildingFillIcon />}>Account</Nav.Item>
        <Nav.Item icon={<PeopleFillIcon />}>People</Nav.Item>
        <Nav.Item icon={<PaperPlaneFillIcon />}>Channels</Nav.Item>
        <Nav.Item icon={<SparkleFillIcon />}>AI</Nav.Item>
        <Nav.Item icon={<MonitorFillIcon />}>Workspaces</Nav.Item>
        <Nav.Item icon={<FlowFillIcon />}>Objects and rules</Nav.Item>
        <Nav.Item icon={<SquareGridCircleFillIcon />}>Apps and integrations</Nav.Item>
      </Nav>
      <StyledMain>
        <MainWrapper $hasCopilot={copilotOpen}>
          <HomeContent $roundedRight={copilotOpen}>
            <HomeInner>
              <Greetings />
              <LatestInsights />
              <Recommendations />
            </HomeInner>
          </HomeContent>
          <PanelSlider $open={copilotOpen}>
            <CopilotPanel onClose={() => setCopilotOpen(false)} />
          </PanelSlider>
        </MainWrapper>
      </StyledMain>
    </Product>
  )
}

export default App
