import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { connect } from '@/utils/db'
import User from '@/models/User'
import bcrypt from "bcryptjs/dist/bcrypt"
import bcryptjs from "bcryptjs"

export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",

            credentials: {
                email: { label: "email", type: "text", placeholder: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                let conn = await connect()

                try {
                    const user = await User.findOne({ email: credentials.email })

                    if (user && bcryptjs.compareSync(credentials.password, user.password)) {
                        return {
                            id: user._id,
                            name: user.name,
                            email: user.email,
                            role: user.role,
                          };
                    }
                } catch (error) {
                    console.log(error)
                }
            }
        }),
    ],
    pages: {
        signIn: '/login', // Ensure this matches your custom login page
        error: '/login'   // Redirect to the same login page on error
    },
    callbacks: {
        async session({ session, token, user }) {
            // Attach additional user info to the session
            if (token) {
                session.user.id = token.id;
                session.user.role = token.role;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async redirect({ url, baseUrl }) {
            return baseUrl; // This ensures the redirection goes to your app's base URL
        }
    }
}
export const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }