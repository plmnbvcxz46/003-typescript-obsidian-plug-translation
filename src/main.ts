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
	lastSelectionSnap: string = "";
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
		this.addCommand({
			id: "select_pre",
			name: "Select pre",
			editorCallback: (editor) => {
				this.selectPre(editor);
			},
		});
		this.addCommand({
			id: "select_next",
			name: "Select next",
			editorCallback: (editor) => {
				this.selectNext(editor);
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

	// 选区
	expandSelection(editor: Editor) {
		const selection = editor.getSelection();
		const cursor = editor.getCursor("from");
		const wordRange = editor.wordAt(cursor);
		const sentenceRange = this.selectSentence(editor, cursor);
		const isChinese = this.isChinese(editor, cursor);
		if (this.lastSelectionSnap != this.getRangeString(editor)) {
			this.selectionHistory = [];
		}
		const currentRange: EditorRange = {
			from: editor.getCursor("from"),
			to: editor.getCursor("to"),
		};
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
		if (
			!isChinese &&
			wordRange &&
			selection.length < wordRange.to.ch - wordRange.from.ch
		) {
			this.selectionHistory.push(currentRange);
			editor.setSelection(wordRange.from, wordRange.to);
			new Notice("Word");
		} else if (
			selection.length <
			sentenceRange.to.ch - sentenceRange.from.ch
		) {
			new Notice("Sentence");
			this.selectionHistory.push(currentRange);
			editor.setSelection(sentenceRange.from, sentenceRange.to);
		} else {
			new Notice("Line");
			this.selectionHistory.push(currentRange);
			editor.setSelection(lineRange.from, lineRange.to);
		}
		this.lastSelectionSnap = this.getRangeString(editor);
	}

	getRangeString(editor: Editor): string {
		const from = editor.getCursor("from");
		const to = editor.getCursor("to");
		return `${from.line}:${from.ch}-${to.line}:${to.ch}`;
	}

	//收缩选区
	shrinkSelection(editor: Editor) {
		if (this.lastSelectionSnap != this.getRangeString(editor)) {
			this.selectionHistory = [];
		}
		const selectionRange = this.selectionHistory.pop();
		if (selectionRange === undefined) {
			new Notice("No minor selection");
			return;
		}
		editor.setSelection(selectionRange.from, selectionRange.to);
		this.lastSelectionSnap = this.getRangeString(editor);
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
	isChinese(editor: Editor, cursor: EditorPosition) {
		const lineText = editor.getLine(cursor.line);
		const rightChar = lineText.charAt(cursor.ch);
		const chineseRegex = /[\u4e00-\u9fa5]/;
		return chineseRegex.test(rightChar);
	}

	//切换选区
	selectPre(editor: Editor) {
		const cursor = editor.getCursor("from");
		const selection = editor.getSelection();
		const wordRange = editor.wordAt(cursor);
		let start: EditorPosition = wordRange
			? { ...wordRange.from }
			: { ...cursor };
		while (start.line >= 0) {
			start.ch--;
			if (start.ch < 0) {
				start.line--;
				start.ch = editor.getLine(
					start.line >= 0 ? start.line : 0
				).length;
			}
			if (start.line < 0) {
				start = {
					line: 0,
					ch: 0,
				};
				return;
			}
			const lineText = editor.getLine(start.line);
			const char = lineText.charAt(start.ch);
			if (/\w|[\u4e00-\u9fa5]/.test(char)) break;
		}
		editor.setCursor(start);
		if (
			wordRange &&
			selection.length <= wordRange.to.ch - wordRange.from.ch
		) {
			this.expandSelection(editor);
		}
		this.selectionHistory = [];
	}
	selectNext(editor: Editor) {
		const cursor = editor.getCursor("to");
		const selection = editor.getSelection();
		const wordRange = editor.wordAt(cursor);
		let end: EditorPosition = wordRange
			? { ...wordRange.to }
			: { ...cursor };
		while (end.line <= editor.lastLine()) {
			end.ch++;
			if (end.ch > editor.getLine(end.line).length) {
				end.line++;
				end.ch = 0;
			}
			if (end.line > editor.lastLine()) {
				end = {
					line: editor.lastLine(),
					ch: editor.getLine(editor.lastLine()).length,
				};
				return;
			}
			const lineText = editor.getLine(end.line);
			const char = lineText.charAt(end.ch);
			new Notice(char);
			if (/\w|[\u4e00-\u9fa5]/.test(char)) {
				new Notice(char);
				break;
			}
		}

		editor.setCursor(end);
		if (
			wordRange &&
			selection.length <= wordRange.to.ch - wordRange.from.ch
		) {
			this.expandSelection(editor);
		}
		this.selectionHistory = [];
	}
}
