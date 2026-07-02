"use client";
import { usePathname, useRouter } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n/config";

const LABELS: Record<Locale, string> = { ru: "RU", kz: "KZ", en: "EN" };

/**
 * Swaps the locale prefix in the current path, keeping the same page.
 * Persists the choice in the NEXT_LOCALE cookie for future visits.
 */
export default function LanguageSwitcher({ current }: { current: Locale }) {
	const pathname = usePathname();
	const router = useRouter();

	const switchTo = (locale: Locale) => {
		document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`;
		const segments = pathname.split("/");
		segments[1] = locale; // replace the locale segment
		router.push(segments.join("/") || `/${locale}`);
	};

	return (
		<div className="lang-switcher">
			{locales.map((l) => (
				<button
					key={l}
					type="button"
					onClick={() => switchTo(l)}
					className={l === current ? "active" : ""}
					aria-current={l === current}
				>
					{LABELS[l]}
				</button>
			))}
		</div>
	);
}
