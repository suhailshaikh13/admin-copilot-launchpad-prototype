import { useState, useRef, useCallback, useEffect } from 'react'
import { Product, Header, Nav, Main, ProfileMenu } from '@zendesk-ui/navigation'
import { Tooltip } from '@zendesk-ui/react-components'
import HomeFillIcon from '@zendesk-ui/assets/icons/20px/home-fill.svg?react'
import BuildingFillIcon from '@zendesk-ui/assets/icons/20px/building-fill.svg?react'
import PeopleFillIcon from '@zendesk-ui/assets/icons/20px/people-fill.svg?react'
import PaperPlaneFillIcon from '@zendesk-ui/assets/icons/20px/paper-plane-fill.svg?react'
import SparkleFillIcon from '@zendesk-ui/assets/icons/20px/sparkle-fill.svg?react'
import MonitorFillIcon from '@zendesk-ui/assets/icons/20px/monitor-fill.svg?react'
import FlowFillIcon from '@zendesk-ui/assets/icons/20px/flow-fill.svg?react'
import SquareGridCircleFillIcon from '@zendesk-ui/assets/icons/20px/square-grid-circle-fill.svg?react'
import LaptopPhoneFillIcon from '@zendesk-ui/assets/icons/20px/laptop-phone-fill.svg?react'
import RocketFillIcon from '@zendesk-ui/assets/icons/20px/rocket-fill.svg?react'
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
import RecommendationDrawer from './components/RecommendationDrawer'
import SaveToast from './components/SaveToast'
import { recommendations } from './components/recommendationsData'
import Usage from './components/Usage'
import ZendeskUpdates from './components/ZendeskUpdates'
import FeatureUsage from './components/FeatureUsage'
import CopilotPanel from './components/CopilotPanel'
import type { CopilotPanelHandle } from './components/CopilotPanel'
import SearchSuggestions from './components/SearchSuggestions'
import LaunchpadTrialCanvas from './components/LaunchpadTrialCanvas'
import { SetupGuide } from './components/SetupGuide'
import type { LaunchpadStage } from './launchpad/types'
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
  transition: background 150ms ease-out, transform 160ms ease-out;
  background: ${({ $isOpen }) =>
    $isOpen
      ? 'linear-gradient(135deg, #9256B1 30%, #1F73B7 100%)'
      : 'transparent'};

  svg {
    width: 20px;
    height: 20px;
    color: ${({ $isOpen }) => ($isOpen ? 'white' : '#885BB3')};
    transition: transform 200ms ease-out;
  }

  ${({ $animateHover }) =>
    $animateHover
      ? `svg { animation: rotate-360 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards; }`
      : ''}

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: ${({ $isOpen }) =>
        $isOpen
          ? 'linear-gradient(135deg, #9256B1 30%, #1F73B7 100%)'
          : 'rgba(136, 91, 179, 0.08)'};
    }
  }

  &:active {
    transform: scale(0.97);
    background: ${({ $isOpen }) =>
      $isOpen
        ? 'linear-gradient(135deg, #9256B1 30%, #1F73B7 100%)'
        : 'rgba(136, 91, 179, 0.16)'};
  }
`

const StyledMain = styled(Main)`
  && {
    background: transparent;
    box-shadow: none;
    border-radius: 0;
    overflow: visible;
    min-height: 0;
  }
`

const MainWrapper = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
  height: 100%;
`

const PanelSlider = styled.div<{ $open: boolean; $fullscreen?: boolean; $wide?: boolean }>`
  width: ${({ $open, $fullscreen, $wide }) =>
    !$open ? '0px' : $fullscreen ? 'calc(100% - 8px)' : $wide ? '420px' : '380px'};
  flex: none;
  margin-left: ${({ $open, $fullscreen }) => $open && !$fullscreen ? '8px' : '0'};
  margin-right: ${({ $open }) => $open ? '8px' : '0'};
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
  height: 100%;
  overflow: hidden;
  border-radius: 24px 24px 0 0;
  box-shadow: ${({ $open }) => ($open ? '0px 0px 4px 0px rgba(10, 13, 14, 0.16)' : 'none')};
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              margin-right 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              opacity 0.2s ease-out 0.05s,
              box-shadow 0.2s ease-out 0.05s;
`

const DrawerSlider = styled.div<{ $open: boolean }>`
  width: ${({ $open }) => ($open ? '404px' : '0px')};
  padding: ${({ $open }) => ($open ? '12px' : '0')};
  flex: none;
  position: sticky;
  top: 0;
  height: 100%;
  overflow: hidden;
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
  box-sizing: border-box;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              padding 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              opacity 0.2s ease-out 0.05s;
`

