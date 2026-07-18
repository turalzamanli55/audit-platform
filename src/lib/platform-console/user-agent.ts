/** Best-effort user-agent parsing for login history / session display. */
export function parseUserAgent(userAgent: string | null): { device: string; browser: string } {
  if (!userAgent) return { device: "Unknown", browser: "Unknown" };
  const ua = userAgent.toLowerCase();
  const device = /mobile|android|iphone|ipad/.test(ua)
    ? "Mobile"
    : /macintosh|windows|linux|x11/.test(ua)
      ? "Desktop"
      : "Unknown";
  const browser = ua.includes("edg")
    ? "Edge"
    : ua.includes("chrome")
      ? "Chrome"
      : ua.includes("firefox")
        ? "Firefox"
        : ua.includes("safari")
          ? "Safari"
          : "Other";
  return { device, browser };
}
