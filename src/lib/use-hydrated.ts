"use client";

import { useEffect, useState } from "react";

/** True after first client mount — avoids SSR/localStorage mismatches */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  return hydrated;
}
