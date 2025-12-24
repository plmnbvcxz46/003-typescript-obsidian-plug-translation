import OpenAI from "openai";
import { Notice } from "obsidian";
import SmartSelectPlugin from "main";
import { apiSetting } from "../type";
export class AIService {
	private openai!: OpenAI;
	private plugin!: SmartSelectPlugin;
	constructor(plugin: SmartSelectPlugin) {
		const { key, baseUrl }: apiSetting = plugin.settings.api;
		this.plugin = plugin;
		this.openai.apiKey = key;
		this.openai.baseURL = baseUrl;
	}
	async askAI(prompt: string): Promise<string> {
		const modelSetting = this.plugin.settings.modelSetting;
		try {
			const completion = await this.openai.chat.completions.create({
				messages: [
					{
						role: "system",
						content: modelSetting.systemInstruction,
					},
					{ role: "user", content: prompt },
				],
				temperature: modelSetting.temperature,
				model: this.plugin.settings.api.modalName,
			});

			// 使用可选链操作符避免 "Object is possibly undefined" 错误
			const content = completion.choices[0]?.message?.content;
			return content || "";
		} catch (error) {
			console.error("AI 请求出错:", error);
			new Notice("AI 请求出错，请检查控制台");
			return "";
		}
	}
}
