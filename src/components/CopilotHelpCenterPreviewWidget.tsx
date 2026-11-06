import { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Button, Tag } from '@zendesk-ui/react-components'
import ArrowDiagonalOutIcon from '../assets/arrow-diagonal-out.svg?react'
import {
  buildHelpCenterArticles,
  HELP_CENTER_PREVIEW_BRAND,
  HELP_CENTER_PREVIEW_SITE,
  helpCenterArticleUrl,
  type ArticleStatus,
  type HelpCenterCompletionSummary,
} from '../launchpad/helpCenterArticles'
import CopilotPreviewCard from './CopilotPreviewCard'

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
  padding: 12px;
  border-bottom: 1px solid #eae9e8;
  background: ${({ $published }) => ($published ? '#fafafa' : '#fff')};

  &:last-child {
    border-bottom: none;
  }
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

const ArticleActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
`

const PublishedTag = styled(Tag)`
  && {
    background: #edf7ed;
    color: #4b7d04;
  }
`

const Footer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 4px;
  width: 100%;
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
    Object.fromEntries(articles.map(article => [article.id, 'unpublished' as ArticleStatus]))
  )

  const unpublishedIds = useMemo(
    () =>
      articles.filter(article => statuses[article.id] === 'unpublished').map(article => article.id),
    [articles, statuses]
  )

  const completeWithStatuses = useCallback(
    (nextStatuses: Record<string, ArticleStatus>) => {
      if (finished) return
      onComplete({
        businessName: HELP_CENTER_PREVIEW_BRAND,
        siteLabel: HELP_CENTER_PREVIEW_SITE,
        articles: articles.map(article => ({
          ...article,
          status: nextStatuses[article.id],
        })),
      })
      setFinished(true)
    },
    [articles, finished, onComplete]
  )

  const publishArticle = useCallback(
    (id: string) => {
      if (finished || statuses[id] === 'published') return

      const nextStatuses = { ...statuses, [id]: 'published' as ArticleStatus }
      setStatuses(nextStatuses)

      const remainingUnpublished = articles.filter(
        article => article.id !== id && nextStatuses[article.id] === 'unpublished'
      )
      if (remainingUnpublished.length === 0) {
        completeWithStatuses(nextStatuses)
      }
    },
    [articles, completeWithStatuses, finished, statuses]
  )

  const publishAll = useCallback(() => {
    if (finished || unpublishedIds.length === 0) return

    const nextStatuses = { ...statuses }
    unpublishedIds.forEach(id => {
      nextStatuses[id] = 'published'
    })
    setStatuses(nextStatuses)
    completeWithStatuses(nextStatuses)
  }, [completeWithStatuses, finished, statuses, unpublishedIds])

  return (
    <CopilotPreviewCard title="Help center preview">
      <Body>
        <ArticleListShell>
          {articles.map(article => {
            const isPublished = statuses[article.id] === 'published'
            const articleUrl = helpCenterArticleUrl(article.slug)

            return (
              <ArticleRow key={article.id} $published={isPublished}>
                <ArticleContent>
                  <ArticleTitle>{article.title}</ArticleTitle>
                  <ArticlePreview>{article.previewLines}</ArticlePreview>
                  <ArticleActions>
                    <ArticleLink href={articleUrl} target="_blank" rel="noopener noreferrer">
                      View full article
                      <ArrowDiagonalOutIcon aria-hidden />
                    </ArticleLink>
                    {isPublished ? (
                      <PublishedTag>Published</PublishedTag>
                    ) : (
                      <Button
                        size="small"
                        disabled={finished}
                        onClick={() => publishArticle(article.id)}
                      >
                        Publish
                      </Button>
                    )}
                  </ArticleActions>
                </ArticleContent>
              </ArticleRow>
            )
          })}
        </ArticleListShell>

        <Footer>
          <Button
            size="small"
            isPrimary
            disabled={finished || unpublishedIds.length === 0}
            onClick={publishAll}
          >
            Publish all
          </Button>
        </Footer>
      </Body>
    </CopilotPreviewCard>
  )
}
