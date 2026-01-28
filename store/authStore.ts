import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/axios";
import { LoginCredentials, LoginResponse, User } from "@/types/auth";

interface AuthState {
	user: User | null;
	accessToken: string | null;
	refreshToken: string | null;
	isLoading: boolean;
	error: string | null;
	login: (credentials: LoginCredentials) => Promise<void>;
	logout: () => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			user: null,
			accessToken: null,
			refreshToken: null,
			isLoading: false,
			error: null,
			login: async (credentials) => {
				set({ isLoading: true, error: null });
				try {
					const response = await api.post<LoginResponse>(
						"/api/v1/admin/login/",
						credentials,
					);
					const { user, access, refresh } = response.data.data;

					// Set session cookie for middleware
					if (typeof window !== "undefined") {
						document.cookie = `session=true; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
					}

					set({
						user,
						accessToken: access,
						refreshToken: refresh,
						isLoading: false,
					});
				} catch (error: any) {
					const errorMessage =
						error.response?.data?.message ||
						error.response?.data?.error ||
						"Login failed";
					set({
						isLoading: false,
						error: errorMessage,
					});
					throw error;
				}
			},
			logout: () => {
				// Remove session cookie
				if (typeof window !== "undefined") {
					document.cookie =
						"session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
				}
				set({ user: null, accessToken: null, refreshToken: null });
			},
		}),
		{
			name: "auth-storage",
			partialize: (state) => ({
				user: state.user,
				accessToken: state.accessToken,
				refreshToken: state.refreshToken,
			}),
		},
	),
);
