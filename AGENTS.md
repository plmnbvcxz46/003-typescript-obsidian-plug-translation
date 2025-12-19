# Obsidian 社区插件

## 项目概览

-   目标：Obsidian 社区插件（TypeScript → 捆绑后的 JavaScript）。
-   入口点：`main.ts` 编译为 `main.js` 并由 Obsidian 加载。
-   必需的发布产物：`main.js`、`manifest.json` 以及可选的 `styles.css`。

## 环境与工具

-   Node.js：使用当前 LTS 版本（推荐 Node 18+）。
-   **包管理器：npm**（本项目必需 - `package.json` 定义了脚本和依赖）。
-   **构建工具：esbuild**（本项目必需 - 依赖 `esbuild.config.mjs`）。
-   类型定义：`obsidian` 类型定义。

## Linting

-   使用 `eslint main.ts` 分析项目。
-   如果源码在文件夹中（如 `src`），使用 `eslint ./src/`。

## 文件与文件夹规范

-   **多文件组织代码**：将功能拆分到不同模块，不要全部写在 `main.ts` 中。
-   源码存放在 `src/`。保持 `main.ts` 精简，仅负责插件生命周期。
-   **示例文件结构**：
    ```
    src/
      main.ts           # 插件入口，生命周期管理
      settings.ts       # 设置接口与默认值
      commands/         # 命令实现
      ui/              # UI 组件、模态框、视图
      utils/           # 工具函数、常量
      types.ts         # TypeScript 接口与类型
    ```
-   **不要提交构建产物**：切勿将 `node_modules/` 或 `main.js` 提交到版本控制。
-   保持插件精简。避免引入大型依赖。优先选择与浏览器兼容的包。
-   生成的输出应放在插件根目录或 `dist/` 文件夹中，具体取决于构建设置。发布产物必须位于库中插件文件夹的顶层（`main.js`、`manifest.json`、`styles.css`）。

## 清单规则 (`manifest.json`)

-   必须包含（非详尽）：
    -   `id`（插件 ID；对于本地开发，应与文件夹名称匹配）
    -   `name`
    -   `version`（语义版本 `x.y.z`）
    -   `minAppVersion`
    -   `description`
    -   `isDesktopOnly`（布尔值）
    -   可选：`author`、`authorUrl`、`fundingUrl`（字符串或映射）
-   发布后切勿更改 `id`。将其视为稳定的 API。
-   使用新 API 时，保持 `minAppVersion` 的准确性。
-   规范要求已在此编码： https://github.com/obsidianmd/obsidian-releases/blob/master/.github/workflows/validate-plugin-entry.yml

## 测试

-   手动安装以进行测试：将 `main.js`、`manifest.json`、`styles.css`（如有）复制到：
    ```
    <Vault>/.obsidian/plugins/<plugin-id>/
    ```
-   重新加载 Obsidian 并在 **设置 → 社区插件** 中启用插件。

## 命令与设置

-   使用 `this.addCommand(...)` 添加用户面向的命令。
-   如果插件有配置，提供设置选项卡和合理的默认值。
-   使用 `this.loadData()` / `this.saveData()` 持久化设置。
-   使用稳定的命令 ID；发布后避免重命名。

## 版本控制与发布

-   在 `manifest.json` 中提升 `version`（语义化版本）并更新 `versions.json`，以映射插件版本与最低应用版本。
-   创建一个 GitHub 发布，其标签与 `manifest.json` 中的 `version` 完全匹配。不要使用前导 `v`。
-   将 `manifest.json`、`main.js` 和 `styles.css`（如有）作为单独的资产附加到发布中。
-   初始发布后，按照需要的过程添加/更新社区目录中的插件。

## 安全、隐私与合规

遵循 Obsidian 的 **开发者政策** 和 **插件指南**。特别是：

-   默认本地/离线运行。仅在必要时发起网络请求。
-   禁止隐藏遥测。如果收集分析数据，必须明确告知并要求用户选择加入（opt-in）。
-   严禁执行远程代码或 fetch 后 eval 脚本。
-   最小化权限：仅访问库内必要文件。
-   清楚披露所使用的外部服务、发送的数据和风险。
-   尊重用户隐私。除非绝对必要并明确获得同意，否则不收集库内容、文件名或个人信息。
-   避免欺骗性模式、广告或垃圾邮件通知。
-   使用提供的 `register*` 助手注册和清理所有 DOM、应用和间隔监听器，以便插件安全卸载。

## 用户体验与文案指南（针对 UI 文本、命令、设置）

