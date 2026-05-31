import type { NextRequest, NextResponse } from "next/server";

/** Cookie names used by NextAuth for the encrypted session JWT. */
export const SESSION_COOKIE_NAMES = [
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
] as const;

const PLACEHOLDER_SECRET = "your_nextauth_secret_here";

/**
 * Returns a stable NEXTAUTH_SECRET. Without this, NextAuth auto-generates a new
 * secret on each dev server start and existing session cookies fail to decrypt.
 */
export function getAuthSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET?.trim();

  if (!secret || secret === PLACEHOLDER_SECRET) {
    throw new Error(
      [
        "NEXTAUTH_SECRET is missing or still set to the placeholder in .env.local.",
        "Generate one with: openssl rand -base64 32",
        "Then restart the dev server and clear site cookies for localhost.",
      ].join(" ")
    );
  }

  return secret;
}

export function hasSessionCookie(req: NextRequest): boolean {
  return SESSION_COOKIE_NAMES.some((name) => req.cookies.has(name));
}

export function clearSessionCookies(response: NextResponse): void {
  for (const name of SESSION_COOKIE_NAMES) {
    response.cookies.set(name, "", {
      expires: new Date(0),
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });
  }
}
