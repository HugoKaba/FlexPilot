import { useMemo, useState } from 'react'
import { useAuth } from '@/features/auth'
import { useMoveWorkItemStatusMutation } from '@/features/board-actions'
import {
  useBoardColumnsQuery,
  type WorkItem,
  type WorkItemStatus,
  type WorkItemType,
} from '@/entities/work-item'
import { getFirebaseErrorMessage, useI18n } from '@/shared/lib'
import { ErrorState, LoadingState } from '@/shared/ui'
import { BoardColumns } from '@/widgets/board-columns'

const emptyBoardData: Record<WorkItemStatus, WorkItem[]> = {
  todo: [],
  in_progress: [],
  review: [],
  done: [],
}

export const BoardPage = () => {
  const { user } = useAuth()
  const { t } = useI18n()
  const boardQuery = useBoardColumnsQuery(user?.uid)
  const moveStatusMutation = useMoveWorkItemStatusMutation(user?.uid ?? '')
  const [search, setSearch] = useState('')
  const [assigneeFilter, setAssigneeFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState<'all' | WorkItemType>('all')
  const boardData = boardQuery.data ?? emptyBoardData

  const assignees = useMemo(() => {
    const values = Object.values(boardData)
      .flat()
      .map((item) => item.assignee)
    return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b))
  }, [boardData])

  const filteredData = useMemo<Record<WorkItemStatus, WorkItem[]>>(() => {
    const term = search.trim().toLowerCase()
    const isSearchActive = term.length > 0
    const matchesFilters = (item: WorkItem) => {
      if (assigneeFilter !== 'all' && item.assignee !== assigneeFilter) {
        return false
      }
      if (typeFilter !== 'all' && item.type !== typeFilter) {
        return false
      }
      if (!isSearchActive) {
        return true
      }
      return (
        item.title.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        item.labels.some((label) => label.toLowerCase().includes(term))
      )
    }
    return {
      todo: boardData.todo.filter(matchesFilters),
      in_progress: boardData.in_progress.filter(matchesFilters),
      review: boardData.review.filter(matchesFilters),
      done: boardData.done.filter(matchesFilters),
    }
  }, [assigneeFilter, boardData, search, typeFilter])

  if (boardQuery.isLoading) {
    return <LoadingState text={t('loadingBoard')} />
  }

  if (boardQuery.isError || !boardQuery.data || !user) {
    const details = boardQuery.error ? getFirebaseErrorMessage(boardQuery.error) : undefined

    return (
      <ErrorState
        title={t('boardLoadError')}
        details={
          <>
            <p>{details}</p>
            <a href="https://console.firebase.google.com/project/archi-front/firestore/indexes" target="_blank" rel="noreferrer">
              {t('checkIndexes')}
            </a>
          </>
        }
      />
    )
  }

  return (
    <section className="page target-board-page">
      <div className="page-head">
        <div>
          <h1>{t('boardTitle')}</h1>
          <p className="page-subtitle">{t('boardSubtitle')}</p>
        </div>
      </div>
      <div className="card target-board-toolbar">
        <label className="field">
          {t('search')}
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t('boardSearchPlaceholder')} />
        </label>
        <label className="field">
          {t('assignee')}
          <select value={assigneeFilter} onChange={(event) => setAssigneeFilter(event.target.value)}>
            <option value="all">{t('all')}</option>
            {assignees.map((assignee) => (
              <option key={assignee} value={assignee}>
                {assignee}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          {t('type')}
          <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as 'all' | WorkItemType)}>
            <option value="all">{t('all')}</option>
            <option value="epic">Epic</option>
            <option value="feature">Feature</option>
            <option value="story">Story</option>
            <option value="task">Task</option>
            <option value="bug">Bug</option>
          </select>
        </label>
        <button
          className="btn btn-muted"
          type="button"
          onClick={() => {
            setSearch('')
            setAssigneeFilter('all')
            setTypeFilter('all')
          }}
        >
          {t('reset')}
        </button>
      </div>
      <BoardColumns
        data={filteredData}
        onMove={(itemId, status: WorkItemStatus) => {
          void moveStatusMutation.mutateAsync({ itemId, status })
        }}
      />
    </section>
  )
}
