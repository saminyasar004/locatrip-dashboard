export type RevenueChartData = {
	month: string;
	revenue: number;
}[];

export type UserGrowthChartData = {
	month: string;
	value: number;
}[];

export interface UserGrowthApiResponse {
	today: {
		day_name: string;
		date: string;
		month: string;
		year: number;
	};
	year: number;
	grand_total_users: number;
	total_users_this_year: number;
	monthly_growth: {
		month: string;
		user_count: number;
		percentage: number;
	}[];
}
