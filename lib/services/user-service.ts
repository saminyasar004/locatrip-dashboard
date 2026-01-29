import api from "@/lib/axios";
import { UserApiResponse } from "@/types/user";

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
