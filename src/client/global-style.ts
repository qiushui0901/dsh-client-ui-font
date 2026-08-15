/**
 * Global CSS fallback for the font preference. Many feature CSS Modules
 * still hardcode `font-size` in px, so the theme-token layer alone cannot
 * resize them; this patch applies the family to `body` and uses `zoom` on
 * `html` as the pragmatic whole-surface scale. The patch is removed when the
 * plugin disposes or the user changes a preference.
 */
import { FONT_FAMILIES, fontScale } from './tokens.ts'
import type { FontSize, FontStyle } from '../font-settings.ts'

/** Data attribute used to identify this plugin's style node. */
export const FONT_PATCH_ATTRIBUTE = 'data-dsh-font-plugin'

/**
 * Inject the hardcoded-px fallback stylesheet.
 * @param style - selected font family style.
 * @param size - selected base font size in px.
 * @returns disposer removing the style node.
 */
export function injectHardcodedFontPatch(style: FontStyle, size: FontSize): () => void {
  const element = document.createElement('style')
  element.setAttribute(FONT_PATCH_ATTRIBUTE, 'ui-font')
  element.textContent = `
    body {
      font-family: ${FONT_FAMILIES[style]} !important;
    }
    body :where(button, input, textarea, select) {
      font-family: inherit !important;
    }
    html {
      zoom: ${fontScale(size)};
    }
  `
  document.head.appendChild(element)
  return () => { element.remove() }
}
