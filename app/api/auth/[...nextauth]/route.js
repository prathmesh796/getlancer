import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connect } from "@/utils/db";
import User from "@/models/User";
import bcryptjs from "bcryptjs";

/** Skip Turnstile only for Playwright/e2e: non-production, runner flag, matching secret token. */
export function shouldBypassTurnstileForE2E(turnstileToken) {
    const expectedToken = process.env.E2E_TURNSTILE_BYPASS_TOKEN;
    if (!expectedToken || process.env.NODE_ENV === "production") {
        return false;
    }

    const e2eRunnerActive =
        process.env.PLAYWRIGHT === "1" || process.env.E2E_TEST === "1";
    if (!e2eRunnerActive) {
        return false;
    }

    return turnstileToken === expectedToken;
}

export const authOptions = {
    // Configure authentication providers
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
                'cf-turnstile-response': { label: "Turnstile", type: "text" }
            },
            async authorize(credentials) {
                await connect();

                const turnstileToken = credentials?.['cf-turnstile-response'];

                if (!shouldBypassTurnstileForE2E(turnstileToken)) {
                    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: `secret=${process.env.TURNSTILE_SECRET_KEY}&response=${turnstileToken}`,
                    });

                    const verifyData = await verifyRes.json();

                    if (!verifyData.success) {
                        throw new Error('Turnstile verification failed');
                    }
                }

                const user = await User.findOne({ email: credentials.email });

                if (!user) {
                    throw new Error("UserNotFound");
                }

                if (user && bcryptjs.compareSync(credentials.password, user.password)) {
                    return {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    };
                }
                else {
                    throw new Error("InvalidCredentials");
                }
            }
        }),

        // **Google Authentication**
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    scope: "openid email profile https://www.googleapis.com/auth/calendar",
                    access_type: "offline",  // Request refresh_token
                    prompt: "consent",       // Force re-consent to get refresh_token
                },
            },
        }),

        // **GitHub Authentication**
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),
    ],

    pages: {
        signIn: "/login", // Custom login page
        error: "/login"   // Redirect to login on error
    },

    callbacks: {
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.accessToken = token.accessToken;      
                session.refreshToken = token.refreshToken || null;
            }
            return session;
        },
        async jwt({ token, user, account }) {
            if (user) {
                await connect();
                let dbUser = await User.findOne({ email: user.email });

                if (!dbUser) {
                    dbUser = await User.create({
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    });
                }

                token.id = dbUser._id;
                token.role = dbUser.role;
            }

            // 🆕 Save Google tokens
            if (account?.provider === "google") {
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
            }

            return token;
        },
        async redirect({ url, baseUrl }) {
            return url.startsWith(baseUrl) ? url : baseUrl;
        }
    }
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
