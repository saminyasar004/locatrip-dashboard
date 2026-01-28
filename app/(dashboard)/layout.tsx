"use client";
import { DashboardHeader } from "@/components/common/dashboard-header";
import DashboardSidebar from "@/components/common/dashboard-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/authStore";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
	const { user } = useAuthStore();
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		if (!user) router.push(`/login?redirect_from=${pathname}`);
	}, [user, router, pathname]);

	return (
		<SidebarProvider>
			<DashboardSidebar />
			<div className="w-full min-h-screen flex flex-col">
				<DashboardHeader />
				<div className="flex-1 flex flex-col p-6">{children}</div>
			</div>
		</SidebarProvider>
	);
}
