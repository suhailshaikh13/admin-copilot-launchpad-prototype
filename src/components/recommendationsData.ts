import type { ComponentType } from 'react'
import FlowFillIcon from '@zendesk-ui/assets/icons/20px/flow-fill.svg?react'
import BookOpenFillIcon from '@zendesk-ui/assets/icons/20px/book-open-fill.svg?react'
import MonitorFillIcon from '@zendesk-ui/assets/icons/20px/monitor-fill.svg?react'

export interface RecommendationData {
  title: string
  description: string
  reviewLabel: string
  tags: { label: string; bg: string; color: string; Icon?: ComponentType }[]
}

export const recommendations: RecommendationData[] = [
  {
    title: 'Route specific tickets to assignee: EMEA Group',
    description: 'Resolution time could improve by 2h 45min',
    reviewLabel: 'Review trigger',
    tags: [
      { label: 'Triggers', bg: '#e4e8f6', color: '#304073', Icon: FlowFillIcon },
      { label: 'Optimization', bg: '#F6F5F4', color: '#313131' },
    ],
  },
  {
    title: 'Change ticket status for intent: Unsolicited marketing',
    description: 'Resolution time could improve by 1h 05min',
    reviewLabel: 'Review procedure',
    tags: [
      { label: 'Procedures', bg: '#e2edd4', color: '#344914', Icon: BookOpenFillIcon },
      { label: 'Optimization', bg: '#F6F5F4', color: '#313131' },
    ],
  },
  {
    title: 'Turn on suggested macros',
    description: 'Resolution time could improve by 50min',
    reviewLabel: 'Review macros',
    tags: [
      { label: 'Macros', bg: '#dceeed', color: '#034a4b', Icon: MonitorFillIcon },
      { label: 'Maintenance', bg: '#F6F5F4', color: '#313131' },
    ],
  },
]
