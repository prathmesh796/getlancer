import { getToken } from "next-auth/jwt";

import { NextRequest, NextResponse } from "next/server";

import {

  clearSessionCookies,

  getAuthSecret,

  hasSessionCookie,

} from "@/lib/auth";



const freelancerRoutes = ["/Fdash", "/Fprofile", "/MyApplications", "/ApplyJob"];

const clientRoutes = ["/Cdash", "/Cprofile", "/NewJob", "/JobApplications"];



function matchesRoute(pathname: string, routes: string[]) {

  return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

}



async function getValidToken(req: NextRequest) {

  try {

    return await getToken({ req, secret: getAuthSecret() });

  } catch {

    return null;

  }

}



export async function proxy(req: NextRequest) {

  const { pathname } = req.nextUrl;



  let token = null;

  if (hasSessionCookie(req)) {
    token = await getValidToken(req);

    if (!token) {
      const response = NextResponse.next();
      clearSessionCookies(response);

      return response;
    }
  }

  const isFreelancerRoute = matchesRoute(pathname, freelancerRoutes);
  const isClientRoute = matchesRoute(pathname, clientRoutes);

  if ((isFreelancerRoute || isClientRoute) && !token) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  if (!token) {
    return NextResponse.next();
  }

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
    "/api/auth/:path*",
  ],
};