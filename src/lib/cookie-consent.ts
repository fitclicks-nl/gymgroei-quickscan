type CookieConsent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
};

const STORAGE_KEY = "fitclicks_cookie_consent";
const GTM_ID = "GTM-N4VZQ9D";

let gtmLoaded = false;

export function getCookieConsent(): CookieConsent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function hasCookieConsent(): boolean {
  return !!getCookieConsent();
}

export function setCookieConsent(
  consent: Omit<CookieConsent, "timestamp">
) {
  const fullConsent: CookieConsent = {
    ...consent,
    timestamp: Date.now(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(fullConsent));

  if (fullConsent.analytics || fullConsent.marketing) {
    loadGTM();
  }
}

export function loadTrackingFromConsent() {
  const consent = getCookieConsent();
  if (!consent) return;

  if (consent.analytics || consent.marketing) {
    loadGTM();
  }
}

function loadGTM() {
  if (gtmLoaded) return;

  if (document.getElementById("gtm-script")) {
    gtmLoaded = true;
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    "gtm.start": new Date().getTime(),
    event: "gtm.js",
  });

  const script = document.createElement("script");
  script.id = "gtm-script";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;

  document.head.appendChild(script);

  gtmLoaded = true;
}

export function openCookieSettingsEvent() {
  window.dispatchEvent(new CustomEvent("fitclicks:open-cookie-settings"));
}

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}
