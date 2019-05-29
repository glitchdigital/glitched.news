import { locales, defaultLocale } from '../locales'

export default function getCatalog(locale) {
  return (locales[locale]) ? locales[locale] : locales[defaultLocale]
}