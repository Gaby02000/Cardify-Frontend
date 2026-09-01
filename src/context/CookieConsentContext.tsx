// src/context/CookieConsentContext.tsx
import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type CookieCategories = {
  essential: true; // siempre activas
  ux: boolean; // experiencia de usuario
  analytics: boolean; // análisis de tráfico
};

export type StoredConsent = CookieCategories & { updatedAt: string };

const STORAGE_KEY = "cookie-consent";

const ALL: CookieCategories = { essential: true, ux: true, analytics: true };
const NONE: CookieCategories = { essential: true, ux: false, analytics: false };

function readConsent(): StoredConsent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    if (typeof p !== "object" || p === null) return null;
    return {
      essential: true,
      ux: Boolean(p.ux),
      analytics: Boolean(p.analytics),
      updatedAt: typeof p.updatedAt === "string" ? p.updatedAt : "",
    };
  } catch {
    return null;
  }
}

type CookieConsentContextType = {
  consent: StoredConsent | null; // null = todavía no decidió
  decided: boolean;
  prefsOpen: boolean;
  openPreferences: () => void;
  closePreferences: () => void;
  save: (categories: CookieCategories) => void;
  acceptAll: () => void;
  rejectAll: () => void;
  /** ¿El usuario permitió esta categoría no esencial? */
  allows: (category: "ux" | "analytics") => boolean;
};

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(
  undefined
);

export const CookieConsentProvider = ({ children }: { children: ReactNode }) => {
  const [consent, setConsent] = useState<StoredConsent | null>(() => readConsent());
  const [prefsOpen, setPrefsOpen] = useState(false);

  const persist = (categories: CookieCategories) => {
    const stored: StoredConsent = {
      ...categories,
      essential: true,
      updatedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch {
      /* modo privado / storage bloqueado: igual seguimos en memoria */
    }
    setConsent(stored);
    setPrefsOpen(false);
  };

  const value = useMemo<CookieConsentContextType>(
    () => ({
      consent,
      decided: consent !== null,
      prefsOpen,
      openPreferences: () => setPrefsOpen(true),
      closePreferences: () => setPrefsOpen(false),
      save: persist,
      acceptAll: () => persist(ALL),
      rejectAll: () => persist(NONE),
      allows: (category) => Boolean(consent?.[category]),
    }),
    [consent, prefsOpen]
  );

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsent = () => {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) {
    throw new Error("useCookieConsent debe usarse dentro de CookieConsentProvider");
  }
  return ctx;
};
