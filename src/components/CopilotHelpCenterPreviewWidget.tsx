import { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Button, Checkbox, Tag } from '@zendesk-ui/react-components'
import SparkleFillIcon from '../assets/sparkle-fill.svg?react'
import ArrowDiagonalOutIcon from '../assets/arrow-diagonal-out.svg?react'
import {
  buildHelpCenterArticles,
  HELP_CENTER_PREVIEW_BRAND,
  HELP_CENTER_PREVIEW_SITE,
  helpCenterArticleUrl,
  sampleAgentAnswer,
  type ArticleStatus,
  type HelpCenterCompletionSummary,
} from '../launchpad/helpCenterArticles'
import CopilotPreviewCard from './CopilotPreviewCard'

const ScreenReaderOnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  min-width: 0;
`

const ArticleListShell = styled.div`
  margin: -20px -20px 0;
  width: calc(100% + 40px);
  border-bottom: 1px solid #eae9e8;
`

const ArticleRow = styled.div<{ $published?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 20px;
  border-bottom: 1px solid #eae9e8;
  background: ${({ $published }) => ($published ? '#fafafa' : '#fff')};
  cursor: ${({ $published }) => ($published ? 'default' : 'pointer')};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${({ $published }) => ($published ? '#fafafa' : '#f9f9f8')};
  }
`

const CheckboxColumn = styled.span`
  flex-shrink: 0;
  width: 16px;
  padding-top: 2px;
`

const ArticleContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
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

const ArticlePreview = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: -0.154px;
  color: #646864;
`

const ArticleLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  width: fit-content;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: -0.154px;
  color: #406cc4;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
`

const PublishedTag = styled(Tag)`
  && {
    background: #edf7ed;
    color: #4b7d04;
  }
`

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 4px;
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

interface CopilotHelpCenterPreviewWidgetProps {
  onComplete: (summary: HelpCenterCompletionSummary) => void
}

export default function CopilotHelpCenterPreviewWidget({
  onComplete,
}: CopilotHelpCenterPreviewWidgetProps) {
  const articles = useMemo(() => buildHelpCenterArticles(HELP_CENTER_PREVIEW_BRAND), [])
  const [finished, setFinished] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set())
  const [statuses, setStatuses] = useState<Record<string, ArticleStatus>>(() =>
    Object.fromEntries(articles.map(article => [article.id, 'unpublished' as ArticleStatus]))
  )

  const toggleSelected = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const unpublishedIds = useMemo(
    () =>
      articles.filter(article => statuses[article.id] === 'unpublished').map(article => article.id),
    [articles, statuses]
  )

  const allUnpublishedSelected =
    unpublishedIds.length > 0 && unpublishedIds.every(id => selectedIds.has(id))

  const toggleSelectAll = useCallback(() => {
    if (allUnpublishedSelected) {
      setSelectedIds(new Set())
      return
    }
    setSelectedIds(new Set(unpublishedIds))
  }, [allUnpublishedSelected, unpublishedIds])

  const publishSelected = useCallback(() => {
    if (selectedIds.size === 0) return
    setStatuses(prev => {
      const next = { ...prev }
      selectedIds.forEach(id => {
        if (next[id] === 'unpublished') {
          next[id] = 'published'
        }
      })
      return next
    })
    setSelectedIds(new Set())
  }, [selectedIds])

  const publishedCount = useMemo(
    () => articles.filter(article => statuses[article.id] === 'published').length,
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

  const selectionCount = selectedIds.size

  const handleFinish = useCallback(() => {
    if (finished) return
    onComplete({
      businessName: HELP_CENTER_PREVIEW_BRAND,
      siteLabel: HELP_CENTER_PREVIEW_SITE,
      articles: articles.map(article => ({
        ...article,
        status: statuses[article.id],
      })),
    })
    setFinished(true)
    setSelectedIds(new Set())
  }, [articles, finished, onComplete, statuses])

  return (
    <CopilotPreviewCard title="Help center preview">
      <Body>
        <ArticleListShell>
          {articles.map(article => {
            const isPublished = statuses[article.id] === 'published'
            const isSelected = selectedIds.has(article.id)
            const articleUrl = helpCenterArticleUrl(article.slug)
            const canSelect = !isPublished && !finished

            return (
              <ArticleRow
                key={article.id}
                $published={isPublished}
                onClick={event => {
                  if (!canSelect) return
                  if ((event.target as HTMLElement).closest('a, input, label')) return
                  toggleSelected(article.id)
                }}
              >
                <CheckboxColumn onClick={event => event.stopPropagation()}>
                  {canSelect ? (
                    <Checkbox checked={isSelected} onChange={() => toggleSelected(article.id)}>
                      <ScreenReaderOnly>Select {article.title}</ScreenReaderOnly>
                    </Checkbox>
                  ) : null}
                </CheckboxColumn>
                <ArticleContent>
                  <ArticleTitle>{article.title}</ArticleTitle>
                  <ArticlePreview>{article.previewLines}</ArticlePreview>
                  <ArticleLink href={articleUrl} target="_blank" rel="noopener noreferrer">
                    View full article
                    <ArrowDiagonalOutIcon aria-hidden />
                  </ArticleLink>
                  {isPublished && <PublishedTag>Published</PublishedTag>}
                </ArticleContent>
              </ArticleRow>
            )
          })}
        </ArticleListShell>

        {publishedCount > 0 && agentAnswer && (
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
            {publishedCount > 0
              ? `${publishedCount} published — use View full article to open the live Help center page anytime.`
              : selectionCount > 0
                ? `${selectionCount} selected — publish when you are ready, or finish after reviewing.`
                : 'Read the preview, open the full article, then select and publish what you want live.'}
          </FooterHint>
          <FooterActions>
            {unpublishedIds.length > 0 && !finished && (
              <Button size="small" onClick={toggleSelectAll}>
                {allUnpublishedSelected ? 'Clear selection' : 'Select all'}
              </Button>
            )}
            <Button
              size="small"
              isPrimary={selectionCount > 0}
              disabled={finished || selectionCount === 0}
              onClick={publishSelected}
            >
              Publish selected
            </Button>
            <Button size="small" isPrimary={selectionCount === 0} disabled={finished} onClick={handleFinish}>
              {finished ? 'Saved' : 'Finish preview'}
            </Button>
          </FooterActions>
        </Footer>
      </Body>
    </CopilotPreviewCard>
  )
}
