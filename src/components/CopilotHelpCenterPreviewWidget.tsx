import { useMemo } from 'react'
import styled from 'styled-components'
import { Button, Tag } from '@zendesk-ui/react-components'
import ArrowDiagonalOutIcon from '../assets/arrow-diagonal-out.svg?react'
import {
  buildHelpCenterArticles,
  HELP_CENTER_PREVIEW_BRAND,
  helpCenterArticleUrl,
  type ArticleStatus,
  type HelpCenterArticle,
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

function defaultStatuses(articles: HelpCenterArticle[]): Record<string, ArticleStatus> {
  return Object.fromEntries(articles.map(article => [article.id, 'unpublished' as ArticleStatus]))
}

interface CopilotHelpCenterPreviewWidgetProps {
  statuses?: Record<string, ArticleStatus>
  interactive?: boolean
  onPublishArticle?: (article: HelpCenterArticle) => void
  onPublishAll?: () => void
}

export default function CopilotHelpCenterPreviewWidget({
  statuses: statusesProp,
  interactive = true,
  onPublishArticle,
  onPublishAll,
}: CopilotHelpCenterPreviewWidgetProps) {
  const articles = useMemo(() => buildHelpCenterArticles(HELP_CENTER_PREVIEW_BRAND), [])
  const statuses = statusesProp ?? defaultStatuses(articles)
  const unpublishedIds = articles
    .filter(article => statuses[article.id] !== 'published')
    .map(article => article.id)

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
                      interactive &&
                      onPublishArticle && (
                        <Button size="small" onClick={() => onPublishArticle(article)}>
                          Publish
                        </Button>
                      )
                    )}
                  </ArticleActions>
                </ArticleContent>
              </ArticleRow>
            )
          })}
        </ArticleListShell>

        {interactive && unpublishedIds.length > 0 && onPublishAll && (
          <Footer>
            <Button size="small" isPrimary onClick={onPublishAll}>
              Publish all
            </Button>
          </Footer>
        )}
      </Body>
    </CopilotPreviewCard>
  )
}
