import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/db"; // pastikan path ini sesuai dengan lokasi db.ts
import { env } from "./env";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // ubah ke "postgresql" atau "sqlite" sesuai DATABASE_URL kamu
  }),

  socialProviders:{
    github:{
      clientId:env.GITHUB_CLIENT_ID,
      clientSecret:env.GITHUB_CLIENT_SECRET
    }
  }
});
