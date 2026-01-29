import { DialogTitle } from "@radix-ui/react-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Dialog, DialogContent } from "../ui/dialog";
import { H3, H5 } from "../ui/typography";
import {
	Calendar,
	Clock,
	Heart,
	Loader2,
	Mail,
	MapPin,
	ShieldUser,
	UsersRound,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ConfirmationDialog } from "./confirmation-dialog";
import { useEffect, useState } from "react";
import { getUserPreference } from "@/lib/services/user-service";
import { UserPreferenceResponse } from "@/types/user";
import { useAuthStore } from "@/store/authStore";

type Props = {
	showModal: boolean;
	onClose: () => void;
};

export function ProfileModal({ showModal, onClose }: Props) {
	const [data, setData] = useState<UserPreferenceResponse | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const { user } = useAuthStore();

	useEffect(() => {
		if (showModal && user?.id) {
			const fetchData = async () => {
				try {
					setIsLoading(true);
					const res = await getUserPreference(user.id);
					setData(res);
				} catch (error) {
					console.error("Error fetching user preferences:", error);
				} finally {
					setIsLoading(false);
				}
			};
			fetchData();
		}
	}, [showModal, user?.id]);

	const getImageUrl = (path: string | undefined) => {
		if (!path) return "https://github.com/evilrabbit.png";
		if (path.startsWith("http")) return path;
		return `https://travel-assistant.duckdns.org${path}`;
	};

	const formatDate = (dateStr: string | undefined) => {
		if (!dateStr) return "N/A";
		try {
			return new Date(dateStr).toLocaleDateString("en-GB", {
				day: "numeric",
				month: "long",
				year: "numeric",
			});
		} catch {
			return dateStr;
		}
	};

	return (
		<Dialog open={showModal} onOpenChange={onClose}>
			<DialogContent className="max-w-xl overflow-y-auto max-h-[90vh]">
				{isLoading ? (
					<div className="flex h-64 items-center justify-center">
						<Loader2 className="h-10 w-10 animate-spin text-primary" />
					</div>
				) : (
					<>
						<DialogTitle>
							<div className="flex">
								<div className="flex items-center gap-2 justify-between w-auto">
									<Avatar className="rounded-full h-12 w-12 border border-primary/20">
										<AvatarImage
											src={getImageUrl(data?.data?.image)}
											alt={
												data?.data?.full_name || "User"
											}
										/>
										<AvatarFallback>
											{data?.data?.full_name?.[0] || "U"}
										</AvatarFallback>
									</Avatar>
									<H3>
										{data?.data?.full_name || "Guest User"}
									</H3>
								</div>
							</div>
						</DialogTitle>

						<div className="grid lg:grid-cols-2 grid-cols-1 shadow-md shadow-black/10 p-4 gap-3 rounded-lg bg-background border border-primary/10">
							<div className="flex items-center gap-2 text-primary lg:col-span-2 font-semibold">
								<UsersRound className="w-5 h-5" />
								Basic Information
							</div>

							<div className="flex items-center gap-2 overflow-hidden">
								<span className="flex items-center gap-1 text-muted-foreground whitespace-nowrap">
									<Mail className="w-5" strokeWidth={1} />{" "}
									Email:
								</span>
								<span
									className="truncate"
									title={data?.data?.email}
								>
									{data?.data?.email || "N/A"}
								</span>
							</div>

							<div className="flex items-center gap-2">
								<span className="flex items-center gap-1 text-muted-foreground">
									<MapPin
										className="w-4 h-4"
										strokeWidth={1}
									/>{" "}
									Location:
								</span>
								USA{" "}
								{/* Still static in response, maybe API adds it later */}
							</div>

							<div className="flex items-center gap-2">
								<span className="flex items-center gap-1 text-muted-foreground whitespace-nowrap">
									<Calendar className="w-5" strokeWidth={1} />{" "}
									Join Date:
								</span>
								{formatDate(data?.data?.join_date)}
							</div>

							<div className="flex items-center gap-2">
								<span className="flex items-center gap-1 text-muted-foreground">
									<ShieldUser
										className="w-5"
										strokeWidth={1}
									/>{" "}
									Status:
								</span>
								<Badge
									className={
										data?.data?.status === "Activate" ||
										data?.data?.status === "Active"
											? "bg-green-600 hover:bg-green-700"
											: "bg-red-500 hover:bg-red-600"
									}
								>
									{data?.data?.status || "N/A"}
								</Badge>
							</div>
							<div className="border-b border-muted-foreground/20 pb-2 w-full lg:col-span-2" />
							<div className="flex items-center gap-2 text-muted-foreground text-sm">
								<Clock className="w-4 h-4" strokeWidth={1} />
								<span>Last Active: Recently</span>
							</div>
						</div>

						<div className="flex flex-col shadow-md shadow-black/10 p-4 gap-4 rounded-lg bg-background border border-primary/10">
							<div className="flex items-center gap-2 text-primary font-semibold">
								<Heart className="w-5 h-5 text-red-500 fill-red-500" />
								Travel Preferences
							</div>
							<div className="flex flex-col gap-2">
								<H5 className="text-sm font-medium">
									Interests
								</H5>
								<div className="flex flex-wrap gap-2">
									{data?.interest &&
									data.interest.length > 0 ? (
										data.interest.map((interest, i) => (
											<Badge
												key={i}
												variant="secondary"
												className="bg-muted text-muted-foreground border-none"
											>
												{interest}
											</Badge>
										))
									) : (
										<p className="text-sm text-muted-foreground italic">
											No interests listed
										</p>
									)}
								</div>
							</div>

							<div className="flex flex-col gap-3">
								<H5 className="text-sm font-medium">
									Itineraries
								</H5>
								{data?.itineries &&
								data.itineries.length > 0 ? (
									data.itineries.map((trip, idx) => (
										<div
											key={idx}
											className="grid grid-cols-1 lg:grid-cols-2 bg-muted/40 rounded-md p-4 gap-2 border border-primary/5"
										>
											<h5 className="lg:col-span-2 mb-1 font-bold text-primary">
												{trip.destination_name}
											</h5>
											<p className="text-sm">
												<span className="text-muted-foreground">
													Trip Type:{" "}
												</span>{" "}
												<Badge
													variant="outline"
													className="text-[10px] h-4"
												>
													{trip.trip_type}
												</Badge>
											</p>

											<p className="text-sm">
												<span className="text-muted-foreground">
													Budget:
												</span>{" "}
												${trip.budget}
											</p>

											<p className="text-sm">
												<span className="text-muted-foreground">
													Duration:{" "}
												</span>{" "}
												{trip.duration} Days
											</p>

											<p className="text-sm lg:col-span-2">
												<span className="text-muted-foreground">
													Dates:{" "}
												</span>{" "}
												{trip.start_date} to{" "}
												{trip.end_date}
											</p>
										</div>
									))
								) : (
									<p className="text-sm text-muted-foreground italic">
										No itineraries found
									</p>
								)}
							</div>
						</div>
						<div className="flex justify-end pt-2">
							<ConfirmationDialog
								message="Are you sure you want to deactivate this user?"
								onConfirm={() => {
									onClose();
								}}
								confirmLabel="Confirm"
							>
								<Button variant={"destructive"} size="sm">
									Deactivate Account
								</Button>
							</ConfirmationDialog>
						</div>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}
