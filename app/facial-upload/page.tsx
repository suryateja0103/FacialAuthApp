// app/facial-upload/page.tsx

export const dynamic = 'force-dynamic';

import { Suspense } from "react";
import FacialAuthApp from "@/components/FacialUpload";

export default function FacialUploadPage() {
  return (
    <main className="min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <FacialAuthApp />
      </Suspense>
    </main>
  );
}
