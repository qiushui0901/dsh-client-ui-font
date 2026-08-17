# dsh-client-ui-font

A [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) web client plugin that adds a **Font** settings row in **General**:

- 13 font family presets: System, Sans-serif, Serif, Monospace, Rounded, Songti, Heiti, Kaiti, FangSong, Arial, Georgia, Courier, JetBrains Mono
- A numeric base font size input in px (default 14, range 10–28)
- Applies immediately, persists to `$DSH_HOME/settings.yaml` under the `ui-font` namespace

The plugin composes two layers:

1. `ctx.theme.overrideTokens('ui-font', …)` recomposes every `--dsw-font-*` token and the two font-family roots.
2. A global CSS patch applies the family to `body` and uses `html { zoom }` as a fallback for components that still hardcode `font-size` in px. The patch also re-enables page-level scrolling so an enlarged UI is not clipped.

## Install

> **Note:** DeepSeek Harness is still pre-release and some `@deepseek-ai/*` packages are not yet published to npm. This repository is therefore primarily a **source-level plugin**: use it inside a `deepseek-harness` checkout.

### Use inside a deepseek-harness checkout

Copy this repository's plugin package into the monorepo:

```sh
cp -R src packages/client/ui-font/src
cp package.json packages/client/ui-font/package.json
cp tsconfig.json packages/client/ui-font/tsconfig.json
cp tsdown.config.ts packages/client/ui-font/tsdown.config.ts
```

Then register it in the web bundle:

- Add `@deepseek-ai/dsh-client-ui-font` to `packages/bundle/web-app/package.json` dependencies.
- Add a row to `packages/bundle/web-app/cordis.patch.yml`:

```yaml
- id: ui-font
  name: '@deepseek-ai/dsh-client-ui-font'
```

- Add `./packages/client/ui-font` to `tsconfig.client.json` references and `@deepseek-ai/dsh-client-ui-font` to `tsconfig.base.json` paths.

Finally build the client bundle:

```sh
pnpm --filter @deepseek-ai/dsh-client-ui-font bundle
```

### Standalone build (when DSH packages become fully published)

```sh
pnpm install
pnpm build
```

This produces:

- `lib/index.js` — host half
- `lib/invariant.js` — invariant companion
- `lib/client.js` — browser client bundle in DSH module-loader format
- `lib/types/` — TypeScript declarations

## Usage

After the plugin is loaded, open DSH Web → **Settings → General → Font**:

- Choose a font family from the dropdown.
- Type a base font size in px.

Changes apply immediately and are saved to the DSH user settings document.

## Development

```sh
pnpm typecheck
pnpm bundle
```

The source lives in `src/`:

- `src/index.ts` — Host settings schema registration
- `src/client/index.ts` — browser plugin entry, settings row, and apply logic
- `src/client/FontRow.tsx` — settings row UI
- `src/client/tokens.ts` — font family stacks and `--dsw-font-*` token generation
- `src/client/global-style.ts` — hardcoded-px fallback stylesheet

## License

[MIT](LICENSE)

[中文](README.md)
