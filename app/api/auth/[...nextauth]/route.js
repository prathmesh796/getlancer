import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connect } from "@/utils/db";
import User from "@/models/User";
import bcryptjs from "bcryptjs";

export const authOptions = {
    // Configure authentication providers
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "email", type: "text", placeholder: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                await connect();
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
                else{
                    throw new Error("InvalidCredentials");
                }
            }
        }),

        // **Google Authentication**
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                // Check if user exists in the database
                await connect();
                let dbUser = await User.findOne({ email: user.email });

                if (!dbUser) {
                    // If user doesn't exist, create a new user
                    dbUser = await User.create({
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    });
                }

                // Assign role from database to the session token
                token.id = dbUser._id;
                token.role = dbUser.role;
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
