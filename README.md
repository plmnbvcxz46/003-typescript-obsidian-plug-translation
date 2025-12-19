# Obsidian 示例插件

这是一个 Obsidian (https://obsidian.md) 的示例插件。

本项目使用 TypeScript 提供类型检查和文档支持。
仓库依赖于最新的 TypeScript 定义格式的 Obsidian API (obsidian.d.ts)，其中包含描述其功能的 TSDoc 注释。

此示例插件展示了插件 API 的一些基本功能：

-   添加功能栏图标，点击时显示通知。
-   添加“打开模态框（简单）”命令，打开一个模态框。
-   在设置页面添加插件设置选项卡。
-   注册全局点击事件并在控制台输出 'click'。
-   注册全局定时器并在控制台记录 'setInterval'。

## 第一次开发插件？

新插件开发者的快速入门指南：

-   检查是否[已经有人开发了你想要的功能](https://obsidian.md/plugins)！可能已经存在类似的插件，你可以参与合作。
-   使用“Use this template”按钮复制此仓库作为模板。
-   将仓库克隆到本地开发文件夹。为了方便，你可以将此文件夹放在 `.obsidian/plugins/your-plugin-name` 路径下。
-   安装 NodeJS，然后在仓库文件夹下运行 `npm i`。
-   运行 `npm run dev` 将插件从 `main.ts` 编译为 `main.js`。
-   修改 `main.ts`（或创建新的 `.ts` 文件）。这些更改将自动编译到 `main.js` 中。
-   重新加载 Obsidian 以加载新版本的插件。
-   在设置窗口中启用插件。
-   如需更新 Obsidian API，请在仓库文件夹下运行 `npm update`。

## 发布新版本

-   更新 `manifest.json` 中的版本号（如 `1.0.1`）以及该版本所需的最低 Obsidian 版本。
-   更新 `versions.json` 文件，映射“插件版本”: “最低 Obsidian 版本”，以便旧版 Obsidian 可以下载兼容的旧版插件。
-   使用与 `manifest.json` 中完全一致的版本号创建新的 GitHub Release。不要包含前缀 `v`。
-   将 `manifest.json`、`main.js`、`styles.css` 作为二进制附件上传。注意：`manifest.json` 必须同时存在于仓库根目录和 Release 附件中。
-   发布 Release。

> 你可以通过在手动更新 `manifest.json` 中的 `minAppVersion` 后运行 `npm version patch`、`npm version minor` 或 `npm version major` 来简化版本升级过程。该命令会更新 `manifest.json` 和 `package.json` 中的版本，并向 `versions.json` 添加新条目。

## 将插件添加到社区插件列表

-   查看[插件指南](https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines)。
-   发布初始版本。
-   确保仓库根目录有 `README.md` 文件。
-   在 https://github.com/obsidianmd/obsidian-releases 提交 Pull Request 以添加你的插件。

## 如何使用

-   克隆此仓库。
-   确保 NodeJS 版本至少为 v16 (`node --version`)。
-   运行 `npm i` 安装依赖。
-   运行 `npm run dev` 启动监听模式下的编译。

## 手动安装插件

-   将 `main.js`、`styles.css`、`manifest.json` 复制到你的库文件夹 `<VaultFolder>/.obsidian/plugins/<your-plugin-id>/`。

## 使用 eslint 提高代码质量

-   [ESLint](https://eslint.org/) 是一个分析代码以快速发现问题的工具。
-   本项目已预配置 eslint，运行 `npm run lint` 即可执行检查。
-   结合针对 Obsidan 特定代码规范的自定义 eslint [插件](https://github.com/eslint-plugin)。
-   已预配置 GitHub 操作，以便在所有分支上自动检查每次提交的代码。

## 赞助 URL

你可以在 `manifest.json` 中包含赞助链接。

```json
{
	"fundingUrl": "https://buymeacoffee.com"
}
```

如果你有多个链接，也可以这样做：

```json
{
	"fundingUrl": {
		"Buy Me a Coffee": "https://buymeacoffee.com",
		"GitHub Sponsor": "https://github.com/sponsors",
		"Patreon": "https://www.patreon.com/"
	}
}
```

## API 文档

详见 https://docs.obsidian.md
