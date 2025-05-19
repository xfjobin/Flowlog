import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;       // 👈 Add id property
      email?: string | null;
      name?: string | null;
      image?: string | null;
    }
  }

  interface User {
    id: string;         // 👈 Add id property
    email?: string | null;
    name?: string | null;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;        // 👈 Add id property to token as well
    email?: string | null;
    name?: string | null;
    image?: string | null;
  }
}
