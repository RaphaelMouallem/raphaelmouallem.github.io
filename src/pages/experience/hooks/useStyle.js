import { useStyleStore } from '../store/useStyleStore'
import { STYLES } from '../styles'

export function useStyle() {
  const { activeStyle, isDark } = useStyleStore()
  const style = STYLES[activeStyle]
  const config = isDark ? style.night : style.day
  return {
    SceneWorld: style.World,
    Cards: style.Cards,
    ConfigPanel: style.ConfigPanel,
    LoadingScreen: style.LoadingScreen,
    config,
    sections: style.SECTIONS,
    theme: style.theme,
    onScrollUpdate: style.onScrollUpdate,
    getUnderwaterThreshold: style.getUnderwaterThreshold ?? null,
    isDark,
    activeStyle,
  }
}
