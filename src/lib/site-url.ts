const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const SITE_URL = configuredSiteUrl && !configuredSiteUrl.includes("localhost")
  ? configuredSiteUrl.replace(/\/+$/, "")
  : null;

export function getSiteUrl(): string {
  if (SITE_URL) {
    return SITE_URL;
  }
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return "";
}
