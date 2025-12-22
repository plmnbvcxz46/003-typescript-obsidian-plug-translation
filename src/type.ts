type apiSetting = {
	modalName: string;
	provider: string;
	key: string;
	baseUrl: string;
};

type modelSetting = {
	temperature: number;
	systemInstruction: string;
};

export type { apiSetting, modelSetting };
