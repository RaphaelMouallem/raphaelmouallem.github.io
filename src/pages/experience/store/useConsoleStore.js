import { create } from 'zustand'

export const useConsoleStore = create((set) => ({
  overrides: {},
  setOverride: (path, value) =>
    set((s) => {
      const next = structuredClone(s.overrides)
      const keys = path.split('.')
      let cur = next
      for (let i = 0; i < keys.length - 1; i++) {
        if (!cur[keys[i]]) cur[keys[i]] = {}
        cur = cur[keys[i]]
      }
      cur[keys.at(-1)] = value
      return { overrides: next }
    }),
  resetOverrides: () => set({ overrides: {} }),
}))
