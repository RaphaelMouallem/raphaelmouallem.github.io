import { create } from 'zustand'

export const useLoadingStore = create((set) => ({
  frames: 0,
  tick: () => set((s) => (s.frames < 90 ? { frames: s.frames + 1 } : {})),
}))
