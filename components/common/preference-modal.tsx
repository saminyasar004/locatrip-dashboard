import { DialogTitle } from "@radix-ui/react-dialog";
import { Dialog, DialogContent } from "../ui/dialog";
import { H3, P } from "../ui/typography";
import Input from "./input";
import { Label } from "@/components/ui/label";
import { Textarea } from "../ui/textarea";
import { useEffect, useState } from "react";
import { Preference } from "@/app/(dashboard)/management/preference/page";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

type Props = {
	isOpen: boolean;
	onClose: () => void;
	selectedPref: Preference | null;
	onSubmit: (name: string) => Promise<void>;
};

export default function PreferenceModal({
	isOpen,
	onClose,
	selectedPref,
	onSubmit,
}: Props) {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (selectedPref) {
			setName(selectedPref.title);
			setDescription(selectedPref.description || "");
		} else {
			setName("");
			setDescription("");
		}
	}, [selectedPref, isOpen]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim()) return;

		try {
			setIsLoading(true);
			await onSubmit(name);
			onClose();
		} catch (error) {
			console.error("Error submitting preference:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-xl">
				<DialogTitle className="flex items-start gap-1 justify-between w-auto flex-col">
					<div>
						<H3 className="mb-0">
							{selectedPref === null ? "Add " : "Edit"} Preference
						</H3>
						<P className="mt-0! text-muted-foreground">
							{selectedPref === null ? "Add a new " : "Edit "}
							preference option.
						</P>
					</div>
				</DialogTitle>

				<form
					className="flex flex-col mt-10 gap-4"
					onSubmit={handleSubmit}
				>
					<Input
						label="Preference Name"
						id="preference-name"
						placeholder="Preference Name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>

					<div className="grid w-full items-center gap-1">
						<Label htmlFor="description">
							Description (Optional)
						</Label>

						<Textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Write here"
							className="bg-muted-background placeholder:text-muted-foreground/60 border-none"
						></Textarea>
					</div>

					<div className="flex items-center justify-center">
						<Button disabled={isLoading || !name.trim()}>
							{isLoading ? (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							) : null}
							{selectedPref === null ? "Confirm" : "Save Change"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
