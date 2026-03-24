import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { WorkItem, WorkItemStatus } from '@/entities/work-item'
import { Badge, Card, EmptyState } from '@/shared/ui'

const columns: { key: WorkItemStatus; title: string }[] = [
  { key: 'todo', title: 'Todo' },
  { key: 'in_progress', title: 'In Progress' },
  { key: 'review', title: 'Review' },
  { key: 'done', title: 'Done' },
]

export const BoardColumns = ({
  data,
  onMove,
}: {
  data: Record<WorkItemStatus, WorkItem[]>
  onMove: (itemId: string, status: WorkItemStatus) => void
}) => {
  const [draggingItemId, setDraggingItemId] = useState<string | null>(null)
  const navigate = useNavigate()

  return (
    <section className="board-grid target-board-grid">
      {columns.map((column) => (
        <Card
          key={column.key}
          className={`board-column target-board-column ${draggingItemId ? 'board-column-droppable' : ''}`.trim()}
          onDragOver={(event) => {
            event.preventDefault()
            event.dataTransfer.dropEffect = 'move'
          }}
          onDrop={(event) => {
            event.preventDefault()
            const itemId = event.dataTransfer.getData('text/plain') || draggingItemId
            if (!itemId) {
              return
            }
            onMove(itemId, column.key)
            setDraggingItemId(null)
          }}
        >
          <div className="target-board-column-head">
            <h2>{column.title}</h2>
            <span className="target-board-count">{data[column.key].length}</span>
          </div>

          {data[column.key].length === 0 ? <EmptyState title="Aucun item" /> : null}

          <div
            className="board-column-content"
            onDragOver={(event) => {
              event.preventDefault()
              event.dataTransfer.dropEffect = 'move'
            }}
            onDrop={(event) => {
              event.preventDefault()
              const itemId = event.dataTransfer.getData('text/plain') || draggingItemId
              if (!itemId) {
                return
              }
              onMove(itemId, column.key)
              setDraggingItemId(null)
            }}
          >
            {data[column.key].map((item) => (
              <div
                key={item.id}
                className="draggable-card"
                draggable
                onDragStart={(event) => {
                  event.dataTransfer.effectAllowed = 'move'
                  event.dataTransfer.setData('text/plain', item.id)
                  setDraggingItemId(item.id)
                }}
                onDragEnd={() => {
                  setDraggingItemId(null)
                }}
              >
                <article
                  className="target-board-card target-board-card-clickable"
                  onClick={() => {
                    navigate(`/work-items/${item.id}?edit=1`)
                  }}
                >
                  <div className="target-board-card-head">
                    <h3 className="target-board-title">{item.title}</h3>
                    <Badge>{item.type}</Badge>
                  </div>
                  <div className="target-board-card-id">#{item.id.slice(0, 8)} • {item.status}</div>
                  <p className="work-item-description">{item.description}</p>
                  <div className="target-board-card-meta">
                    <Badge>{item.assignee}</Badge>
                    <Badge>{item.estimate} pts</Badge>
                    <Badge>{item.priority}</Badge>
                  </div>
                  {item.parentId ? <div className="target-board-parent">Parent: #{item.parentId.slice(0, 8)}</div> : null}
                </article>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </section>
  )
}
