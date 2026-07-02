import Image from "next/image";
import Instagram from "@/assets/icons/instagram.svg";
import Whatsapp from "@/assets/icons/whatsapp.svg";
import Phone from "@/assets/icons/phone.svg";
import type { SocialLink } from "@/lib/directus/types";

const ICONS: Record<string, any> = { instagram: Instagram, whatsapp: Whatsapp, phone: Phone };

/** Social icons driven by site_settings.social_links (+ phone). */
export default function SocialLinks({
	color,
	links,
	phone,
}: {
	color: string;
	links?: SocialLink[];
	phone?: string;
}) {
	const invert = color !== "white" ? 100 : 0;
	const items: { url: string; icon: any; alt: string }[] = [];

	for (const l of links ?? []) {
		const icon = ICONS[l.platform.toLowerCase()];
		if (icon) items.push({ url: l.url, icon, alt: l.platform });
	}
	if (phone) items.push({ url: `tel:${phone.replace(/\s/g, "")}`, icon: Phone, alt: "Phone" });

	// Fallback to the historical links if settings are empty.
	if (items.length === 0) {
		items.push(
			{ url: "https://www.instagram.com/reca.kz", icon: Instagram, alt: "Instagram" },
			{ url: "https://wa.me/77758887203", icon: Whatsapp, alt: "Whatsapp" },
			{ url: "tel:+77758887203", icon: Phone, alt: "Phone" },
		);
	}

	return (
		<div className="social-links">
			{items.map((it, i) => (
				<a key={i} href={it.url} target="_blank" rel="noreferrer">
					<Image src={it.icon} width={30} height={30} alt={it.alt} style={{ filter: `invert(${invert}%)` }} />
				</a>
			))}
		</div>
	);
}
