import { NextResponse } from "next/server";

/**
 * Diagnostic route: checks if the deployment host can reach Resend's API.
 * Visit /api/debug/resend (e.g. on Vercel) to see if DNS/network works.
 * Remove or protect this route after debugging if you prefer.
 */
export async function GET() {
  const result: {
    ok: boolean;
    message: string;
    detail?: string;
    status?: number;
    resolved: boolean;
  } = {
    ok: false,
    message: "",
    resolved: false,
  };

  try {
    const res = await fetch("https://api.resend.com", {
      method: "HEAD",
      signal: AbortSignal.timeout(10_000),
    });
    result.status = res.status;
    result.resolved = true;
    result.ok = true;
    result.message =
      res.status === 200 || res.status === 401 || res.status === 404
        ? "Host can reach api.resend.com (connection and DNS OK)."
        : `Host reached api.resend.com; HTTP ${res.status}.`;
  } catch (err) {
    const e = err instanceof Error ? err : new Error(String(err));
    result.message = "Host could not reach api.resend.com.";
    result.detail = e.message;
    if (
      e.message.includes("resolve") ||
      e.message.includes("fetch") ||
      e.message.includes("network") ||
      e.message.includes("ENOTFOUND") ||
      e.message.includes("ECONNREFUSED")
    ) {
      result.message += " Likely DNS or network/firewall issue on the server.";
    }
  }

  return NextResponse.json(result);
}
