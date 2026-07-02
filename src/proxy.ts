import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, isLocale } from "@/lib/i18n/config";

/**
 * Ensures every content URL is locale-prefixed (/ru, /kz, /en). Paths without a
 * known locale prefix are redirected to the detected locale
 * (cookie → Accept-Language → RU default). (Next 16 "proxy" convention.)
 */
function detectLocale(req: NextRequest): string {
	const cookie = req.cookies.get("NEXT_LOCALE")?.value;
	if (isLocale(cookie)) return cookie;

	const header = req.headers.get("accept-language") ?? "";
	for (const part of header.split(",")) {
		const code = part.split(";")[0].trim().slice(0, 2).toLowerCase();
		if (isLocale(code)) return code;
	}
	return defaultLocale;
}

export function proxy(req: NextRequest) {
	const { pathname } = req.nextUrl;
	const first = pathname.split("/")[1];

	if (isLocale(first)) return NextResponse.next();

	const locale = detectLocale(req);
	const url = req.nextUrl.clone();
	url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
	return NextResponse.redirect(url);
}

export const config = {
	// Skip API, Next internals, and files with an extension (assets).
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
