"use client";
import { UserTable } from "@/components/common/user-table";
import { UserMiniType } from "@/types/user";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { getAllUsers } from "@/lib/services/user-service";

export default function AllUsersPage() {
	const [users, setUsers] = useState<UserMiniType[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [statusFilter, setStatusFilter] = useState("all");
	const [searchQuery, setSearchQuery] = useState("");

	const fetchUsers = async () => {
		try {
			setIsLoading(true);
			setError(null);

			// Map UI filter values to API expected values
			let apiFilter = statusFilter;
			if (statusFilter === "active") apiFilter = "Activate";
			if (statusFilter === "deactive") apiFilter = "Deactivate";
			if (statusFilter === "new") apiFilter = "New";

			const response = await getAllUsers(apiFilter);
			if (response.status === "success") {
				const mappedUsers: UserMiniType[] = response.data.map(
					(user) => ({
						id: user.user_id.toString(),
						username: user.full_name || user.email.split("@")[0],
						email: user.email,
						status: user.status,
					}),
				);
				setUsers(mappedUsers);
			} else {
				setError("Failed to fetch users");
			}
		} catch (err) {
			console.error("Error fetching users:", err);
			setError("An error occurred while fetching users");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, [statusFilter]);

	// Client-side search filtering
	const filteredUsers = users.filter((user) => {
		const query = searchQuery.toLowerCase();
		return (
			user.username.toLowerCase().includes(query) ||
			(user.email && user.email.toLowerCase().includes(query))
		);
	});

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center p-12 text-center">
				<p className="text-destructive mb-4">{error}</p>
				<button
					onClick={() => fetchUsers()}
					className="text-primary hover:underline"
				>
					Try again
				</button>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			<div className="flex gap-6 h-12">
				<div className="relative w-full  max-w-2xl h-full">
					<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
					<Input
						placeholder="Search by name or email..."
						className="pl-12 bg-muted-background h-full rounded-4xl border-none"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
				<Select
					defaultValue="all"
					onValueChange={(value) => setStatusFilter(value)}
				>
					<SelectTrigger className="w-32 h-full!">
						<SelectValue placeholder="All Status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Status</SelectItem>
						<SelectItem value="new">New</SelectItem>
						<SelectItem value="active">Active</SelectItem>
						<SelectItem value="deactive">Deactive</SelectItem>
					</SelectContent>
				</Select>
			</div>
			{isLoading ? (
				<div className="flex items-center justify-center p-12">
					<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
				</div>
			) : (
				<UserTable users={filteredUsers} showPagination={true} />
			)}
		</div>
	);
}
