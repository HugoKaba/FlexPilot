import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { workItemPayloadSchema, workItemPrioritySchema, workItemStatusSchema, workItemTypeSchema, type WorkItemPayload } from '@/entities/work-item'
import { Button, FieldInput, FieldSelect, FieldTextarea } from '@/shared/ui'

interface WorkItemFormProps {
  initialValues?: WorkItemPayload
  isSaving: boolean
  onSubmit: (values: WorkItemPayload) => Promise<void>
}

const defaultValues: WorkItemPayload = {
  title: '',
  description: '',
  type: 'task',
  status: 'todo',
  priority: 'medium',
  estimate: 1,
  assignee: '',
  labels: [],
  sprintId: null,
  parentId: null,
}

export const WorkItemForm = ({ initialValues, isSaving, onSubmit }: WorkItemFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WorkItemPayload>({
    resolver: zodResolver(workItemPayloadSchema),
    defaultValues: initialValues ?? defaultValues,
  })

  return (
    <form className="card form-grid" onSubmit={handleSubmit(onSubmit)}>
      <label className="field">
        Titre
        <FieldInput type="text" {...register('title')} />
        {errors.title && <span className="error">{errors.title.message}</span>}
      </label>

      <label className="field">
        Description
        <FieldTextarea rows={4} {...register('description')} />
        {errors.description && <span className="error">{errors.description.message}</span>}
      </label>

      <div className="grid-4">
        <label className="field">
          Type
          <FieldSelect {...register('type')}>
            {workItemTypeSchema.options.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </FieldSelect>
        </label>

        <label className="field">
          Statut
          <FieldSelect {...register('status')}>
            {workItemStatusSchema.options.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </FieldSelect>
        </label>

        <label className="field">
          Priorité
          <FieldSelect {...register('priority')}>
            {workItemPrioritySchema.options.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </FieldSelect>
        </label>

        <label className="field">
          Estimation
          <FieldInput type="number" min={0} step={1} {...register('estimate', { valueAsNumber: true })} />
          {errors.estimate && <span className="error">{errors.estimate.message}</span>}
        </label>
      </div>

      <label className="field">
        Assignee
        <FieldInput type="text" {...register('assignee')} />
        {errors.assignee && <span className="error">{errors.assignee.message}</span>}
      </label>

      <div className="actions">
        <Button tone="primary" type="submit" disabled={isSaving}>
          {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </div>
    </form>
  )
}
