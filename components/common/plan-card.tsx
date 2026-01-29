import { Plan } from "@/app/(dashboard)/subscription/page";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Check, SquarePen, Trash2 } from "lucide-react";
import { H2, H4, P } from "../ui/typography";
import { Button } from "../ui/button";

type Props = {
	plan: Plan;
	onClickEdit: (id: string) => void;
	onDelete: (id: string) => void;
};
export default function PlanCard({ plan, onClickEdit, onDelete }: Props) {
	return (
		<Card className="max-w-sm">
			<CardHeader className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<span className="p-2 bg-muted-background rounded-full">
						{
							<plan.icon className="fill-primary outline-primary text-primary" />
						}
					</span>
					<p className="font-bold text-xl">{plan.name}</p>
				</div>
				<div className="flex items-center">
					<Button
						className="cursor-pointer"
						variant={"ghost"}
						onClick={() => onClickEdit(plan.id)}
					>
						<SquarePen strokeWidth={2} className="!w-5 !h-5" />
					</Button>
					<Button
						className="cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50/10"
						variant={"ghost"}
						onClick={() => onDelete(plan.id)}
					>
						<Trash2 strokeWidth={2} className="!w-5 !h-5" />
					</Button>
				</div>
			</CardHeader>
			<CardContent className="space-y-4 py-4">
				<div className="flex flex-col items-center">
					<H2 className="font-sans">${plan.price}</H2>
					<P className="text-muted-foreground !mt-2">
						Free for {plan.trialDays}{" "}
						{plan.trialDays > 1 ? "days" : "day"}
					</P>
				</div>

				<div className="mt-6">
					<H4>Feature List: </H4>
					<ul className="space-y-2 mt-3">
						{plan.features.map((feature, i) => (
							<li
								key={i}
								className="flex items-center gap-2 text-muted-foreground"
							>
								<Check className="w-4 text-[#2EC866]" />{" "}
								{feature}
							</li>
						))}
					</ul>
				</div>
			</CardContent>
		</Card>
	);
}
