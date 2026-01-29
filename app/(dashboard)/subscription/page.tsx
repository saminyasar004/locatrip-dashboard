"use client";
import PlanCard from "@/components/common/plan-card";
import PlanEditModal from "@/components/common/plan-edit-modal";
import { Button } from "@/components/ui/button";
import { H3 } from "@/components/ui/typography";
import {
	Crown,
	LucideIcon,
	MessagesSquare,
	Plus,
	Zap,
	Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
	deleteSubscriptionPlan,
	getSubscriptionPlans,
} from "@/lib/services/user-service";
import { SubscriptionPlan } from "@/types/subscription";

export type Plan = {
	id: string;
	name: string;
	price: number;
	trialDays: number;
	features: string[];
	icon: LucideIcon;
};

export default function Page() {
	const [showModal, setShowModal] = useState<boolean>(false);
	const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [plans, setPlans] = useState<Plan[]>([]);

	const fetchPlans = async () => {
		try {
			setIsLoading(true);
			const res = await getSubscriptionPlans();

			const mappedPlans: Plan[] = res.payment.map(
				(plan: SubscriptionPlan) => {
					const features = [
						plan.feature_1,
						plan.feature_2,
						plan.feature_3,
						plan.feature_4,
						plan.feature_5,
						plan.feature_6,
						plan.feature_7,
						plan.feature_8,
						plan.feature_9,
						plan.feature_10,
					].filter(Boolean);

					let icon = Zap;
					if (plan.plan_name.toUpperCase() === "BASIC")
						icon = MessagesSquare;
					if (
						plan.plan_name.toUpperCase() === "PREMIUM" ||
						plan.plan_name.toUpperCase() === "ADVANCED"
					)
						icon = Crown;

					return {
						id: plan.id.toString(),
						name: plan.plan_name,
						price: plan.price,
						trialDays: plan.duration,
						features,
						icon,
					};
				},
			);

			setPlans(mappedPlans);
		} catch (error) {
			console.error("Error fetching subscription plans:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchPlans();
	}, []);

	const handleDeletePlan = async (id: string) => {
		if (!confirm("Are you sure you want to delete this subscription plan?"))
			return;
		try {
			await deleteSubscriptionPlan(id);
			await fetchPlans();
		} catch (error) {
			console.error("Error deleting plan:", error);
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
				<H3>Subscription Plans</H3>
				<Button
					className="flex items-center gap-2"
					onClick={() => {
						setShowModal(true);
					}}
				>
					<Plus color="white" strokeWidth={3} />
					Add Plan
				</Button>
			</div>

			<div className="grid gap-4 justify-center grid-cols-[repeat(auto-fit,minmax(350px,max-content))]">
				{plans.map((plan, i) => (
					<PlanCard
						key={i}
						plan={plan}
						onDelete={handleDeletePlan}
						onClickEdit={(id: string) => {
							setShowModal(true);
							setSelectedPlan(
								plans.find((plan) => plan.id === id) ?? null,
							);
						}}
					/>
				))}
			</div>
			<PlanEditModal
				isOpen={showModal}
				selectedPlan={selectedPlan}
				onClose={() => {
					setShowModal(false);
					setSelectedPlan(null);
				}}
				onUpdate={() => {
					fetchPlans();
				}}
			/>
		</div>
	);
}
