"use client";
import { ChartRevenue } from "@/components/common/chart-revenue";
import ChartUserGrowth from "@/components/common/chart-user-growth";
import { StatCard } from "@/components/common/stat-card";
import { UserTable } from "@/components/common/user-table";
import { Button } from "@/components/ui/button";
import { H3 } from "@/components/ui/typography";
import { RevenueChartData, UserGrowthChartData } from "@/types/chart";
import { UserMiniType } from "@/types/user";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
	getAllUsers,
	getUserGrowthChart,
	getSubscriptionRevenueChart,
} from "@/lib/services/user-service";
import { Loader2 } from "lucide-react";

export default function HomePage() {
	const [users, setUsers] = useState<UserMiniType[]>([]);
	const [growthData, setGrowthData] = useState<UserGrowthChartData>([]);
	const [revenueData, setRevenueData] = useState<RevenueChartData>([]);
	const [stats, setStats] = useState({
		totalUsers: "0",
		usersThisYear: "0",
		totalRevenue: "$0",
		revenueThisYear: "+$0",
	});
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
				const [usersRes, growthRes, revenueRes] = await Promise.all([
					getAllUsers(),
					getUserGrowthChart(),
					getSubscriptionRevenueChart(),
				]);

				if (usersRes.status === "success") {
					const mappedUsers: UserMiniType[] = usersRes.data
						.slice(0, 5) // Just show recent 5
						.map((user) => ({
							id: user.user_id.toString(),
							username:
								user.full_name || user.email.split("@")[0],
							email: user.email,
							status: user.status,
						}));
					setUsers(mappedUsers);
				}

				if (growthRes) {
					const mappedGrowth: UserGrowthChartData =
						growthRes.monthly_growth.map((item) => ({
							month: item.month,
							value: item.percentage,
						}));
					setGrowthData(mappedGrowth);
					setStats((prev) => ({
						...prev,
						totalUsers:
							growthRes.grand_total_users.toLocaleString(),
						usersThisYear:
							growthRes.total_users_this_year.toLocaleString(),
					}));
				}

				if (revenueRes) {
					const mappedRevenue: RevenueChartData =
						revenueRes.monthly_revenue.map((item) => ({
							month: item.month,
							revenue: item.amount,
						}));
					setRevenueData(mappedRevenue);
					setStats((prev) => ({
						...prev,
						totalRevenue: `$${revenueRes.grand_total.toLocaleString()}`,
						revenueThisYear: `+$${revenueRes.year_total.toLocaleString()}`,
					}));
				}
			} catch (error) {
				console.error("Error fetching dashboard data:", error);
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
		<div className="space-y-12">
			<div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4">
				<StatCard
					label="Total User"
					isUp={true}
					value={stats.totalUsers}
					subValue={`+${stats.usersThisYear}`}
					subText="this year"
				/>
				<StatCard
					label="Total Revenue"
					isUp={true}
					value={stats.totalRevenue}
					subValue={stats.revenueThisYear}
					subText="this year"
				/>
				<StatCard
					label="Destination"
					isUp={true}
					value="1,356"
					subValue="+7.2%"
					subText="from last month"
				/>
				<StatCard
					label="Total Events"
					isUp={true}
					value="100"
					subValue="+2.2%"
					subText="from last month"
				/>
			</div>
			<div>
				<H3 className="mb-4">Revenue Analytics</H3>
				<ChartRevenue chartData={revenueData} />
			</div>

			<div>
				<H3 className="mb-4">User Growth</H3>
				<ChartUserGrowth chartData={growthData} />
			</div>
			<div>
				<div className="mb-4 flex items-center justify-between">
					<H3>Recent User Added</H3>
					<Link href="/management/all-users">
						<Button variant={"link"}>View All User</Button>
					</Link>
				</div>
				<UserTable users={users} showPagination={false} />
			</div>
		</div>
	);
}
