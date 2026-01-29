export interface TermsAndConditionsData {
	id: number;
	main_content: string;
	title_1: string;
	title_1_content: string;
	title_2: string;
	title_2_content: string;
	title_3: string;
	title_3_content: string;
	title_4: string;
	title_4_content: string;
	title_5: string;
	title_5_content: string;
	last_updated: string;
}

export interface TermsAndConditionsResponse {
	status: string;
	data: TermsAndConditionsData;
}
