import { FirebaseError } from 'firebase/app'

const authErrorMessages: Record<string, string> = {
  'auth/email-already-in-use': 'Cet email est déjà utilisé.',
  'auth/invalid-email': 'Adresse email invalide.',
  'auth/weak-password': 'Mot de passe trop faible (6 caractères minimum).',
  'auth/operation-not-allowed':
    "L'authentification Email/Mot de passe n'est pas activée dans Firebase.",
  'auth/configuration-not-found':
    "La configuration Firebase Auth est introuvable sur ce projet. Ouvre Firebase > Authentication > Commencer, puis active Email/Mot de passe.",
  'auth/invalid-credential': 'Email ou mot de passe incorrect.',
  'auth/user-not-found': 'Aucun compte trouvé avec cet email.',
  'auth/wrong-password': 'Mot de passe incorrect.',
  'auth/too-many-requests': 'Trop de tentatives, réessaie dans quelques minutes.',
  'auth/network-request-failed': 'Erreur réseau, vérifie ta connexion.',
}

export const getAuthErrorMessage = (error: unknown): string => {
  if (error instanceof FirebaseError) {
    return authErrorMessages[error.code] ?? `Erreur Firebase: ${error.code}`
  }

  return 'Une erreur inattendue est survenue.'
}
