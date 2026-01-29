import api from "@/lib/axios";
import { UserApiResponse } from "@/types/user";
import { UserGrowthApiResponse } from "@/types/chart";

export const getAllUsers = async (
	filter?: string,
): Promise<UserApiResponse> => {
	if (filter && filter !== "all") {
		// The API uses capitalized status names like "Activate", "Deactivate", "New"
		// The dropdown values are lowercase. I'll handle that mapping in the component or here.
		// Given the image shows {"filter": "Activate"}, I'll pass the string as is.
		const response = await api.post<UserApiResponse>(
			"/api/v1/admin/all_user_list/",
			{
				filter: filter,
			},
		);
		return response.data;
	}

	const response = await api.get<UserApiResponse>(
		"/api/v1/admin/all_user_list/",
	);
	return response.data;
};

export const toggleUserStatus = async (
	userId: string,
	type: "activate" | "deactivate",
): Promise<{ status: string; message: string }> => {
	const response = await api.post("/api/v1/admin/user_activate_deactivate/", {
		user_id: userId,
		type: type,
	});
	return response.data;
};

export const updateProfile = async (formData: FormData): Promise<any> => {
	const response = await api.patch("/api/profile/", formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
	return response.data;
};

export const getUserGrowthChart = async (): Promise<UserGrowthApiResponse> => {
	const response = await api.get<UserGrowthApiResponse>(
		"/api/v1/admin/user_growth_chart/",
	);
	return response.data;
};
