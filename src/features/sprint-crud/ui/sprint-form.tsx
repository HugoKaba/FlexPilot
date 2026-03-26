import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { sprintPayloadSchema, sprintStatusSchema, type SprintPayload } from '@/entities/sprint'
import { useI18n } from '@/shared/lib'
import { Button, FieldInput, FieldSelect, FieldTextarea } from '@/shared/ui'

const defaults: SprintPayload = {
  name: '',
  goal: '',
  startDate: '',
  endDate: '',
  status: 'planned',
}

export const SprintForm = ({
  initialValues,
  isSaving,
  onSubmit,
}: {
  initialValues?: SprintPayload
  isSaving: boolean
  onSubmit: (values: SprintPayload) => Promise<void>
}) => {
  const { t } = useI18n()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SprintPayload>({
    resolver: zodResolver(sprintPayloadSchema),
    defaultValues: initialValues ?? defaults,
  })

  return (
    <form className="card form-grid" onSubmit={handleSubmit(onSubmit)}>
      <label className="field">
        {t('name')}
        <FieldInput type="text" {...register('name')} />
        {errors.name && <span className="error">{errors.name.message}</span>}
      </label>

      <label className="field">
        {t('goal')}
        <FieldTextarea rows={3} {...register('goal')} />
        {errors.goal && <span className="error">{errors.goal.message}</span>}
      </label>

      <div className="grid-3">
        <label className="field">
          {t('start')}
          <FieldInput type="date" {...register('startDate')} />
        </label>

        <label className="field">
          {t('end')}
          <FieldInput type="date" {...register('endDate')} />
        </label>

        <label className="field">
          {t('status')}
          <FieldSelect {...register('status')}>
            {sprintStatusSchema.options.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </FieldSelect>
        </label>
      </div>

      <div className="actions">
        <Button tone="primary" type="submit" disabled={isSaving}>
          {isSaving ? t('saving') : t('save')}
        </Button>
      </div>
    </form>
  )
}
