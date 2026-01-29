"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { H2, H3, H4 } from "@/components/ui/typography";
import { Edit, Loader2, MoreVertical, Plus, Trash2 } from "lucide-react";
import EventModal from "@/components/common/event-modal";
import {
	createEvent,
	deleteEvent,
	getEventSummary,
	listEvents,
	updateEvent,
} from "@/lib/services/user-service";
import { EventSummaryResponse } from "@/types/event";

export type EventType = {
	id: string;
	title: string;
	numberOfEvents: number;
};

export default function Events() {
	const [data, setData] = useState<EventSummaryResponse | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [showModal, setShowModal] = useState<boolean>(false);
	const [selectedEv, setSelectedEv] = useState<EventType | null>(null);

	const fetchData = async () => {
		try {
			setIsLoading(true);
			const [summaryRes, listRes] = await Promise.all([
				getEventSummary(),
				listEvents(),
			]);

			// Merge the event count from summary with the IDs from the admin list
			const enrichedCategories = summaryRes.category_event_summary.map(
				(cat) => {
					// Use any response structure from listRes that might contain the ID
					// Assuming listRes is the response from /api/v1/admin/admin_events/
					// which usually returns { data: [...] } or just [...]
					const adminList = Array.isArray(listRes)
						? listRes
						: listRes.data || [];
					const matchingAdmin = adminList.find(
						(adminCat: any) =>
							adminCat.event_name === cat.name ||
							adminCat.name === cat.name,
					);

					return {
						...cat,
						id:
							matchingAdmin?.event_id ||
							matchingAdmin?.id ||
							cat.id,
					};
				},
			);

			setData({
				...summaryRes,
				category_event_summary: enrichedCategories,
			});
		} catch (error) {
			console.error("Error fetching event data:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const handleEventSubmit = async (name: string) => {
		try {
			if (selectedEv) {
				await updateEvent(selectedEv.id, name);
			} else {
				await createEvent(name);
			}
			await fetchData();
		} catch (error) {
			console.error("Error submitting event:", error);
		}
	};

	const handleDeleteEvent = async (id: string | number) => {
		if (!confirm("Are you sure you want to delete this category?")) return;
		try {
			await deleteEvent(id);
			await fetchData();
		} catch (error) {
			console.error("Error deleting event:", error);
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
			<div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
				<Card>
					<CardContent className="pt-6">
						<H4 className="text-muted-foreground">Total Users</H4>
						<H2>{data?.total_users || 0}</H2>
						<small className="text-muted-foreground text-sm">
							Total registered users
						</small>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						<H4 className="text-muted-foreground">
							Total Itinerary
						</H4>
						<H2>{data?.total_itinerary || 0}</H2>
						<small className="text-muted-foreground text-sm">
							Total itineraries created
						</small>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						<H4 className="text-primary text-2xl font-bold">
							Total Event
						</H4>
						<H2 className="text-primary">
							{data?.total_events || 0}
						</H2>
						<small className="text-muted-foreground text-sm">
							Overall events across all categories
						</small>
					</CardContent>
				</Card>
			</div>

			<div className="flex justify-between">
				<H3>Event Categories</H3>
				<Button
					className="flex items-center gap-2"
					onClick={() => {
						setShowModal(true);
						setSelectedEv(null);
					}}
				>
					<Plus color="white" strokeWidth={3} />
					Add Categories
				</Button>
			</div>

			<Table className="overflow-hidden">
				<TableHeader className="text-muted-foreground bg-muted-background rounded-4xl!">
					<TableRow>
						<TableHead className="text-muted-foreground">
							Category Name
						</TableHead>
						<TableHead className="text-muted-foreground ">
							Number of Events
						</TableHead>
						<TableHead className="text-muted-foreground w-full text-end">
							Action
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data?.category_event_summary.map((category, index) => (
						<TableRow className="" key={index}>
							<TableCell className="text-lg">
								{category.name}
							</TableCell>
							<TableCell className="text-lg">
								{category.event_count}
							</TableCell>
							<TableCell className="relative">
								<DropdownMenu>
									<DropdownMenuTrigger className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-muted-background/40 rounded-2xl">
										<MoreVertical className="w-6" />
									</DropdownMenuTrigger>
									<DropdownMenuContent>
										<DropdownMenuItem
											onClick={() =>
												setTimeout(() => {
													setShowModal(true);
													const categoryId =
														category.event_id ||
														category.id;
													setSelectedEv({
														id: categoryId
															? categoryId.toString()
															: index.toString(),
														title: category.name,
														numberOfEvents:
															category.event_count,
													});
												}, 120)
											}
										>
											<span className="flex items-center gap-2 cursor-pointer">
												<Edit className="w-4 h-4" />
												Edit
											</span>
										</DropdownMenuItem>

										<DropdownMenuItem
											onClick={() => {
												const categoryId =
													category.event_id ||
													category.id;
												if (categoryId) {
													handleDeleteEvent(
														categoryId,
													);
												}
											}}
										>
											<span className="flex items-center gap-2 cursor-pointer">
												<Trash2 className="text-red-500 w-4 h-4" />
												Delete
											</span>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			<EventModal
				isOpen={showModal}
				selectedPref={selectedEv}
				onSubmit={handleEventSubmit}
				onClose={() => {
					setShowModal(false);
					setSelectedEv(null);
				}}
			/>
		</div>
	);
}
