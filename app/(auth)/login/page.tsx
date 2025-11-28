"use client";

import Apple from "@/public/apple.png";
import Google from "@/public/google.png";

import Input from "@/components/common/input";
import PasswordInput from "@/components/common/input-password";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { H1, P } from "@/components/ui/typography";
import Image from "next/image";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { z } from "zod";

const loginSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(1, "Password is required"),
});

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [validationErrors, setValidationErrors] = useState<{
		email?: string;
		password?: string;
	}>({});
	const { login, isLoading, error } = useAuthStore();
	const router = useRouter();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setValidationErrors({});

		const result = loginSchema.safeParse({ email, password });

		if (!result.success) {
			const fieldErrors = result.error.flatten().fieldErrors;
			setValidationErrors({
				email: fieldErrors.email?.[0],
				password: fieldErrors.password?.[0],
			});
			return;
		}

		try {
			await login({ email, password });
			router.push("/"); // Redirect to dashboard
		} catch (err) {
			// Error is handled in the store and available via 'error' state
		}
	};

	return (
		<div className="flex items-center justify-center">
			<div className="space-y-4 max-w-lg w-full flex flex-col items-center">
				<div className="flex flex-col items-center font-sans pb-8">
					<H1 className="to-black from-primary bg-linear-to-r bg-clip-text text-transparent mb-0">
						Welcome Back!
					</H1>
					<P className="text-muted-foreground text-center mt-0! text-xl">
						Please login to continue
					</P>
				</div>
				<form
					onSubmit={handleLogin}
					className="w-full text-muted-foreground  space-y-4"
				>
					<div className="space-y-1">
						<Input
							label="Email Address"
							id="email"
							type="email"
							placeholder="Enter email address"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className={
								validationErrors.email ? "border-red-500" : ""
							}
						/>
						{validationErrors.email && (
							<p className="text-red-500 text-xs">
								{validationErrors.email}
							</p>
						)}
					</div>

					<div className="space-y-1">
						<PasswordInput
							label="Password"
							placeholder="********"
							type="password"
							id="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className={
								validationErrors.password
									? "border-red-500"
									: ""
							}
						/>
						{validationErrors.password && (
							<p className="text-red-500 text-xs">
								{validationErrors.password}
							</p>
						)}
					</div>

					{error && (
						<div className="text-red-500 text-sm text-center">
							{error}
						</div>
					)}

					<div className="flex justify-between">
						<div className="flex items-center gap-2">
							<Checkbox
								id="remember_me"
								className="cursor-pointer"
							/>
							<Label
								htmlFor="remember_me"
								className="cursor-pointer"
							>
								Remember me
							</Label>
						</div>
						<Link href="/forget-password">
							<Button
								className="underline cursor-pointer"
								variant={"link"}
							>
								Forget Passwoard
							</Button>
						</Link>
					</div>

					<Button
						size="lg"
						className="w-full h-12 text-xl font-bold font-sans cursor-pointer rounded-2xl"
						disabled={isLoading}
					>
						{isLoading ? "Logging in..." : "Log In"}
					</Button>
				</form>

				<div className="w-full">
					<div className="text-divider">Or Login With</div>
				</div>
				<div className="flex justify-center gap-8">
					<Button variant={"outline"} className="w-16 h-16">
						<Image src={Google} alt="Google" />
					</Button>

					<Button variant={"outline"} className="w-16 h-16">
						<Image src={Apple} alt="Google" />
					</Button>
				</div>

				<Link href={"/register"} className="mt-4">
					Don&apos;t have an account?{" "}
					<span className="text-primary">Register</span>
				</Link>
			</div>
		</div>
	);
};

export default LoginPage;
