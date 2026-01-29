"use client";

import { ChartRevenue } from "@/components/common/chart-revenue";
import ChartUserGrowth from "@/components/common/chart-user-growth";
import { H3 } from "@/components/ui/typography";
import { RevenueChartData, UserGrowthChartData } from "@/types/chart";
import { useEffect, useState } from "react";
import { getUserGrowthChart } from "@/lib/services/user-service";
import { Loader2 } from "lucide-react";

const revenueData: RevenueChartData = [
	{ month: "", revenue: 0 },
	{ month: "January", revenue: 143 },
	{ month: "February", revenue: 78 },
	{ month: "March", revenue: 256 },
	{ month: "April", revenue: 94 },
	{ month: "May", revenue: 212 },
	{ month: "Jun", revenue: 134 },
	{ month: "July", revenue: 278 },
	{ month: "August", revenue: 167 },
	{ month: "September", revenue: 201 },
	{ month: "November", revenue: 239 },
];

export default function Page() {
	const [growthData, setGrowthData] = useState<UserGrowthChartData>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchGrowth = async () => {
			try {
				setIsLoading(true);
				const response = await getUserGrowthChart();
				if (response) {
					const mappedGrowth: UserGrowthChartData =
						response.monthly_growth.map((item) => ({
							month: item.month,
							value: item.percentage,
						}));
					setGrowthData(mappedGrowth);
				}
			} catch (error) {
				console.error("Error fetching growth data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchGrowth();
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
