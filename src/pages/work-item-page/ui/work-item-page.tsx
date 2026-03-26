import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useWorkItemQuery, useWorkItemsQuery, type WorkItem } from '@/entities/work-item'
import { WorkItemForm, useDeleteWorkItemMutation, useUpdateWorkItemMutation } from '@/features/work-item-crud'
import { useAuth } from '@/features/auth'
import { getFirebaseErrorMessage, useI18n } from '@/shared/lib'
import { Badge, Button, Card, ErrorState, LoadingState } from '@/shared/ui'

export const WorkItemPage = () => {
  const { t, language } = useI18n()
  const { itemId } = useParams<{ itemId: string }>()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(() => searchParams.get('edit') === '1')

  const itemQuery = useWorkItemQuery(user?.uid, itemId)
  const allItemsQuery = useWorkItemsQuery(user?.uid)
  const updateMutation = useUpdateWorkItemMutation(user?.uid ?? '', itemId ?? '')
  const deleteMutation = useDeleteWorkItemMutation(user?.uid ?? '')

  const related = useMemo(() => {
    if (!itemQuery.data || !allItemsQuery.data) {
      return { parent: null, children: [] as WorkItem[] }
    }

    return {
      parent: itemQuery.data.parentId ? allItemsQuery.data.find((item) => item.id === itemQuery.data?.parentId) ?? null : null,
      children: allItemsQuery.data.filter((item) => item.parentId === itemQuery.data?.id),
    }
  }, [allItemsQuery.data, itemQuery.data])

  if (!itemId) {
    return <ErrorState title={t('missingWorkItemId')} />
  }

  if (itemQuery.isLoading || allItemsQuery.isLoading) {
    return <LoadingState text={t('loadingWorkItem')} />
  }

  if (itemQuery.isError || allItemsQuery.isError || !itemQuery.data || !allItemsQuery.data) {
    const details = itemQuery.error ? getFirebaseErrorMessage(itemQuery.error) : undefined
    return <ErrorState title={t('workItemLoadError')} details={details} />
  }

  const item = itemQuery.data
  const children = related.children ?? []

  return (
    <section className="page">
      <div className="page-head">
        <div>
          <h1>{item.title}</h1>
          <p className="page-subtitle">{t('workItemDetailSubtitle')}</p>
        </div>
        <div className="actions">
          <Button type="button" tone="muted" onClick={() => setEditing((state) => !state)}>
            {editing ? t('closeEdit') : t('edit')}
          </Button>
          <Button
            type="button"
            tone="danger"
            disabled={deleteMutation.isPending}
            onClick={async () => {
              await deleteMutation.mutateAsync(item.id)
              navigate('/backlog')
            }}
          >
            {deleteMutation.isPending ? t('deleting') : t('delete')}
          </Button>
        </div>
      </div>

      <Card className="enterprise-card">
        <div className="work-item-meta">
          <Badge>{item.type}</Badge>
          <Badge>{item.status}</Badge>
          <Badge>P{item.priority}</Badge>
          <Badge>{item.estimate} pts</Badge>
          <Badge>{item.assignee}</Badge>
          {item.sprintId ? <Badge>Sprint: {item.sprintId}</Badge> : null}
        </div>
        <p>{item.description}</p>
      </Card>

      {editing ? (
        <WorkItemForm
          initialValues={{
            title: item.title,
            description: item.description,
            type: item.type,
            status: item.status,
            priority: item.priority,
            estimate: item.estimate,
            assignee: item.assignee,
            labels: item.labels,
            sprintId: item.sprintId,
            parentId: item.parentId,
          }}
          isSaving={updateMutation.isPending}
          onSubmit={async (values) => {
            await updateMutation.mutateAsync(values)
            setEditing(false)
          }}
        />
      ) : null}

      <section className="grid-2">
        <Card className="enterprise-card">
          <h2>{t('hierarchy')}</h2>
          <p className="page-subtitle">{t('parent')}: {related.parent ? related.parent.title : t('noParent')}</p>
          {related.parent ? <Link to={`/work-items/${related.parent.id}`} className="btn btn-muted">{t('openParent')}</Link> : null}

          <h3>{t('children')}</h3>
          <div className="enterprise-list">
            {children.length === 0 ? (
              <p className="page-subtitle">{t('noChild')}</p>
            ) : (
              children.map((child) => (
                <article key={child.id} className="enterprise-item enterprise-row">
                  <p><strong>{child.title}</strong></p>
                  <Link to={`/work-items/${child.id}`} className="btn btn-muted">{t('open')}</Link>
                </article>
              ))
            )}
          </div>
        </Card>

        <Card className="enterprise-card">
          <h2>{t('activity')}</h2>
          <div className="enterprise-list">
            <article className="enterprise-item">
              <p><strong>{t('createdAt')}</strong></p>
              <p className="page-subtitle">{new Date(item.createdAt).toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US')}</p>
            </article>
            <article className="enterprise-item">
              <p><strong>{t('updatedAt')}</strong></p>
              <p className="page-subtitle">{new Date(item.updatedAt).toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US')}</p>
            </article>
            <article className="enterprise-item">
              <p><strong>{t('cycleStatus')}</strong></p>
              <p className="page-subtitle">{item.status}</p>
            </article>
          </div>
        </Card>
      </section>
    </section>
  )
}
