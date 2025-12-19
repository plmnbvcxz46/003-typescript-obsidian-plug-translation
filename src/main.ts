import { Editor, Plugin } from "obsidian";
// 引入设置相关的定义（虽然我们还没改 settings.ts，但先留着不报错）
import {
	DEFAULT_SETTINGS,
	MyPluginSettings,
	SampleSettingTab,
} from "./settings";

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	// 插件加载时执行（相当于游戏的“开始游戏”）
	async onload() {
		await this.loadSettings();

		// --- 我们的代码将写在这里 ---
		console.log("我的插件加载啦！");

		// 添加设置页（暂时留着）
		this.addSettingTab(new SampleSettingTab(this.app, this));
	}

	// 插件关闭时执行
	onunload() {
		// 暂时不用管
	}

	// 加载设置
	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	// 保存设置
	async saveSettings() {
		await this.saveData(this.settings);
	}
}
