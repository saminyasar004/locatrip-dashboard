export interface User {
	id: number;
	full_name: string;
	email: string;
	image: string;
}

export interface LoginResponse {
	status: string;
	data: {
		user: User;
		refresh: string;
		access: string;
	};
}

export interface LoginCredentials {
	email: string;
	password: string;
}
