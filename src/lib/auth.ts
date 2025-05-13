import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import crypto from "crypto";

/**
 * Hash a password using SHA-256
 * This matches the format used in the database
 */
function hashPassword(password: string): string {
  // The password "password" should hash to 5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8
  const hash = crypto.createHash("sha256").update(password).digest("hex");
  console.log(`Hashing password "${password}" to: ${hash}`);
  return hash;
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

          // Special handling for the admin user
          if (credentials.email === "quiseforeverphilly@gmail.com") {
            console.log("Auth: Admin user login attempt");

            // Get the admin user from the database
            const adminUser = await prisma.user.findUnique({
              where: {
                email: "quiseforeverphilly@gmail.com",
              },
            });

            console.log("Auth: Admin user found:", adminUser ? "Yes" : "No", adminUser);

            // If admin user exists in the database
            if (adminUser) {
              // Hash the provided password and compare with the stored hash
              const hashedPassword = hashPassword(credentials.password);
              console.log("Auth: Admin password check:");
              console.log("Auth: Input password:", credentials.password);
              console.log("Auth: Hashed password:", hashedPassword);
              console.log("Auth: Stored password:", adminUser.password);
              console.log("Auth: Passwords match:", adminUser.password === hashedPassword);

              // For admin user, also accept "password" directly
              const isCorrectPassword =
                adminUser.password === hashedPassword ||
                (credentials.password === "password" &&
                 adminUser.password === "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8");

              console.log("Auth: Final password match result:", isCorrectPassword);

              if (isCorrectPassword) {
                console.log("Auth: Admin authentication successful");
                return {
                  id: adminUser.id,
                  name: adminUser.name || "Admin User",
                  email: adminUser.email,
                  role: "ADMIN",
                };
              }
            }
          } else {
            // Regular user authentication
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
