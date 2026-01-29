export interface InterestType {
	id: number;
	name: string;
	slug: string;
	status: boolean;
	created_at: string;
	updated_at: string;
}

export interface InterestApiResponse {
	status: string;
	data: InterestType[];
}

export interface CreateInterestResponse {
	status: string;
	data: InterestType;
}
