import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

declare global {
  interface Window {
    dataLayer: Record<string, any>[];
  }
}

export const trackEvent = (event: string, data: Record<string, any> = {}) => {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];

  const payload = {
    event,
    ...data,
  };

  window.dataLayer.push(payload);

  // tijdelijke debug
  console.log("TRACK EVENT FIRED:", payload);
};
