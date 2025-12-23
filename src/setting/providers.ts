// Provider 配置的类型定义
export interface ProviderConfig {
	displayName: string; // 显示名称，如 "Deepseek"
	models: string[]; // 预设模型列表
	baseUrl: string; // API 基础地址
	canFetchModels: boolean; // 是否支持联网获取模型列表
}

// 所有 providers 的类型
export type ProvidersType = Record<string, ProviderConfig>;

// Provider 配置数据
export const PROVIDERS: ProvidersType = {
	deepseek: {
		displayName: "Deepseek",
		models: ["deepseek-chat", "deepseek-reasoner"],
		baseUrl: "https://api.deepseek.com",
		canFetchModels: false, // Deepseek 不支持获取模型列表
	},
	openai: {
		displayName: "OpenAI",
		models: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-3.5-turbo"],
		baseUrl: "https://api.openai.com/v1",
		canFetchModels: true, // OpenAI 支持获取模型列表
	},
};

// 辅助函数：获取 provider 下拉框选项
export function getProviderOptions(): Record<string, string> {
	const options: Record<string, string> = {};
	for (const [key, config] of Object.entries(PROVIDERS)) {
		options[key] = config.displayName;
	}
	return options;
	// 结果: { "deepseek": "Deepseek", "openai": "OpenAI" }
}

// 辅助函数：获取指定 provider 的模型下拉框选项
export function getModelOptions(providerKey: string): Record<string, string> {
	const provider = PROVIDERS[providerKey];
	if (!provider) return {};

	const options: Record<string, string> = {};
	for (const model of provider.models) {
		options[model] = model; // key 和显示文本相同
	}
	return options;
	// 结果: { "deepseek-chat": "deepseek-chat", "deepseek-reasoner": "deepseek-reasoner" }
}
