import { App, PluginSettingTab, Setting, DropdownComponent } from "obsidian";
import SmartSelectPlugin from "../main";
import { apiSetting, modelSetting } from "../type";
import { PROVIDERS, getProviderOptions, getModelOptions } from "./providers";

export interface SmartSelectSettings {
	api: apiSetting;
	modelSetting: modelSetting;
}

export const DEFAULT_SETTINGS: SmartSelectSettings = {
	api: {
		modalName: "",
		provider: "deepseek", // 默认选择 deepseek
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
	modelDropdown: DropdownComponent | null = null; // 保存模型下拉框引用

	constructor(app: App, plugin: SmartSelectPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		// ========== API 设置 ==========
		new Setting(containerEl).setName("API 设置").setHeading();

		// Provider 选择（放在前面）
		new Setting(containerEl)
			.setName("Provider")
			.setDesc("选择 AI 服务提供商")
			.addDropdown((dropDown) => {
				dropDown
					.addOptions(getProviderOptions())
					.setValue(this.plugin.settings.api.provider)
					.onChange(async (value) => {
						this.plugin.settings.api.provider = value;

						// 自动填充 baseUrl
						const provider = PROVIDERS[value];
						if (provider) {
							this.plugin.settings.api.baseUrl = provider.baseUrl;
						}

						// 清空之前选的模型（因为换了 provider）
						this.plugin.settings.api.modalName = "";

						// 直接更新 Model 下拉框的选项
						if (this.modelDropdown) {
							this.modelDropdown.selectEl.empty(); // 清空旧选项
							const newOptions = getModelOptions(value);
							this.modelDropdown.addOptions(newOptions);
							this.modelDropdown.setValue(""); // 重置选中值
						}

						await this.plugin.saveSettings();
						// 不需要 this.display()
					});
			});

		// Model 选择（根据当前 provider 动态显示选项）
		new Setting(containerEl)
			.setName("Model")
			.setDesc("选择要使用的模型")
			.addDropdown((dropDown) => {
				this.modelDropdown = dropDown;
				const currentProvider = this.plugin.settings.api.provider;
				const modelOptions = getModelOptions(currentProvider);

				dropDown
					.addOptions(modelOptions)
					.setValue(this.plugin.settings.api.modalName)
					.onChange(async (value) => {
						this.plugin.settings.api.modalName = value;
						await this.plugin.saveSettings();
					});
			});

		// API Key
		new Setting(containerEl)
			.setName("Key")
			.setDesc("你的 API 密钥")
			.addText((text) => {
				text.inputEl.type = "password";
				text.setPlaceholder("输入key")
					.setValue(this.plugin.settings.api.key)
					.onChange(async (value) => {
						this.plugin.settings.api.key = value;
						await this.plugin.saveSettings();
					});
			});

		// Base URL
		new Setting(containerEl)
			.setName("Base URL")
			.setDesc("Baseurl")
			.addText((text) =>
				text
					.setPlaceholder("https://api.example.com")
					.setValue(this.plugin.settings.api.baseUrl)
					.onChange(async (value) => {
						this.plugin.settings.api.baseUrl = value;
						await this.plugin.saveSettings();
					})
			);

		// ========== 模型设置 ==========
		new Setting(containerEl).setName("模型设置").setHeading();

		// 温度
		new Setting(containerEl)
			.setName("温度")
			.setDesc("0 = 更确定性，2 = 更随机/有创意")
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

		// 系统提示词
		new Setting(containerEl)
			.setName("系统提示词")
			.setDesc("设置 AI 的角色和行为")
			.addTextArea((textArea) => {
				textArea
					.setPlaceholder("例如：你是一个翻译助手...")
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
