/** Host registration for the browser font preference. */

import type { Context } from '@deepseek-ai/cordis'
import { settingsNamespace } from '@deepseek-ai/dsh-settings'
import { FONT_SETTINGS_NAMESPACE, FontSettingsSchema } from './font-settings.ts'

export {
  DEFAULT_FONT_SIZE, DEFAULT_FONT_STYLE, FONT_SETTINGS_NAMESPACE, FONT_SIZE_FIELD,
  FONT_STYLE_FIELD, FONT_STYLES, MAX_FONT_SIZE, MIN_FONT_SIZE,
  type FontSettings, type FontSize, type FontStyle,
} from './font-settings.ts'

/**
 * Register the durable font section when a settings provider exists.
 * @param ctx - Host context whose optional settings service owns the section.
 */
export function apply(ctx: Context): void {
  ctx.inject(['settings'], (settingsCtx) => {
    settingsCtx.settings.register(
      settingsNamespace(FONT_SETTINGS_NAMESPACE),
      FontSettingsSchema,
    )
  })
}
