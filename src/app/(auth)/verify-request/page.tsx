// src/app/(auth)/verify-request/page.tsx
"use client";
export const dynamic = "force-dynamic";

import nextDynamic from "next/dynamic";

// Load component sepenuhnya CSR
const VerifyRequestComponent = nextDynamic(
  () => import("./VerifyRequestComponent"),
  { ssr: false } // disable SSR
);

export default function Page() {
  return <VerifyRequestComponent />;
}
