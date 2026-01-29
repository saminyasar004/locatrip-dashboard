"use client";

import { ChartRevenue } from "@/components/common/chart-revenue";
import ChartUserGrowth from "@/components/common/chart-user-growth";
import { H3 } from "@/components/ui/typography";
import { RevenueChartData, UserGrowthChartData } from "@/types/chart";
import { useEffect, useState } from "react";
import {
	getUserGrowthChart,
	getSubscriptionRevenueChart,
} from "@/lib/services/user-service";
import { Loader2 } from "lucide-react";

export default function Page() {
	const [growthData, setGrowthData] = useState<UserGrowthChartData>([]);
	const [revenueData, setRevenueData] = useState<RevenueChartData>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
				const [growthRes, revenueRes] = await Promise.all([
					getUserGrowthChart(),
					getSubscriptionRevenueChart(),
				]);

				if (growthRes) {
					const mappedGrowth: UserGrowthChartData =
						growthRes.monthly_growth.map((item) => ({
							month: item.month,
							value: item.percentage,
						}));
					setGrowthData(mappedGrowth);
				}

				if (revenueRes) {
					const mappedRevenue: RevenueChartData =
						revenueRes.monthly_revenue.map((item) => ({
							month: item.month,
							revenue: item.amount,
						}));
					setRevenueData(mappedRevenue);
				}
			} catch (error) {
				console.error("Error fetching analytics data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	if (isLoading) {
		return (
			<div className="flex h-[80vh] items-center justify-center">
				<Loader2 className="h-12 w-12 animate-spin text-primary" />
			</div>
		);
	}

	return (
		<div className="space-y-8">
			<div>
				<H3 className="mb-4">Revenue Analytics</H3>
				<ChartRevenue chartData={revenueData} />
			</div>

			<div>
				<H3 className="mb-4">User Growth</H3>
				<ChartUserGrowth chartData={growthData} />
			</div>
		</div>
	);
}
