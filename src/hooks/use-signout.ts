"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useSignOut() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      router.push("/");
      toast.success("signout successfully");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return handleSignOut;
}
