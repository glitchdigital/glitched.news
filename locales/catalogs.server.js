import en from "@lingui/loader!./en/messages.json"
import de from "@lingui/loader!./de/messages.json"

const catalogs = { en, de }

export default function getCatalog(locale) {
  return catalogs[locale] || en
}