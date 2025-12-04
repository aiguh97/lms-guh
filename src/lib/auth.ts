import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/db"; // pastikan path ini sesuai dengan lokasi db.ts
import { env } from "./env";
import { emailOTP } from "better-auth/plugins";
import { resend } from "./resend";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // ubah ke "postgresql" atau "sqlite" sesuai DATABASE_URL kamu
  }),

  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
       await resend.emails.send({
          from: "Guh LMS <onboarding@resend.dev>",
          to: [email],
          subject: "GUHLMS - Verfiy your email",
          html: `<p>Tour OTP is <strong>${otp}</strong></p>`,
        });
      },
    }),
  ],
});