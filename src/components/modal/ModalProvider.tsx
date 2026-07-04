"use client";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import styles from "./ModalProvider.module.css";

interface ModalContextValue {
	open: (content: ReactNode) => void;
	close: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export function useModal(): ModalContextValue {
	const ctx = useContext(ModalContext);
	if (!ctx) throw new Error("useModal must be used within <ModalProvider>");
	return ctx;
}

/**
 * Single app-wide modal host. Any component calls useModal().open(<Form/>) to
 * show content in one overlay. Overlay uses a solid translucent background
 * (no backdrop blur — that janks scrolling/animation on lower-end devices).
 */
export default function ModalProvider({ children }: { children: ReactNode }) {
	const [content, setContent] = useState<ReactNode | null>(null);

	const open = useCallback((c: ReactNode) => setContent(c), []);
	const close = useCallback(() => setContent(null), []);

	// Lock body scroll while open; close on Escape. --scrollbar-comp pads the
	// body and fixed header by the vanished scrollbar width so nothing shifts.
	useEffect(() => {
		if (!content) return;
		const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
		const scrollbar = window.innerWidth - document.documentElement.clientWidth;
		document.documentElement.style.setProperty("--scrollbar-comp", `${scrollbar}px`);
		document.body.style.overflow = "hidden";
		window.addEventListener("keydown", onKey);
		return () => {
			document.documentElement.style.removeProperty("--scrollbar-comp");
			document.body.style.overflow = "";
			window.removeEventListener("keydown", onKey);
		};
	}, [content, close]);

	return (
		<ModalContext.Provider value={{ open, close }}>
			{children}
			{content && (
				<div className={styles.overlay} onClick={close}>
					<div className={styles.container} onClick={(e) => e.stopPropagation()}>
						<button type="button" className={styles.close} onClick={close} aria-label="Close">
							<X size={22} />
						</button>
						{content}
					</div>
				</div>
			)}
		</ModalContext.Provider>
	);
}
