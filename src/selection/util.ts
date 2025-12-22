import { Editor, EditorPosition, EditorRange } from "obsidian";

function isChinese(editor: Editor, cursor: EditorPosition): boolean {
	const lineText = editor.getLine(cursor.line);
	const rightChar = lineText.charAt(cursor.ch);
	const chineseRegex = /[\u4e00-\u9fa5]/;
	return chineseRegex.test(rightChar);
}
function getRangeString(editor: Editor): string {
	const from = editor.getCursor("from");
	const to = editor.getCursor("to");
	return `${from.line}:${from.ch}-${to.line}:${to.ch}`;
}
function selectSentence(editor: Editor, cursor: EditorPosition): EditorRange {
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
export { isChinese, getRangeString, selectSentence };
