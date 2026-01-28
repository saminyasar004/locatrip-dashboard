import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
	const session = request.cookies.get("session");
	const { pathname } = request.nextUrl;

	// Define public routes (guest only)
	const isPublicRoute =
		pathname.startsWith("/login") || pathname.startsWith("/register");

	// Define dashboard routes (protected)
	// Assuming dashboard is at '/' and all other subroutes except /login, /register
	const isDashboardRoute = !isPublicRoute && !pathname.includes("."); // Basic check for non-file paths

	if (isDashboardRoute && !session) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	if (isPublicRoute && session) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	return NextResponse.next();
}

// Config to match all routes except static files, api routes, etc.
export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico).*)",
	],
};
