import { create } from 'zustand'
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware'

export type Currency = 'EUR' | 'USD'
export type Density = 'comfortable' | 'compact'
export type Timezone = 'Europe/Paris' | 'UTC' | 'America/New_York'
export type SubscriptionPlan = 'free' | 'pro' | 'business'
export type SubscriptionStatus = 'inactive' | 'active' | 'past_due'

interface PreferencesState {
  displayName: string
  role: string
  timezone: Timezone
  currency: Currency
  density: Density
  emailNotifications: boolean
  pushNotifications: boolean
  weeklyDigest: boolean
  boardWipLimit: number
  defaultSprintDurationDays: number
  showStoryPoints: boolean
  subscriptionPlan: SubscriptionPlan
  subscriptionStatus: SubscriptionStatus
  setCurrency: (currency: Currency) => void
  setDensity: (density: Density) => void
  setDisplayProfile: (payload: { displayName: string; role: string; timezone: Timezone }) => void
  setNotifications: (payload: { email: boolean; push: boolean; digest: boolean }) => void
  setBoardWipLimit: (limit: number) => void
  setSprintDuration: (days: number) => void
  toggleShowStoryPoints: () => void
  setSubscriptionPlan: (plan: SubscriptionPlan) => void
  setSubscriptionStatus: (status: SubscriptionStatus) => void
  compactMode: () => boolean
}

type PreferencesPersistedState = Pick<
  PreferencesState,
  | 'displayName'
  | 'role'
  | 'timezone'
  | 'currency'
  | 'density'
  | 'emailNotifications'
  | 'pushNotifications'
  | 'weeklyDigest'
  | 'boardWipLimit'
  | 'defaultSprintDurationDays'
  | 'showStoryPoints'
  | 'subscriptionPlan'
  | 'subscriptionStatus'
>

const memoryStorage = (): StateStorage => {
  let storage = new Map<string, string>()

  return {
    getItem: (name) => storage.get(name) ?? null,
    setItem: (name, value) => {
      storage.set(name, value)
    },
    removeItem: (name) => {
      storage.delete(name)
    },
  }
}

const getStorage = (): StateStorage => {
  if (typeof window !== 'undefined' && typeof window.localStorage?.setItem === 'function') {
    return window.localStorage
  }
  return memoryStorage()
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set, get) => ({
      displayName: '',
      role: 'Product Manager',
      timezone: 'Europe/Paris',
      currency: 'EUR',
      density: 'comfortable',
      emailNotifications: true,
      pushNotifications: true,
      weeklyDigest: true,
      boardWipLimit: 5,
      defaultSprintDurationDays: 14,
      showStoryPoints: true,
      subscriptionPlan: 'free',
      subscriptionStatus: 'inactive',
      setCurrency: (currency) => set({ currency }),
      setDensity: (density) => set({ density }),
      setDisplayProfile: (payload) =>
        set({
          displayName: payload.displayName,
          role: payload.role,
          timezone: payload.timezone,
        }),
      setNotifications: (payload) =>
        set({
          emailNotifications: payload.email,
          pushNotifications: payload.push,
          weeklyDigest: payload.digest,
        }),
      setBoardWipLimit: (limit) => set({ boardWipLimit: Math.max(1, Math.min(limit, 20)) }),
      setSprintDuration: (days) => set({ defaultSprintDurationDays: Math.max(7, Math.min(days, 30)) }),
      toggleShowStoryPoints: () => set((state) => ({ showStoryPoints: !state.showStoryPoints })),
      setSubscriptionPlan: (plan) => set({ subscriptionPlan: plan }),
      setSubscriptionStatus: (status) => set({ subscriptionStatus: status }),
      compactMode: () => get().density === 'compact',
    }),
    {
      name: 'saas-preferences',
      storage: createJSONStorage(getStorage),
      version: 2,
      partialize: (state): PreferencesPersistedState => ({
        displayName: state.displayName,
        role: state.role,
        timezone: state.timezone,
        currency: state.currency,
        density: state.density,
        emailNotifications: state.emailNotifications,
        pushNotifications: state.pushNotifications,
        weeklyDigest: state.weeklyDigest,
        boardWipLimit: state.boardWipLimit,
        defaultSprintDurationDays: state.defaultSprintDurationDays,
        showStoryPoints: state.showStoryPoints,
        subscriptionPlan: state.subscriptionPlan,
        subscriptionStatus: state.subscriptionStatus,
      }),
      migrate: (persistedState) => {
        const source = persistedState as Partial<PreferencesPersistedState> | undefined

        return {
          displayName: source?.displayName ?? '',
          role: source?.role ?? 'Product Manager',
          timezone: source?.timezone ?? 'Europe/Paris',
          currency: source?.currency ?? 'EUR',
          density: source?.density === 'compact' ? 'compact' : 'comfortable',
          emailNotifications: source?.emailNotifications ?? true,
          pushNotifications: source?.pushNotifications ?? true,
          weeklyDigest: source?.weeklyDigest ?? true,
          boardWipLimit: Math.max(1, Math.min(source?.boardWipLimit ?? 5, 20)),
          defaultSprintDurationDays: Math.max(7, Math.min(source?.defaultSprintDurationDays ?? 14, 30)),
          showStoryPoints: source?.showStoryPoints ?? true,
          subscriptionPlan:
            source?.subscriptionPlan === 'pro' || source?.subscriptionPlan === 'business' ? source.subscriptionPlan : 'free',
          subscriptionStatus:
            source?.subscriptionStatus === 'active' || source?.subscriptionStatus === 'past_due'
              ? source.subscriptionStatus
              : 'inactive',
        }
      },
    },
  ),
)
