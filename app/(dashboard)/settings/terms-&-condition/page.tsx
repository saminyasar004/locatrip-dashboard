"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { H2, P } from "@/components/ui/typography";
import { Loader2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getTermsAndConditions } from "@/lib/services/user-service";
import { TermsAndConditionsData } from "@/types/legal";

type Terms = {
	updatedAt: string;
	description: string;
	title?: string;
};

export default function Page() {
	const [terms, setTerms] = useState<Terms[]>([]);
	const [loading, setLoading] = useState(true);

	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [editedTerms, setEditedTerms] = useState<Terms[]>([]);

	const fetchTerms = async () => {
		try {
			setLoading(true);
			const res = await getTermsAndConditions();
			const data = res.data;

			const mappedTerms: Terms[] = [];

			// Map main content
			if (data.main_content) {
				mappedTerms.push({
					updatedAt: formatDate(data.last_updated),
					description: data.main_content,
					title: "Introduction",
				});
			}

			// Map additional titles
			for (let i = 1; i <= 5; i++) {
				const titleKey = `title_${i}` as keyof TermsAndConditionsData;
				const contentKey =
					`title_${i}_content` as keyof TermsAndConditionsData;
				if (data[titleKey] || data[contentKey]) {
					mappedTerms.push({
						updatedAt: formatDate(data.last_updated),
						description: String(data[contentKey] || ""),
						title: String(data[titleKey] || ""),
					});
				}
			}

			setTerms(mappedTerms);
		} catch (error) {
			console.error("Error fetching terms:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchTerms();
	}, []);

	const formatDate = (dateString: string) => {
		if (!dateString) return "";
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const today = () =>
		new Date().toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});

	const handleSave = () => {
		setTerms((prev) =>
			editedTerms
				.filter((edited) => edited.description.trim() !== "")
				.map((edited, i) => {
					const prevTerm = prev[i];
					if (!prevTerm) return edited;

					if (prevTerm.description !== edited.description) {
						return { ...edited, updatedAt: today() };
					}
					return prevTerm;
				}),
		);
		setIsEditing(false);
	};

	const handleCancel = () => {
		setEditedTerms(terms);
		setIsEditing(false);
	};

	const handleAddNew = () => {
		setEditedTerms((prev) => [
			...prev,
			{
				updatedAt: today(),
				description: "",
				title: "",
			},
		]);
	};

	const handleDelete = (index: number) => {
		setEditedTerms((prev) => prev.filter((_ter, i) => i !== index));
	};

	if (loading) {
		return (
			<div className="flex h-[80vh] items-center justify-center">
				<Loader2 className="h-12 w-12 animate-spin text-primary" />
			</div>
		);
	}

	return (
		<div className="space-y-8 w-full">
			<div className="flex justify-end space-x-4">
				{isEditing && (
					<>
						<Button
							onClick={handleAddNew}
							className="px-8 bg-foreground text-muted-background hover:bg-muted-foreground"
						>
							Add New
						</Button>
						<Button
							onClick={handleSave}
							className="px-8 bg-foreground text-muted-background hover:bg-muted-foreground"
						>
							Save
						</Button>
						<Button onClick={handleCancel} className="px-8 border">
							Cancel
						</Button>
					</>
				)}
				{!isEditing && (
					<Button
						onClick={() => {
							setEditedTerms(terms);
							setIsEditing(true);
						}}
						className="px-8"
					>
						Edit
					</Button>
				)}
			</div>

			{isEditing
				? editedTerms.map((term, i) => (
						<div
							key={i}
							className="space-y-4 rounded-lg border p-4"
						>
							<div className="flex items-center justify-between">
								<div className="space-y-1">
									<H2 className="text-primary text-lg">
										Last Updated At {term.updatedAt}
									</H2>
									<input
										className="w-full bg-transparent text-lg font-bold outline-none"
										placeholder="Title (Optional)"
										value={term.title || ""}
										onChange={(e) => {
											const newTerms = [...editedTerms];
											newTerms[i] = {
												...newTerms[i],
												title: e.target.value,
											};
											setEditedTerms(newTerms);
										}}
									/>
								</div>
								<Button
									variant={"ghost"}
									onClick={() => handleDelete(i)}
								>
									<Trash2 className="w-5! h-5!" />
								</Button>
							</div>
							<Textarea
								className="bg-muted-background border-0 min-h-[150px]"
								value={term.description}
								placeholder="Write new terms here..."
								onChange={(e) => {
									const newTerms = [...editedTerms];
									newTerms[i] = {
										...newTerms[i],
										description: e.target.value,
									};
									setEditedTerms(newTerms);
								}}
							/>
						</div>
					))
				: terms.map((term, i) => (
						<div key={i}>
							<H2 className="text-primary">
								{term.title ||
									`Last Updated At ${term.updatedAt}`}
							</H2>
							{term.title && (
								<P className="text-sm text-muted-foreground mb-2">
									Last Updated At {term.updatedAt}
								</P>
							)}
							<P className="mt-4! whitespace-pre-wrap">
								{term.description}
							</P>
						</div>
					))}

			{!isEditing && terms.length < 1 && (
				<P className="text-primary text-center">
					No terms and conditions found.
				</P>
			)}
		</div>
	);
}
