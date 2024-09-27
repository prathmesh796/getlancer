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
            id: "email-credentials",
            name: "Credentials",

            credentials: {
                email: { label: "email", type: "text", placeholder: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                let conn = await connect()

                try {
                   const user = await User.findOne({ email: credentials.email})
                   
                   if(user && bcryptjs.compareSync(credentials.password, user.password)){
                        return user
                   }
                } catch (error) {
                    console.log(error)
                }
            }
        }),
    ],
}
export const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }