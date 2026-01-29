import api from "@/lib/axios";
import {
	UserApiResponse,
	UserPreferenceResponse,
	UserStatusToggleResponse,
} from "@/types/user";
import {
	SubscriptionRevenueApiResponse,
	UserGrowthApiResponse,
} from "@/types/chart";
import { EventSummaryResponse, CreateEventResponse } from "@/types/event";
import {
	InterestApiResponse,
	CreateInterestResponse,
} from "@/types/preference";

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

export const getSubscriptionRevenueChart =
	async (): Promise<SubscriptionRevenueApiResponse> => {
		const response = await api.get<SubscriptionRevenueApiResponse>(
			"/api/v1/admin/subscription_revenue_chart/",
		);
		return response.data;
	};

export const getUserPreference = async (
	userId: string | number,
): Promise<UserPreferenceResponse> => {
	const response = await api.get<UserPreferenceResponse>(
		"/api/v1/admin/user_info_and_preference_list/",
		{
			data: { user_id: userId.toString() },
		},
	);
	return response.data;
};

export const getEventSummary = async (): Promise<EventSummaryResponse> => {
	const response = await api.get<EventSummaryResponse>(
		"/api/v1/admin/total_envet_iteneray_count/",
	);
	return response.data;
};

export const listEvents = async (): Promise<any> => {
	const response = await api.get("/api/v1/admin/admin_events/");
	return response.data;
};

export const createEvent = async (
	name: string,
): Promise<CreateEventResponse> => {
	const response = await api.post<CreateEventResponse>(
		"/api/v1/admin/admin_events/",
		{
			event_name: name,
		},
	);
	return response.data;
};

export const updateEvent = async (
	id: string | number,
	name: string,
): Promise<CreateEventResponse> => {
	const numericId = typeof id === "string" ? parseInt(id, 10) : id;
	const response = await api.patch<CreateEventResponse>(
		"/api/v1/admin/admin_events/",
		{
			event_id: isNaN(numericId) ? id : numericId,
			event_name: name,
		},
	);
	return response.data;
};

export const getInterestList = async (): Promise<InterestApiResponse> => {
	const response = await api.get<InterestApiResponse>(
		"/api/v1/admin/admin_interest/",
	);
	return response.data;
};

export const createInterest = async (
	name: string,
): Promise<CreateInterestResponse> => {
	const response = await api.post<CreateInterestResponse>(
		"/api/v1/admin/admin_interest/",
		{
			name: name,
		},
	);
	return response.data;
};

export const updateInterest = async (
	id: string | number,
	name?: string,
	status?: boolean,
): Promise<CreateInterestResponse> => {
	const payload: any = { id: id.toString() };
	if (name) payload.name = name;
	if (status !== undefined) payload.status = status ? "True" : "False";

	const response = await api.patch<CreateInterestResponse>(
		"/api/v1/admin/admin_interest/",
		payload,
	);
	return response.data;
};

export const deleteInterest = async (
	id: string | number,
): Promise<{ status: string; message: string }> => {
	const response = await api.delete("/api/v1/admin/admin_interest/", {
		data: {
			id: id.toString(),
		},
	});
	return response.data;
};

export const deleteEvent = async (
	id: string | number,
): Promise<{ status: string; message: string }> => {
	const numericId = typeof id === "string" ? parseInt(id, 10) : id;
	const response = await api.delete("/api/v1/admin/admin_events/", {
		data: {
			event_id: isNaN(numericId) ? id : numericId,
		},
	});
	return response.data;
};
