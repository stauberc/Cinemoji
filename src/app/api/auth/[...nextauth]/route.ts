import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Anmelden mit Benutzernamen",
      credentials: {
        username: { label: "Benutzername", type: "text" },
      },
      async authorize(credentials) {
        if (credentials?.username?.trim()) {
          return { id: credentials.username, name: credentials.username };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.username = user.name;
      return token;
    },
    async session({ session, token }) {
      if (token?.username) {
        session.user.name = token.username;
        session.user.id = token.sub;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === 'development',
});

export { handler as GET, handler as POST };