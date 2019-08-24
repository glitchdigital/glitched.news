import React from "react"
import Router from 'next/router'
import { withRouter } from 'next/router'
import { I18n } from "@lingui/react"
import { t } from "@lingui/macro"
import 'isomorphic-unfetch'

import { localeNames } from '../locales'

class Locale extends React.Component {
  constructor(props) {
    super(props)
    this.state = { locale: null }
    this.onSetLocale = this.onSetLocale.bind(this)
  }
  
  async componentDidMount() {
    this.setState({ locale: document.documentElement.lang })
  }

  async onSetLocale(e) {
    e.preventDefault()

    // Get locale from element
    const locale = e.target.getAttribute('data-locale')

    // Fetch locale catalog from server
    const server = `${window.location.protocol}//${window.location.host}`
    const request = await fetch(`${server}/api/locale?locale=${locale}`)
    const i18nCatalog = await request.json()

    // Load new locale catalog from API by running it with eval()
    eval(i18nCatalog.i18nCatalog)

    // Call Router.push() to update the app state to apply
    // changes and have the new locale take effect
    let router = this.props.router
    router.query.locale = locale
    Router.push({ 
      pathname: router.pathname,
      query: router.query
    })

    // Update the HTML lang attribute on the DOM and window variable
    document.documentElement.lang = locale
    this.setState({ locale })
  }

  render() {
    let { locale } = this.state

    return (
      <I18n>
        {({ i18n }) => (
          <p className="locales">
            <span>{locale}</span>
            {Object.keys(localeNames).map((l, i) =>
              <a href={`https://${l}.glitched.news`}
              onClick={this.onSetLocale}
              data-locale={l} key={`locale-${l}`} className={`locale ${((locale) ? l === locale : l === i18n._(t('_locale')`en`)) ? 'locale--active' : ''}`}>
                  {localeNames[l]}
              </a>
            )}
          </p>
        )}
      </I18n>
    )
  }
}

export default withRouter(Locale)