import "../assets/styles/globals.css";

/**
 * Root layout is a pass-through: the real <html>/<body> live in
 * app/[locale]/layout.tsx, where the active locale is known and can be set on
 * <html lang>. This is the standard App Router pattern for a [locale] segment.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
	return children;
}
