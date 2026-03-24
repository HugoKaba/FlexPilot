import { FirebaseError } from 'firebase/app'
import { describe, expect, it } from 'vitest'
import { getFirebaseErrorMessage } from '@/shared/lib/firebase-error'

describe('firebase error mapper', () => {
  it('maps auth errors', () => {
    expect(getFirebaseErrorMessage(new FirebaseError('auth/email-already-in-use', 'x'))).toContain('déjà')
  })

  it('maps firestore index precondition errors', () => {
    expect(getFirebaseErrorMessage(new FirebaseError('failed-precondition', 'x'))).toContain('Index Firestore')
  })
})
