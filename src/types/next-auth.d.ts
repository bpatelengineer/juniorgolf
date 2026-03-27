import type { Role } from "@prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      isMinor: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
    isMinor: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    isMinor: boolean;
  }
}
