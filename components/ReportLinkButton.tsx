"use client";

import React, { useState } from "react";
import { Flag } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/ToastProvider";
import { createLinkReport } from "@/lib/contrib";

interface Props {
  subjectId: string;
  label: string;
  url: string;
}

/** Small "report broken link" control. Hidden entirely when login is not configured. */
export default function ReportLinkButton({ subjectId, label, url }: Props) {
  const auth = useAuth();
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  if (!auth.enabled) return null;

  const report = async () => {
    if (!auth.signedIn) {
      toast.info("Sign in with Google to report a broken link.");
      await auth.signIn();
      return;
    }
    setBusy(true);
    const { error, duplicate } = await createLinkReport({ subjectId, label, url, reason: "" });
    setBusy(false);
    if (duplicate) toast.info("You already reported this link. Thank you.");
    else if (error) toast.error(error);
    else toast.success("Thanks. The admin will check this link.");
  };

  return (
    <button
      onClick={report}
      disabled={busy}
      className="p-3 -m-1.5 rounded-md hover:bg-surface-container dark:hover:bg-inverse-surface text-text-secondary-light dark:text-text-secondary-dark hover:text-red-500 disabled:opacity-50"
      title="Report broken link"
      aria-label={`Report broken link: ${label}`}
    >
      <Flag size={16} />
    </button>
  );
}
