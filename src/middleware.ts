import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protéger les routes /dashboard/* : pas de cookie → login
  if (pathname.startsWith("/dashboard")) {
    const sessionToken = request.cookies.get("gp_session")?.value;

    if (!sessionToken) {
      const loginUrl = new URL("/connexion", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
