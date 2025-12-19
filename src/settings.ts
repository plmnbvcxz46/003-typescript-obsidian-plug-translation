import { App, PluginSettingTab, Setting } from "obsidian";
import SmartSelectPlugin from "./main";

export interface SmartSelectSettings {
	mySetting: string;
}

export const DEFAULT_SETTINGS: SmartSelectSettings = {
	mySetting: "default",
};

export class SmartSelectSettingTap extends PluginSettingTab {
	plugin: SmartSelectPlugin;

	constructor(app: App, plugin: SmartSelectPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Settings #1")
			.setDesc("It's a secret")
			.addText((text) =>
				text
					.setPlaceholder("Enter your secret")
					.setValue(this.plugin.settings.mySetting)
					.onChange(async (value) => {
						this.plugin.settings.mySetting = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
