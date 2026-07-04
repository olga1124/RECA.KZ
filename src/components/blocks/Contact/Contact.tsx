import { Mail, MapPin, Phone } from "lucide-react";
import { getForm, getSiteSettings, getUiStrings } from "@/lib/directus/queries";
import { getFormUi } from "@/components/forms/ui";
import DynamicForm from "@/components/forms/DynamicForm";
import ContactMap from "@/components/ContactMap";
import SocialLinks from "@/components/SocialLinks";
import type { ContactBlock } from "@/lib/directus/types";
import type { Locale } from "@/lib/i18n/config";
import styles from "./Contact.module.css";

export default async function Contact({ data, locale }: { data: ContactBlock; locale: Locale }) {
	const [form, ui, t, settings] = await Promise.all([
		data.formId ? getForm(data.formId, locale) : null,
		getFormUi(locale),
		getUiStrings(locale),
		getSiteSettings(locale),
	]);
	const words = (data.heading ?? "").split(" ");

	const channels = [
		settings.phone && {
			icon: <Phone size={20} />,
			label: t("contact.phone", "Телефон"),
			value: settings.phone,
			href: `tel:${settings.phone.replace(/\s/g, "")}`,
		},
		settings.email && {
			icon: <Mail size={20} />,
			label: t("contact.email", "Email"),
			value: settings.email,
			href: `mailto:${settings.email}`,
		},
		settings.address && {
			icon: <MapPin size={20} />,
			label: t("contact.address", "Адрес"),
			value: settings.address,
		},
	].filter(Boolean) as { icon: React.ReactNode; label: string; value: string; href?: string }[];

	return (
		<section id="contact" className={styles.section}>
			<div className={styles.container}>
				<header className={styles.header}>
					{data.heading && (
						<h1>
							{words.slice(0, -1).join(" ")} <span>{words.slice(-1)}</span>
						</h1>
					)}
					<p className={styles.subtitle}>{t("contact.subtitle", "")}</p>
				</header>

				<div className={styles.grid}>
					<aside className={styles.side}>
						<ul className={styles.channels}>
							{channels.map((c) => (
								<li key={c.label}>
									{c.href ? (
										<a href={c.href} className={styles.channel}>
											<span className={styles.channelIcon}>{c.icon}</span>
											<span className={styles.channelText}>
												<span className={styles.channelLabel}>{c.label}</span>
												<span className={styles.channelValue}>{c.value}</span>
											</span>
										</a>
									) : (
										<div className={styles.channel}>
											<span className={styles.channelIcon}>{c.icon}</span>
											<span className={styles.channelText}>
												<span className={styles.channelLabel}>{c.label}</span>
												<span className={styles.channelValue}>{c.value}</span>
											</span>
										</div>
									)}
								</li>
							))}
						</ul>

						<div className={styles.socials}>
							<span className={styles.socialsLabel}>{t("contact.socials", "")}</span>
							<SocialLinks color="dark" links={settings.social_links} />
						</div>
					</aside>

					{data.show_map && <ContactMap note={t("contact.map_note", "")} regions={t("contact.regions", "")} />}
				</div>

				{form && (
					<div className={styles.formCard}>
						<DynamicForm form={form} ui={ui} />
					</div>
				)}
			</div>
		</section>
	);
}
