import { useMemo } from 'react'
import en from '../../i18n/en.json'

const locales = { en }

export function useContent(locale = 'en') {
  return useMemo(() => locales[locale] ?? locales.en, [locale])
}
