import { useCallback, useMemo, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { Button, Tag } from '@zendesk-ui/react-components'
import SparkleFillIcon from '../assets/sparkle-fill.svg?react'
import {
  buildHelpCenterArticles,
  HELP_CENTER_PREVIEW_BRAND,
  HELP_CENTER_PREVIEW_SITE,
  sampleAgentAnswer,
  type ArticleStatus,
  type HelpCenterCompletionSummary,
} from '../launchpad/helpCenterArticles'
import CopilotPreviewCard from './CopilotPreviewCard'

const rise = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  min-width: 0;
`

const ArticleStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  min-width: 0;
`

const ArticleCard = styled.article<{ $delay: number }>`
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #eae9e8;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
  animation: ${rise} 0.45s ease-out both;
  animation-delay: ${({ $delay }) => $delay}ms;
`

const ArticleHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  min-width: 0;
`

const ArticleTitle = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: -0.154px;
  color: #2f3130;
`

const ArticleExcerpt = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: -0.154px;
  color: #646864;
`

const StatusTagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
`

const StatusTag = styled(Tag)<{ $tone?: 'neutral' | 'draft' | 'published' }>`
  && {
    ${({ $tone }) =>
      $tone === 'published'
        ? `
      background: #edf7ed;
      color: #4b7d04;
    `
        : $tone === 'draft'
          ? `
      background: #f4f6f8;
      color: #646864;
    `
          : `
      background: #e4eaf6;
      color: #406cc4;
    `}
  }
`

const CardActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-top: 4px;
`

const CardActionButton = styled.button<{ $active?: boolean; $variant?: 'publish' }>`
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

  &:hover:not(:disabled) {
    border-color: #b7b7b3;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 8px;
  border-top: 1px solid #e9ebed;
  width: 100%;
`

const FooterActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
`

const FooterHint = styled.p`
  margin: 0;
  font-size: 12px;
  line-height: 16px;
  color: #646864;
`

const FooterBulkButton = styled.button`
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid #dcdcda;
  background: #fafafa;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  color: #2f3130;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #f4f6f8;
    border-color: #b7b7b3;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const AgentPreview = styled.div`
  padding: 12px;
  border-radius: 10px;
  background: linear-gradient(180deg, #f9f5fa 0%, #fff 100%);
  border: 1px solid #e9ebed;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  box-sizing: border-box;
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

function statusLabel(status: ArticleStatus): string {
  if (status === 'published') return 'Published'
  if (status === 'draft') return 'Draft'
  return 'Awaiting review'
}

function statusTone(status: ArticleStatus): 'neutral' | 'draft' | 'published' {
  if (status === 'published') return 'published'
  if (status === 'draft') return 'draft'
  return 'neutral'
}

interface CopilotHelpCenterPreviewWidgetProps {
  onComplete: (summary: HelpCenterCompletionSummary) => void
}

export default function CopilotHelpCenterPreviewWidget({
  onComplete,
}: CopilotHelpCenterPreviewWidgetProps) {
  const articles = useMemo(() => buildHelpCenterArticles(HELP_CENTER_PREVIEW_BRAND), [])
  const [finished, setFinished] = useState(false)
  const [statuses, setStatuses] = useState<Record<string, ArticleStatus>>(() =>
    Object.fromEntries(articles.map(article => [article.id, 'generated' as ArticleStatus]))
  )

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
    () => sampleAgentAnswer(HELP_CENTER_PREVIEW_BRAND, publishedTitles),
    [publishedTitles]
  )

  const allDecided = decidedCount === articles.length

  const handleFinish = useCallback(() => {
    if (!allDecided || finished) return
    const summary: HelpCenterCompletionSummary = {
      businessName: HELP_CENTER_PREVIEW_BRAND,
      siteLabel: HELP_CENTER_PREVIEW_SITE,
      articles: articles.map(article => ({
        ...article,
        status: statuses[article.id] as 'draft' | 'published',
      })),
    }
    setFinished(true)
    onComplete(summary)
  }, [allDecided, articles, finished, onComplete, statuses])

  return (
    <CopilotPreviewCard title="Help center preview">
      <Body>
        <ArticleStack>
          {articles.map((article, index) => {
            const status = statuses[article.id]
            return (
              <ArticleCard key={article.id} $delay={index * 80}>
                <ArticleHeader>
                  <ArticleTitle>{article.title}</ArticleTitle>
                  <ArticleExcerpt>{article.excerpt}</ArticleExcerpt>
                </ArticleHeader>
                <StatusTagRow>
                  <StatusTag $tone={statusTone(status)}>{statusLabel(status)}</StatusTag>
                </StatusTagRow>
                <CardActions>
                  <CardActionButton
                    type="button"
                    $active={status === 'draft'}
                    onClick={() => setArticleStatus(article.id, 'draft')}
                    disabled={finished}
                  >
                    Save as draft
                  </CardActionButton>
                  <CardActionButton
                    type="button"
                    $variant="publish"
                    $active={status === 'published'}
                    onClick={() => setArticleStatus(article.id, 'published')}
                    disabled={finished}
                  >
                    Publish
                  </CardActionButton>
                </CardActions>
              </ArticleCard>
            )
          })}
        </ArticleStack>

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
          <FooterHint>
            {allDecided
              ? `${publishedTitles.length} published · ${decidedCount - publishedTitles.length} draft`
              : `Choose draft or publish for each article (${decidedCount}/${articles.length} decided).`}
          </FooterHint>
          <FooterActions>
            <FooterBulkButton type="button" onClick={draftAll} disabled={finished}>
              Draft all three
            </FooterBulkButton>
            <FooterBulkButton type="button" onClick={publishAll} disabled={finished}>
              Publish all three
            </FooterBulkButton>
            <Button
              size="small"
              isPrimary
              disabled={!allDecided || finished}
              onClick={handleFinish}
            >
              {finished ? 'Saved' : 'Finish preview'}
            </Button>
          </FooterActions>
        </Footer>
      </Body>
    </CopilotPreviewCard>
  )
}
