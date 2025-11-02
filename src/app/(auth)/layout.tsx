import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import Image from "next/image";
import Logo from "../../../public/logo.png";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center">
      <Link
        href="/"
        className={buttonVariants({
          variant: "outline",
          className: "absolute top-4 left-4 flex items-center gap-2",
        })}
      >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
      </Link>

      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium select-none"
        >
          {/* ✅ Pastikan alt & ukuran fix agar SSR dan client match */}
          <Image
            src={Logo}
            alt="Logo"
            width={32}
            height={32}
            priority
          />
          <span>GuhLMS.</span>
        </Link>

        {children}
        <div className="text-balance text-center text-xs text-muted-foreground">
          By clicking continue you agree to our <span className="hover:text-primary hover:underline"> Terms of service</span>
          {" "} and Privacy Policy
        </div>
      </div>
    </div>
  );
}
