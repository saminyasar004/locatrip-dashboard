import { DialogTitle } from "@radix-ui/react-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Dialog, DialogContent } from "../ui/dialog";
import { H3 } from "../ui/typography";
import {
	Calendar,
	Clock,
	Heart,
	Mail,
	MapPin,
	ShieldUser,
	UsersRound,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ConfirmationDialog } from "./confirmation-dialog";

type Props = {
	showModal: boolean;
	onClose: () => void;
};

import { useAuthStore } from "@/store/authStore";

export function ProfileModal({ showModal, onClose }: Props) {
	const { user } = useAuthStore();
	const interests: string[] = [
		"Hiking & Trekking",
		"Art",
		"Local Festivals",
		"Food & Drinks",
		"Camping In Nature",
	];

	return (
		<Dialog open={showModal} onOpenChange={onClose}>
			<DialogContent className="max-w-xl">
				<DialogTitle>
					<div className="flex">
						<div className="flex items-center gap-2 justify-between w-auto">
							<Avatar className="rounded-full h-12 w-12">
								<AvatarImage
									src={
										user?.image
											? `https://travel-assistant.duckdns.org${user.image}`
											: "https://github.com/evilrabbit.png"
									}
									alt={user?.full_name || "User"}
									className=""
								/>
								<AvatarFallback>
									{user?.full_name?.[0] || "U"}
								</AvatarFallback>
							</Avatar>
							<H3>{user?.full_name || "Guest User"}</H3>
						</div>
					</div>
				</DialogTitle>

				<div className="grid lg:grid-cols-2 grid-cols-1 shadow-md shadow-black/10 p-4 gap-3 rounded-lg max-h-lvh">
					<div className="flex items-center gap-2 text-primary lg:col-span-2">
						<UsersRound />
						Basic Information
					</div>

					<div className="flex items-center gap-2">
						<span className="flex items-center gap-1 text-muted-foreground">
							<Mail className="w-5" strokeWidth={1} /> Email:
						</span>
						{user?.email || "N/A"}
					</div>

					<div className="flex items-center gap-2">
						<span className="flex items-center gap-1 text-muted-foreground">
							<MapPin className="w-5" strokeWidth={1} /> Location:
						</span>
						New York, USA
					</div>

					<div className="flex items-center gap-2">
						<span className="flex items-center gap-1 text-muted-foreground">
							<Calendar className="w-5" strokeWidth={1} /> Join
							Date:
						</span>
						2024-03-20
					</div>

					<div className="flex items-center gap-2">
						<span className="flex items-center gap-1 text-muted-foreground">
							<ShieldUser className="w-5" strokeWidth={1} />{" "}
							Status:
						</span>
						<Badge className="bg-[#2563EB]">Active</Badge>
					</div>
					<div className="border-b border-muted-foreground pb-2 w-full lg:col-span-2" />
					<div className="flex items-center gap-2 text-muted-foreground">
						<Clock className="w-5" strokeWidth={1} />
						<span>Last Active: 2hr ago</span>
					</div>
				</div>

				<div className="flex flex-col shadow-md shadow-black/10 p-4 gap-3 rounded-lg">
					<div className="flex items-center gap-2 text-primary">
						<Heart />
						Travel Preferences
					</div>
					<div className="flex flex-col gap-2">
						<h5>Interest</h5>
						<div className="flex flex-wrap gap-2">
							{interests.map((interest, i) => (
								<Badge
									key={i}
									className="bg-[#E4E4E4] text-[#63707C] px-3 py-1"
								>
									{interest}
								</Badge>
							))}
						</div>
					</div>
					<div className="grid grid-cols-1 lg:grid-cols-2 bg-muted-background rounded-md p-4 gap-2">
						<h5 className="lg:col-span-2 mb-1">Itinerary: 01</h5>
						<p>
							<span className="text-muted-foreground">
								Destination:{" "}
							</span>{" "}
							Costa Rica
						</p>

						<p>
							<span className="text-muted-foreground">
								Trip Type
							</span>{" "}
							Solo
						</p>

						<p>
							<span className="text-muted-foreground">
								Budget:
							</span>{" "}
							$50-100/per day
						</p>

						<p>
							<span className="text-muted-foreground">
								Duration:{" "}
							</span>{" "}
							5 Days
						</p>

						<p>
							<span className="text-muted-foreground">
								Start Date:{" "}
							</span>{" "}
							13 June 2025
						</p>

						<p>
							<span className="text-muted-foreground">
								End Date:{" "}
							</span>{" "}
							18 June 2025
						</p>
					</div>
				</div>
				<div>
					<ConfirmationDialog
						message="Are you sure you want to deactivate this user?"
						onConfirm={() => {
							onClose();
						}}
						confirmLabel="Confirm"
					>
						<Button variant={"outline"} className="w-auto">
							Deactivate User
						</Button>
					</ConfirmationDialog>
				</div>
			</DialogContent>
		</Dialog>
	);
}
