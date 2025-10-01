'use client'

import s from './InfoPage.module.scss'

type Section = {
  title: string
  content: string
}

type TermsJson = {
  title: string
  intro: string
  sections: Record<string, Section>
  footer: string
}

export function TermsAndServices({ terms }: { terms: TermsJson }) {
  const { intro, sections, footer } = terms

  return (
    <div>
      {intro}
      <br />
      {Object.values(sections).map((sec, i) => (
        <div key={i}>
          <p className={s.point}>{sec.title}</p>
          {sec.content}
          <br />
        </div>
      ))}
      <div className={s.footer}>{footer}</div>
    </div>
  )
}
