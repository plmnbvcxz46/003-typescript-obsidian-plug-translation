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

interface BaseNode {
	original: string;
	translation: string;
}

export interface WordNode extends BaseNode {
	type: "words";
	otherMeanings: {
		translation: string;
		examples: string;
	}[];
}

export interface SentenceNode extends BaseNode {
	type: "sentence";
	construction: string;
	keyWords: WordNode[];
	keyPhrase: BaseNode[];
}

export interface ParagraphNode extends BaseNode {
	type: "paragraph";
	importantWords: SentenceNode[];
}

export type AnalysisResult = WordNode | SentenceNode | ParagraphNode | BaseNode;
