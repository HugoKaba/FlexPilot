import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { authSchema, type AuthFormValues } from '@/features/auth/model/auth-schemas'
import { useAuth } from '@/features/auth/model/auth-context'
import { getFirebaseErrorMessage, useI18n } from '@/shared/lib'

export const AuthForm = () => {
  const { login, register } = useAuth()
  const { t } = useI18n()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const {
    register: field,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: AuthFormValues) => {
    setErrorMessage(null)

    try {
      if (mode === 'login') {
        await login(values.email, values.password)
      } else {
        await register(values.email, values.password)
      }
    } catch (error: unknown) {
      setErrorMessage(getFirebaseErrorMessage(error))
    }
  }

  return (
    <form className="card auth-form" onSubmit={handleSubmit(onSubmit)}>
      <h1>{mode === 'login' ? t('login') : t('signup')}</h1>
      <p className="auth-form-helper">{mode === 'login' ? t('resumeDelivery') : t('createWorkspace')}</p>

      <label className="field">
        {t('email')}
        <input type="email" placeholder="you@saas.com" {...field('email')} />
        {errors.email && <span className="error">{errors.email.message}</span>}
      </label>

      <label className="field">
        {t('password')}
        <input type="password" placeholder="******" {...field('password')} />
        {errors.password && <span className="error">{errors.password.message}</span>}
      </label>

      {errorMessage && <p className="error">{errorMessage}</p>}

      <div className="actions">
        <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? t('loading') : mode === 'login' ? t('signIn') : t('createAccount')}
        </button>
        <button
          type="button"
          className="btn btn-muted"
          onClick={() => setMode((previousMode) => (previousMode === 'login' ? 'register' : 'login'))}
        >
          {mode === 'login' ? t('createAccount') : t('alreadyRegistered')}
        </button>
      </div>
    </form>
  )
}
