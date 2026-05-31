import NextAuth from "next-auth";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "./options";
import {
  clearSessionCookies,
  getAuthSecret,
  hasSessionCookie,
} from "@/lib/auth";

const nextAuthHandler = NextAuth(authOptions);

type RouteContext = { params: Promise<{ nextauth: string[] }> };

/**
 * If the browser still has a session cookie from an old NEXTAUTH_SECRET,
 * NextAuth logs JWEDecryptionFailed on every /api/auth/session call.
 * Detect that case and return an empty session after clearing the cookie.
 */
async function handleStaleSession(req: NextRequest): Promise<NextResponse | null> {
  if (req.method !== "GET" || !hasSessionCookie(req)) {
    return null;
  }

  const url = new URL(req.url);
  if (!url.pathname.endsWith("/api/auth/session")) {
    return null;
  }

  let token = null;
  try {
    token = await getToken({ req, secret: getAuthSecret() });
  } catch {
    token = null;
  }

  if (token) {
    return null;
  }

  const response = NextResponse.json({});
  clearSessionCookies(response);
  return response;
}

async function auth(req: NextRequest, context: RouteContext) {
  const staleResponse = await handleStaleSession(req);
  if (staleResponse) {
    return staleResponse;
  }

  return nextAuthHandler(req, context);
}

export { auth as GET, auth as POST };