const HomeContentWrapper = styled.div<{ $roundedRight?: boolean; $hidden?: boolean }>`
  flex: 1 1 0px;
  min-width: 0;
  overflow: hidden;
  opacity: ${({ $hidden }) => $hidden ? 0 : 1};
  background: white;
  border-radius: ${({ $roundedRight }) => ($roundedRight ? '24px 24px 0 0' : '24px 0 0 0')};
  box-shadow: 0px 0px 4px 0px rgba(10, 13, 14, 0.16);
  transition: opacity ${({ $hidden }) => $hidden ? '0.3s cubic-bezier(0.4, 0, 0.2, 1)' : '0.25s ease-out 0.1s'},
              border-radius 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: row;
  min-height: 0;
`

const ScrollArea = styled.div`
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: row;
`

const HomeContent = styled.div`
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  flex: 1;
  min-width: 0;
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
  const [copilotOpen, setCopilotOpen] = useState(true)
  const [copilotFullscreen, setCopilotFullscreen] = useState(false)
  const [copilotOpenCount, setCopilotOpenCount] = useState(1)
  const [hovering, setHovering] = useState(false)
  const [currentPage, setCurrentPage] = useState<'home' | 'setup-guide' | 'launchpad'>('launchpad')
  const [launchpadStage, setLaunchpadStage] = useState<LaunchpadStage>('idle')
  const copilotRef = useRef<CopilotPanelHandle>(null)
  const [activeRecommendation, setActiveRecommendation] = useState<number | null>(null)
  const [drawerRec, setDrawerRec] = useState<number | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const drawerVisible = drawerOpen && drawerRec !== null
  const [savedRecs, setSavedRecs] = useState<boolean[]>(() => Array(recommendations.length).fill(false))
  const [skippedRecs, setSkippedRecs] = useState<boolean[]>(() => Array(recommendations.length).fill(false))
  const [toast, setToast] = useState<{ id: number; title: string; description?: string } | null>(null)

  // Any close path (X, Skip, copilot, setup guide) returns cards to default state
  useEffect(() => {
    if (!drawerOpen) setActiveRecommendation(null)
  }, [drawerOpen])

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false)
    setActiveRecommendation(null)
  }, [])

  const handleCardClick = useCallback((index: number) => {
    setActiveRecommendation(prev => {
      if (prev === index) {
        setDrawerOpen(false)
        setCopilotOpen(false)
        setCopilotFullscreen(false)
        return null
      }
      setDrawerRec(index)
      setDrawerOpen(true)
      setCopilotOpen(false)
      setCopilotFullscreen(false)
      return index
    })
  }, [])

  const handleSaveToggle = useCallback((index: number) => {
    setSavedRecs(prev => {
      const nowSaved = !prev[index]
      if (nowSaved) {
        setToast({ id: Date.now(), title: 'Recommendation saved' })
      }
      return prev.map((s, i) => (i === index ? nowSaved : s))
    })
  }, [])

  const handleSkip = useCallback((index: number) => {
    setSkippedRecs(prev => prev.map((s, i) => (i === index ? true : s)))
    setToast({
      id: Date.now(),
      title: 'Recommendation skipped',
      description: 'You can find skipped recommendations in the archive.',
    })
  }, [])

  const handleDetailsClick = useCallback((index: number) => {
    setActiveRecommendation(prev => {
      if (prev === index) {
        setDrawerOpen(false)
        setCopilotOpen(false)
        setCopilotFullscreen(false)
        return null
      }
      setDrawerRec(index)
      setDrawerOpen(true)
      setCopilotOpen(false)
      setCopilotFullscreen(false)
      return index
    })
  }, [])


  const handleSuggestionClick = useCallback((text: string) => {
    setCopilotOpen(true)
    setCopilotOpenCount(c => c + 1)
    setHovering(false)
    setDrawerOpen(false)
    // Panel is always mounted, so ref is available immediately
    copilotRef.current?.sendMessage(text)
  }, [])

  const handleNavigateToSetupGuide = useCallback(() => {
    setCurrentPage('setup-guide')
    setCopilotOpen(false)
    setCopilotFullscreen(false)
    setDrawerOpen(false)
  }, [])

  const openLaunchpad = useCallback(() => {
    setCurrentPage('launchpad')
    setLaunchpadStage('idle')
    setCopilotOpen(true)
    setCopilotOpenCount(c => c + 1)
    setCopilotFullscreen(false)
    setDrawerOpen(false)
    setActiveRecommendation(null)
  }, [])

  const openHome = useCallback(() => {
    setCurrentPage('home')
    setLaunchpadStage('idle')
  }, [])

  const isLaunchpad = currentPage === 'launchpad'

  return (
    <>
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
        <Tooltip content="Copilot" placement="bottom" zIndex={100} appendToNode={document.body}>
          <CopilotToggle
            $isOpen={copilotOpen}
            $animateHover={hovering}
            onClick={() => {
              setCopilotOpen(prev => {
                if (!prev) setCopilotOpenCount(c => c + 1)
                if (prev) setCopilotFullscreen(false)
                return !prev
              })
              setHovering(false)
              setDrawerOpen(false)
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
        <Nav.Item icon={<HomeFillIcon />} isCurrent={currentPage === 'home'} onClick={openHome}>Home</Nav.Item>
        <Nav.Item icon={<BuildingFillIcon />}>Account</Nav.Item>
        <Nav.Item icon={<PeopleFillIcon />}>People</Nav.Item>
        <Nav.Item icon={<PaperPlaneFillIcon />}>Channels</Nav.Item>
        <Nav.Item icon={<SparkleFillIcon />}>AI</Nav.Item>
        <Nav.Item icon={<MonitorFillIcon />}>Workspaces</Nav.Item>
        <Nav.Item icon={<FlowFillIcon />}>Objects and rules</Nav.Item>
        <Nav.Item icon={<SquareGridCircleFillIcon />}>Apps and integrations</Nav.Item>
        <Nav.Item icon={<LaptopPhoneFillIcon />}>IT assets</Nav.Item>
        <Nav.Separator />
        <Nav.Item icon={<RocketFillIcon />} isCurrent={isLaunchpad} onClick={openLaunchpad}>Launchpad</Nav.Item>
      </Nav>
      <StyledMain>
        <MainWrapper>
          <HomeContentWrapper $roundedRight={copilotOpen} $hidden={copilotFullscreen && !isLaunchpad}>
            <ScrollArea>
              {isLaunchpad ? (
                <LaunchpadTrialCanvas stage={launchpadStage} />
              ) : (
                <>
                  <HomeContent>
                    <HomeInner>
                      {currentPage === 'home' && (
                        <>
                          <Greetings onSuggestionClick={handleSuggestionClick} />
                          <LatestInsights />
                          <Recommendations
                            activeIndex={activeRecommendation}
                            saved={savedRecs}
                            skipped={skippedRecs}
                            onCardClick={handleCardClick}
                            onDetailsClick={handleDetailsClick}
                            onSaveToggle={handleSaveToggle}
                            onSkip={handleSkip}
                          />
                          <Usage />
                          <ZendeskUpdates />
                          <FeatureUsage />
                        </>
                      )}
                      {currentPage === 'setup-guide' && (
                        <SetupGuide onBack={() => setCurrentPage('home')} />
                      )}
                    </HomeInner>
                  </HomeContent>
                  <DrawerSlider $open={drawerVisible}>
                    {drawerRec !== null && (
                      <RecommendationDrawer
                        recommendation={recommendations[drawerRec]}
                        onClose={closeDrawer}
                        onAskCopilot={handleSuggestionClick}
                      />
                    )}
                  </DrawerSlider>
                </>
              )}
            </ScrollArea>
          </HomeContentWrapper>
          <PanelSlider $open={copilotOpen} $fullscreen={copilotFullscreen && !isLaunchpad} $wide={isLaunchpad}>
            <CopilotPanel
              ref={copilotRef}
              openCount={copilotOpenCount}
              variant={isLaunchpad ? 'launchpad' : 'admin'}
              businessName="Camera obscura"
              onLaunchpadProgress={setLaunchpadStage}
              onClose={() => {
                if (isLaunchpad) return
                setCopilotOpen(false)
                setCopilotFullscreen(false)
              }}
              onNavigateToSetupGuide={handleNavigateToSetupGuide}
              isFullscreen={copilotFullscreen && !isLaunchpad}
              onToggleFullscreen={() => {
                if (isLaunchpad) return
                setCopilotFullscreen(f => !f)
              }}
            />
          </PanelSlider>
        </MainWrapper>
      </StyledMain>
    </Product>
    {toast && <SaveToast key={toast.id} title={toast.title} description={toast.description} onDismiss={() => setToast(null)} />}
    </>
  )
}

export default App
