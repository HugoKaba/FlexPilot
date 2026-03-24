import { useMemo } from 'react'
import { useLanguageStore, type Language } from '@/shared/model'

const translations = {
  fr: {
    delivery: 'Delivery',
    organisation: 'Organisation',
    dashboard: 'Dashboard',
    backlog: 'Backlog',
    board: 'Board',
    sprints: 'Sprints',
    roadmap: 'Roadmap',
    team: 'Team',
    reports: 'Reports',
    integrations: 'Integrations',
    settings: 'Settings',
    billing: 'Billing',
    workItem: 'Work Item',
    workspace: 'Workspace',
    topbarSubtitle: 'Workspace de pilotage delivery',
    logout: 'Déconnexion',
    language: 'Langue',
    authTitle: 'Lance ton delivery process',
    authSubtitle: 'Backlog, Board, Sprint et reporting dans un workspace lisible et orienté exécution.',
    authFeatureBoardsTitle: 'Boards ultra rapides',
    authFeatureBoardsText: 'Fais avancer tes tickets en temps réel avec suivi clair du statut.',
    authFeatureSprintTitle: 'Sprints pilotés',
    authFeatureSprintText: 'Visualise la progression, la charge et les priorités en un coup d’oeil.',
    authFeatureBillingTitle: 'Paywall intégré Stripe',
    authFeatureBillingText: 'Paiement en pop-in dans ton produit, sans sortie casse-UX.',
    authSecureAccess: 'Accès sécurisé',
    authConnectToOpen: 'Connecte-toi pour ouvrir ton workspace.',
    login: 'Connexion',
    signup: 'Inscription',
    email: 'Email',
    password: 'Mot de passe',
    loading: 'Chargement...',
    signIn: 'Se connecter',
    createAccount: 'Créer un compte',
    alreadyRegistered: 'Déjà inscrit ?',
    resumeDelivery: 'Reprends ton flux de delivery.',
    createWorkspace: 'Crée ton espace produit en 1 minute.',
    boardTitle: 'Board',
    boardSubtitle: 'Vue delivery temps réel orientée exécution.',
    search: 'Recherche',
    assignee: 'Assignee',
    type: 'Type',
    all: 'Tous',
    reset: 'Reset',
    loadingBoard: 'Chargement board...',
    boardLoadError: 'Impossible de charger le board.',
    checkIndexes: 'Vérifier les index Firestore',
  },
  en: {
    delivery: 'Delivery',
    organisation: 'Organization',
    dashboard: 'Dashboard',
    backlog: 'Backlog',
    board: 'Board',
    sprints: 'Sprints',
    roadmap: 'Roadmap',
    team: 'Team',
    reports: 'Reports',
    integrations: 'Integrations',
    settings: 'Settings',
    billing: 'Billing',
    workItem: 'Work Item',
    workspace: 'Workspace',
    topbarSubtitle: 'Delivery operations workspace',
    logout: 'Logout',
    language: 'Language',
    authTitle: 'Launch your delivery process',
    authSubtitle: 'Backlog, Board, Sprint and reporting in one execution-focused workspace.',
    authFeatureBoardsTitle: 'Fast boards',
    authFeatureBoardsText: 'Move your tickets in real time with clear status tracking.',
    authFeatureSprintTitle: 'Controlled sprints',
    authFeatureSprintText: 'See progress, capacity and priorities at a glance.',
    authFeatureBillingTitle: 'Embedded Stripe paywall',
    authFeatureBillingText: 'In-app checkout pop-in, no UX-breaking redirects.',
    authSecureAccess: 'Secure access',
    authConnectToOpen: 'Sign in to open your workspace.',
    login: 'Sign in',
    signup: 'Sign up',
    email: 'Email',
    password: 'Password',
    loading: 'Loading...',
    signIn: 'Sign in',
    createAccount: 'Create account',
    alreadyRegistered: 'Already registered?',
    resumeDelivery: 'Resume your delivery flow.',
    createWorkspace: 'Create your product workspace in one minute.',
    boardTitle: 'Board',
    boardSubtitle: 'Real-time execution-focused delivery view.',
    search: 'Search',
    assignee: 'Assignee',
    type: 'Type',
    all: 'All',
    reset: 'Reset',
    loadingBoard: 'Loading board...',
    boardLoadError: 'Unable to load board.',
    checkIndexes: 'Check Firestore indexes',
  },
} as const

type TranslationKey = keyof (typeof translations)['fr']

export const useI18n = () => {
  const language = useLanguageStore((state) => state.language)
  const setLanguage = useLanguageStore((state) => state.setLanguage)

  const t = useMemo(() => {
    return (key: TranslationKey): string => {
      const table = translations[language]
      return table[key] ?? translations.fr[key]
    }
  }, [language])

  return { t, language, setLanguage, languages: ['fr', 'en'] as Language[] }
}
