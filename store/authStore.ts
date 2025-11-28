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
						credentials
					);
					const { user, access, refresh } = response.data.data;
					set({
						user,
						accessToken: access,
						refreshToken: refresh,
						isLoading: false,
					});
				} catch (error: any) {
					set({
						isLoading: false,
						error: error.response?.data?.message || "Login failed",
					});
					throw error;
				}
			},
			logout: () => {
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
		}
	)
);
