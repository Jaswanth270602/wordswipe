"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";

/** Single place to rehydrate zustand persist after mount */
export function StoreHydrator() {
  useEffect(() => {
    void useAppStore.persist.rehydrate();
  }, []);
  return null;
}
