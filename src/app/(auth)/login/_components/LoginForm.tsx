"use client";

import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { GithubIcon, Loader, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [isGithubPending, startGithubTransition] = useTransition();
  const [isEmailPending, startEmailTransition] = useTransition();
  const [email, setEmail] = useState("");

  async function singInWithGithub() {
    startGithubTransition(async () => {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed in with Github, you will be redirected");
          },
          onError: (error) => {
            toast.error(`internal server error ${error.error.message}`);
          },
        },
      });
    });
  }

  async function signInWithEmail() {
    startEmailTransition(async () => {
      try {
        await authClient.emailOtp.sendVerificationOtp({
          email: email,
          type: "sign-in",
          fetchOptions: {
            onSuccess: () => {
              toast.success("Email sent");
              router.push(`/verify-request?email=${email}`);
            },
            onError: (err) => {
              console.error("Error sending email:", err);
              toast.error("Error sending email");
            },
          },
        });
      } catch (err) {
        console.error("Unexpected error:", err);
        toast.error("Unexpected error sending email");
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Welcome back!</CardTitle>
        <CardDescription>Login with your github emal account</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Button
          disabled={isGithubPending}
          onClick={singInWithGithub}
          className="w-full"
          variant="outline"
        >
          {isGithubPending ? (
            <>
              <Loader className="size-4 animate-spin" />
              <span>Loading....</span>
            </>
          ) : (
            <>
              <GithubIcon className="size-4" />
              Sign in with Github
            </>
          )}
        </Button>
        <div
          className="relative text-center text-sm after:absolute after:inset-0 
          after:top-1/2 after:z-0 after:flex after:items-center after:border-t 
          after:border-border"
        >
          <span className="relative z-10 bg-card px-2 text-muted-foreground">
            Or Continue With
          </span>
        </div>

        <div className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <Button onClick={signInWithEmail} disabled={isEmailPending}>
            {isEmailPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Loading</span>
              </>
            ) : (
              <>
                <Send className="size-4" />
                <span> Continue With Email</span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
