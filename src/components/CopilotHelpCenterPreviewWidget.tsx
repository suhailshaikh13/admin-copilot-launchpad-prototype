import { useCallback, useEffect, useMemo, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { Button } from '@zendesk-ui/react-components'
import SparkleFillIcon from '../assets/sparkle-fill.svg?react'
import MonitorFillIcon from '@zendesk-ui/assets/icons/20px/monitor-fill.svg?react'
import {
  buildHelpCenterArticles,
  inferSiteLabel,
  sampleAgentAnswer,
  type ArticleStatus,
  type HelpCenterCompletionSummary,
} from '../launchpad/helpCenterArticles'

const shimmer = keyframes`
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
`

const rise = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`

const Card = styled.div`
  margin-top: 12px;
  border: 1px solid #dcdcda;
  border-radius: 14px;
  background: #fff;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(47, 49, 48, 0.06);
`

const Hero = styled.div`
  padding: 16px;
  background: linear-gradient(135deg, #f4f7fc 0%, #faf5ff 48%, #fff 100%);
  border-bottom: 1px solid #e9ebed;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const HeroTitle = styled.h3`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  line-height: 20px;
  color: #2f3130;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    width: 18px;
    height: 18px;
    color: #9256b1;
  }
`

const SiteChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  align-self: flex-start;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid #dcdcda;
  font-size: 12px;
  font-weight: 600;
  color: #406cc4;

  svg {
    width: 14px;
    height: 14px;
  }
`

const ScanBar = styled.div`
  height: 6px;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    rgba(64, 108, 196, 0.15) 0%,
    rgba(146, 86, 177, 0.45) 50%,
    rgba(64, 108, 196, 0.15) 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.4s ease-in-out infinite;
`

const ScanStep = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 18px;
  color: #646864;
  min-height: 18px;
`

const Body = styled.div`
  padding: 14px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`

const BulkRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`

const BulkButton = styled.button`
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid #dcdcda;
  background: #fafafa;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  color: #2f3130;
  cursor: pointer;

  &:hover {
    background: #f4f6f8;
    border-color: #b7b7b3;
  }
`

const ArticleList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const ArticleCard = styled.li<{ $delay: number }>`
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #e9ebed;
  background: #fafafa;
  display: flex;
  flex-direction: column;
  gap: 10px;
  animation: ${rise} 0.45s ease-out both;
  animation-delay: ${({ $delay }) => $delay}ms;
`

const ArticleTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
`

const ArticleCopy = styled.div`
  min-width: 0;
  flex: 1;
`

const Category = styled.span`
  display: block;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: #646864;
  margin-bottom: 4px;
`

const Title = styled.p`
  margin: 0 0 4px;
  font-size: 14px;
  font-weight: 600;
  line-height: 18px;
  color: #2f3130;
`

const Excerpt = styled.p`
  margin: 0;
  font-size: 12px;
  line-height: 16px;
  color: #646864;
`

const StatusPill = styled.span<{ $status: ArticleStatus }>`
  flex-shrink: 0;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  line-height: 14px;
  white-space: nowrap;
  color: ${({ $status }) =>
    $status === 'published' ? '#4b7d04' : $status === 'draft' ? '#646864' : '#406cc4'};
  background: ${({ $status }) =>
    $status === 'published' ? '#edf7ed' : $status === 'draft' ? '#f4f6f8' : '#e4eaf6'};
`

const RowActions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`

const RowButton = styled.button<{ $active?: boolean; $variant?: 'publish' }>`
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  cursor: pointer;
  border: 1px solid
    ${({ $active, $variant }) =>
      $active ? ($variant === 'publish' ? '#4b7d04' : '#646864') : '#dcdcda'};
  background: ${({ $active, $variant }) =>
    $active ? ($variant === 'publish' ? '#edf7ed' : '#fff') : '#fff'};
  color: ${({ $active, $variant }) =>
    $active && $variant === 'publish' ? '#4b7d04' : '#2f3130'};

  &:hover {
    border-color: #b7b7b3;
  }
`

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 4px;
  border-top: 1px solid #e9ebed;
`

const FooterActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`

const TextButton = styled.button`
  padding: 8px 4px;
  border: none;
  background: none;
  font-size: 14px;
  line-height: 20px;
  color: #646864;
  cursor: pointer;

  &:hover {
    color: #2f3130;
  }
`

const Hint = styled.p`
  margin: 0;
  font-size: 12px;
  line-height: 16px;
  color: #646864;
`

const AgentPreview = styled.div`
  padding: 12px;
  border-radius: 10px;
  background: linear-gradient(180deg, #f9f5fa 0%, #fff 100%);
  border: 1px solid #e9ebed;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const AgentLabel = styled.span`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #9256b1;
  display: flex;
  align-items: center;
  gap: 6px;

  svg {
    width: 14px;
    height: 14px;
  }
`

const AgentQuestion = styled.p`
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: #2f3130;
`

const AgentAnswer = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 18px;
  color: #646864;
`

const SCAN_STEPS = [
  'Scanning your public site…',
  'Extracting policies and FAQs…',
  'Drafting three help articles for your trial…',
] as const

type Phase = 'scanning' | 'ready' | 'finished'

interface CopilotHelpCenterPreviewWidgetProps {
  businessName: string
  onComplete: (summary: HelpCenterCompletionSummary) => void
  onSkip?: () => void
}

export default function CopilotHelpCenterPreviewWidget({
  businessName,
  onComplete,
  onSkip,
}: CopilotHelpCenterPreviewWidgetProps) {
  const siteLabel = inferSiteLabel(businessName)
  const articles = useMemo(() => buildHelpCenterArticles(businessName), [businessName])
  const [phase, setPhase] = useState<Phase>('scanning')
  const [scanIndex, setScanIndex] = useState(0)
  const [statuses, setStatuses] = useState<Record<string, ArticleStatus>>(() =>
    Object.fromEntries(articles.map(article => [article.id, 'generated' as ArticleStatus]))
  )

  useEffect(() => {
    if (phase !== 'scanning') return
    const stepTimer = window.setInterval(() => {
      setScanIndex(index => Math.min(index + 1, SCAN_STEPS.length - 1))
    }, 650)
    const doneTimer = window.setTimeout(() => setPhase('ready'), 2200)
    return () => {
      window.clearInterval(stepTimer)
      window.clearTimeout(doneTimer)
    }
  }, [phase])

  const setArticleStatus = useCallback((id: string, status: ArticleStatus) => {
    setStatuses(prev => ({ ...prev, [id]: status }))
  }, [])

  const draftAll = useCallback(() => {
    setStatuses(Object.fromEntries(articles.map(article => [article.id, 'draft' as ArticleStatus])))
  }, [articles])

  const publishAll = useCallback(() => {
    setStatuses(
      Object.fromEntries(articles.map(article => [article.id, 'published' as ArticleStatus]))
    )
  }, [articles])

  const decidedCount = useMemo(
    () =>
      articles.filter(article => {
        const status = statuses[article.id]
        return status === 'draft' || status === 'published'
      }).length,
    [articles, statuses]
  )

  const publishedTitles = useMemo(
    () =>
      articles
        .filter(article => statuses[article.id] === 'published')
        .map(article => article.title),
    [articles, statuses]
  )

  const agentAnswer = useMemo(
    () => sampleAgentAnswer(businessName, publishedTitles),
    [businessName, publishedTitles]
  )

  const allDecided = decidedCount === articles.length

  const handleFinish = useCallback(() => {
    if (!allDecided) return
    const summary: HelpCenterCompletionSummary = {
      businessName,
      siteLabel,
      articles: articles.map(article => ({
        ...article,
        status: statuses[article.id] as 'draft' | 'published',
      })),
    }
    setPhase('finished')
    onComplete(summary)
  }, [allDecided, articles, businessName, onComplete, siteLabel, statuses])

  if (phase === 'scanning') {
    return (
      <Card aria-busy="true">
        <Hero>
          <HeroTitle>
            <SparkleFillIcon aria-hidden />
            Building your Help center
          </HeroTitle>
          <SiteChip>
            <MonitorFillIcon aria-hidden />
            {siteLabel}
          </SiteChip>
          <ScanBar />
          <ScanStep>{SCAN_STEPS[scanIndex]}</ScanStep>
        </Hero>
      </Card>
    )
  }

  return (
    <Card aria-labelledby="help-center-preview-title">
      <Hero>
        <HeroTitle id="help-center-preview-title">
          <SparkleFillIcon aria-hidden />
          Three articles from {siteLabel}
        </HeroTitle>
        <Hint>
          Generated for <strong>{businessName}</strong> from your public site. Choose draft or
          publish for each — your AI agent only uses published articles in this preview.
        </Hint>
      </Hero>

      <Body>
        <BulkRow>
          <BulkButton type="button" onClick={draftAll}>
            Draft all three
          </BulkButton>
          <BulkButton type="button" onClick={publishAll}>
            Publish all three
          </BulkButton>
        </BulkRow>

        <ArticleList>
          {articles.map((article, index) => {
            const status = statuses[article.id]
            return (
              <ArticleCard key={article.id} $delay={index * 80}>
                <ArticleTop>
                  <ArticleCopy>
                    <Category>{article.category}</Category>
                    <Title>{article.title}</Title>
                    <Excerpt>{article.excerpt}</Excerpt>
                  </ArticleCopy>
                  <StatusPill $status={status}>
                    {status === 'generated'
                      ? 'Suggested'
                      : status === 'draft'
                        ? 'Draft'
                        : 'Published'}
                  </StatusPill>
                </ArticleTop>
                <RowActions>
                  <RowButton
                    type="button"
                    $active={status === 'draft'}
                    onClick={() => setArticleStatus(article.id, 'draft')}
                  >
                    Save as draft
                  </RowButton>
                  <RowButton
                    type="button"
                    $variant="publish"
                    $active={status === 'published'}
                    onClick={() => setArticleStatus(article.id, 'published')}
                  >
                    Publish
                  </RowButton>
                </RowActions>
              </ArticleCard>
            )
          })}
        </ArticleList>

        {publishedTitles.length > 0 && agentAnswer && (
          <AgentPreview>
            <AgentLabel>
              <SparkleFillIcon aria-hidden />
              Agent preview
            </AgentLabel>
            <AgentQuestion>Customer asks: &ldquo;What is your return policy?&rdquo;</AgentQuestion>
            <AgentAnswer>{agentAnswer}</AgentAnswer>
          </AgentPreview>
        )}

        <Footer>
          <Hint>
            {allDecided
              ? `${publishedTitles.length} published · ${decidedCount - publishedTitles.length} draft — finish when this looks right.`
              : `Choose draft or publish for each article (${decidedCount}/${articles.length} decided).`}
          </Hint>
          <FooterActions>
            <TextButton type="button" onClick={onSkip}>
              Skip for now
            </TextButton>
            <Button
              size="small"
              isPrimary
              disabled={!allDecided || phase === 'finished'}
              onClick={handleFinish}
            >
              {phase === 'finished' ? 'Saved' : 'Finish preview'}
            </Button>
          </FooterActions>
        </Footer>
      </Body>
    </Card>
  )
}
