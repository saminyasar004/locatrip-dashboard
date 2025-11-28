import Logo from "@/public/logo.svg";
import Image from "next/image";
import { H1, P } from "@/components/ui/typography";

export default function NotFound() {
	return (
		<div className="min-h-screen relative bg-muted-background flex flex-col items-center justify-center ga-8">
			<div className="fixed top-8 left-8 z-50">
				<Image alt="Logo" src={Logo} className="h-24 w-auto" />
			</div>
			<H1 className="font-sans">Page Not Found</H1>
			<P>Sorry, the page you&apos;re looking for doesn&apos;t exist.</P>
		</div>
	);
}
