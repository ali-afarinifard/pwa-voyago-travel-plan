"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "voyago:install-dismissed";

export function InstallPrompt() {
  const [deferredEvent, setDeferredEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setDismissed(sessionStorage.getItem(DISMISS_KEY) === "1");

    const handler = (event: Event) => {
      event.preventDefault();
      setDeferredEvent(event as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);

    const onInstalled = () => setDeferredEvent(null);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!deferredEvent || dismissed) return null;

  const install = async () => {
    await deferredEvent.prompt();
    const choice = await deferredEvent.userChoice;
    if (choice.outcome !== "accepted") {
      sessionStorage.setItem(DISMISS_KEY, "1");
      setDismissed(true);
    }
    setDeferredEvent(null);
  };

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  };

  return (
    <div
      role="region"
      aria-label="Install Voyago"
      className="boarding-pass fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-md items-center gap-3 p-4 sm:inset-x-auto sm:right-4"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-(--color-primary)/15 text-(--color-primary)">
        <Download size={18} aria-hidden="true" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-(--color-foreground)">
          Install Voyago
        </p>
        <p className="text-xs text-(--color-foreground)/65">
          Plan trips and browse saved destinations offline.
        </p>
      </div>
      <button
        type="button"
        onClick={install}
        className="rounded-full bg-(--color-primary) px-3 py-1.5 text-xs font-semibold text-(--color-primary-foreground) transition-opacity hover:opacity-90"
      >
        Install
      </button>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss install prompt"
        className="text-(--color-foreground)/50 transition-colors hover:text-(--color-foreground)"
      >
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
