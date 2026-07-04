"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Globe } from "lucide-react";
import { locales, type Locale } from "@/lib/i18n/config";
import styles from "./LanguageSwitcher.module.css";

const CODES: Record<Locale, string> = { ru: "RU", kz: "KZ", en: "EN" };
const NAMES: Record<Locale, string> = { ru: "Русский", kz: "Қазақша", en: "English" };

/**
 * Dropdown locale picker. Swaps the locale prefix in the current path and
 * persists the choice in the NEXT_LOCALE cookie for future visits.
 */
export default function LanguageSwitcher({ current }: { current: Locale }) {
	const pathname = usePathname();
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const rootRef = useRef<HTMLDivElement>(null);

	// Close on outside click / Escape.
	useEffect(() => {
		if (!open) return;
		const onDown = (e: PointerEvent) => {
			if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
		};
		const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
		document.addEventListener("pointerdown", onDown);
		document.addEventListener("keydown", onKey);
		return () => {
			document.removeEventListener("pointerdown", onDown);
			document.removeEventListener("keydown", onKey);
		};
	}, [open]);

	const switchTo = (locale: Locale) => {
		setOpen(false);
		if (locale === current) return;
		document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`;
		const segments = pathname.split("/");
		segments[1] = locale; // replace the locale segment
		router.push(segments.join("/") || `/${locale}`);
	};

	return (
		<div className={styles.wrap} ref={rootRef}>
			<button
				type="button"
				className={styles.trigger}
				aria-haspopup="listbox"
				aria-expanded={open}
				onClick={() => setOpen((v) => !v)}
			>
				<Globe size={16} />
				<span>{CODES[current]}</span>
				<ChevronDown size={14} className={`${styles.chevron} ${open ? styles.chevronUp : ""}`} />
			</button>

			{open && (
				<ul className={styles.menu} role="listbox" aria-activedescendant={`lang-${current}`}>
					{locales.map((l) => (
						<li key={l}>
							<button
								type="button"
								id={`lang-${l}`}
								role="option"
								aria-selected={l === current}
								className={`${styles.option} ${l === current ? styles.optionActive : ""}`}
								onClick={() => switchTo(l)}
							>
								<span className={styles.optionCode}>{CODES[l]}</span>
								{NAMES[l]}
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
