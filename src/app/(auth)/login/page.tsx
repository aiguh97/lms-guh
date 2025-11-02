"use client"

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
import { GithubIcon, Loader } from "lucide-react";
import React, { useTransition } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const [isGithubPending, startGithubTransition] = useTransition();

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
            Or Continue eith
          </span>
        </div>

        <div className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input type="email" placeholder="m@example.com" />
          </div>
          <Button>Continue With Email</Button>
        </div>
      </CardContent>
    </Card>
  );
}
