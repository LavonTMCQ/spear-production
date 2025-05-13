import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import crypto from "crypto";

/**
 * Hash a password using SHA-256
 * This matches the format in data/users.json
 */
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          console.log("Auth: Authorizing with credentials:", credentials);

          if (!credentials?.email || !credentials?.password) {
            console.log("Auth: Missing email or password");
            return null;
          }

          // First try to authenticate with database users
          console.log("Auth: Looking up user in database:", credentials.email);
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          console.log("Auth: User found:", user ? "Yes" : "No", user);

          if (user) {
            // Hash the provided password and compare with the stored hash
            const hashedPassword = hashPassword(credentials.password);
            console.log("Auth: Hashed password:", hashedPassword);
            console.log("Auth: Stored password:", user.password);
            console.log("Auth: Passwords match:", user.password === hashedPassword);

            if (user.password === hashedPassword) {
              console.log("Auth: Authentication successful for database user");
              return {
                id: user.id,
                name: user.name || "",
                email: user.email,
                role: user.role,
              };
            }
          }

          // Fallback to hardcoded test accounts for development
          if (credentials.email === "admin@example.com" && credentials.password === "password") {
            return {
              id: "1",
              name: "Admin User",
              email: "admin@example.com",
              role: "ADMIN",
            };
          } else if (credentials.email === "client@example.com" && credentials.password === "password") {
            return {
              id: "2",
              name: "Client User",
              email: "client@example.com",
              role: "CLIENT",
            };
          }

          return null;
        } catch (error) {
          console.error("Error in authorize function:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
