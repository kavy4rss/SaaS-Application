import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma) as any,
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                name: { label: "Name", type: "text" },
            },
            async authorize(credentials) {
                if (!credentials?.email) return null;

                // Find or create the user based on email (simplest approach for $0 budget preview)
                let user = await prisma.user.findUnique({
                    where: { email: credentials.email as string }
                });

                if (!user) {
                    user = await prisma.user.create({
                        data: {
                            email: credentials.email as string,
                            name: (credentials.name as string) || null,
                            // role is left null by default from our updated schema
                        }
                    });
                }

                return user as any;
            }
        })
    ],
    // Force JWT strategy since CredentialsProvider doesn't support database strategy natively
    session: {
        strategy: "jwt"
    },
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            // Update token if user is logging in
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }

            // This allows us to manually trigger a token refresh (e.g. after onboarding)
            if (trigger === "update" && session?.role) {
                token.role = session.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as any;
            }
            return session;
        }
    }
})
