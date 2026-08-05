"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Loader from "./Loader";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (pathname !== "/" || sessionStorage.getItem("milkLoaded")) return;
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
