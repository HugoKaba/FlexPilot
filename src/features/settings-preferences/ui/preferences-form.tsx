import { useState } from 'react'
import { usePreferencesStore, type Timezone } from '@/shared/model'
import { Button, Card, FieldInput, FieldSelect } from '@/shared/ui'

export const PreferencesForm = () => {
  const displayName = usePreferencesStore((state) => state.displayName)
  const role = usePreferencesStore((state) => state.role)
  const timezone = usePreferencesStore((state) => state.timezone)
  const currency = usePreferencesStore((state) => state.currency)
  const density = usePreferencesStore((state) => state.density)
  const emailNotifications = usePreferencesStore((state) => state.emailNotifications)
  const pushNotifications = usePreferencesStore((state) => state.pushNotifications)
  const weeklyDigest = usePreferencesStore((state) => state.weeklyDigest)
  const boardWipLimit = usePreferencesStore((state) => state.boardWipLimit)
  const defaultSprintDurationDays = usePreferencesStore((state) => state.defaultSprintDurationDays)
  const showStoryPoints = usePreferencesStore((state) => state.showStoryPoints)
  const setCurrency = usePreferencesStore((state) => state.setCurrency)
  const setDensity = usePreferencesStore((state) => state.setDensity)
  const setDisplayProfile = usePreferencesStore((state) => state.setDisplayProfile)
  const setNotifications = usePreferencesStore((state) => state.setNotifications)
  const setBoardWipLimit = usePreferencesStore((state) => state.setBoardWipLimit)
  const setSprintDuration = usePreferencesStore((state) => state.setSprintDuration)
  const toggleShowStoryPoints = usePreferencesStore((state) => state.toggleShowStoryPoints)
  const [activeTab, setActiveTab] = useState<'profile' | 'display' | 'delivery' | 'notifications'>('profile')

  return (
    <section className="settings-layout">
      <Card className="settings-tabs">
        <button className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`} type="button" onClick={() => setActiveTab('profile')}>
          Profil
        </button>
        <button className={`tab-btn ${activeTab === 'display' ? 'active' : ''}`} type="button" onClick={() => setActiveTab('display')}>
          Affichage
        </button>
        <button className={`tab-btn ${activeTab === 'delivery' ? 'active' : ''}`} type="button" onClick={() => setActiveTab('delivery')}>
          Delivery Rules
        </button>
        <button className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`} type="button" onClick={() => setActiveTab('notifications')}>
          Notifications
        </button>
      </Card>

      <Card className="settings-section">
        {activeTab === 'profile' ? (
          <>
            <h2>Profil</h2>
            <div className="grid-3">
              <label className="field">
                Nom affiché
                <FieldInput
                  type="text"
                  value={displayName}
                  onChange={(event) =>
                    setDisplayProfile({
                      displayName: event.target.value,
                      role,
                      timezone,
                    })
                  }
                />
              </label>

              <label className="field">
                Rôle
                <FieldInput
                  type="text"
                  value={role}
                  onChange={(event) =>
                    setDisplayProfile({
                      displayName,
                      role: event.target.value,
                      timezone,
                    })
                  }
                />
              </label>

              <label className="field">
                Timezone
                <FieldSelect
                  value={timezone}
                  onChange={(event) =>
                    setDisplayProfile({
                      displayName,
                      role,
                      timezone: event.target.value as Timezone,
                    })
                  }
                >
                  <option value="Europe/Paris">Europe/Paris</option>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">America/New_York</option>
                </FieldSelect>
              </label>
            </div>
          </>
        ) : null}

        {activeTab === 'display' ? (
          <>
            <h2>Affichage</h2>
            <div className="grid-3">
              <label className="field">
                Devise
                <FieldSelect value={currency} onChange={(event) => setCurrency(event.target.value as 'EUR' | 'USD')}>
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                </FieldSelect>
              </label>

              <label className="field">
                Densité
                <FieldSelect value={density} onChange={(event) => setDensity(event.target.value as 'comfortable' | 'compact')}>
                  <option value="comfortable">Comfortable</option>
                  <option value="compact">Compact</option>
                </FieldSelect>
              </label>

              <label className="field">
                Story points
                <FieldSelect value={showStoryPoints ? 'show' : 'hide'} onChange={() => toggleShowStoryPoints()}>
                  <option value="show">Afficher</option>
                  <option value="hide">Masquer</option>
                </FieldSelect>
              </label>
            </div>
          </>
        ) : null}

        {activeTab === 'delivery' ? (
          <>
            <h2>Delivery Rules</h2>
            <div className="grid-2">
              <label className="field">
                Limite WIP Board
                <FieldInput
                  type="number"
                  min={1}
                  max={20}
                  value={boardWipLimit}
                  onChange={(event) => setBoardWipLimit(Number(event.target.value))}
                />
              </label>

              <label className="field">
                Durée sprint par défaut (jours)
                <FieldInput
                  type="number"
                  min={7}
                  max={30}
                  value={defaultSprintDurationDays}
                  onChange={(event) => setSprintDuration(Number(event.target.value))}
                />
              </label>
            </div>
          </>
        ) : null}

        {activeTab === 'notifications' ? (
          <>
            <h2>Notifications</h2>
            <div className="settings-switches">
              <label className="switch-row">
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(event) =>
                    setNotifications({
                      email: event.target.checked,
                      push: pushNotifications,
                      digest: weeklyDigest,
                    })
                  }
                />
                Email notifications
              </label>

              <label className="switch-row">
                <input
                  type="checkbox"
                  checked={pushNotifications}
                  onChange={(event) =>
                    setNotifications({
                      email: emailNotifications,
                      push: event.target.checked,
                      digest: weeklyDigest,
                    })
                  }
                />
                Push notifications
              </label>

              <label className="switch-row">
                <input
                  type="checkbox"
                  checked={weeklyDigest}
                  onChange={(event) =>
                    setNotifications({
                      email: emailNotifications,
                      push: pushNotifications,
                      digest: event.target.checked,
                    })
                  }
                />
                Weekly digest
              </label>
            </div>

            <Button type="button" tone="primary" disabled>
              Préférences sauvegardées automatiquement
            </Button>
          </>
        ) : null}
      </Card>
    </section>
  )
}
