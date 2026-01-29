export interface EventSummaryResponse {
	total_users: number;
	total_itinerary: number;
	total_events: number;
	category_event_summary: {
		name: string;
		event_count: number;
	}[];
}

export interface CreateEventResponse {
	status: string;
	message: string;
	data: {
		event_id: number;
		event_name: string;
	}[];
}
