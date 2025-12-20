import { Editor, EditorPosition, EditorRange, Plugin } from "obsidian";
import { Notice } from "obsidian";
// 引入设置相关的定义（虽然我们还没改 settings.ts，但先留着不报错）
import {
	DEFAULT_SETTINGS,
	SmartSelectSettings,
	SmartSelectSettingTap,
} from "./settings";

export default class SmartSelectPlugin extends Plugin {
	settings!: SmartSelectSettings;
	selectionHistory: EditorRange[] = [];
	// 插件加载时执行（相当于游戏的“开始游戏”）
	async onload() {
		await this.loadSettings();

		// --- 我们的代码将写在这里 ---
		new Notice("Successfully loding");

		// 添加设置页（暂时留着）
		this.addSettingTab(new SmartSelectSettingTap(this.app, this));

		// 添加功能
		this.addCommand({
			id: "expand_selection",
			name: "Expand selection",
			editorCallback: (editor: Editor) => {
				this.expandSelection(editor);
			},
		});
		this.addCommand({
			id: "shrink_selection",
			name: "Shrink selection",
			editorCallback: (editor: Editor) => {
				this.shrinkSelection(editor);
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

	// 保存设置
	async saveSettings() {
		await this.saveData(this.settings);
	}

	//获取选区

	// 选区
	expandSelection(editor: Editor) {
		const selection = editor.getSelection();
		const cursor = editor.getCursor();
		const wordRange = editor.wordAt(cursor);
		const sentenceRange = this.selectSentence(editor, cursor);
		const lineRange: EditorRange = {
			from: {
				line: cursor.line,
				ch: 0,
			},
			to: {
				line: cursor.line,
				ch: editor.getLine(cursor.line).length,
			},
		};
		if (!wordRange) {
			new Notice("No words");
		} else if (selection.length < wordRange.to.ch - wordRange.from.ch) {
			editor.setSelection(wordRange.from, wordRange.to);
			this.selectionHistory.push(wordRange);
		} else if (
			selection.length <
			sentenceRange.to.ch - sentenceRange.from.ch
		) {
			editor.setSelection(sentenceRange.from, sentenceRange.to);
			this.selectionHistory.push(sentenceRange);
		} else {
			editor.setSelection(lineRange.from, lineRange.to);
			this.selectionHistory.push(lineRange);
		}
	}
	//收缩选区
	shrinkSelection(editor: Editor) {
		const selectionRange = this.selectionHistory.pop();
		if (selectionRange === undefined) {
			new Notice("No minor selection");
			return;
		}
		editor.setSelection(selectionRange.from, selectionRange.to);
	}

	selectSentence(editor: Editor, cursor: EditorPosition): EditorRange {
		const separators = /[.!?。！？]/;
		const lineText = editor.getLine(cursor.line);
		let start = cursor.ch;
		let end = cursor.ch;
		while (start > 0) {
			const char = lineText.charAt(start - 1);
			if (separators.test(char)) break;
			start--;
		}
		while (end < lineText.length) {
			const char = lineText.charAt(end);
			if (separators.test(char)) {
				end++;
				break;
			}
			end++;
		}

		while (start < cursor.ch && /\s/.test(lineText.charAt(start))) {
			start++;
		}
		return {
			from: {
				line: cursor.line,
				ch: start,
			},
			to: {
				line: cursor.line,
				ch: end,
			},
		};
	}
}
