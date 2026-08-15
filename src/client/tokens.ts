/**
 * Build the theme-token override layer for a font style/base-size selection.
 * The layer covers the two family roots and every `--dsw-font-*` composite
 * token from `ui-theme`'s gradient-shadow-text sheet; the same source layer
 * is replaced whenever the user changes a preference.
 */
import type { ThemeTokenOverrides } from '@deepseek-ai/dsh-client-ui-theme/client'
import { DEFAULT_FONT_SIZE, type FontSize, type FontStyle } from '../font-settings.ts'

/** Font family stacks for each selectable style. */
export const FONT_FAMILIES: Record<FontStyle, string> = {
  system: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC',\n    'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  sans: "'Inter', 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  serif: "Georgia, 'Times New Roman', 'Songti SC', 'SimSun', serif",
  mono: "'SF Mono', 'JetBrains Mono', 'Fira Code', Consolas, 'Liberation Mono', Menlo, Courier, monospace",
  rounded: "'Hiragino Maru Gothic ProN', 'Yuanti SC', 'YouYuan', '幼圆', 'PingFang SC', sans-serif",
  songti: "'Songti SC', 'SimSun', 'NSimSun', serif",
  heiti: "'Heiti SC', 'SimHei', 'Microsoft YaHei', sans-serif",
  kaiti: "'Kaiti SC', 'KaiTi', 'STKaiti', serif",
  fangsong: "'FangSong', 'FangSong_GB2312', 'STFangsong', serif",
  arial: "Arial, 'Helvetica Neue', Helvetica, sans-serif",
  georgia: "Georgia, 'Times New Roman', serif",
  courier: "'Courier New', Courier, monospace",
  jetbrains: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
}

/** One composite typography token from ui-theme's gradient-shadow-text sheet. */
interface FontToken {
  /** CSS variable name (the composite shorthand). */
  name: string
  /** Base font size in px. */
  size: number
  /** Base line height in px. */
  line: number
  /** Font weight, or 0 when the token has no explicit weight. */
  weight: number
  /** Whether the token uses the code font family root. */
  code: boolean
}

/** Composite `--dsw-font-*` tokens currently shipped by ui-theme. */
const FONT_TOKENS: readonly FontToken[] = [
  { name: '--dsw-font-markdown-h1', size: 24, line: 34, weight: 700, code: false },
  { name: '--dsw-font-markdown-h2', size: 22, line: 32, weight: 700, code: false },
  { name: '--dsw-font-markdown-h3', size: 20, line: 30, weight: 700, code: false },
  { name: '--dsw-font-markdown-h4', size: 16, line: 28, weight: 600, code: false },
  { name: '--dsw-font-markdown-base', size: 16, line: 28, weight: 0, code: false },
  { name: '--dsw-font-markdown-base-strong', size: 16, line: 28, weight: 600, code: false },
  { name: '--dsw-font-markdown-table', size: 15, line: 25, weight: 0, code: false },
  { name: '--dsw-font-markdown-table-head', size: 15, line: 25, weight: 500, code: false },
  { name: '--dsw-font-markdown-small', size: 14, line: 24, weight: 0, code: false },
  { name: '--dsw-font-markdown-small-strong', size: 14, line: 24, weight: 600, code: false },
  { name: '--dsw-font-markdown-code', size: 14, line: 22, weight: 0, code: true },
  { name: '--dsw-font-markdown-code-block', size: 13, line: 22, weight: 0, code: true },
  { name: '--dsw-font-markdown-code-block-small', size: 12, line: 18, weight: 0, code: true },
  { name: '--dsw-font-xl-24', size: 24, line: 32, weight: 600, code: false },
  { name: '--dsw-font-l-20', size: 20, line: 28, weight: 500, code: false },
  { name: '--dsw-font-m-18', size: 16, line: 28, weight: 500, code: false },
  { name: '--dsw-font-base-16', size: 16, line: 24, weight: 0, code: false },
  { name: '--dsw-font-base-strong-16', size: 16, line: 24, weight: 500, code: false },
  { name: '--dsw-font-s-14', size: 14, line: 22, weight: 0, code: false },
  { name: '--dsw-font-s-strong-14', size: 14, line: 22, weight: 500, code: false },
  { name: '--dsw-font-xs-13', size: 13, line: 20, weight: 0, code: false },
  { name: '--dsw-font-xs-strong-13', size: 13, line: 20, weight: 500, code: false },
  { name: '--dsw-font-xxs-12', size: 12, line: 18, weight: 0, code: false },
  { name: '--dsw-font-xxs-strong-12', size: 12, line: 18, weight: 500, code: false },
  { name: '--dsw-font-xxxs-11', size: 11, line: 14, weight: 0, code: false },
  { name: '--dsw-font-xxxs-strong-11', size: 11, line: 14, weight: 500, code: false },
]

/** Build one scheme-invariant token value pair. */
function pair(value: string): { light: string; dark: string } {
  return { light: value, dark: value }
}

/**
 * Compute the scale factor for a selected base font size relative to the
 * built-in 14px base.
 * @param size - selected base font size in px.
 * @returns scale factor applied to every `--dsw-font-*` token.
 */
export function fontScale(size: FontSize): number {
  return size / DEFAULT_FONT_SIZE
}

/**
 * Build the full token override layer for a font preference.
 * @param style - selected font family style.
 * @param size - selected base font size in px.
 * @returns theme token overrides for `ctx.theme.overrideTokens`.
 */
export function buildTokenOverrides(style: FontStyle, size: FontSize): ThemeTokenOverrides {
  const overrides: ThemeTokenOverrides = {
    '--dsw-font-family': pair(FONT_FAMILIES[style]),
    '--ds-font-family-code': pair(FONT_FAMILIES[style]),
  }
  const scale = fontScale(size)
  for (const token of FONT_TOKENS) {
    const nextSize = Math.round(token.size * scale)
    const nextLine = Math.round(token.line * scale)
    const weight = token.weight === 0 ? '' : `${token.weight} `
    const family = token.code ? 'var(--ds-font-family-code)' : 'var(--dsw-font-family)'
    overrides[token.name] = pair(`${weight}${nextSize}px/${nextLine}px ${family}`)
    overrides[`${token.name}-font-size`] = pair(`${nextSize}px`)
    overrides[`${token.name}-line-height`] = pair(`${nextLine}px`)
  }
  return overrides
}
