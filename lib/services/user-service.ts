import api from "@/lib/axios";
import { UserApiResponse } from "@/types/user";

export const getAllUsers = async (): Promise<UserApiResponse> => {
	const response = await api.get<UserApiResponse>(
		"/api/v1/admin/all_user_list/",
	);
	return response.data;
};
