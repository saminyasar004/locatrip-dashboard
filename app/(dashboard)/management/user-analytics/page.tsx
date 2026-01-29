"use client";

import ChartUserGrowth from "@/components/common/chart-user-growth";
import { UserTable } from "@/components/common/user-table";
import { Button } from "@/components/ui/button";
import { H3 } from "@/components/ui/typography";
import { UserGrowthChartData } from "@/types/chart";
import { UserMiniType } from "@/types/user";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
	getAllUsers,
	getUserGrowthChart,
	toggleUserStatus,
} from "@/lib/services/user-service";
import { Loader2 } from "lucide-react";

export default function Page() {
	const [users, setUsers] = useState<UserMiniType[]>([]);
	const [growthData, setGrowthData] = useState<UserGrowthChartData>([]);
	const [isLoading, setIsLoading] = useState(true);

	const fetchData = async () => {
		try {
			setIsLoading(true);
			const [usersRes, growthRes] = await Promise.all([
				getAllUsers(),
				getUserGrowthChart(),
			]);

			if (usersRes.status === "success") {
				const mappedUsers: UserMiniType[] = usersRes.data
					.slice(0, 5) // Just show recent 5
					.map((user) => ({
						id: user.user_id.toString(),
						username: user.full_name || user.email.split("@")[0],
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
			}
		} catch (error) {
			console.error("Error fetching analytics data:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const handleToggleStatus = async (
		userId: string,
		type: "activate" | "deactivate",
	) => {
		try {
			const res = await toggleUserStatus(userId, type);
			if (res.status === "success") {
				fetchData();
			}
		} catch (error) {
			console.error("Error toggling status:", error);
		}
	};

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
				<UserTable
					users={users}
					showPagination={false}
					onToggleStatus={handleToggleStatus}
				/>
			</div>
		</div>
	);
}
