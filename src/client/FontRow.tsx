/**
 * Font preference row registered into the General section item slot: title,
 * a font-style selector pill, and a numeric base-size input. Registered by
 * this package — the font feature owns its own settings surface.
 */
import { useEffect, useState } from 'react'
import type { PropsLocale, PropsRuntime, PropsStore } from '@deepseek-ai/dsh-client-ui-slots'
import { IconChevronDownOutline14, Menu } from '@deepseek-ai/dsh-client-ui-primitives'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import {
  FONT_STYLES, MAX_FONT_SIZE, MIN_FONT_SIZE, type FontSize, type FontStyle,
} from '../font-settings.ts'
import type { FontKey } from './locales.ts'
import type { createFontRowStore } from './settings-store.ts'
import css from './FontRow.module.css'

/** Injected business face: the preference writes (t rides the standard locale seat). */
export interface FontRowInjected {
  /** Switch the font family style. */
  setStyle: (style: FontStyle) => void
  /** Switch the base font size in px. */
  setSize: (size: FontSize) => void
}

/** Full component props: runtime share + store share + locale seat + injected face. */
export type FontRowComponentProps =
  PropsRuntime<'settings.general.item'> & PropsStore<ReturnType<typeof createFontRowStore>>
  & PropsLocale<'settings.font'> & FontRowInjected

const STYLE_OPTIONS = FONT_STYLES.map(id => ({ id, labelKey: `font.style.${id}` }))

/**
 * Render the Font row.
 * @param props - composed slot props.
 * @returns the row element tree.
 */
export function FontRow({ t, useStore, setStyle, setSize }: FontRowComponentProps) {
  const style = useStore(s => s.style)
  const size = useStore(s => s.size)
  const [openStyle, setOpenStyle] = useState(false)
  const [sizeDraft, setSizeDraft] = useState(String(size))

  useEffect(() => {
    setSizeDraft(String(size))
  }, [size])

  const commitSize = (value: string): void => {
    const next = Number(value)
    if (Number.isFinite(next) && next >= MIN_FONT_SIZE && next <= MAX_FONT_SIZE) {
      setSize(next)
    }
  }

  return (
    <div className={css.row}>
      <div className={css.rowText}>
        <div className={css.title}>{t('font.title')}</div>
      </div>
      <Menu
        open={openStyle}
        onClose={() => { setOpenStyle(false) }}
        items={STYLE_OPTIONS.map(o => ({ id: o.id, label: t(o.labelKey as FontKey) }))}
        selectedId={style}
        onSelect={(id) => {
          setStyle(id as FontStyle)
          setOpenStyle(false)
        }}
        align="end"
        portal
        anchor={(
          <button
            type="button"
            className={css.selector}
            aria-haspopup="menu"
            aria-expanded={openStyle}
            onClick={() => { setOpenStyle(v => !v) }}
          >
            {t(`font.style.${style}`)}
            <IconChevronDownOutline14 className={css.chevron} />
          </button>
        )}
      />
      <label className={css.sizeControl}>
        <span className={css.sizeLabel}>{t('font.sizeLabel')}</span>
        <input
          type="number"
          className={css.sizeInput}
          min={MIN_FONT_SIZE}
          max={MAX_FONT_SIZE}
          step={1}
          value={sizeDraft}
          onChange={(event) => {
            setSizeDraft(event.target.value)
            commitSize(event.target.value)
          }}
          onBlur={() => {
            const next = Number(sizeDraft)
            if (!Number.isFinite(next) || next < MIN_FONT_SIZE || next > MAX_FONT_SIZE) {
              setSizeDraft(String(size))
            }
          }}
        />
        <span className={css.sizeUnit}>{t('font.sizeUnit')}</span>
      </label>
    </div>
  )
}
