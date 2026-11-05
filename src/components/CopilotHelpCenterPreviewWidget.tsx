import { useCallback, useMemo, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { Button } from '@zendesk-ui/react-components'
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
  gap: 14px;
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

  &:hover {
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
                    disabled={finished}
                  >
                    Save as draft
                  </RowButton>
                  <RowButton
                    type="button"
                    $variant="publish"
                    $active={status === 'published'}
                    onClick={() => setArticleStatus(article.id, 'published')}
                    disabled={finished}
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
