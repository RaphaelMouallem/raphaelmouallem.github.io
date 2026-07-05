import { useMemo } from 'react'
import en from '../i18n/en.json'

const locales = { en }

/**
 * Returns the content for the given locale.
 * Defaults to 'en'. Falls back to 'en' if locale not found.
 *
 * Usage:
 *   const content = useContent()           // English
 *   const content = useContent('fr')       // French (when added)
 *
 *   content.about
 *   content.projects        // array
 *   content.site
 *   content.contact
 *   content.ocean
 */
export function useContent(locale = 'en') {
  return useMemo(() => locales[locale] ?? locales.en, [locale])
}
