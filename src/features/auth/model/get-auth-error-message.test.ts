import { FirebaseError } from 'firebase/app'
import { describe, expect, it } from 'vitest'
import { getAuthErrorMessage } from '@/features/auth/model/get-auth-error-message'

describe('getAuthErrorMessage', () => {
  it('retourne un message métier connu pour un code Firebase', () => {
    const error = new FirebaseError('auth/email-already-in-use', 'already used')
    expect(getAuthErrorMessage(error)).toBe('Cet email est déjà utilisé.')
  })

  it('retourne un fallback pour une erreur inconnue', () => {
    expect(getAuthErrorMessage(new Error('boom'))).toBe('Une erreur inattendue est survenue.')
  })
})
