import { describe, expect, it } from 'vitest'
import { usePreferencesStore } from '@/shared/model/preferences-store'

describe('preferences store', () => {
  it('met à jour la devise', () => {
    usePreferencesStore.setState({ currency: 'EUR', density: 'comfortable' })

    usePreferencesStore.getState().setCurrency('USD')

    expect(usePreferencesStore.getState().currency).toBe('USD')
  })

  it('calcule un derived state via sélecteur strict', () => {
    usePreferencesStore.setState({ currency: 'EUR', density: 'comfortable' })
    usePreferencesStore.getState().setDensity('compact')

    const densityLabel = usePreferencesStore.getState().compactMode() ? 'Compact' : 'Comfort'

    expect(densityLabel).toBe('Compact')
  })

  it('met à jour le plan et le statut d’abonnement', () => {
    usePreferencesStore.setState({ subscriptionPlan: 'free', subscriptionStatus: 'inactive' })

    usePreferencesStore.getState().setSubscriptionPlan('pro')
    usePreferencesStore.getState().setSubscriptionStatus('active')

    expect(usePreferencesStore.getState().subscriptionPlan).toBe('pro')
    expect(usePreferencesStore.getState().subscriptionStatus).toBe('active')
  })
})
