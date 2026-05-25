import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const freelancerRoutes = ["/Fdash", "/Fprofile", "/MyApplications", "/ApplyJob"];
const clientRoutes = ["/Cdash", "/Cprofile", "/NewJob", "/JobApplications"];

function matchesRoute(pathname: string, routes: string[]) {
  return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const isFreelancerRoute = matchesRoute(pathname, freelancerRoutes);
  const isClientRoute = matchesRoute(pathname, clientRoutes);

  // If route is protected and user is not authenticated, send to login.
  if ((isFreelancerRoute || isClientRoute) && !token) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  if (!token) {
    return NextResponse.next();
  }

  // Enforce role-based route access.
  if (isFreelancerRoute && token.role !== "Freelancer") {
    return NextResponse.redirect(new URL("/Cdash", req.url));
  }

  if (isClientRoute && token.role !== "Client") {
    return NextResponse.redirect(new URL("/Fdash", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/Fdash/:path*",
    "/Fprofile/:path*",
    "/MyApplications/:path*",
    "/ApplyJob/:path*",
    "/Cdash/:path*",
    "/Cprofile/:path*",
    "/NewJob/:path*",
    "/JobApplications/:path*",
  ],
};
