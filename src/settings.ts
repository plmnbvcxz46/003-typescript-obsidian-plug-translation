import { App, PluginSettingTab, Setting } from "obsidian";
import SmartSelectPlugin from "./main";
import { apiSetting, modelSetting } from "./type";
export interface SmartSelectSettings {
	api: apiSetting;
	modelSetting: modelSetting;
}

export const DEFAULT_SETTINGS: SmartSelectSettings = {
	api: {
		modalName: "",
		provider: "",
		key: "",
		baseUrl: "",
	},
	modelSetting: {
		temperature: 0,
		systemInstruction: "",
	},
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
		new Setting(containerEl).setName("设置").setHeading();
		new Setting(containerEl)
			.setName("Model name")
			.setDesc("")
			.addText((text) =>
				text
					.setPlaceholder("Enter your secret")
					.setValue(this.plugin.settings.api.modalName)
					.onChange(async (value) => {
						this.plugin.settings.api.modalName = value;
						await this.plugin.saveSettings();
					})
			);
		new Setting(containerEl)
			.setName("Provider")
			.setDesc("")
			.addDropdown((dropDown) => {
				dropDown
					.addOption("deepseek", "Deepseek")
					.addOption("openai", "Openai")
					.setValue(this.plugin.settings.api.provider)
					.onChange(async (value) => {
						this.plugin.settings.api.provider = value;
						await this.plugin.saveSettings();
					});
			});
		new Setting(containerEl)
			.setName("Key")
			.setDesc("")
			.addText((text) => {
				text.inputEl.type = "password";
				text.setPlaceholder("Enter your secret")
					.setValue(this.plugin.settings.api.key)
					.onChange(async (value) => {
						this.plugin.settings.api.key = value;
						await this.plugin.saveSettings();
					});
			});
		new Setting(containerEl)
			.setName("Baseurl")
			.setDesc("")
			.addText((text) =>
				text
					.setPlaceholder("Enter your secret")
					.setValue(this.plugin.settings.api.baseUrl)
					.onChange(async (value) => {
						this.plugin.settings.api.baseUrl = value;
						await this.plugin.saveSettings();
					})
			);
		new Setting(containerEl).setName("Model setting").setHeading();
		new Setting(containerEl)
			.setName("温度")
			.setDesc("")
			.addSlider((slider) => {
				slider
					.setLimits(0, 2, 0.1)
					.setValue(this.plugin.settings.modelSetting.temperature)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.modelSetting.temperature = value;
						await this.plugin.saveSettings();
					});
			});
		new Setting(containerEl)
			.setName("系统提示词")
			.setDesc("")
			.addTextArea((textArea) => {
				textArea
					.setPlaceholder("Enter your instruction")
					.setValue(
						this.plugin.settings.modelSetting.systemInstruction
					)
					.onChange(async (value) => {
						this.plugin.settings.modelSetting.systemInstruction =
							value;
						await this.plugin.saveSettings();
					});
			});
	}
}
