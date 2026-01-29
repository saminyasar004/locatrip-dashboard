export type UserMiniType = {
	id: string;
	username: string;
	email?: string;
	status: string;
};

export type UserType = {
	user_id: number;
	full_name: string;
	email: string;
	status: string;
};

export interface UserApiResponse {
	status: string;
	total_user?: number;
	data: UserType[];
}
