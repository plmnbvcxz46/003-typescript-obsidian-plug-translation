import { ItemView, WorkspaceLeaf } from "obsidian";
import { createRoot, Root } from "react-dom/client";
import React from "react";
import App from "./ui/page";

export const VIEW_TYPE_TRANSLATION = "ai_translation_display";

class aiView extends ItemView {
	private root: Root | null = null;
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

		this.root = createRoot(containerEl);
		this.root.render(React.createElement(App));
	}

	protected async onClose(): Promise<void> {
		this.root?.unmount();
	}
}
export { aiView };
