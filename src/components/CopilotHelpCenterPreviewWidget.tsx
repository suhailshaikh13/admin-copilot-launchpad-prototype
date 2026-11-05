import { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Button, Checkbox, Tag } from '@zendesk-ui/react-components'
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
  margin: 0 -20px;
  width: calc(100% + 40px);
  border-top: 1px solid #eae9e8;
  border-bottom: 1px solid #eae9e8;
`

const ArticleRow = styled.label<{ $decided?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 20px;
  border-bottom: 1px solid #eae9e8;
  cursor: pointer;
  background: ${({ $decided }) => ($decided ? '#fafafa' : '#fff')};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f9f9f8;
  }
`

const CheckboxWrap = styled.span`
  flex-shrink: 0;
  padding-top: 2px;
`

const ArticleContent = styled.span`
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  min-width: 0;
`

const ArticleHeader = styled.span`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`

const ArticleTitle = styled.span`
  display: block;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: -0.154px;
  color: #2f3130;
`

const ArticleExcerpt = styled.span`
  display: block;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: -0.154px;
  color: #646864;
`

const StatusTagRow = styled.span`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
`

const StatusTag = styled(Tag)<{ $tone?: 'draft' | 'published' }>`
  && {
    ${({ $tone }) =>
      $tone === 'published'
        ? `
      background: #edf7ed;
      color: #4b7d04;
    `
        : `
      background: #f4f6f8;
      color: #646864;
    `}
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
    Object.fromEntries(articles.map(article => [article.id, 'generated' as ArticleStatus]))
  )

  const toggleSelected = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const selectableIds = useMemo(
    () => articles.filter(article => statuses[article.id] === 'generated').map(article => article.id),
    [articles, statuses]
  )

  const allSelectableSelected =
    selectableIds.length > 0 && selectableIds.every(id => selectedIds.has(id))

  const toggleSelectAll = useCallback(() => {
    if (allSelectableSelected) {
      setSelectedIds(new Set())
      return
    }
    setSelectedIds(new Set(selectableIds))
  }, [allSelectableSelected, selectableIds])

  const applyToSelected = useCallback(
    (status: 'draft' | 'published') => {
      if (selectedIds.size === 0) return
      setStatuses(prev => {
        const next = { ...prev }
        selectedIds.forEach(id => {
          if (next[id] === 'generated') {
            next[id] = status
          }
        })
        return next
      })
      setSelectedIds(new Set())
    },
    [selectedIds]
  )

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
  const selectionCount = selectedIds.size

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
    setSelectedIds(new Set())
    onComplete(summary)
  }, [allDecided, articles, finished, onComplete, statuses])

  return (
    <CopilotPreviewCard title="Help center preview">
      <Body>
        <ArticleListShell>
          {articles.map(article => {
            const status = statuses[article.id]
            const isSelected = selectedIds.has(article.id)
            const isPending = status === 'generated'
            return (
              <ArticleRow
                key={article.id}
                $decided={!isPending}
                onClick={event => {
                  if (finished || !isPending) return
                  if ((event.target as HTMLElement).closest('input[type="checkbox"]')) return
                  toggleSelected(article.id)
                }}
              >
                <CheckboxWrap onClick={event => event.stopPropagation()}>
                  <Checkbox
                    checked={isSelected}
                    disabled={finished || !isPending}
                    onChange={() => toggleSelected(article.id)}
                  >
                    <ScreenReaderOnly>Select {article.title}</ScreenReaderOnly>
                  </Checkbox>
                </CheckboxWrap>
                <ArticleContent>
                  <ArticleHeader>
                    <ArticleTitle>{article.title}</ArticleTitle>
                    <ArticleExcerpt>{article.excerpt}</ArticleExcerpt>
                  </ArticleHeader>
                  {!isPending && (
                    <StatusTagRow>
                      <StatusTag $tone={status === 'published' ? 'published' : 'draft'}>
                        {status === 'published' ? 'Published' : 'Draft'}
                      </StatusTag>
                    </StatusTagRow>
                  )}
                </ArticleContent>
              </ArticleRow>
            )
          })}
        </ArticleListShell>

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
              : selectionCount > 0
                ? `${selectionCount} selected — publish or save as draft, then finish when every article is decided.`
                : `Select articles to publish or save as draft (${decidedCount}/${articles.length} decided).`}
          </FooterHint>
          <FooterActions>
            {selectableIds.length > 0 && (
              <Button size="small" onClick={toggleSelectAll} disabled={finished}>
                {allSelectableSelected ? 'Clear selection' : 'Select all'}
              </Button>
            )}
            <Button
              size="small"
              disabled={finished || selectionCount === 0}
              onClick={() => applyToSelected('draft')}
            >
              Save selected as draft
            </Button>
            <Button
              size="small"
              isPrimary={selectionCount > 0 && !allDecided}
              disabled={finished || selectionCount === 0}
              onClick={() => applyToSelected('published')}
            >
              Publish selected
            </Button>
            <Button
              size="small"
              isPrimary={allDecided}
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
