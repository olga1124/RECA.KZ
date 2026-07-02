import { SITE_URL } from "./metadata";
import { assetUrl } from "@/lib/directus/assets";
import type { SiteSettings } from "@/lib/directus/types";

function JsonLd({ data }: { data: object }) {
	return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

/** schema.org EmploymentAgency — emitted once in the layout. */
export function OrganizationJsonLd({ settings }: { settings: SiteSettings }) {
	const data = {
		"@context": "https://schema.org",
		"@type": "EmploymentAgency",
		name: settings.site_name ?? "REC-A",
		url: SITE_URL,
		...(settings.logoId ? { logo: `${SITE_URL}${assetUrl(settings.logoId)}` } : {}),
		...(settings.email ? { email: settings.email } : {}),
		...(settings.phone ? { telephone: settings.phone } : {}),
		...(settings.social_links?.length ? { sameAs: settings.social_links.map((s) => s.url) } : {}),
	};
	return <JsonLd data={data} />;
}

/** schema.org WebPage — emitted per page. */
export function WebPageJsonLd({ title, description }: { title: string; description?: string }) {
	return (
		<JsonLd
			data={{
				"@context": "https://schema.org",
				"@type": "WebPage",
				name: title,
				...(description ? { description } : {}),
			}}
		/>
	);
}
