"use client";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Input from "@/components/common/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Loader2 } from "lucide-react";
import PasswordInput from "@/components/common/input-password";
import { useAuthStore } from "@/store/authStore";
import { updateProfile } from "@/lib/services/user-service";

export default function EditProfile() {
	const { user, updateUser } = useAuthStore();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [profileData, setProfileData] = useState({
		fullName: user?.full_name || "",
		email: user?.email || "",
	});

	const getImageUrl = (path: string | null) => {
		if (!path) return null;
		if (
			path.startsWith("data:") ||
			path.startsWith("blob:") ||
			path.startsWith("http")
		)
			return path;
		return `https://travel-assistant.duckdns.org${path}`;
	};

	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(
		getImageUrl(user?.image || null),
	);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [passwordData, setPasswordData] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});

	useEffect(() => {
		if (user) {
			setProfileData({
				fullName: user.full_name,
				email: user.email,
			});
			setImagePreview(getImageUrl(user.image));
		}
	}, [user]);

	function handleProfileDataChange(event: ChangeEvent<HTMLInputElement>) {
		const { name, value } = event.target;
		setProfileData((prev) => ({
			...prev,
			[name]: value,
		}));
	}

	function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		if (file) {
			setImageFile(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	}

	function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
		const { name, value } = event.target;
		setPasswordData((prev) => ({
			...prev,
			[name]: value,
		}));
	}

	const handleSaveProfile = async () => {
		try {
			setIsSubmitting(true);
			const formData = new FormData();
			formData.append("full_name", profileData.fullName);
			formData.append("email", profileData.email);
			if (imageFile) {
				formData.append("image", imageFile);
			}

			const response = await updateProfile(formData);
			// Assuming response is the updated user object or contains it
			if (response) {
				updateUser({
					...user!,
					full_name: response.full_name,
					email: response.email,
					image: response.image,
				});
				alert("Profile updated successfully!");
			}
		} catch (error) {
			console.error("Error updating profile:", error);
			alert("Failed to update profile. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<section className="w-full pb-8">
			<div className="p-6">
				<div className="w-full">
					<div className="p-4">
						<div className="w-full">
							<div className="flex gap-4 justify-center items-center mb-8">
								<div className="relative mb-4">
									<Avatar
										className="w-24 h-24 outline-primary outline-3 cursor-pointer"
										onClick={() =>
											fileInputRef.current?.click()
										}
									>
										<AvatarImage
											src={imagePreview || ""}
											alt={user?.full_name || "Profile"}
										/>
										<AvatarFallback className="text-xl">
											{user?.full_name?.charAt(0) || "U"}
										</AvatarFallback>
									</Avatar>
									<input
										type="file"
										ref={fileInputRef}
										className="hidden"
										accept="image/*"
										onChange={handleImageChange}
									/>
									<div
										className="absolute -bottom-1 -right-1 bg-primary rounded-full p-2 cursor-pointer"
										onClick={() =>
											fileInputRef.current?.click()
										}
									>
										<Edit className="w-4 h-4 text-white" />
									</div>
								</div>
								<div>
									<h2 className="text-2xl font-semibold">
										{user?.full_name || "User"}
									</h2>
									<h3 className="text-lg text-muted-foreground font-semibold">
										Admin
									</h3>
								</div>
							</div>

							<Tabs
								defaultValue="edit-profile"
								className="w-full items-center flex flex-col"
							>
								<TabsList className="grid w-1/2 mb-8 grid-cols-2">
									<TabsTrigger value="edit-profile">
										Edit Profile
									</TabsTrigger>
									<TabsTrigger value="change-password">
										Change Password
									</TabsTrigger>
								</TabsList>

								<TabsContent
									value="edit-profile"
									className="w-full space-y-6 max-w-2xl"
								>
									<div className="text-center mb-8">
										<h3 className="text-xl font-semibold">
											Edit Your Profile
										</h3>
									</div>

									<div className="space-y-6">
										<Input
											label="Full Name"
											type="text"
											id="fullName"
											name="fullName"
											placeholder="Enter your name"
											value={profileData.fullName}
											onChange={handleProfileDataChange}
										/>
										<Input
											label="Email"
											type="email"
											id="email"
											name="email"
											placeholder="Enter your email"
											value={profileData.email}
											onChange={handleProfileDataChange}
										/>
									</div>

									<Button
										className="w-full"
										onClick={handleSaveProfile}
										disabled={isSubmitting}
									>
										{isSubmitting ? (
											<Loader2 className="animate-spin" />
										) : (
											"Save & Change"
										)}
									</Button>
								</TabsContent>

								<TabsContent
									value="change-password"
									className="w-full space-y-6 max-w-2xl"
								>
									<div className="text-center mb-8">
										<h3 className="text-xl font-semibold">
											Edit Your Password
										</h3>
									</div>

									<div className="space-y-6">
										<PasswordInput
											label="Current Password"
											name="currentPassword"
											id="currentPassword"
											value={passwordData.currentPassword}
											onChange={handlePasswordChange}
										/>

										<PasswordInput
											label="New Password"
											name="newPassword"
											id="newPassword"
											value={passwordData.newPassword}
											onChange={handlePasswordChange}
										/>

										<PasswordInput
											label="Confirm New Password"
											name="confirmPassword"
											id="confirmPassword"
											value={passwordData.confirmPassword}
											onChange={handlePasswordChange}
										/>
									</div>

									<Button className="w-full">
										Save & Change
									</Button>
								</TabsContent>
							</Tabs>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
