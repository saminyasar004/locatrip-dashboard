import { Plan } from "@/app/(dashboard)/subscription/page";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Plus, SquarePen, Trash2, Zap } from "lucide-react";
import { Button } from "../ui/button";
import Input from "./input";
import { Input as InputShadcn } from "../ui/input";
import { Label } from "../ui/label";
import {
	FormEvent,
	FormEventHandler,
	useEffect,
	useRef,
	useState,
} from "react";
import { H3, P } from "../ui/typography";
import { createSubscriptionPlan } from "@/lib/services/user-service";
import { Loader2 } from "lucide-react";

type Props = {
	isOpen: boolean;
	onClose: () => void;
	selectedPlan: Plan | null;
	onUpdate: () => void;
};

export default function PlanEditModal({
	isOpen,
	onClose,
	selectedPlan,
	onUpdate,
}: Props) {
	const icon = { icon: selectedPlan?.icon ?? Zap };
	const [form, setForm] = useState({
		title: "",
		price: "",
		duration: "",
		features: [] as string[],
	});
	const [isLoading, setIsLoading] = useState(false);
	const newFeatureInp = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		if (selectedPlan)
			setForm({
				title: selectedPlan?.name,
				features: selectedPlan.features,
				duration: String(selectedPlan.trialDays),
				price: String(selectedPlan.price),
			});
		else
			setForm({
				title: "",
				features: [] as string[],
				duration: "",
				price: "",
			});
	}, [selectedPlan]);

	const handleFormChange = (e: FormEvent<HTMLFormElement>) => {
		const { name, value } = e.target as HTMLInputElement;
		setForm((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleFeatureDelete = (index: number) => {
		setForm((prev) => ({
			...prev,
			features: prev.features.filter((_, i) => i !== index),
		}));
	};
	const handleFeatureAdd = (feature: string) => {
		if (!feature.trim()) return;
		setForm((prev) => ({
			...prev,
			features: [...prev.features, feature],
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!form.title || !form.price || !form.duration) return;

		try {
			setIsLoading(true);
			if (selectedPlan) {
				// Update logic (to be implemented if needed)
				console.log("Updating plan:", selectedPlan.id);
			} else {
				await createSubscriptionPlan(
					form.title,
					Number(form.price),
					Number(form.duration),
					form.features,
				);
			}
			onUpdate();
			onClose();
		} catch (error) {
			console.error("Error submitting plan:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-xl " showCloseButton={false}>
				<DialogTitle className="flex items-center justify-between mb-6">
					<div className="flex items-center gap-2">
						<span className="p-2 bg-muted-background rounded-full">
							{
								<icon.icon className="fill-primary outline-primary text-primary" />
							}
						</span>
						<p className="font-bold text-xl">
							{selectedPlan?.name ?? "Create New Plan"}
						</p>
					</div>
					<Button variant={"ghost"}>
						<SquarePen strokeWidth={2} className="!w-5 !h-5" />
					</Button>
				</DialogTitle>
				<form className="space-y-4" onSubmit={handleSubmit}>
					<Input
						label="Plan Name"
						id="title"
						placeholder="Free Trial"
						name="title"
						value={form.title}
						onChange={(e) =>
							setForm({ ...form, title: e.target.value })
						}
						required
					/>
					<div className="flex items-center gap-4">
						<Input
							label="Price($)"
							placeholder="0"
							id="price"
							name="price"
							type="number"
							value={form.price}
							onChange={(e) =>
								setForm({ ...form, price: e.target.value })
							}
							required
						/>
						<Input
							label="Duration"
							placeholder="7 days"
							id="duration"
							name="duration"
							type="number"
							value={form.duration}
							onChange={(e) =>
								setForm({ ...form, duration: e.target.value })
							}
							required
						/>
					</div>

					<div className="flex flex-col">
						<H3>Features</H3>
						<ul className="grid space-y-2 mt-2">
							{form.features.map((feature, i) => (
								<li className="flex items-center" key={i}>
									<span className="w-full bg-muted-background p-3 rounded-lg">
										{feature}
									</span>
									<Button
										type="button"
										variant={"ghost"}
										onClick={(e) => {
											e.preventDefault();
											handleFeatureDelete(i);
										}}
									>
										<Trash2 className="!w-5 !h-5" />
									</Button>
								</li>
							))}
							<li className="flex items-center">
								<InputShadcn
									className="w-full bg-muted-background p-3 rounded-lg placeholder:text-muted-foreground"
									placeholder="Add New Element"
									ref={newFeatureInp}
								/>
								<Button
									className=""
									variant={"ghost"}
									onClick={(e) => {
										e.preventDefault();
										if (newFeatureInp.current) {
											handleFeatureAdd(
												newFeatureInp.current?.value,
											);
											newFeatureInp.current.value = "";
										}
									}}
								>
									<Plus className="!w-5 !h-5" />
								</Button>
							</li>
						</ul>
					</div>
					<Button
						className="w-full"
						disabled={isLoading}
						type="submit"
					>
						{isLoading ? (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						) : selectedPlan ? (
							"Save Changes"
						) : (
							"Add Plan"
						)}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
