'use client'

import { useLocale } from 'next-intl'
import { useEffect, useState } from 'react'

import s from './InfoPage.module.scss'

type Section = {
  title: string
  text?: string
  bullets?: string[]
}

type PolicyData = {
  sections: Section[]
}

export const PrivacyPolicy = () => {
  const locale = useLocale()
  const [policy, setPolicy] = useState<PolicyData | null>(null)

  useEffect(() => {
    import(`../../../locales/privacyPolicy.${locale}.json`)
      .then((mod) => setPolicy(mod as PolicyData))
      .catch(() => {
        import('../../../locales/privacyPolicy.en.json').then((mod) => setPolicy(mod as PolicyData))
      })
  }, [locale])

  if (!policy) return null

  return (
    <div>
      {policy.sections.map((section, i) => (
        <div key={i}>
          <p className={s.point}>{section.title}</p>

          {section.bullets?.length ? (
            section.bullets.map((item, idx) => {
              const emDashIndex = item.indexOf('—')
              const dashIndex = emDashIndex !== -1 ? emDashIndex : item.indexOf('-')

              const boldPart = dashIndex !== -1 ? item.slice(0, dashIndex).trim() : item.trim()
              const restPart = dashIndex !== -1 ? item.slice(dashIndex + 1).trim() : ''

              return (
                <p className={s.listItem} key={idx}>
                  <strong>{boldPart}</strong>
                  {restPart && <> — {restPart}</>}
                </p>
              )
            })
          ) : section.text ? (
            <p>{section.text}</p>
          ) : null}
        </div>
      ))}
    </div>
  )
}
