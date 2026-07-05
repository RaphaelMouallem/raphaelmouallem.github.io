import { create } from 'zustand'

export const useSceneStore = create((set) => ({
  scrollDepth: 0,
  cameraMode: 'room',
  currentSection: 'intro',
  roomLocked: false,
  scrollEl: null,
  setScrollDepth: (v) => set({ scrollDepth: v }),
  setCameraMode: (m) => set({ cameraMode: m }),
  setCurrentSection: (s) => set({ currentSection: s }),
  setRoomLocked: (v) => set({ roomLocked: v }),
}))
