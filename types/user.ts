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

export interface UserStatusToggleResponse {
	status: string;
	message: string;
}

export interface UserPreferenceResponse {
	status: string;
	data: {
		user_id: number;
		full_name: string;
		email: string;
		status: string;
		join_date: string;
		image?: string;
	};
	interest: string[];
	itineries: {
		destination_name: string;
		trip_type: string;
		budget: string;
		duration: string;
		start_date: string;
		end_date: string;
	}[];
}
