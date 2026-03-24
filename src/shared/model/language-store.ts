import { create } from 'zustand'
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware'

export type Language = 'fr' | 'en'

interface LanguageState {
  language: Language
  setLanguage: (language: Language) => void
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

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'fr',
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'saas-language',
      storage: createJSONStorage(getStorage),
    },
  ),
)
