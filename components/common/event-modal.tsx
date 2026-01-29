import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { H3, P } from "../ui/typography";
import Input from "./input";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { EventType } from "@/app/(dashboard)/management/events/page";
import { Loader2 } from "lucide-react";

type Props = {
	isOpen: boolean;
	onClose: () => void;
	selectedPref: EventType | null;
	onSubmit: (name: string) => Promise<void>;
};

export default function EventModal({
	isOpen,
	onClose,
	selectedPref,
	onSubmit,
}: Props) {
	const [title, setTitle] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (selectedPref) setTitle(selectedPref.title);
		else setTitle("");
	}, [selectedPref, isOpen]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!title.trim()) return;

		try {
			setIsLoading(true);
			await onSubmit(title);
			onClose();
		} catch (error) {
			console.error("Error submitting event:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-xl">
				<DialogTitle className="flex items-start gap-1 justify-between w-auto flex-col pb-2 border-b">
					<div>
						<H3 className="mb-0">
							{selectedPref === null ? "Add " : "Edit"} New
							Category
						</H3>
						<P className="mt-0! text-muted-foreground">
							{selectedPref === null ? "Add a new " : "Edit "}{" "}
							event category
						</P>
					</div>
				</DialogTitle>

				<form
					className="flex flex-col mt-6 gap-6"
					onSubmit={handleSubmit}
				>
					<Input
						label="Category Name"
						id="category-name"
						placeholder="Enter category name"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						disabled={isLoading}
						required
					/>

					<div className="flex items-center justify-end gap-3 mt-4">
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							disabled={isLoading}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={isLoading || !title.trim()}
						>
							{isLoading && (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
							{selectedPref === null
								? "Add Category"
								: "Save Changes"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
