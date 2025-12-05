import prismaClient from "@/utils/connect";

import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import { compare } from "bcrypt";
import { AdapterUser } from "next-auth/adapters";

declare module "next-auth" {
  interface User {
    valid_email: string;
    draws?: { email: string };
    firstName: string;
    lastName: string;
    familyGroup: string;
  }
}
export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "email", placeholder: "some@email.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        if (credentials.email && credentials.password) {
          console.log(credentials.email, credentials.password);
          const user = await prismaClient.user.findFirst({
            where: { email: credentials.email },
            select: {
              email: true,
              firstName: true,
              lastName: true,
              familyGroup: true,
              draws: { select: { email: true } },
              passhash: true,
            },
          });
          if (
            !user ||
            (await compare(credentials.password as string, user.passhash)) ===
              false
          ) {
            console.log(
              "Invalid credentials",
              user,
              await compare(credentials.password as string, user!.passhash)
            );
            return null;
          }
          if (user) {
            // console.log(user);
            return {
              valid_email: user.email,
              draws: user.draws ?? undefined,
              firstName: user.firstName,
              lastName: user.lastName,
              familyGroup: user.familyGroup,
            };
          }
        }
        // Return null if user data could not be retrieved
        throw null;
      },
    }),
  ],
  session: {
    strategy: "jwt", // Use JWT for sessions
  },
  callbacks: {
    async jwt(props) {
      const { token, user } = props;
      if (user) token.user = user;
      // console.log("JWT", props);

      return { user: token.user };
    },
    async session({ session, token }) {
      session.user = token.user as AdapterUser;

      return session;
    },
  },
});
