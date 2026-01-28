import axios from "axios";

const api = axios.create({
	baseURL: "https://travel-assistant.duckdns.org",
	headers: {
		"Content-Type": "application/json",
	},
});

// Request Interceptor: Attach Token
api.interceptors.request.use(
	(config) => {
		// Do not attach token for login request
		if (config.url?.includes("/login/")) {
			return config;
		}

		if (typeof window !== "undefined") {
			const authStorage = localStorage.getItem("auth-storage");
			if (authStorage) {
				const { state } = JSON.parse(authStorage);
				const token = state.accessToken;
				if (token) {
					config.headers.Authorization = `Bearer ${token}`;
				}
			}
		}
		return config;
	},
	(error) => Promise.reject(error),
);

// Response Interceptor: Handle Token Expiration
api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		// If it's a 401 and not a login request, redirect to login
		if (
			error.response?.status === 401 &&
			!originalRequest._retry &&
			!originalRequest.url?.includes("/login/")
		) {
			originalRequest._retry = true;
			// we could implement refresh token logic here
			// but for now, let's just logout the user
			if (typeof window !== "undefined") {
				localStorage.removeItem("auth-storage");
				window.location.href = "/login";
			}
		}
		return Promise.reject(error);
	},
);

export default api;
