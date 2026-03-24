import { useMemo, useState } from 'react'
import type { WorkItem } from '@/entities/work-item'
import { Button, EmptyState } from '@/shared/ui'

type SortKey = 'title' | 'type' | 'status' | 'priority' | 'assignee' | 'estimate' | 'rank'

export const BacklogList = ({
  items,
  onOpen,
  onEdit,
  onDelete,
  onMoveRank,
}: {
  items: WorkItem[]
  onOpen: (item: WorkItem) => void
  onEdit: (item: WorkItem) => void
  onDelete: (itemId: string) => void
  onMoveRank: (itemId: string, direction: 'up' | 'down') => void
}) => {
  const [sortKey, setSortKey] = useState<SortKey>('rank')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [hierarchyMode, setHierarchyMode] = useState(true)
  const [collapsedParents, setCollapsedParents] = useState<Record<string, boolean>>({})

  const sortedItems = useMemo(() => {
    const clone = [...items]

    clone.sort((a, b) => {
      const left = a[sortKey]
      const right = b[sortKey]

      if (typeof left === 'number' && typeof right === 'number') {
        return sortDirection === 'asc' ? left - right : right - left
      }

      const l = String(left).toLowerCase()
      const r = String(right).toLowerCase()
      if (l < r) return sortDirection === 'asc' ? -1 : 1
      if (l > r) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return clone
  }, [items, sortDirection, sortKey])

  const flattenedHierarchy = useMemo(() => {
    const byId = new Map(sortedItems.map((item) => [item.id, item]))
    const childrenByParent = new Map<string, WorkItem[]>()
    const roots: WorkItem[] = []

    for (const item of sortedItems) {
      if (item.parentId && byId.has(item.parentId)) {
        const bucket = childrenByParent.get(item.parentId) ?? []
        bucket.push(item)
        childrenByParent.set(item.parentId, bucket)
      } else {
        roots.push(item)
      }
    }

    const output: Array<{ item: WorkItem; level: number; childCount: number }> = []
    for (const root of roots) {
      const children = childrenByParent.get(root.id) ?? []
      output.push({ item: root, level: 0, childCount: children.length })
      if (collapsedParents[root.id]) {
        continue
      }
      for (const child of children) {
        output.push({ item: child, level: 1, childCount: 0 })
      }
    }
    return output
  }, [collapsedParents, sortedItems])

  const onSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDirection((previous) => (previous === 'asc' ? 'desc' : 'asc'))
      return
    }

    setSortKey(key)
    setSortDirection('asc')
  }

  if (!items.length) {
    return <EmptyState title="Aucun work item pour ces filtres." />
  }

  return (
    <section className="card backlog-table-wrap">
      <div className="inline-row" style={{ marginBottom: 10 }}>
        <h2 style={{ fontSize: '0.96rem' }}>Backlog</h2>
        <Button tone="muted" type="button" onClick={() => setHierarchyMode((value) => !value)}>
          {hierarchyMode ? 'Vue triée simple' : 'Vue hiérarchique'}
        </Button>
      </div>
      <table className="backlog-table">
        <thead>
          <tr>
            <th>
              <button className="table-sort" type="button" onClick={() => onSort('title')}>
                Titre
              </button>
            </th>
            <th>
              <button className="table-sort" type="button" onClick={() => onSort('type')}>
                Type
              </button>
            </th>
            <th>
              <button className="table-sort" type="button" onClick={() => onSort('status')}>
                Statut
              </button>
            </th>
            <th>
              <button className="table-sort" type="button" onClick={() => onSort('priority')}>
                Priorité
              </button>
            </th>
            <th>
              <button className="table-sort" type="button" onClick={() => onSort('assignee')}>
                Assignee
              </button>
            </th>
            <th>
              <button className="table-sort" type="button" onClick={() => onSort('estimate')}>
                Points
              </button>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {(hierarchyMode ? flattenedHierarchy : sortedItems.map((item) => ({ item, level: 0, childCount: 0 }))).map(({ item, level, childCount }, index) => (
            <tr key={item.id}>
              <td>
                <strong style={{ display: 'inline-flex', alignItems: 'center', gap: 8, paddingLeft: `${level * 20}px` }}>
                  {level === 0 && childCount > 0 ? (
                    <button
                      className="btn btn-muted"
                      type="button"
                      style={{ minHeight: 24, padding: '2px 8px' }}
                      onClick={() => {
                        setCollapsedParents((state) => ({ ...state, [item.id]: !state[item.id] }))
                      }}
                    >
                      {collapsedParents[item.id] ? '+' : '-'}
                    </button>
                  ) : null}
                  <button className="table-sort" type="button" onClick={() => onOpen(item)}>
                    <span style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
                      {item.title}
                      {childCount > 0 ? <span className="page-subtitle">({childCount})</span> : null}
                    </span>
                  </button>
                </strong>
                <p className="page-subtitle">{item.description}</p>
              </td>
              <td><span className="badge">{item.type}</span></td>
              <td><span className="badge">{item.status}</span></td>
              <td><span className="badge">{item.priority}</span></td>
              <td>{item.assignee}</td>
              <td>{item.estimate}</td>
              <td>
                <div className="actions">
                  <Button tone="muted" type="button" onClick={() => onMoveRank(item.id, 'up')} disabled={index === 0}>
                    ↑
                  </Button>
                  <Button tone="muted" type="button" onClick={() => onMoveRank(item.id, 'down')} disabled={index === sortedItems.length - 1}>
                    ↓
                  </Button>
                  <Button tone="muted" type="button" onClick={() => onEdit(item)}>
                    Éditer
                  </Button>
                  <Button tone="muted" type="button" onClick={() => onOpen(item)}>
                    Drawer
                  </Button>
                  <Button tone="danger" type="button" onClick={() => onDelete(item.id)}>
                    Supprimer
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
