"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// Dynamically import LoginContent to enforce suspense boundary
const LoginContent = dynamic(() => import("./login-content"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
