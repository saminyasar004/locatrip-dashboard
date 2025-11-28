"use client";
import Logo from "@/public/logo.svg";
import Image from "next/image";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenuLink,
} from "../ui/sidebar";
import {
	ChartNoAxesCombined,
	CreditCard,
	LayoutDashboard,
	Settings,
	UsersRound,
} from "lucide-react";
import { LinkType } from "@/types/sidebar";

const links: LinkType[] = [
	{
		icon: LayoutDashboard,
		title: "Dashboard",
		href: "/",
		children: [],
	},
	{
		icon: UsersRound,
		title: "Management",
		href: "/management",
		children: [
			{ title: "All Users", href: "/management/all-users" },
			{ title: "User Analytics", href: "/management/user-analytics" },
			{ title: "Preference", href: "/management/preference" },
			{ title: "Events", href: "/management/events" },
		],
	},
	{
		icon: ChartNoAxesCombined,
		title: "Analytics & Reports",
		href: "/analytics-&-reports",
		children: [],
	},
	{
		icon: CreditCard,
		title: "Subscription",
		href: "/subscription",
		children: [],
	},
	{
		icon: Settings,
		title: "Settings",
		href: "/settings",
		children: [
			{ title: "General Settings", href: "/settings/general-settings" },
			{ title: "Terms & Condition", href: "/settings/terms-&-condition" },
		],
	},
];

export default function DashboardSidebar() {
	return (
		<Sidebar className="shadow-black/10 shadow-xl">
			<SidebarHeader className=" flex items-center justify-center">
				<Image
					src={Logo}
					alt="Logo"
					className="h-26 w-auto mt-8 mb-4"
				/>
				<div className="relative w-full h-[2px]">
					<div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/60 to-transparent"></div>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent className="px-6 py-8 space-y-4">
						{links.map((link, i) => (
							<SidebarMenuLink link={link} key={i} />
						))}
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
