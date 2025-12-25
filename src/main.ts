import { Editor, EditorRange, Plugin } from "obsidian";
import { Notice } from "obsidian";
// 引入设置相关的定义（虽然我们还没改 settings.ts，但先留着不报错）
import {
	DEFAULT_SETTINGS,
	SmartSelectSettings,
	SmartSelectSettingTap,
} from "./setting";
import {
	expandSelection,
	shrinkSelection,
	selectPre,
	selectNext,
} from "./selection/index";
import { AIService } from "./ai/index";

export default class SmartSelectPlugin extends Plugin {
	aiAssistant!: AIService;
	settings!: SmartSelectSettings;
	selectionHistory: EditorRange[] = [];
	lastSelectionSnap: string = "";
	// 插件加载时执行（相当于游戏的“开始游戏”）
	async onload() {
		await this.loadSettings();
		await this.loadAi();
		// --- 我们的代码将写在这里 ---
		new Notice("Successfully loding");

		// 添加设置页（暂时留着）
		this.addSettingTab(new SmartSelectSettingTap(this.app, this));

		// 添加功能
		this.addCommand({
			id: "expand_selection",
			name: "Expand selection",
			editorCallback: (editor: Editor) => {
				expandSelection(editor, this);
			},
		});
		this.addCommand({
			id: "shrink_selection",
			name: "Shrink selection",
			editorCallback: (editor: Editor) => {
				shrinkSelection(editor, this);
			},
		});
		this.addCommand({
			id: "select_pre",
			name: "Select pre",
			editorCallback: (editor) => {
				selectPre(editor, this);
			},
		});
		this.addCommand({
			id: "select_next",
			name: "Select next",
			editorCallback: (editor) => {
				selectNext(editor, this);
			},
		});
		this.addCommand({
			id: "translator",
			name: "Translator",
			editorCallback: async (editor) => {
				const selection = await this.aiAssistant.askAI(
					editor.getSelection()
				);
				new Notice(selection);
			},
		});
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
			(await this.loadData()) as SmartSelectSettings
		);
	}
	async loadAi() {
		this.aiAssistant = new AIService(this);
	}

	// 保存设置
	async saveSettings() {
		await this.saveData(this.settings);
	}
}
