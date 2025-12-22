import { ItemView, WorkspaceLeaf } from "obsidian";

export const VIEW_TYPE_TRANSLATION = "ai_translation_display";

class aiView extends ItemView {
	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}
	getViewType(): string {
		return VIEW_TYPE_TRANSLATION;
	}
	getDisplayText(): string {
		return "AI_PAGE";
	}
	protected async onOpen() {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl("h4", { text: "翻译" });
		containerEl.createEl("div", {
			cls: "translation-content",
			text: "等待输入",
		});

		containerEl.createEl("h4", { text: "句子结构" });
		containerEl.createEl("div", {
			cls: "sentence-construction",
			text: "等待输入",
		});

		containerEl.createEl("h4", { text: "短语&单词" });
		containerEl.createEl("div", {
			cls: "words",
			text: "等待输入",
		});
	}

	protected async onClose(): Promise<void> {}
}
export { aiView };
