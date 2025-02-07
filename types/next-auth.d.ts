import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      email: string;
      role: string;
      userTypeId: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    username: string;
    email: string;
    role: string;
    userType: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "USER" | "ADMIN" | "SUPERUSER";
    userTypeId: string;
  }
}
