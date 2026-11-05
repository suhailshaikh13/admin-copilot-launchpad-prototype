import { useCallback, useState } from 'react'
import styled from 'styled-components'
import { IconButton, Tooltip } from '@zendesk-ui/react-components'
import ThumbsUpIcon from '@zendeskgarden/svg-icons/src/16/thumbs-up-stroke.svg?react'
import ThumbsDownIcon from '@zendeskgarden/svg-icons/src/16/thumbs-down-stroke.svg?react'
import CopyStrokeIcon from '@zendeskgarden/svg-icons/src/16/copy-stroke.svg?react'

const FeedbackRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  margin-top: 8px;
`

type Satisfaction = 1 | -1 | null

interface AssistantMessageFeedbackProps {
  content: string
}

export default function AssistantMessageFeedback({ content }: AssistantMessageFeedbackProps) {
  const [satisfaction, setSatisfaction] = useState<Satisfaction>(null)
  const [copied, setCopied] = useState(false)

  const handleHelpful = useCallback(() => {
    setSatisfaction(current => (current === 1 ? null : 1))
  }, [])

  const handleUnhelpful = useCallback(() => {
    setSatisfaction(current => (current === -1 ? null : -1))
  }, [])

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }, [content])

  return (
    <FeedbackRow aria-label="Message feedback">
      <Tooltip content={satisfaction === 1 ? 'Helpful' : 'Mark as helpful'} placement="top">
        <IconButton
          size="small"
          aria-label="Mark as helpful"
          aria-pressed={satisfaction === 1}
          onClick={handleHelpful}
        >
          <ThumbsUpIcon />
        </IconButton>
      </Tooltip>
      <Tooltip content={satisfaction === -1 ? 'Unhelpful' : 'Mark as unhelpful'} placement="top">
        <IconButton
          size="small"
          aria-label="Mark as unhelpful"
          aria-pressed={satisfaction === -1}
          onClick={handleUnhelpful}
        >
          <ThumbsDownIcon />
        </IconButton>
      </Tooltip>
      <Tooltip content={copied ? 'Copied' : 'Copy response'} placement="top">
        <IconButton size="small" aria-label="Copy response" onClick={handleCopy}>
          <CopyStrokeIcon />
        </IconButton>
      </Tooltip>
    </FeedbackRow>
  )
}
