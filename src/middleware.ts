import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protéger les routes /dashboard/*
  if (pathname.startsWith("/dashboard")) {
    const sessionToken = request.cookies.get("gp_session")?.value;

    if (!sessionToken) {
      const loginUrl = new URL("/connexion", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Si connecté et va sur /connexion → redirige vers dashboard
  if (pathname === "/connexion") {
    const sessionToken = request.cookies.get("gp_session")?.value;

    if (sessionToken) {
      const dashboardUrl = new URL("/dashboard", request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/connexion"],
};
