import { z } from 'zod'

export const authSchema = z.object({
  email: z.email('Email invalide'),
  password: z.string().min(6, '6 caractères minimum'),
})

export type AuthFormValues = z.infer<typeof authSchema>
