import { useState } from 'react'
import { Modal, Tabs, TabPanel } from '@levin-the-doctor/simple-tailwind-ui'
import { Globe, Palette } from 'lucide-react'
import { ThemeSettings } from '../themes/ThemeSettings.jsx'
import { LanguagePicker } from '../i18n/LanguagePicker.jsx'
import { useT } from '../i18n/I18nProvider.jsx'

/**
 * One settings surface for all preferences. Driven by simple-tailwind-ui's
 * Modal + Tabs so it matches the rest of the design language. Sections are
 * easy to extend — drop a new TabPanel in alongside the existing ones.
 */
export function SettingsModal({ open, onClose }) {
  const t = useT()
  const [active, setActive] = useState('language')

  const tabs = [
    { id: 'language', label: t('settings.tab.language'), icon: Globe },
    { id: 'theme',    label: t('settings.tab.theme'),    icon: Palette },
  ]

  return (
    <Modal open={open} onClose={onClose} title={t('settings.title')} size="lg">
      <div className="pt-1">
        <Tabs items={tabs} activeId={active} onChange={setActive} size="sm" variant="subtle">
          <TabPanel id="language">
            <div className="pt-4">
              <SectionHeading title={t('settings.tab.language')} hint={t('settings.language.hint')} />
              <LanguagePicker />
            </div>
          </TabPanel>
          <TabPanel id="theme">
            <div className="pt-4">
              <SectionHeading title={t('settings.tab.theme')} hint={t('settings.theme.hint')} />
              <ThemeSettings />
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </Modal>
  )
}

function SectionHeading({ title, hint }) {
  return (
    <div className="mb-4">
      <div className="font-display italic text-2xl leading-none" style={{ color: 'var(--c-fg)' }}>
        {title}
      </div>
      <div className="font-mono text-[11px] uppercase tracking-[0.16em] mt-1.5" style={{ color: 'var(--c-fg-subtle)' }}>
        {hint}
      </div>
    </div>
  )
}
