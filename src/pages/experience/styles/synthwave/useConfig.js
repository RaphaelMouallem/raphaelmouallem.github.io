import { night, day } from './config'
import { useStyleStore } from '../../store/useStyleStore'
import { useConsoleStore } from '../../store/useConsoleStore'

function deepMerge(base, overrides) {
  const result = { ...base }
  for (const key in overrides) {
    if (overrides[key] && typeof overrides[key] === 'object' && !Array.isArray(overrides[key])) {
      result[key] = deepMerge(base[key] ?? {}, overrides[key])
    } else {
      result[key] = overrides[key]
    }
  }
  return result
}

export function useConfig() {
  const isDark = useStyleStore((s) => s.isDark)
  const overrides = useConsoleStore((s) => s.overrides)
  const base = isDark ? night : day
  return deepMerge(base, overrides)
}
