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
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          // First try to authenticate with database users
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          if (user) {
            // For database users, we'll use "password" as the default password
            // since we don't have password hashes in the database schema
            if (credentials.password === "password") {
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
