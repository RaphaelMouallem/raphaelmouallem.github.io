import { create } from 'zustand'
import { STYLE_NAMES } from '../styles'

const randomStyle = STYLE_NAMES[Math.floor(Math.random() * STYLE_NAMES.length)]

export const useStyleStore = create((set) => ({
  activeStyle: randomStyle,
  isDark: Math.random() > 0.5,
  setStyle: (name) => set({ activeStyle: name }),
  toggleDark: () => set((s) => ({ isDark: !s.isDark })),
  setDark: (v) => set({ isDark: v }),
}))
