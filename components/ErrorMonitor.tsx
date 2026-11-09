"use client";

import { useEffect } from "react";
import { initErrorMonitoring } from "@/lib/error-monitoring";

export default function ErrorMonitor() {
  useEffect(() => {
    initErrorMonitoring();
  }, []);
  return null;
}
