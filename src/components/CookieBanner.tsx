import { useEffect, useState } from "react";
import {
  getCookieConsent,
  hasCookieConsent,
  openCookieSettingsEvent,
  setCookieConsent,
} from "@/lib/cookie-consent";

type CookieBannerProps = {
  privacyHref?: string;
};

const Toggle = ({
  checked,
  onChange,
  disabled = false,
}: {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => !disabled && onChange?.(!checked)}
      className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full transition ${
        disabled
          ? "cursor-default bg-white/8 opacity-60"
          : checked
          ? "bg-[#EB7F4B]"
          : "bg-white/12 hover:bg-white/16"
      }`}
    >
      <span
        className={`inline-block h-6 w-6 rounded-full transition ${
          disabled
            ? "translate-x-7 bg-white/85"
            : checked
            ? "translate-x-7 bg-white"
            : "translate-x-1 bg-white"
        }`}
      />
    </button>
  );
};

const CookieBanner = ({ privacyHref = "/privacy" }: CookieBannerProps) => {
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    setVisible(!hasCookieConsent());

    const handleOpen = () => {
      const existing = getCookieConsent();
      if (existing) {
        setAnalytics(existing.analytics);
        setMarketing(existing.marketing);
      }
      setVisible(true);
      setShowPreferences(true);
      setIsClosing(false);
      requestAnimationFrame(() => setMounted(true));
    };

    window.addEventListener("fitclicks:open-cookie-settings", handleOpen);

    return () => {
      window.removeEventListener("fitclicks:open-cookie-settings", handleOpen);
    };
  }, []);

  useEffect(() => {
    if (visible) {
      setIsClosing(false);
      requestAnimationFrame(() => setMounted(true));
    } else {
      setMounted(false);
    }
  }, [visible]);

  const closeBanner = () => {
    setIsClosing(true);
    setMounted(false);

    window.setTimeout(() => {
      setVisible(false);
      setShowPreferences(false);
      setIsClosing(false);
    }, 260);
  };

  const acceptAll = () => {
    setCookieConsent({
      necessary: true,
      analytics: true,
      marketing: true,
    });
    closeBanner();
  };

  const acceptNecessaryOnly = () => {
    setCookieConsent({
      necessary: true,
      analytics: false,
      marketing: false,
    });
    closeBanner();
  };

  const savePreferences = () => {
    setCookieConsent({
      necessary: true,
      analytics,
      marketing,
    });
    closeBanner();
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-3 z-[9999] px-3 md:inset-x-auto md:right-6 md:bottom-6 md:px-0">
      <div
        className={`mx-auto w-full max-w-[420px] transform will-change-transform md:mx-0 md:w-[380px] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          mounted && !isClosing
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-6 opacity-0 scale-[0.96]"
        }`}
      >
        <div className="relative max-h-[85vh] overflow-x-hidden overflow-y-auto rounded-[22px] border border-white/10 bg-[rgba(9,12,24,0.94)] p-4 text-white shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-6">
          <div
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl"
            style={{ background: "rgba(235,127,75,0.14)" }}
          />

          <div className="relative text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#EB7F4B]">
              Cookies, maar netjes
            </p>

            <h3 className="mt-3 text-[1.8rem] font-bold leading-[1.05] tracking-[-0.04em] sm:text-[2rem]">
              Jij kiest wat we mogen meten
            </h3>

            <p className="mx-auto mt-3 max-w-[32ch] text-[15px] leading-7 text-white/62">
              We gebruiken cookies om de website goed te laten werken en om inzicht
              te krijgen in wat werkt. Geen ruis, wel duidelijkheid.
            </p>

            {!showPreferences ? (
              <>
                <div className="mx-auto mt-5 w-full max-w-[320px] space-y-3">
                  <button
                    onClick={acceptAll}
                    className="inline-flex h-14 w-full items-center justify-center rounded-[18px] px-6 text-[17px] font-semibold text-white shadow-[0_10px_30px_rgba(235,127,75,0.22)] transition hover:scale-[1.01] active:scale-[0.99]"
                    style={{
                      background:
                        "linear-gradient(135deg, hsl(18 80% 60%), hsl(24 85% 55%))",
                    }}
                  >
                    Alles accepteren
                  </button>

                  <button
                    onClick={acceptNecessaryOnly}
                    className="inline-flex h-14 w-full items-center justify-center rounded-[18px] border border-white/12 bg-white/[0.045] px-6 text-[17px] font-semibold text-white/92 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition hover:bg-white/[0.07] active:scale-[0.99]"
                  >
                    Alleen noodzakelijk
                  </button>
                </div>

                <button
                  onClick={() => setShowPreferences(true)}
                  className="mt-4 text-sm font-medium text-white/65 transition hover:text-white"
                >
                  Voorkeuren beheren
                </button>
              </>
            ) : (
              <div className="mt-5 space-y-3 text-left">
                <div className="rounded-2xl border border-white/7 bg-white/[0.02] p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0 pr-2">
                      <p className="font-medium text-white/88">Noodzakelijk</p>
                      <p className="mt-1 text-sm leading-6 text-white/45">
                        Nodig om de site goed te laten werken.
                      </p>
                    </div>
                    <Toggle checked={true} disabled />
                  </div>
                </div>

                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0 pr-2">
                      <p className="font-medium">Statistieken</p>
                      <p className="mt-1 text-sm leading-6 text-white/55">
                        Helpt ons begrijpen wat werkt op de site.
                      </p>
                    </div>
                    <Toggle checked={analytics} onChange={setAnalytics} />
                  </div>
                </div>

                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0 pr-2">
                      <p className="font-medium">Marketing</p>
                      <p className="mt-1 text-sm leading-6 text-white/55">
                        Voor advertentie- en remarketingdoeleinden.
                      </p>
                    </div>
                    <Toggle checked={marketing} onChange={setMarketing} />
                  </div>
                </div>

                <div className="mx-auto mt-4 w-full max-w-[320px] space-y-3">
                  <button
                    onClick={savePreferences}
                    className="inline-flex h-12 w-full items-center justify-center rounded-[16px] px-5 text-base font-semibold text-white shadow-[0_10px_30px_rgba(235,127,75,0.18)] transition hover:scale-[1.01] active:scale-[0.99]"
                    style={{
                      background:
                        "linear-gradient(135deg, hsl(18 80% 60%), hsl(24 85% 55%))",
                    }}
                  >
                    Voorkeuren opslaan
                  </button>

                  <button
                    onClick={() => setShowPreferences(false)}
                    className="inline-flex h-12 w-full items-center justify-center rounded-[16px] border border-white/12 bg-white/[0.04] px-5 text-base font-semibold text-white/88 transition hover:bg-white/[0.07] active:scale-[0.99]"
                  >
                    Terug
                  </button>
                </div>
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-white/40">
              <a href={privacyHref} className="transition hover:text-white/70">
                Privacybeleid
              </a>
              <button
                type="button"
                onClick={openCookieSettingsEvent}
                className="transition hover:text-white/70"
              >
                Cookie-instellingen
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
