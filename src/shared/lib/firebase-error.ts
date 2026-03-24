import { FirebaseError } from 'firebase/app'

const firestoreMessages: Record<string, string> = {
  'permission-denied': "Tu n'as pas les droits pour cette action.",
  'not-found': 'Ressource introuvable.',
  'failed-precondition':
    'Index Firestore manquant. Ouvre la console Firebase, crée l’index proposé puis recharge.',
  'unavailable': 'Service Firebase indisponible temporairement.',
}

const authMessages: Record<string, string> = {
  'auth/email-already-in-use': 'Cet email est déjà utilisé.',
  'auth/invalid-email': 'Adresse email invalide.',
  'auth/weak-password': 'Mot de passe trop faible (6 caractères minimum).',
  'auth/operation-not-allowed': "L'authentification Email/Mot de passe n'est pas activée dans Firebase.",
  'auth/configuration-not-found':
    "Configuration Firebase Auth introuvable: initialise Authentication dans Firebase.",
  'auth/invalid-credential': 'Email ou mot de passe incorrect.',
  'auth/network-request-failed': 'Erreur réseau, vérifie ta connexion.',
}

export const getFirebaseErrorMessage = (error: unknown): string => {
  if (error instanceof FirebaseError) {
    if (error.code in authMessages) {
      return authMessages[error.code]
    }

    if (error.code in firestoreMessages) {
      return firestoreMessages[error.code]
    }

    return `Erreur Firebase: ${error.code}`
  }

  return 'Une erreur inattendue est survenue.'
}
