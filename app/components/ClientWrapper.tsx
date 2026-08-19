"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Loader from "./Loader";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only show Loader after IntroLoader has been seen at least once —
    // prevents both running simultaneously on first visit (dual black logo bug).
    if (pathname !== "/" || sessionStorage.getItem("milkLoaded") || !sessionStorage.getItem("milk:intro-shown")) return;
    setLoading(true);
  }, [pathname]);

  return (
    <>
      {loading && (
        <Loader onDone={() => {
          sessionStorage.setItem("milkLoaded", "1");
          setLoading(false);
        }} />
      )}
      {children}
    </>
  );
}
