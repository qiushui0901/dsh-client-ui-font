/**
 * Font row slot store: a mirror of the persisted font section. The plugin's
 * apply-world settings listener is the only writer; the row component reads
 * via props.useStore.
 */
import { defineStore, type EngineStoreHandle } from '@deepseek-ai/dsh-client-runtime/client'
import { DEFAULT_FONT_SIZE, type FontSize, type FontStyle } from '../font-settings.ts'

/** Store state mirrored from the font section. */
export interface FontRowState {
  /** Active font style id. */
  style: FontStyle
  /** Active base font size in px. */
  size: FontSize
  /** Service revision; -1 until first sync so revision 0 lands as a change. */
  revision: number
}

/** Declared action shape giving the exported factory a stable return type. */
type FontRowActions = {
  sync: (draft: FontRowState, style: FontStyle, size: FontSize, revision: number) => void
}

/**
 * Declares the Font row state and write surface.
 * @returns the store handle.
 */
export function createFontRowStore(): EngineStoreHandle<FontRowState, FontRowActions> {
  return defineStore({
    init: (): FontRowState => ({ style: 'system', size: DEFAULT_FONT_SIZE, revision: -1 }),
    actions: {
      sync: (d, style: FontStyle, size: FontSize, revision: number) => {
        if (revision <= d.revision) return
        d.style = style
        d.size = size
        d.revision = revision
      },
    },
  })
}
