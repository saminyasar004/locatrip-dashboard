"use client";

import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { UserMiniType } from "@/types/user";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

export function UserTable({
	users,
	showPagination,
	onToggleStatus,
}: {
	users: UserMiniType[];
	showPagination: boolean;
	onToggleStatus?: (userId: string, type: "activate" | "deactivate") => void;
}) {
	return (
		<div className="overflow-hidden">
			<Table className="rounded-xl">
				<TableHeader>
					<TableRow className="bg-muted-background h-12 hover:bg-muted-background">
						<TableHead className="text-muted-foreground w-1/2">
							User Name
						</TableHead>
						<TableHead className="text-muted-foreground">
							Status
						</TableHead>
						<TableHead className="text-end text-muted-foreground">
							Action
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{users.map((user, i) => (
						<TableRow
							key={i}
							className="hover:bg-muted-background cursor-pointer"
						>
							<TableCell className="flex items-center gap-2">
								<div>
									<p className="font-semibold text-lg">
										{user.username}
									</p>
									{user.email && (
										<p className="text-sm text-muted-foreground">
											{user.email}
										</p>
									)}
								</div>
							</TableCell>
							<TableCell
								className={`text-lg ${user.status.toLowerCase().startsWith("deactiv") ? "text-muted-foreground" : "text-foreground"}`}
							>
								{user.status}
							</TableCell>
							<TableCell className="relative">
								<DropdownMenu>
									<DropdownMenuTrigger className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-muted-background/40 rounded-2xl">
										<MoreVertical className="w-6" />
									</DropdownMenuTrigger>
									<DropdownMenuContent>
										<DropdownMenuItem
											onClick={() =>
												onToggleStatus?.(
													user.id,
													user.status
														.toLowerCase()
														.startsWith("activ")
														? "deactivate"
														: "activate",
												)
											}
										>
											<span className="flex items-center gap-2 cursor-pointer">
												{user.status
													.toLowerCase()
													.startsWith("activ")
													? "Deactivate"
													: "Activate"}
											</span>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			{showPagination && (
				<Pagination className="flex justify-end items-center border-t p-4">
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious href="#" />
						</PaginationItem>
						<PaginationItem>
							<PaginationLink href="#">1</PaginationLink>
						</PaginationItem>
						<PaginationItem>
							<PaginationLink href="#" isActive>
								2
							</PaginationLink>
						</PaginationItem>
						<PaginationItem>
							<PaginationLink href="#">3</PaginationLink>
						</PaginationItem>
						<PaginationItem>
							<PaginationEllipsis />
						</PaginationItem>
						<PaginationItem>
							<PaginationNext href="#" />
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			)}
		</div>
	);
}
