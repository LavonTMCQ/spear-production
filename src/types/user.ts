export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "CLIENT";
  image?: string | null;
}

export type UserRole = "ADMIN" | "CLIENT";