-   标题、按钮和标题使用句子首字母大写。
-   使用清晰、面向操作的命令式语气。
-   使用 **粗体** 指示字面 UI 标签。交互时更喜欢使用 "select"。
-   导航使用箭头表示： **设置 → 社区插件**。
-   保持应用内字符串简短、一致且无行话。

## 性能

-   启动时保持轻量。推迟重型工作，直到需要时再执行。
-   避免在 `onload` 中执行长时间运行的任务；使用惰性初始化。
-   批量磁盘访问，避免过度扫描库。
-   在响应文件系统事件时，防抖/节流耗时操作。

## 编码规范

-   推荐使用 TypeScript 严格模式 (`"strict": true`)。
-   **保持 `main.ts` 最小化**：仅关注生命周期（onload, onunload）。
-   **拆分大文件**：如果文件超过 200-300 行，考虑拆分。
-   **使用清晰的模块边界**：每个文件应有单一、明确的职责。
-   将所有内容捆绑到 `main.js` 中（没有未捆绑的运行时依赖）。
-   如果希望兼容移动设备，避免使用 Node/Electron API；相应设置 `isDesktopOnly`。
-   优先使用 `async/await` 而非 Promise 链；优雅地处理错误。

## 移动端

-   尽可能在 iOS 和 Android 上测试。
-   除非 `isDesktopOnly` 为 `true`，否则不要假设仅限桌面的行为。
-   避免在内存中使用大型结构；注意内存和存储限制。

## Agent 做与不做

**要做 (Do)**

-   添加具有稳定 ID 的命令。
-   在设置中提供默认值和验证。
-   编写幂等代码路径，以便重新加载/卸载时不会泄漏监听器或间隔。
-   对所有需要清理的内容使用 `this.register*` 助手。

**不要做 (Don't)**

-   在没有明确理由的情况下引入网络调用。
-   在未披露的情况下使用云服务。
-   存储或传输库内容，除非是核心功能必需且已获授权。

## 常见任务

### 多文件组织代码示例

**main.ts**（最小化，仅生命周期）：

```ts
import { Plugin } from "obsidian";
import { MySettings, DEFAULT_SETTINGS } from "./settings";
import { registerCommands } from "./commands";

export default class MyPlugin extends Plugin {
	settings: MySettings;

	async onload() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
		registerCommands(this);
	}
}
```

**settings.ts**：

```ts
export interface MySettings {
	enabled: boolean;
	apiKey: string;
}

export const DEFAULT_SETTINGS: MySettings = {
	enabled: true,
	apiKey: "",
};
```

**commands/index.ts**：

```ts
import { Plugin } from "obsidian";
import { doSomething } from "./my-command";

export function registerCommands(plugin: Plugin) {
	plugin.addCommand({
		id: "do-something",
		name: "Do something",
		callback: () => doSomething(plugin),
	});
}
```

### 添加命令

```ts
this.addCommand({
	id: "your-command-id",
	name: "Do the thing",
	callback: () => this.doTheThing(),
});
```

### 持久化设置

```ts
interface MySettings { enabled: boolean }
const DEFAULT_SETTINGS: MySettings = { enabled: true };

async onload() {
  this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  await this.saveData(this.settings);
}
```

### 安全注册监听器

```ts
this.registerEvent(
	this.app.workspace.on("file-open", (f) => {
		/* ... */
	})
);
this.registerDomEvent(window, "resize", () => {
	/* ... */
});
this.registerInterval(
	window.setInterval(() => {
		/* ... */
	}, 1000)
);
```

## 疑难解答

-   插件在构建后不加载：确保 `main.js` 和 `manifest.json` 位于 `<Vault>/.obsidian/plugins/<plugin-id>/` 的插件文件夹顶层。
-   构建问题：如果缺少 `main.js`，请运行 `npm run build` 或 `npm run dev` 来编译 TypeScript 源代码。
-   命令未出现：验证 `addCommand` 是否在 `onload` 之后运行，且 ID 唯一。
-   设置未持久化：确保 `loadData`/`saveData` 已被等待，并且在更改后重新渲染 UI。
-   仅限移动的问题：确认未使用仅限桌面的 API；检查 `isDesktopOnly` 并进行调整。

## 参考文献

-   Obsidian 示例插件： https://github.com/obsidianmd/obsidian-sample-plugin
-   API 文档： https://docs.obsidian.md
-   开发者政策： https://docs.obsidian.md/Developer+policies
-   插件指南： https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines
-   风格指南： https://help.obsidian.md/style-guide
