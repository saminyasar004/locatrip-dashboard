"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { H2, H3 } from "@/components/ui/typography";
import { Plus, Search } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { SelectItem } from "@/components/ui/select";
import PreferenceTable from "@/components/common/preference-table";
import { useState } from "react";
import PreferenceModal from "@/components/common/preference-modal";
import {
	createInterest,
	deleteInterest,
	getInterestList,
	updateInterest,
} from "@/lib/services/user-service";
import { InterestType } from "@/types/preference";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

export type Preference = {
	id: string;
	title: string;
	usage: number;
	status: boolean;
	description?: string;
};

export default function Page() {
	const [showModal, setShowModal] = useState<boolean>(false);
	const [selectedPref, setSelectedPref] = useState<Preference | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [preferences, setPreferences] = useState<Preference[]>([]);

	const fetchData = async () => {
		try {
			setIsLoading(true);
			const res = await getInterestList();
			const mappedPrefs: Preference[] = res.data.map(
				(item: InterestType) => ({
					id: item.id.toString(),
					title: item.name,
					usage: 0, // Not provided by the get interest list API
					status: item.status,
					description: "", // Not provided by the interest list API
				}),
			);
			setPreferences(mappedPrefs);
		} catch (error) {
			console.error("Error fetching interests:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const toggleCheck = async (id: string) => {
		const pref = preferences.find((p) => p.id === id);
		if (!pref) return;

		try {
			const newStatus = !pref.status;
			// Optimistic update
			setPreferences(
				preferences.map((p) =>
					p.id === id ? { ...p, status: newStatus } : p,
				),
			);
			await updateInterest(id, undefined, newStatus);
		} catch (error) {
			console.error("Error toggling interest status:", error);
			// Rollback on error
			await fetchData();
		}
	};

	const handleInterestSubmit = async (name: string) => {
		try {
			if (selectedPref) {
				await updateInterest(selectedPref.id, name);
			} else {
				await createInterest(name);
			}
			await fetchData();
		} catch (error) {
			console.error("Error submitting interest:", error);
		}
	};

	const handleDeleteInterest = async (id: string) => {
		if (!confirm("Are you sure you want to delete this preference?"))
			return;
		try {
			await deleteInterest(id);
			await fetchData();
		} catch (error) {
			console.error("Error deleting interest:", error);
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
			<div className="flex justify-between">
				<H2>Preference Management</H2>
				<Button
					className="flex items-center gap-2"
					onClick={() => {
						setShowModal(true);
						setSelectedPref(null);
					}}
				>
					<Plus color="white" strokeWidth={3} />
					Add Preference
				</Button>
			</div>
			<div className="flex gap-6 h-12">
				<div className="relative w-full max-w-2xl h-full">
					<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
					<Input
						placeholder="Search..."
						className="pl-12 bg-muted-background h-full rounded-4xl border-none"
					/>
				</div>
			</div>
			<div>
				<PreferenceTable
					preferences={preferences}
					toggleCheck={toggleCheck}
					onDelete={handleDeleteInterest}
					onShowModal={(id: string) => {
						setShowModal(true);
						setSelectedPref(
							preferences.find((pref) => pref.id === id) ?? null,
						);
					}}
				/>
			</div>

			<PreferenceModal
				selectedPref={selectedPref}
				onClose={() => {
					setShowModal(false);
					setSelectedPref(null);
				}}
				isOpen={showModal}
				onSubmit={handleInterestSubmit}
			/>
		</div>
	);
}
