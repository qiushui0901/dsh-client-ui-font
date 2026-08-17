# dsh-client-ui-font

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的 Web 客户端插件，在 **General** 设置中新增一个 **字体** 设置项：

- 13 种字体预设：系统默认、无衬线、衬线、等宽、圆体、宋体、黑体、楷体、仿宋、Arial、Georgia、Courier、JetBrains Mono
- 数字基准字号输入（px），默认 14，范围 10–28
- 即时生效，并持久化到 `$DSH_HOME/settings.yaml` 的 `ui-font` 命名空间

插件通过两层方式应用字体：

1. `ctx.theme.overrideTokens('ui-font', …)` 重新生成所有 `--dsw-font-*` token 和两个字体族根变量。
2. 一段全局 CSS 把字体族应用到 `body`，并用 `html { zoom }` 作为对仍然写死 `font-size` px 的组件的兜底。该补丁还会重新启用页面级滚动，避免放大后的界面被裁剪。

## 安装

> **注意：** DeepSeek Harness 目前仍是 pre-release，部分 `@deepseek-ai/*` 依赖还没有完整发布到 npm。因此这个仓库目前主要作为 **源码级插件** 使用：请放进 `deepseek-harness` 源码仓库中使用。

### 在 deepseek-harness 源码中使用

把本仓库的插件包复制到 monorepo 中：

```sh
cp -R src packages/client/ui-font/src
cp package.json packages/client/ui-font/package.json
cp tsconfig.json packages/client/ui-font/tsconfig.json
cp tsdown.config.ts packages/client/ui-font/tsdown.config.ts
```

然后注册到 web bundle：

- 在 `packages/bundle/web-app/package.json` 的 dependencies 中加入 `@deepseek-ai/dsh-client-ui-font`
- 在 `packages/bundle/web-app/cordis.patch.yml` 中加入：

```yaml
- id: ui-font
  name: '@deepseek-ai/dsh-client-ui-font'
```

- 在 `tsconfig.client.json` 的 references 中加入 `./packages/client/ui-font`
- 在 `tsconfig.base.json` 的 paths 中加入 `@deepseek-ai/dsh-client-ui-font`

最后构建客户端 bundle：

```sh
pnpm --filter @deepseek-ai/dsh-client-ui-font bundle
```

### 独立构建（等 DSH 相关包完整发布后）

```sh
pnpm install
pnpm build
```

构建产物：

- `lib/index.js` — Host 半区
- `lib/invariant.js` — invariant 伴生插件
- `lib/client.js` — DSH module-loader 格式的浏览器客户端 bundle
- `lib/types/` — TypeScript 类型声明

## 使用

插件加载后，打开 DSH Web → **设置 → General → 字体**：

- 从下拉框选择字体族
- 输入基准字号（px）

修改会立即生效，并保存到 DSH 用户设置文档。

## 开发

```sh
pnpm typecheck
pnpm bundle
```

源码结构：

- `src/index.ts` — Host 设置 schema 注册
- `src/client/index.ts` — 浏览器插件入口、设置行与应用逻辑
- `src/client/FontRow.tsx` — 设置行 UI
- `src/client/tokens.ts` — 字体族栈与 `--dsw-font-*` token 生成
- `src/client/global-style.ts` — 写死 px 组件的全局兜底样式

## License

[MIT](LICENSE)

[English](README.en.md)
