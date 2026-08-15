/**
 * Browser font plugin: persists a font style/size preference through the Host
 * settings scope, applies it through the theme-token override layer plus the
 * hardcoded-px global patch, and registers the Font row into the settings
 * General section — the font feature owns its own settings surface.
 */
import type { BoundActions } from '@deepseek-ai/dsh-client-ui-slots'
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
// Type-only: the ctx.settingsScope Context merge. Cross-plugin collaboration
// goes through the service, never a value import (client bundle purity gate).
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
// Type-only: pulls the locale plugin's Context merge (ctx.locale).
import type {} from '@deepseek-ai/dsh-client-locale/client'
// Type-only: pulls the theme plugin's Context merge (ctx.theme) and token types.
import type {} from '@deepseek-ai/dsh-client-ui-theme/client'
import {
  DEFAULT_FONT_SIZE, DEFAULT_FONT_STYLE, FONT_SETTINGS_NAMESPACE, FONT_SIZE_FIELD,
  FONT_STYLE_FIELD, type FontSettings, type FontSize, type FontStyle,
} from '../font-settings.ts'
import { FontRow, type FontRowInjected } from './FontRow.tsx'
import { createFontRowStore } from './settings-store.ts'
import { en, zh, type FontKey } from './locales.ts'
import { buildTokenOverrides } from './tokens.ts'
import { injectHardcodedFontPatch } from './global-style.ts'

export type { FontRowComponentProps, FontRowInjected } from './FontRow.tsx'
export type { FontRowState } from './settings-store.ts'
export type { FontKey } from './locales.ts'
export type { FontSettings, FontSize, FontStyle } from '../font-settings.ts'

/** Namespace owning this feature's settings-row copy. */
export const SETTINGS_NS = 'settings.font'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** The Font settings row's copy. */
    'settings.font': FontKey
  }
}

/**
 * Required services: slot registration, locale copy, the settings transport,
 * and the theme override layer.
 */
export const inject = ['slots', 'locale', 'connection', 'remote', 'settingsScope', 'theme']

/**
 * Client plugin body: persist font preferences and register the feature-owned
 * Font preference row into the General section's item slot.
 * @param ctx - client cordis context.
 */
export function apply(ctx: ClientContext): void {
  const host = ctx.settingsScope.bind<FontSettings>({ namespace: FONT_SETTINGS_NAMESPACE })
  ctx.effect(() => ctx.locale.register(SETTINGS_NS, { zh, en }), 'ui-font: settings row dictionaries')

  const store = createFontRowStore()
  // Before the row is registered the store has no consumer; a no-op keeps the
  // apply path branch-free and still lets the row's inject replace it later.
  const noopActions: BoundActions<typeof store> = { sync: () => {} }
  let bound: BoundActions<typeof store> = noopActions
  let removeOverrides: (() => void) | undefined
  let removePatch: (() => void) | undefined
  let currentStyle: FontStyle = DEFAULT_FONT_STYLE
  let currentSize: FontSize = DEFAULT_FONT_SIZE
  let applyRevision = 0

  const applyFont = (nextStyle?: FontStyle, nextSize?: FontSize): void => {
    const value = host.getSnapshot().value ?? {}
    currentStyle = nextStyle ?? value.style ?? DEFAULT_FONT_STYLE
    currentSize = nextSize ?? value.size ?? DEFAULT_FONT_SIZE

    removeOverrides?.()
    removePatch?.()
    removeOverrides = ctx.theme.overrideTokens('ui-font', buildTokenOverrides(currentStyle, currentSize))
    removePatch = injectHardcodedFontPatch(currentStyle, currentSize)

    applyRevision += 1
    bound.sync(currentStyle, currentSize, applyRevision)
  }

  ctx.effect(() => host.subscribe(() => { applyFont() }), 'ui-font: settings scope adoption')

  ctx.effect(() => {
    applyFont()
    return () => {
      removeOverrides?.()
      removePatch?.()
      removeOverrides = undefined
      removePatch = undefined
    }
  }, 'ui-font: apply layer')

  const injected = (actions: BoundActions<typeof store>): FontRowInjected => {
    bound = actions
    actions.sync(currentStyle, currentSize, applyRevision)
    return {
      setStyle: (next) => {
        applyFont(next, currentSize)
        void host.set(FONT_STYLE_FIELD, next)
      },
      setSize: (next) => {
        applyFont(currentStyle, next)
        void host.set(FONT_SIZE_FIELD, next)
      },
    }
  }

  ctx.slots.inject('settings.general.item', () => ctx.slots.register({
    name: 'settings.general.item',
    id: 'font',
    order: 20,
    store,
    locale: SETTINGS_NS,
    inject: injected,
  }, FontRow))
}
