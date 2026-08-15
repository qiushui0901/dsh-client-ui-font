/** `settings.font` namespace dictionaries (the Font row's copy). */

/** Simplified Chinese dictionary (the key-set source of truth). */
export const zh = {
  'font.title': '字体',
  'font.style.system': '系统默认',
  'font.style.sans': '无衬线',
  'font.style.serif': '衬线',
  'font.style.mono': '等宽',
  'font.style.rounded': '圆体',
  'font.style.songti': '宋体',
  'font.style.heiti': '黑体',
  'font.style.kaiti': '楷体',
  'font.style.fangsong': '仿宋',
  'font.style.arial': 'Arial',
  'font.style.georgia': 'Georgia',
  'font.style.courier': 'Courier',
  'font.style.jetbrains': 'JetBrains Mono',
  'font.sizeLabel': '字号',
  'font.sizeUnit': 'px',
} satisfies Record<string, string>

/** The settings.font namespace key union. */
export type FontKey = keyof typeof zh

/** English dictionary, checked complete against the zh key set. */
export const en = {
  'font.title': 'Font',
  'font.style.system': 'System',
  'font.style.sans': 'Sans-serif',
  'font.style.serif': 'Serif',
  'font.style.mono': 'Monospace',
  'font.style.rounded': 'Rounded',
  'font.style.songti': 'Songti',
  'font.style.heiti': 'Heiti',
  'font.style.kaiti': 'Kaiti',
  'font.style.fangsong': 'FangSong',
  'font.style.arial': 'Arial',
  'font.style.georgia': 'Georgia',
  'font.style.courier': 'Courier',
  'font.style.jetbrains': 'JetBrains Mono',
  'font.sizeLabel': 'Font size',
  'font.sizeUnit': 'px',
} satisfies Record<FontKey, string>
