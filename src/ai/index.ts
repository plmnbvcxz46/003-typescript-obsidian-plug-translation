import OpenAI from "openai";
import { Notice } from "obsidian";

export async function askAI(apiKey: string, prompt: string) {
	const openai = new OpenAI({
		baseURL: "https://api.deepseek.com",
		apiKey: apiKey,
		dangerouslyAllowBrowser: true, // 必须开启，因为 Obsidian 是浏览器环境
	});

	try {
		const completion = await openai.chat.completions.create({
			messages: [
				{ role: "system", content: "You are a helpful assistant." },
				{ role: "user", content: prompt },
			],
			model: "deepseek-chat",
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
