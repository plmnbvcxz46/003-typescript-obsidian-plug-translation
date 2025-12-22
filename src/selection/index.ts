import { Editor, EditorRange, Notice, EditorPosition } from "obsidian";
import { isChinese, getRangeString, selectSentence } from "./util";
import SmartSelectPlugin from "../main";
// 选区
function expandSelection(editor: Editor, plugin: SmartSelectPlugin) {
	const selection = editor.getSelection();
	const cursor = editor.getCursor("from");
	const wordRange = editor.wordAt(cursor);
	const sentenceRange = selectSentence(editor, cursor);
	const isTextChinese = isChinese(editor, cursor);
	if (plugin.lastSelectionSnap != getRangeString(editor)) {
		plugin.selectionHistory = [];
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
		!isTextChinese &&
		wordRange &&
		selection.length < wordRange.to.ch - wordRange.from.ch
	) {
		plugin.selectionHistory.push(currentRange);
		editor.setSelection(wordRange.from, wordRange.to);
		new Notice("Word");
	} else if (selection.length < sentenceRange.to.ch - sentenceRange.from.ch) {
		new Notice("Sentence");
		plugin.selectionHistory.push(currentRange);
		editor.setSelection(sentenceRange.from, sentenceRange.to);
	} else {
		new Notice("Line");
		plugin.selectionHistory.push(currentRange);
		editor.setSelection(lineRange.from, lineRange.to);
	}
	plugin.lastSelectionSnap = getRangeString(editor);
}

//收缩选区
function shrinkSelection(editor: Editor, plugin: SmartSelectPlugin) {
	if (plugin.lastSelectionSnap != getRangeString(editor)) {
		plugin.selectionHistory = [];
	}
	const selectionRange = plugin.selectionHistory.pop();
	if (selectionRange === undefined) {
		new Notice("No minor selection");
		return;
	}
	editor.setSelection(selectionRange.from, selectionRange.to);
	plugin.lastSelectionSnap = getRangeString(editor);
}

//切换选区
function selectPre(editor: Editor, plugin: SmartSelectPlugin) {
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
			start.ch = editor.getLine(start.line >= 0 ? start.line : 0).length;
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
	if (wordRange && selection.length <= wordRange.to.ch - wordRange.from.ch) {
		expandSelection(editor, plugin);
	}
	plugin.selectionHistory = [];
}
function selectNext(editor: Editor, plugin: SmartSelectPlugin) {
	const cursor = editor.getCursor("to");
	const selection = editor.getSelection();
	const wordRange = editor.wordAt(cursor);
	let end: EditorPosition = wordRange ? { ...wordRange.to } : { ...cursor };
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
	if (wordRange && selection.length <= wordRange.to.ch - wordRange.from.ch) {
		expandSelection(editor, plugin);
	}
	plugin.selectionHistory = [];
}

export { expandSelection, shrinkSelection, selectNext, selectPre };
