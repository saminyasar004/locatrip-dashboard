export interface SubscriptionPlan {
	id: number;
	plan_name: string;
	duration: number;
	price: number;
	itinerary_limit: number | null;
	feature_1: string;
	feature_2: string;
	feature_3: string;
	feature_4: string;
	feature_5: string;
	feature_6: string;
	feature_7: string;
	feature_8: string;
	feature_9: string;
	feature_10: string;
}

export interface SubscriptionApiResponse {
	status: string;
	payment: SubscriptionPlan[];
}

export interface CreateSubscriptionResponse {
	status: string;
	payment: SubscriptionPlan;
}
