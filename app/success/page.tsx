import { Suspense } from "react";
import PropertySuccessPage from "../../components/PropertySuccessPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <PropertySuccessPage />
    </Suspense>
  );
}
