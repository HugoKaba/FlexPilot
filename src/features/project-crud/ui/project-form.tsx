import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { projectStatusSchema, type ProjectPayload } from '@/entities/project'
import { projectFormSchema } from '@/features/project-crud/model/project-form-schema'

interface ProjectFormProps {
  initialValues?: ProjectPayload
  isSaving: boolean
  onSubmit: (values: ProjectPayload) => Promise<void>
}

const statusLabels: Record<(typeof projectStatusSchema.options)[number], string> = {
  planned: 'Planned',
  in_progress: 'In progress',
  done: 'Done',
}

export const ProjectForm = ({ initialValues, isSaving, onSubmit }: ProjectFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectPayload>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: initialValues ?? {
      title: '',
      description: '',
      status: 'planned',
      budget: 0,
    },
  })

  return (
    <form className="card" onSubmit={handleSubmit(onSubmit)}>
      <div className="field">
        <label htmlFor="title">Titre</label>
        <input id="title" type="text" {...register('title')} />
        {errors.title && <span className="error">{errors.title.message}</span>}
      </div>

      <div className="field">
        <label htmlFor="description">Description</label>
        <textarea id="description" rows={5} {...register('description')} />
        {errors.description && <span className="error">{errors.description.message}</span>}
      </div>

      <div className="grid-2">
        <div className="field">
          <label htmlFor="status">Statut</label>
          <select id="status" {...register('status')}>
            {projectStatusSchema.options.map((statusOption) => (
              <option key={statusOption} value={statusOption}>
                {statusLabels[statusOption]}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="budget">Budget</label>
          <input id="budget" type="number" min={0} step={100} {...register('budget', { valueAsNumber: true })} />
          {errors.budget && <span className="error">{errors.budget.message}</span>}
        </div>
      </div>

      <div className="actions">
        <button type="submit" className="btn btn-primary" disabled={isSaving}>
          {isSaving ? 'Enregistrement...' : 'Sauvegarder'}
        </button>
      </div>
    </form>
  )
}
