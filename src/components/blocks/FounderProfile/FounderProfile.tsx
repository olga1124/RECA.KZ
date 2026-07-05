import { assetUrl } from "@/lib/directus/assets";
import DirectusImage from "@/components/DirectusImage";
import type { FounderProfileBlock } from "@/lib/directus/types";
import styles from "./FounderProfile.module.css";

export default function FounderProfile({ data }: { data: FounderProfileBlock }) {
	return (
		<section className={styles.section}>
			<div className={styles.container}>
				<div className={styles.content}>
					{data.photoId && (
						<span className={styles.photo}>
							<DirectusImage
								src={assetUrl(data.photoId)}
								alt={data.name ?? ""}
								fill
								sizes="240px"
								style={{ objectFit: "cover", objectPosition: "top" }}
							/>
						</span>
					)}
					{data.eyebrow_title && <h3 className={styles.eyebrow}>{data.eyebrow_title}</h3>}
					{data.name && <h3 className={styles.name}>{data.name}</h3>}
					{data.intro_content && <div dangerouslySetInnerHTML={{ __html: data.intro_content }} />}
					{data.principles_heading && <h3 className={styles.principlesHeading}>{data.principles_heading}</h3>}
					{data.principles.length > 0 && (
						<ul className={styles.list}>
							{data.principles.map((p, i) => (
								<li key={i}>
									<strong>{p.title}</strong>
									{p.points && <div dangerouslySetInnerHTML={{ __html: p.points }} />}
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</section>
	);
}
