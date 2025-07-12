import "next-auth";
declare module "next-auth" {
  interface User {
    createdAt: string;
    updatedAt: string;
    emailVerified: string | null;
  }
}
