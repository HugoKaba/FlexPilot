import { create } from 'zustand'
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware'

export type ThemeMode = 'light' | 'dark' | 'system'

interface ThemeState {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  resolvedTheme: () => 'light' | 'dark'
}

const getInitialResolvedTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') {
    return 'light'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const memoryStorage = (): StateStorage => {
  const cache = new Map<string, string>()
  return {
    getItem: (key) => cache.get(key) ?? null,
    setItem: (key, value) => {
      cache.set(key, value)
    },
    removeItem: (key) => {
      cache.delete(key)
    },
  }
}

const getStorage = (): StateStorage => {
  if (typeof window !== 'undefined' && typeof window.localStorage?.setItem === 'function') {
    return window.localStorage
  }
  return memoryStorage()
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'system',
      setMode: (mode) => set({ mode }),
      resolvedTheme: () => {
        const currentMode = get().mode
        if (currentMode === 'system') {
          return getInitialResolvedTheme()
        }
        return currentMode
      },
    }),
    {
      name: 'saas-theme',
      storage: createJSONStorage(getStorage),
    },
  ),
)
