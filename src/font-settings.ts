/** Font preferences stored in the Host user-settings document. */

import z from '@deepseek-ai/schemastery'

/** Settings namespace owned by the font plugin. */
export const FONT_SETTINGS_NAMESPACE = 'ui-font'

/** Field carrying the selected font family style. */
export const FONT_STYLE_FIELD = 'style'

/** Field carrying the selected base font size in px. */
export const FONT_SIZE_FIELD = 'size'

/** Built-in font style choices. */
export const FONT_STYLES = [
  'system', 'sans', 'serif', 'mono', 'rounded', 'songti', 'heiti', 'kaiti',
  'fangsong', 'arial', 'georgia', 'courier', 'jetbrains',
] as const

/** Minimum selectable base font size in px. */
export const MIN_FONT_SIZE = 10

/** Maximum selectable base font size in px. */
export const MAX_FONT_SIZE = 28

/** Font style preference id. */
export type FontStyle = typeof FONT_STYLES[number]

/** Base font size in px. */
export type FontSize = number

/** Default font style when the user-settings document has no override. */
export const DEFAULT_FONT_STYLE: FontStyle = 'system'

/** Default base font size in px when the user-settings document has no override. */
export const DEFAULT_FONT_SIZE: FontSize = 14

/** Durable font section shared by the Host schema and the browser scope. */
export interface FontSettings {
  /** Selected font family style; absent means the built-in UI font. */
  style?: FontStyle
  /** Selected base font size in px; absent means the built-in UI size. */
  size?: FontSize
}

/** Durable font schema; also the wire envelope the browser scope validates against. */
export const FontSettingsSchema: z<FontSettings> = z.object({
  [FONT_STYLE_FIELD]: z.union([...FONT_STYLES]).required(false),
  [FONT_SIZE_FIELD]: z.number().min(MIN_FONT_SIZE).max(MAX_FONT_SIZE).required(false),
})

/**
 * Narrow one wire or registry value to a persistable font style.
 * @param value - value crossing the settings or registry boundary.
 * @returns whether the value is a built-in font style.
 */
export function isFontStyle(value: unknown): value is FontStyle {
  return FONT_STYLES.some(style => style === value)
}

/**
 * Narrow one wire or registry value to a persistable base font size.
 * @param value - value crossing the settings or registry boundary.
 * @returns whether the value is a supported base font size.
 */
export function isFontSize(value: unknown): value is FontSize {
  return typeof value === 'number'
    && Number.isFinite(value)
    && value >= MIN_FONT_SIZE
    && value <= MAX_FONT_SIZE
}
