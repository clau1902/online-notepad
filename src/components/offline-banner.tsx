"use client";

import { useState, useEffect } from "react";
import { WifiOff } from "lucide-react";

export function OfflineBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const goOffline = () => setOffline(true);
    const goOnline = () => setOffline(false);

    // Check initial state
    if (!navigator.onLine) setOffline(true);

    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  if (!offline) return null;

  return (
    <div className="sticky top-16 z-40 bg-destructive/10 border-b border-destructive/20 px-4 py-2 text-center text-sm text-destructive flex items-center justify-center gap-2">
      <WifiOff className="h-4 w-4 shrink-0" />
      <span>You&apos;re offline. Changes won&apos;t be saved until you reconnect.</span>
    </div>
  );
}
