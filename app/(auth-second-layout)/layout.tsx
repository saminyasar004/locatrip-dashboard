import Logo from "@/public/logo.svg";
import Image from "next/image";
import { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
	return (
		<div className="min-h-screen relative bg-muted-background flex flex-col">
			<div className="fixed top-8 left-8 z-50">
				<Image alt="Logo" src={Logo} className="h-24 w-auto" />
			</div>
			{children}
		</div>
	);
};

export default AuthLayout;
