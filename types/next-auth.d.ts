import { DefaultSession } from "next-auth"
import { GlobalRole } from "@prisma/client"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `auth()`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            /** The user's unique id. */
            id: string
            /** The user's role (Business or Freelancer) */
            role: GlobalRole
        } & DefaultSession["user"]
    }

    interface User {
        role: GlobalRole
    }
}
